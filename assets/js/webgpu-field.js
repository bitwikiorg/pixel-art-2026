(() => {
  'use strict';

  function cpuFieldOp(input, width, height, op) {
    if (input.length !== width * height) throw new RangeError('input length must equal width × height');
    const out = new Uint32Array(input.length);
    const at = (x, y) => (x < 0 || y < 0 || x >= width || y >= height) ? 0 : (input[y * width + x] ? 1 : 0);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        if (op === 'not') out[i] = input[i] ? 0 : 1;
        else if (op === 'dilate') {
          let on = 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (at(x + dx, y + dy)) on = 1;
          out[i] = on;
        } else if (op === 'edge') {
          const center = at(x, y);
          let differs = 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            if (at(x + dx, y + dy) !== center) differs = 1;
          }
          out[i] = differs;
        } else throw new Error(`unknown operation: ${op}`);
      }
    }
    return out;
  }

  function hammingU32(a, b) {
    if (a.length !== b.length) throw new RangeError('arrays must have equal length');
    let d = 0;
    for (let i = 0; i < a.length; i++) if ((a[i] ? 1 : 0) !== (b[i] ? 1 : 0)) d += 1;
    return d;
  }

  async function runWebGPU(input, width, height, op) {
    if (!navigator.gpu) throw new Error('WebGPU unavailable');
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error('No WebGPU adapter available');
    const device = await adapter.requestDevice();
    const opCode = { not: 0, dilate: 1, edge: 2 }[op];
    if (opCode == null) throw new Error(`unknown operation: ${op}`);

    const shader = `
struct Params { width:u32, height:u32, op:u32, pad:u32 };
@group(0) @binding(0) var<storage, read> src: array<u32>;
@group(0) @binding(1) var<storage, read_write> dst: array<u32>;
@group(0) @binding(2) var<uniform> params: Params;

fn readCell(x:i32, y:i32) -> u32 {
  if (x < 0 || y < 0 || x >= i32(params.width) || y >= i32(params.height)) { return 0u; }
  return select(0u, 1u, src[u32(y) * params.width + u32(x)] != 0u);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= params.width || gid.y >= params.height) { return; }
  let x = i32(gid.x);
  let y = i32(gid.y);
  let i = gid.y * params.width + gid.x;
  if (params.op == 0u) {
    dst[i] = select(1u, 0u, src[i] != 0u);
    return;
  }
  if (params.op == 1u) {
    var on = 0u;
    for (var dy = -1; dy <= 1; dy = dy + 1) {
      for (var dx = -1; dx <= 1; dx = dx + 1) {
        if (readCell(x + dx, y + dy) != 0u) { on = 1u; }
      }
    }
    dst[i] = on;
    return;
  }
  let center = readCell(x, y);
  var differs = 0u;
  for (var dy = -1; dy <= 1; dy = dy + 1) {
    for (var dx = -1; dx <= 1; dx = dx + 1) {
      if ((dx != 0 || dy != 0) && readCell(x + dx, y + dy) != center) { differs = 1u; }
    }
  }
  dst[i] = differs;
}`;

    const module = device.createShaderModule({ code: shader });
    const pipeline = device.createComputePipeline({ layout: 'auto', compute: { module, entryPoint: 'main' } });
    const byteLength = input.byteLength;
    const src = device.createBuffer({ size: byteLength, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
    const dst = device.createBuffer({ size: byteLength, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC });
    const read = device.createBuffer({ size: byteLength, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
    const params = device.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    device.queue.writeBuffer(src, 0, input);
    device.queue.writeBuffer(params, 0, new Uint32Array([width, height, opCode, 0]));
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: src } },
        { binding: 1, resource: { buffer: dst } },
        { binding: 2, resource: { buffer: params } }
      ]
    });
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(Math.ceil(width / 8), Math.ceil(height / 8));
    pass.end();
    encoder.copyBufferToBuffer(dst, 0, read, 0, byteLength);
    const started = performance.now();
    device.queue.submit([encoder.finish()]);
    await read.mapAsync(GPUMapMode.READ);
    const result = new Uint32Array(read.getMappedRange()).slice();
    const elapsed = performance.now() - started;
    read.unmap();
    src.destroy(); dst.destroy(); read.destroy(); params.destroy();
    device.destroy();
    return { result, elapsedMs: elapsed };
  }

  const api = { cpuFieldOp, hammingU32, runWebGPU };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.WebGPUField = api;
  if (typeof document === 'undefined') return;

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('[data-webgpu-lab]');
    if (!root) return;
    const SIZE = 64;
    let input = new Uint32Array(SIZE * SIZE);
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
      const ring = Math.abs(Math.hypot(x - 31.5, y - 31.5) - 18) < 2;
      const axes = (Math.abs(x - 31.5) < 1.5 || Math.abs(y - 31.5) < 1.5) && x > 8 && x < 56 && y > 8 && y < 56;
      input[y * SIZE + x] = ring || axes ? 1 : 0;
    }
    const srcCanvas = root.querySelector('#gpuSource');
    const outCanvas = root.querySelector('#gpuOutput');
    [srcCanvas, outCanvas].forEach(c => { c.width = SIZE; c.height = SIZE; });
    function paint(canvas, data) {
      const ctx = canvas.getContext('2d');
      const image = ctx.createImageData(SIZE, SIZE);
      for (let i = 0; i < data.length; i++) {
        const v = data[i] ? 255 : 0;
        image.data[i * 4] = v; image.data[i * 4 + 1] = v; image.data[i * 4 + 2] = v; image.data[i * 4 + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
    }
    paint(srcCanvas, input); paint(outCanvas, input);

    root.querySelector('#gpuRun').addEventListener('click', async () => {
      const op = root.querySelector('#gpuOp').value;
      const cpuStart = performance.now();
      let cpu = null;
      for (let i = 0; i < 20; i++) cpu = cpuFieldOp(input, SIZE, SIZE, op);
      const cpuMs = (performance.now() - cpuStart) / 20;
      root.querySelector('#gpuCpu').textContent = `${cpuMs.toFixed(3)} ms/op`;
      paint(outCanvas, cpu);
      if (!navigator.gpu) {
        root.querySelector('#gpuStatus').textContent = 'WebGPU is not available in this browser. CPU reference executed; no GPU comparison was attempted.';
        root.querySelector('#gpuGpu').textContent = 'unavailable';
        root.querySelector('#gpuMismatch').textContent = '—';
        return;
      }
      try {
        const gpu = await runWebGPU(input, SIZE, SIZE, op);
        const mismatches = hammingU32(cpu, gpu.result);
        root.querySelector('#gpuGpu').textContent = `${gpu.elapsedMs.toFixed(3)} ms end-to-end`;
        root.querySelector('#gpuMismatch').textContent = mismatches;
        root.querySelector('#gpuStatus').textContent = `GPU result compared against the CPU reference over ${SIZE * SIZE} addresses. ${mismatches === 0 ? 'Outputs match exactly.' : 'Mismatch detected; do not interpret timing until correctness is resolved.'} GPU timing includes command submission and readback, not only kernel execution.`;
        if (mismatches === 0) paint(outCanvas, gpu.result);
      } catch (err) {
        root.querySelector('#gpuStatus').textContent = `WebGPU run failed: ${err.message}. CPU reference remains valid.`;
      }
    });
  });
})();
