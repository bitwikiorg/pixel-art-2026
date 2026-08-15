(() => {
  'use strict';

  function xorshift32(seed) {
    let x = (seed >>> 0) || 0x9E3779B9;
    return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return x >>> 0; };
  }
  function unit(next) { return next() / 4294967296; }

  function generatePattern(size, seed) {
    const next = xorshift32(seed);
    const bits = new Uint8Array(size * size);
    const mode = next() % 5;
    const set = (x, y) => { if (x >= 0 && x < size && y >= 0 && y < size) bits[y * size + x] = 1; };
    if (mode === 0) {
      const x0 = 1 + (next() % Math.max(1, size - 6));
      const y0 = 1 + (next() % Math.max(1, size - 6));
      const w = 3 + (next() % Math.max(1, Math.floor(size / 2)));
      const h = 3 + (next() % Math.max(1, Math.floor(size / 2)));
      for (let y = y0; y < Math.min(size, y0 + h); y++) for (let x = x0; x < Math.min(size, x0 + w); x++) {
        const border = x === x0 || y === y0 || x === Math.min(size - 1, x0 + w - 1) || y === Math.min(size - 1, y0 + h - 1);
        if (border || (next() & 3) === 0) set(x, y);
      }
    } else if (mode === 1) {
      const spacing = 2 + (next() % 4);
      const vertical = next() & 1;
      if (vertical) for (let x = next() % spacing; x < size; x += spacing) for (let y = 1; y < size - 1; y++) set(x, y);
      else for (let y = next() % spacing; y < size; y += spacing) for (let x = 1; x < size - 1; x++) set(x, y);
    } else if (mode === 2) {
      const offset = (next() % 5) - 2;
      for (let i = 0; i < size; i++) { set(i, i + offset); set(size - 1 - i, i + offset); }
    } else if (mode === 3) {
      const cx = (size - 1) / 2 + (unit(next) - 0.5) * 3;
      const cy = (size - 1) / 2 + (unit(next) - 0.5) * 3;
      const r = size * (0.2 + unit(next) * 0.18);
      for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (Math.abs(Math.hypot(x - cx, y - cy) - r) < 1.2) set(x, y);
    } else {
      const half = Math.ceil(size / 2);
      for (let y = 1; y < size - 1; y++) for (let x = 1; x < half; x++) if (unit(next) < 0.12 + 0.25 * Math.exp(-Math.abs(y - size / 2) / 5)) {
        set(x, y); set(size - 1 - x, y);
      }
    }
    return bits;
  }

  function maskPattern(bits, size, rate, seed) {
    if (!(rate >= 0 && rate <= 1)) throw new RangeError('mask rate must be in [0,1]');
    const next = xorshift32(seed);
    const observed = new Float32Array(bits.length * 2);
    const hidden = new Uint8Array(bits.length);
    for (let i = 0; i < bits.length; i++) {
      const isHidden = unit(next) < rate;
      hidden[i] = isHidden ? 1 : 0;
      observed[i * 2] = isHidden ? 0 : bits[i];
      observed[i * 2 + 1] = isHidden ? 0 : 1;
    }
    return { observed, hidden, size };
  }

  function majorityBaseline(observed, hidden, size) {
    const out = new Uint8Array(hidden.length);
    let knownOnes = 0, known = 0;
    for (let i = 0; i < hidden.length; i++) if (!hidden[i]) { known++; knownOnes += observed[i * 2] >= 0.5 ? 1 : 0; }
    const global = known ? (knownOnes / known >= 0.5 ? 1 : 0) : 0;
    const atKnown = (x, y) => {
      if (x < 0 || y < 0 || x >= size || y >= size) return null;
      const i = y * size + x;
      if (hidden[i]) return null;
      return observed[i * 2] >= 0.5 ? 1 : 0;
    };
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const i = y * size + x;
      if (!hidden[i]) { out[i] = observed[i * 2] >= 0.5 ? 1 : 0; continue; }
      let ones = 0, n = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const v = atKnown(x + dx, y + dy);
        if (v != null) { ones += v; n++; }
      }
      out[i] = n ? (ones / n >= 0.5 ? 1 : 0) : global;
    }
    return out;
  }

  function maskedAccuracy(predicted, target, hidden) {
    let good = 0, total = 0;
    for (let i = 0; i < target.length; i++) if (hidden[i]) {
      total++;
      const p = predicted[i] >= 0.5 ? 1 : 0;
      if (p === target[i]) good++;
    }
    return total ? good / total : 1;
  }

  function makeDataset(count, size, maskRate, seedBase) {
    const cells = size * size;
    const inputs = new Float32Array(count * cells * 2);
    const targets = new Float32Array(count * cells);
    const hiddenMasks = new Uint8Array(count * cells);
    for (let n = 0; n < count; n++) {
      const target = generatePattern(size, (seedBase + Math.imul(n + 1, 2654435761)) >>> 0);
      const masked = maskPattern(target, size, maskRate, (seedBase ^ Math.imul(n + 17, 2246822519)) >>> 0);
      inputs.set(masked.observed, n * cells * 2);
      targets.set(target, n * cells);
      hiddenMasks.set(masked.hidden, n * cells);
    }
    return { inputs, targets, hiddenMasks, count, size, cells };
  }

  const api = { generatePattern, maskPattern, majorityBaseline, maskedAccuracy, makeDataset };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.MaskedReconstruction = api;
  if (typeof document === 'undefined') return;

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('[data-masked-reconstruction]');
    if (!root) return;
    const SIZE = 16;
    let model = null;
    const rateInput = root.querySelector('#maskRate');
    const epochsInput = root.querySelector('#maskEpochs');
    const originalCanvas = root.querySelector('#maskOriginal');
    const inputCanvas = root.querySelector('#maskInput');
    const outputCanvas = root.querySelector('#maskOutput');
    [originalCanvas, inputCanvas, outputCanvas].forEach(c => { c.width = SIZE; c.height = SIZE; });

    function paint(canvas, values, hidden = null, showHidden = false) {
      const ctx = canvas.getContext('2d'); const image = ctx.createImageData(SIZE, SIZE);
      for (let i = 0; i < SIZE * SIZE; i++) {
        let v = values[i] >= 0.5 ? 255 : 0;
        if (showHidden && hidden && hidden[i]) v = 110;
        image.data[i * 4] = v; image.data[i * 4 + 1] = v; image.data[i * 4 + 2] = v; image.data[i * 4 + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
    }

    function example(maskRate) {
      const target = generatePattern(SIZE, 0x1234ABCD);
      const masked = maskPattern(target, SIZE, maskRate, 0xBADC0FFE);
      const visible = new Float32Array(SIZE * SIZE);
      for (let i = 0; i < visible.length; i++) visible[i] = masked.observed[i * 2];
      paint(originalCanvas, target); paint(inputCanvas, visible, masked.hidden, true);
      const base = majorityBaseline(masked.observed, masked.hidden, SIZE);
      paint(outputCanvas, base);
      root.querySelector('#maskExampleStatus').textContent = `Gray cells were hidden. Local-majority baseline masked-pixel accuracy: ${(maskedAccuracy(base, target, masked.hidden) * 100).toFixed(1)}%.`;
    }

    function invalidateMeasurement(reason) {
      for (const id of ['maskBaseline', 'maskLearned', 'maskTime', 'maskLoss']) root.querySelector(`#${id}`).textContent = '—';
      root.querySelector('#maskProgress').style.width = '0%';
      root.querySelector('#maskStatus').textContent = reason;
    }

    function buildModel() {
      if (typeof tf === 'undefined') return null;
      if (model) model.dispose();
      const init1 = tf.initializers.glorotUniform({ seed: 101 });
      const init2 = tf.initializers.glorotUniform({ seed: 202 });
      const init3 = tf.initializers.glorotUniform({ seed: 303 });
      model = tf.sequential();
      model.add(tf.layers.conv2d({ inputShape: [SIZE, SIZE, 2], filters: 8, kernelSize: 3, padding: 'same', activation: 'relu', kernelInitializer: init1 }));
      model.add(tf.layers.conv2d({ filters: 8, kernelSize: 3, padding: 'same', activation: 'relu', kernelInitializer: init2 }));
      model.add(tf.layers.conv2d({ filters: 1, kernelSize: 1, padding: 'same', activation: 'sigmoid', kernelInitializer: init3 }));
      model.compile({ optimizer: tf.train.adam(0.005), loss: 'binaryCrossentropy' });
      root.querySelector('#maskParams').textContent = model.countParams().toLocaleString();
      return model;
    }

    async function train() {
      if (typeof tf === 'undefined') { root.querySelector('#maskStatus').textContent = 'TensorFlow.js is unavailable; the deterministic baseline remains runnable.'; return; }
      const button = root.querySelector('#maskTrain');
      button.disabled = true; rateInput.disabled = true; epochsInput.disabled = true;
      const rate = Number(rateInput.value) / 100;
      const epochs = Number(epochsInput.value);
      const trainSet = makeDataset(256, SIZE, rate, 0x1000);
      const testSet = makeDataset(64, SIZE, rate, 0x90000000);
      const xTrain = tf.tensor4d(trainSet.inputs, [trainSet.count, SIZE, SIZE, 2]);
      const yTrain = tf.tensor4d(trainSet.targets, [trainSet.count, SIZE, SIZE, 1]);
      const xTest = tf.tensor4d(testSet.inputs, [testSet.count, SIZE, SIZE, 2]);
      buildModel();
      invalidateMeasurement(`Training at ${(rate * 100).toFixed(0)}% mask rate for ${epochs} epoch${epochs === 1 ? '' : 's'}…`);
      const started = performance.now();
      try {
        await model.fit(xTrain, yTrain, { epochs, batchSize: 32, shuffle: false, callbacks: { onEpochEnd: async (epoch, logs) => {
          root.querySelector('#maskLoss').textContent = (logs.loss || 0).toFixed(4);
          root.querySelector('#maskProgress').style.width = `${100 * (epoch + 1) / epochs}%`;
          await tf.nextFrame();
        } } });
        const predTensor = model.predict(xTest);
        const pred = await predTensor.data();
        const modelAcc = maskedAccuracy(pred, testSet.targets, testSet.hiddenMasks);
        let baselineGood = 0, baselineTotal = 0;
        for (let n = 0; n < testSet.count; n++) {
          const inputOffset = n * SIZE * SIZE * 2;
          const cellOffset = n * SIZE * SIZE;
          const obs = testSet.inputs.slice(inputOffset, inputOffset + SIZE * SIZE * 2);
          const hidden = testSet.hiddenMasks.slice(cellOffset, cellOffset + SIZE * SIZE);
          const target = testSet.targets.slice(cellOffset, cellOffset + SIZE * SIZE);
          const base = majorityBaseline(obs, hidden, SIZE);
          for (let i = 0; i < hidden.length; i++) if (hidden[i]) { baselineTotal++; if (base[i] === target[i]) baselineGood++; }
        }
        root.querySelector('#maskBaseline').textContent = `${(100 * baselineGood / baselineTotal).toFixed(1)}%`;
        root.querySelector('#maskLearned').textContent = `${(100 * modelAcc).toFixed(1)}%`;
        root.querySelector('#maskTime').textContent = `${((performance.now() - started) / 1000).toFixed(1)} s`;
        root.querySelector('#maskStatus').textContent = `Measured at ${(rate * 100).toFixed(0)}% mask rate and ${epochs} epochs. Accuracy is scored only on held-out pixels that were hidden.`;

        const target0 = testSet.targets.slice(0, SIZE * SIZE);
        const hidden0 = testSet.hiddenMasks.slice(0, SIZE * SIZE);
        const obs0 = testSet.inputs.slice(0, SIZE * SIZE * 2);
        const visible0 = new Float32Array(SIZE * SIZE); for (let i = 0; i < visible0.length; i++) visible0[i] = obs0[i * 2];
        const pred0 = pred.slice(0, SIZE * SIZE);
        paint(originalCanvas, target0); paint(inputCanvas, visible0, hidden0, true); paint(outputCanvas, pred0);
        predTensor.dispose();
      } catch (err) {
        root.querySelector('#maskStatus').textContent = `Training failed: ${err.message}`;
      } finally {
        xTrain.dispose(); yTrain.dispose(); xTest.dispose(); button.disabled = false; rateInput.disabled = false; epochsInput.disabled = false;
      }
    }

    rateInput.addEventListener('input', e => {
      root.querySelector('#maskRateValue').textContent = `${e.target.value}%`;
      example(Number(e.target.value) / 100);
      invalidateMeasurement('Mask rate changed. The displayed example is current; aggregate learned/baseline measurements are cleared until Train reconstruction model runs again.');
    });
    epochsInput.addEventListener('input', e => {
      root.querySelector('#maskEpochsValue').textContent = e.target.value;
      invalidateMeasurement('Epoch count changed. Previous training measurements are cleared until Train reconstruction model runs again.');
    });
    root.querySelector('#maskTrain').addEventListener('click', train);
    example(Number(rateInput.value) / 100);
    if (typeof tf !== 'undefined') tf.ready().then(() => { buildModel(); root.querySelector('#maskStatus').textContent = `TensorFlow.js ready on ${tf.getBackend()}. No learned measurement has run yet.`; });
    else root.querySelector('#maskStatus').textContent = 'TensorFlow.js unavailable; the deterministic local-majority example remains active.';
  });
})();
