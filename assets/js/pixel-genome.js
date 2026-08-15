(() => {
  'use strict';

  function xorshift32(seed) {
    let x = (seed >>> 0) || 0x9E3779B9;
    return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return x >>> 0; };
  }

  function hashSeed(text) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < String(text).length; i++) {
      h ^= String(text).charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h || 1;
  }

  function genomeFromSeed(seedText) {
    const next = xorshift32(hashSeed(seedText));
    const g = new Uint8Array(16);
    for (let i = 0; i < g.length; i++) g[i] = next() & 0xFF;
    return g;
  }

  function genomeHex(genome) {
    return Array.from(genome, b => b.toString(16).padStart(2, '0').toUpperCase()).join('');
  }

  function renderGenome(genome, size = 24) {
    if (genome.length !== 16) throw new RangeError('Pixel Genome uses exactly 16 bytes (128 bits)');
    const bits = new Uint8Array(size * size);
    const cx = (size - 1) / 2;
    const cy = size * (0.48 + (genome[0] / 255 - 0.5) * 0.08);
    const rx = size * (0.18 + (genome[1] / 255) * 0.10);
    const ry = size * (0.22 + (genome[2] / 255) * 0.14);
    const stripePeriod = 2 + (genome[3] % 5);
    const eyeY = Math.max(3, Math.min(size - 4, Math.round(cy - ry * (0.25 + (genome[4] / 255) * 0.2))));
    const eyeOffset = Math.max(2, Math.round(rx * (0.35 + (genome[5] / 255) * 0.25)));
    const hornLength = 1 + (genome[6] % 5);
    const legLength = 1 + (genome[7] % 5);
    const patternMode = genome[8] % 4;
    const asymmetry = genome[9] & 1;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const nx = (x - cx) / rx;
        const ny = (y - cy) / ry;
        let on = nx * nx + ny * ny <= 1;
        if (on) {
          if (patternMode === 1 && ((x + genome[10]) % stripePeriod === 0)) on = false;
          else if (patternMode === 2 && ((y + genome[11]) % stripePeriod === 0)) on = false;
          else if (patternMode === 3 && (((x + y + genome[12]) % stripePeriod) === 0)) on = false;
        }
        bits[y * size + x] = on ? 1 : 0;
      }
    }

    const eyeXs = [Math.round(cx - eyeOffset), Math.round(cx + eyeOffset)];
    for (const ex of eyeXs) if (ex >= 0 && ex < size) bits[eyeY * size + ex] = 0;

    const hornY = Math.max(0, Math.round(cy - ry));
    for (let k = 1; k <= hornLength; k++) {
      const yy = hornY - k;
      if (yy < 0) break;
      const left = Math.round(cx - rx * 0.55 - k * 0.35);
      const right = Math.round(cx + rx * 0.55 + k * 0.35);
      if (left >= 0) bits[yy * size + left] = 1;
      if (right < size) bits[yy * size + right] = 1;
    }

    const baseY = Math.min(size - 1, Math.round(cy + ry));
    const legXs = [Math.round(cx - rx * 0.5), Math.round(cx + rx * 0.5)];
    for (const lx of legXs) for (let k = 1; k <= legLength; k++) {
      const yy = baseY + k;
      if (yy >= size) break;
      bits[yy * size + lx] = 1;
    }

    if (asymmetry) {
      const y = Math.max(0, Math.min(size - 1, Math.round(cy)));
      const x = Math.min(size - 1, Math.round(cx + rx + 1));
      bits[y * size + x] = 1;
    }
    return bits;
  }

  function mutateGenome(genome, seedText) {
    const out = Uint8Array.from(genome);
    const next = xorshift32(hashSeed(seedText));
    const mutations = 1 + (next() % 3);
    for (let m = 0; m < mutations; m++) {
      const byte = next() % out.length;
      const bit = next() % 8;
      out[byte] ^= 1 << bit;
    }
    return out;
  }

  function crossGenomes(a, b, seedText) {
    if (a.length !== 16 || b.length !== 16) throw new RangeError('both parents must be 16-byte genomes');
    const next = xorshift32(hashSeed(seedText));
    const child = new Uint8Array(16);
    for (let i = 0; i < child.length; i++) child[i] = (next() & 1) ? a[i] : b[i];
    return child;
  }

  function interpolateGenomes(a, b, t) {
    if (!(t >= 0 && t <= 1)) throw new RangeError('t must be in [0,1]');
    const out = new Uint8Array(16);
    for (let i = 0; i < out.length; i++) out[i] = Math.round(a[i] * (1 - t) + b[i] * t);
    return out;
  }

  function hammingBits(a, b) {
    if (a.length !== b.length) throw new RangeError('bitmaps must have equal length');
    let d = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d += 1;
    return d;
  }

  function damage(bits, rate, seedText) {
    const next = xorshift32(hashSeed(seedText));
    const out = Uint8Array.from(bits);
    let flips = 0;
    for (let i = 0; i < out.length; i++) if ((next() / 4294967296) < rate) { out[i] ^= 1; flips++; }
    return { bits: out, flips };
  }

  const api = { hashSeed, genomeFromSeed, genomeHex, renderGenome, mutateGenome, crossGenomes, interpolateGenomes, hammingBits, damage };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.PixelGenome = api;
  if (typeof document === 'undefined') return;

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('[data-genome-lab]');
    if (!root) return;
    const SIZE = 24;
    let parentA = genomeFromSeed(root.querySelector('#genomeSeed').value);
    let parentB = genomeFromSeed('SECOND-PARENT');
    let genome = Uint8Array.from(parentA);
    let raster = renderGenome(genome, SIZE);
    let mutationCounter = 0;
    const canvas = root.querySelector('#genomeCanvas');
    const ctx = canvas.getContext('2d'); canvas.width = SIZE; canvas.height = SIZE;

    function paint() {
      const image = ctx.createImageData(SIZE, SIZE);
      for (let i = 0; i < raster.length; i++) {
        const v = raster[i] ? 245 : 12;
        image.data[i * 4] = v; image.data[i * 4 + 1] = v; image.data[i * 4 + 2] = v; image.data[i * 4 + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
      root.querySelector('#genomeHex').textContent = genomeHex(genome);
      root.querySelector('#genomeRasterBits').textContent = raster.length;
      root.querySelector('#genomeDescriptionBits').textContent = 128;
      root.querySelector('#genomeRatio').textContent = `${(128 / raster.length).toFixed(3)}×`;
    }

    function regenerate(note = 'Regenerated exactly from the current 128-bit genome and the shared procedural interpreter.') {
      raster = renderGenome(genome, SIZE); paint(); root.querySelector('#genomeStatus').textContent = note;
    }

    root.querySelector('#genomeGenerate').addEventListener('click', () => {
      parentA = genomeFromSeed(root.querySelector('#genomeSeed').value); genome = Uint8Array.from(parentA); mutationCounter = 0; regenerate('Generated a deterministic genome from the seed.');
    });
    root.querySelector('#genomeMutate').addEventListener('click', () => {
      mutationCounter += 1; genome = mutateGenome(genome, `${root.querySelector('#genomeSeed').value}:mutation:${mutationCounter}`); regenerate(`Deterministic mutation #${mutationCounter}: flipped 1–3 genome bits, then regenerated the raster.`);
    });
    root.querySelector('#genomeCross').addEventListener('click', () => {
      parentB = genomeFromSeed(root.querySelector('#genomeParentB').value); genome = crossGenomes(parentA, parentB, root.querySelector('#genomeSeed').value); regenerate('Crossed parent genomes byte-by-byte using a deterministic selection mask.');
    });
    root.querySelector('#genomeInterpolate').addEventListener('input', e => {
      const t = Number(e.target.value) / 100; genome = interpolateGenomes(parentA, parentB, t); regenerate(`Interpolated genome bytes at t=${t.toFixed(2)}.`); root.querySelector('#genomeT').textContent = t.toFixed(2);
    });
    root.querySelector('#genomeDamage').addEventListener('click', () => {
      const original = renderGenome(genome, SIZE); const d = damage(original, 0.15, `${genomeHex(genome)}:damage`); raster = d.bits; paint(); root.querySelector('#genomeStatus').textContent = `Damaged ${d.flips}/${raster.length} visible pixels. The genome itself was not changed.`;
    });
    root.querySelector('#genomeRegenerate').addEventListener('click', () => regenerate());
    regenerate();
  });
})();
