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

  function paletteFromGenome(genome) {
    if (genome.length !== 16) throw new RangeError('Pixel Genome uses exactly 16 bytes (128 bits)');
    const lift = b => 55 + (b % 176);
    return [
      [12 + (genome[13] % 28), 16 + (genome[14] % 28), 20 + (genome[15] % 28)],
      [lift(genome[10]), lift(genome[11]), lift(genome[12])],
      [lift(genome[3]), lift(genome[6]), lift(genome[8])],
      [205 + (genome[4] % 51), 205 + (genome[5] % 51), 205 + (genome[9] % 51)]
    ];
  }

  function renderGenome(genome, size = 24) {
    if (genome.length !== 16) throw new RangeError('Pixel Genome uses exactly 16 bytes (128 bits)');
    const pixels = new Uint8Array(size * size);
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
        const inside = nx * nx + ny * ny <= 1;
        let value = inside ? 1 : 0;
        if (inside) {
          if (patternMode === 1 && ((x + genome[10]) % stripePeriod === 0)) value = 2;
          else if (patternMode === 2 && ((y + genome[11]) % stripePeriod === 0)) value = 2;
          else if (patternMode === 3 && (((x + y + genome[12]) % stripePeriod) === 0)) value = 2;
        }
        pixels[y * size + x] = value;
      }
    }

    const eyeXs = [Math.round(cx - eyeOffset), Math.round(cx + eyeOffset)];
    for (const ex of eyeXs) if (ex >= 0 && ex < size) pixels[eyeY * size + ex] = 3;

    const hornY = Math.max(0, Math.round(cy - ry));
    for (let k = 1; k <= hornLength; k++) {
      const yy = hornY - k;
      if (yy < 0) break;
      const left = Math.round(cx - rx * 0.55 - k * 0.35);
      const right = Math.round(cx + rx * 0.55 + k * 0.35);
      if (left >= 0) pixels[yy * size + left] = 2;
      if (right < size) pixels[yy * size + right] = 2;
    }

    const baseY = Math.min(size - 1, Math.round(cy + ry));
    const legXs = [Math.round(cx - rx * 0.5), Math.round(cx + rx * 0.5)];
    for (const lx of legXs) for (let k = 1; k <= legLength; k++) {
      const yy = baseY + k;
      if (yy >= size) break;
      pixels[yy * size + lx] = 1;
    }

    if (asymmetry) {
      const y = Math.max(0, Math.min(size - 1, Math.round(cy)));
      const x = Math.min(size - 1, Math.round(cx + rx + 1));
      pixels[y * size + x] = 2;
    }
    return pixels;
  }

  function mutateGenome(genome, seedText) {
    const out = Uint8Array.from(genome);
    const next = xorshift32(hashSeed(seedText));
    const mutations = 1 + (next() % 3);
    const positions = new Set();
    while (positions.size < mutations) positions.add(next() % (out.length * 8));
    positions.forEach(bitIndex => {
      const byte = Math.floor(bitIndex / 8);
      const bit = bitIndex % 8;
      out[byte] ^= 1 << bit;
    });
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
    if (a.length !== b.length) throw new RangeError('pixel arrays must have equal length');
    let d = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d += 1;
    return d;
  }

  function genomeBitDistance(a, b) {
    if (a.length !== b.length) throw new RangeError('genomes must have equal length');
    let d = 0;
    for (let i = 0; i < a.length; i++) {
      let x = a[i] ^ b[i];
      while (x) { d += x & 1; x >>>= 1; }
    }
    return d;
  }

  function damage(pixels, rate, seedText) {
    const next = xorshift32(hashSeed(seedText));
    const out = Uint8Array.from(pixels);
    let flips = 0;
    for (let i = 0; i < out.length; i++) if ((next() / 4294967296) < rate) {
      out[i] = (out[i] + 1 + (next() % 3)) % 4;
      flips++;
    }
    return { bits: out, flips };
  }

  function rgbHex(rgb) {
    return `#${rgb.map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
  }

  const api = { hashSeed, genomeFromSeed, genomeHex, paletteFromGenome, renderGenome, mutateGenome, crossGenomes, interpolateGenomes, hammingBits, genomeBitDistance, damage };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.PixelGenome = api;
  if (typeof document === 'undefined') return;

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('[data-genome-lab]');
    if (!root) return;
    const SIZE = 24;
    const BITS_PER_INDEX = 2;
    let parentA = genomeFromSeed(root.querySelector('#genomeSeed').value);
    let parentB = genomeFromSeed(root.querySelector('#genomeParentB').value);
    let genome = Uint8Array.from(parentA);
    let raster = renderGenome(genome, SIZE);
    let mutationCounter = 0;
    const canvas = root.querySelector('#genomeCanvas');
    const ctx = canvas.getContext('2d'); canvas.width = SIZE; canvas.height = SIZE;

    function paintPalette(palette) {
      root.querySelectorAll('[data-palette-index]').forEach(node => {
        const i = Number(node.dataset.paletteIndex);
        const rgb = palette[i];
        const swatch = node.querySelector('.palette-swatch');
        const code = node.querySelector('code');
        if (swatch) swatch.style.background = `rgb(${rgb.join(',')})`;
        if (code) code.textContent = `${i.toString(2).padStart(2, '0')} → ${rgbHex(rgb)}`;
      });
    }

    function paint() {
      const palette = paletteFromGenome(genome);
      const image = ctx.createImageData(SIZE, SIZE);
      for (let i = 0; i < raster.length; i++) {
        const rgb = palette[raster[i]];
        image.data[i * 4] = rgb[0]; image.data[i * 4 + 1] = rgb[1]; image.data[i * 4 + 2] = rgb[2]; image.data[i * 4 + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
      paintPalette(palette);
      root.querySelector('#genomeHex').textContent = genomeHex(genome);
      root.querySelector('#genomeRasterBits').textContent = (raster.length * BITS_PER_INDEX).toLocaleString();
      root.querySelector('#genomeDescriptionBits').textContent = 128;
      root.querySelector('#genomeRatio').textContent = `${(128 / (raster.length * BITS_PER_INDEX)).toFixed(3)}×`;
    }

    function regenerate(note = 'Regenerated exactly from the current 128-bit genome and the shared procedural interpreter.') {
      raster = renderGenome(genome, SIZE); paint(); root.querySelector('#genomeStatus').textContent = note;
    }

    root.querySelector('#genomeGenerate').addEventListener('click', () => {
      parentA = genomeFromSeed(root.querySelector('#genomeSeed').value); genome = Uint8Array.from(parentA); mutationCounter = 0; regenerate('Generated a deterministic genome, four-color palette, and 2-bit indexed raster from the Parent A seed.');
    });
    root.querySelector('#genomeMutate').addEventListener('click', () => {
      mutationCounter += 1;
      const before = Uint8Array.from(genome);
      genome = mutateGenome(genome, `${root.querySelector('#genomeSeed').value}:mutation:${mutationCounter}`);
      const changed = genomeBitDistance(before, genome);
      regenerate(`Deterministic mutation #${mutationCounter}: flipped exactly ${changed} genome bit${changed === 1 ? '' : 's'}, then regenerated traits, palette, and color indices.`);
    });
    root.querySelector('#genomeCross').addEventListener('click', () => {
      parentB = genomeFromSeed(root.querySelector('#genomeParentB').value); genome = crossGenomes(parentA, parentB, root.querySelector('#genomeSeed').value); regenerate('Crossed Parent A and Parent B genomes byte-by-byte using a deterministic selection mask.');
    });
    root.querySelector('#genomeInterpolate').addEventListener('input', e => {
      parentB = genomeFromSeed(root.querySelector('#genomeParentB').value);
      const t = Number(e.target.value) / 100; genome = interpolateGenomes(parentA, parentB, t); regenerate(`Interpolated Parent A and the currently visible Parent B seed at t=${t.toFixed(2)}.`); root.querySelector('#genomeT').textContent = t.toFixed(2);
    });
    root.querySelector('#genomeDamage').addEventListener('click', () => {
      const original = renderGenome(genome, SIZE); const d = damage(original, 0.15, `${genomeHex(genome)}:damage`); raster = d.bits; paint(); root.querySelector('#genomeStatus').textContent = `Damaged ${d.flips}/${raster.length} visible color indices. The genome and derived palette were not changed.`;
    });
    root.querySelector('#genomeRegenerate').addEventListener('click', () => regenerate());
    regenerate();
  });
})();
