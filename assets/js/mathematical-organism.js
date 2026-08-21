(() => {
  const root = document.querySelector('[data-math-organism]');
  if (!root) return;

  const $ = (id) => document.getElementById(id);
  const canvas = $('mathOrgCanvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.imageSmoothingEnabled = false;

  const ui = {
    seed: $('mathOrgSeed'),
    generate: $('mathOrgGenerate'),
    mutate: $('mathOrgMutate'),
    mode: $('mathOrgMode'),
    tempo: $('mathOrgTempo'),
    tempoOut: $('mathOrgTempoOut'),
    pause: $('mathOrgPause'),
    reset: $('mathOrgReset'),
    distance: $('mathOrgDistance'),
    occupied: $('mathOrgOccupied'),
    h0: $('mathOrgH0'),
    h1: $('mathOrgH1'),
    genome: $('mathOrgGenome'),
    status: $('mathOrgStatus'),
    radius: $('mathOrgRadius'),
    k1: $('mathOrgK1'),
    k2: $('mathOrgK2'),
    amp: $('mathOrgAmp'),
    warp: $('mathOrgWarp'),
    pigment: $('mathOrgPigment')
  };

  const WIDTH = 64;
  const HEIGHT = 64;
  const GENOME_BYTES = 24;
  const image = ctx.createImageData(WIDTH, HEIGHT);

  let genome = new Uint8Array(GENOME_BYTES);
  let params = null;
  let h = [0, 0];
  let phaseTime = 0;
  let lastTimestamp = performance.now();
  let running = true;
  let inheritedDistance = 0;

  function fnv1a(text) {
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  function xorshift32(seed) {
    let x = seed >>> 0 || 0x9e3779b9;
    return () => {
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      return (x >>> 0) / 4294967296;
    };
  }

  function genomeFromSeed(seedText) {
    const out = new Uint8Array(GENOME_BYTES);
    const rand = xorshift32(fnv1a(seedText || 'HARMONIC-ORGANISM'));
    for (let i = 0; i < out.length; i++) out[i] = Math.floor(rand() * 256);
    return out;
  }

  function signedByte(v) {
    return (v / 255) * 2 - 1;
  }

  function signedNibble(v) {
    return (v / 15) * 2 - 1;
  }

  function nibble(bytes, index) {
    const b = bytes[12 + Math.floor(index / 2) % 12];
    return index % 2 === 0 ? (b >>> 4) & 15 : b & 15;
  }

  function decodeGenome(g) {
    const k1 = 3 + (g[1] % 7);
    let k2 = 2 + (g[2] % 10);
    if (k2 === k1) k2 += 1;

    const weights = [];
    for (let i = 0; i < 12; i++) weights.push(signedNibble(nibble(g, i)) * 1.2);

    return {
      baseRadius: 0.48 + (g[0] / 255) * 0.18,
      k1,
      k2,
      amp1: 0.055 + (g[3] / 255) * 0.17,
      amp2: 0.025 + (g[4] / 255) * 0.10,
      warp: 0.015 + (g[5] / 255) * 0.16,
      warpFreq: 1 + (g[6] % 5),
      phaseRate1: 0.30 + (g[7] / 255) * 1.10,
      phaseRate2: 0.20 + (g[8] / 255) * 0.95,
      pigmentFreq: 4 + (g[9] % 11),
      edgeWidth: 0.016 + (g[10] / 255) * 0.035,
      paletteHue: (g[11] / 255) * 360,
      weights,
      bias0: signedByte(g[22]) * 0.45,
      bias1: signedByte(g[23]) * 0.45
    };
  }

  function hslToRgb(hue, sat, light) {
    const h = ((hue % 360) + 360) % 360 / 360;
    const s = sat / 100;
    const l = light / 100;
    if (s === 0) {
      const v = Math.round(l * 255);
      return [v, v, v];
    }
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return [
      Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      Math.round(hue2rgb(p, q, h) * 255),
      Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
    ];
  }

  function recurrentStep(t, p) {
    if (ui.mode.value !== 'recurrent') {
      h[0] = 0;
      h[1] = 0;
      return;
    }
    const w = p.weights;
    const sinT = Math.sin(t * 0.72);
    const cosT = Math.cos(t * 0.53);
    const next0 = Math.tanh(
      w[0] * h[0] + w[1] * h[1] + w[2] * sinT + w[3] * cosT + p.bias0
    );
    const next1 = Math.tanh(
      w[4] * h[0] + w[5] * h[1] + w[6] * sinT + w[7] * cosT + p.bias1
    );
    h[0] = next0;
    h[1] = next1;
  }

  function renderField(t) {
    const p = params;
    recurrentStep(t, p);

    const bg = hslToRgb(p.paletteHue + 215, 20, 8);
    const bodyA = hslToRgb(p.paletteHue, 68, 52);
    const bodyB = hslToRgb(p.paletteHue + 42 + signedByte(genome[18]) * 35, 74, 66);
    const edge = hslToRgb(p.paletteHue + 185, 58, 80);

    let occupied = 0;
    let ptr = 0;
    for (let py = 0; py < HEIGHT; py++) {
      const ny = ((py + 0.5) / HEIGHT) * 2 - 1;
      for (let px = 0; px < WIDTH; px++) {
        const nx = ((px + 0.5) / WIDTH) * 2 - 1;

        const recurrentWarp = ui.mode.value === 'recurrent' ? 1 + h[1] * 0.28 : 1;
        const wx = nx + p.warp * recurrentWarp * Math.sin(p.warpFreq * ny * Math.PI + t * 0.75 + h[0]);
        const wy = ny + p.warp * (1 - h[0] * 0.20) * Math.cos((p.warpFreq + 1) * nx * Math.PI - t * 0.58 + h[1]);

        const r = Math.hypot(wx, wy);
        const theta = Math.atan2(wy, wx);
        const recurrentAmp = ui.mode.value === 'recurrent' ? 1 + h[0] * 0.32 : 1;
        const phi1 = t * p.phaseRate1 + h[0] * 1.35;
        const phi2 = t * p.phaseRate2 - h[1] * 1.15;
        const boundary = p.baseRadius
          + p.amp1 * recurrentAmp * Math.sin(p.k1 * theta + phi1)
          + p.amp2 * Math.sin(p.k2 * theta - phi2)
          + 0.018 * Math.sin((p.k1 + p.k2) * theta + t * 0.33 + h[0] - h[1]);

        const signedDistance = r - boundary;
        let rgb = bg;

        if (signedDistance <= 0) {
          occupied += 1;
          const pigment = Math.sin(
            p.pigmentFreq * r * Math.PI
            + (2 + (genome[17] % 5)) * theta
            - t * (0.55 + genome[16] / 255)
            + h[1] * 2.2
          );
          const stripe = 0.5 + 0.5 * pigment;
          rgb = [
            Math.round(bodyA[0] * (1 - stripe) + bodyB[0] * stripe),
            Math.round(bodyA[1] * (1 - stripe) + bodyB[1] * stripe),
            Math.round(bodyA[2] * (1 - stripe) + bodyB[2] * stripe)
          ];
        }

        if (Math.abs(signedDistance) < p.edgeWidth) rgb = edge;

        image.data[ptr++] = rgb[0];
        image.data[ptr++] = rgb[1];
        image.data[ptr++] = rgb[2];
        image.data[ptr++] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);
    ui.occupied.textContent = `${occupied.toLocaleString()} / 4,096`;
    ui.h0.textContent = h[0].toFixed(3);
    ui.h1.textContent = h[1].toFixed(3);
  }

  function genomeHex(g) {
    return Array.from(g, (v) => v.toString(16).padStart(2, '0').toUpperCase()).join(' ');
  }

  function updateParameterReadout() {
    ui.genome.textContent = genomeHex(genome);
    ui.distance.textContent = `${inheritedDistance} bit${inheritedDistance === 1 ? '' : 's'}`;
    ui.radius.textContent = params.baseRadius.toFixed(3);
    ui.k1.textContent = `k₁ = ${params.k1}`;
    ui.k2.textContent = `k₂ = ${params.k2}`;
    ui.amp.textContent = `${params.amp1.toFixed(3)} · ${params.amp2.toFixed(3)}`;
    ui.warp.textContent = `${params.warp.toFixed(3)} × f${params.warpFreq}`;
    ui.pigment.textContent = `${params.pigmentFreq}`;
  }

  function setStatus(text) {
    ui.status.textContent = text;
  }

  function loadGenome(nextGenome, distance = 0, status = 'Genome decoded. The visible field is derived from explicit equations.') {
    genome = nextGenome;
    params = decodeGenome(genome);
    inheritedDistance = distance;
    h = [0, 0];
    phaseTime = 0;
    lastTimestamp = performance.now();
    updateParameterReadout();
    renderField(phaseTime);
    setStatus(status);
  }

  function mutateGenome() {
    const previous = new Uint8Array(genome);
    const next = new Uint8Array(genome);
    const seed = fnv1a(`${genomeHex(genome)}|${performance.now().toFixed(3)}|${phaseTime.toFixed(4)}`);
    const rand = xorshift32(seed);
    const flips = 1 + Math.floor(rand() * 3);
    const chosen = new Set();
    while (chosen.size < flips) chosen.add(Math.floor(rand() * GENOME_BYTES * 8));
    for (const bitIndex of chosen) {
      const byteIndex = Math.floor(bitIndex / 8);
      const bit = bitIndex % 8;
      next[byteIndex] ^= 1 << bit;
    }
    let distance = 0;
    for (let i = 0; i < previous.length; i++) {
      let x = previous[i] ^ next[i];
      while (x) {
        distance += x & 1;
        x >>>= 1;
      }
    }
    loadGenome(next, distance, `Mutated ${distance} inherited bit${distance === 1 ? '' : 's'}; the complete phenotype was regenerated from the new coefficients.`);
  }

  function resetDynamics() {
    h = [0, 0];
    phaseTime = 0;
    lastTimestamp = performance.now();
    renderField(0);
    setStatus('Time and recurrent state reset. The genome is unchanged.');
  }

  function animationFrame(timestamp) {
    const delta = Math.min(0.05, Math.max(0, (timestamp - lastTimestamp) / 1000));
    lastTimestamp = timestamp;
    if (running) {
      const tempo = Number(ui.tempo.value) / 100;
      phaseTime += delta * tempo;
      renderField(phaseTime);
    }
    requestAnimationFrame(animationFrame);
  }

  ui.generate.addEventListener('click', () => {
    loadGenome(genomeFromSeed(ui.seed.value), 0, `Seed “${ui.seed.value || 'HARMONIC-ORGANISM'}” deterministically decoded into a new 192-bit mathematical genome.`);
  });

  ui.mutate.addEventListener('click', mutateGenome);

  ui.mode.addEventListener('change', () => {
    resetDynamics();
    setStatus(ui.mode.value === 'recurrent'
      ? 'Recurrent modulation enabled: previous hidden state now feeds back into morphology.'
      : 'Equation-only control enabled: the same genome is rendered with h₀ = h₁ = 0.');
  });

  ui.tempo.addEventListener('input', () => {
    ui.tempoOut.textContent = `${(Number(ui.tempo.value) / 100).toFixed(2)}×`;
  });

  ui.pause.addEventListener('click', () => {
    running = !running;
    ui.pause.textContent = running ? 'Pause' : 'Resume';
    lastTimestamp = performance.now();
    setStatus(running ? 'Animation resumed.' : 'Animation paused; inherited and transient state are held fixed.');
  });

  ui.reset.addEventListener('click', resetDynamics);

  ui.tempoOut.textContent = `${(Number(ui.tempo.value) / 100).toFixed(2)}×`;
  loadGenome(genomeFromSeed(ui.seed.value));
  requestAnimationFrame(animationFrame);
})();
