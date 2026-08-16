(() => {
  'use strict';

  const FAMILY_NAMES = ['orb', 'biped', 'quadruped', 'winged', 'crawler', 'radial'];

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

  function assertGenome(genome) {
    if (genome.length !== 16) throw new RangeError('Pixel Genome uses exactly 16 bytes (128 bits)');
  }

  function genomeTraits(genome) {
    assertGenome(genome);
    return {
      familyIndex: genome[0] % FAMILY_NAMES.length,
      family: FAMILY_NAMES[genome[0] % FAMILY_NAMES.length],
      patternMode: genome[8] % 4,
      patternPeriod: 2 + (genome[3] % 5),
      asymmetry: Boolean(genome[9] & 1),
      orientation: (genome[9] & 2) ? -1 : 1,
      appendageScale: 1 + (genome[6] % 5),
      limbScale: 1 + (genome[7] % 5)
    };
  }

  function paletteFromGenome(genome) {
    assertGenome(genome);
    const lift = b => 55 + (b % 176);
    return [
      [12 + (genome[13] % 28), 16 + (genome[14] % 28), 20 + (genome[15] % 28)],
      [lift(genome[10]), lift(genome[11]), lift(genome[12])],
      [lift(genome[3]), lift(genome[6]), lift(genome[8])],
      [205 + (genome[4] % 51), 205 + (genome[5] % 51), 205 + (genome[9] % 51)]
    ];
  }

  function renderGenome(genome, size = 24) {
    assertGenome(genome);
    if (!Number.isInteger(size) || size < 12) throw new RangeError('size must be an integer >= 12');
    const pixels = new Uint8Array(size * size);
    const traits = genomeTraits(genome);
    const cx = (size - 1) / 2;
    const cy = (size - 1) / 2;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    function set(x, y, value) {
      const xx = Math.round(x), yy = Math.round(y);
      if (xx >= 0 && yy >= 0 && xx < size && yy < size) pixels[yy * size + xx] = value;
    }

    function patternValue(x, y, base = 1) {
      const p = traits.patternPeriod;
      if (traits.patternMode === 1 && ((x + genome[10]) % p === 0)) return 2;
      if (traits.patternMode === 2 && ((y + genome[11]) % p === 0)) return 2;
      if (traits.patternMode === 3 && (((x + y + genome[12]) % p) === 0)) return 2;
      return base;
    }

    function ellipse(ex, ey, rx, ry, patterned = true, value = 1) {
      const minX = Math.floor(ex - rx - 1), maxX = Math.ceil(ex + rx + 1);
      const minY = Math.floor(ey - ry - 1), maxY = Math.ceil(ey + ry + 1);
      for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
        const nx = (x - ex) / Math.max(rx, 0.01), ny = (y - ey) / Math.max(ry, 0.01);
        if (nx * nx + ny * ny <= 1) set(x, y, patterned ? patternValue(x, y, value) : value);
      }
    }

    function line(x0, y0, x1, y1, value = 2) {
      const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        set(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, value);
      }
    }

    function eye(x, y) { set(x, y, 3); }

    const width = size * (0.17 + (genome[1] / 255) * 0.12);
    const height = size * (0.18 + (genome[2] / 255) * 0.14);
    const appendage = 1 + (genome[6] % 5);
    const limb = 1 + (genome[7] % 5);
    const offset = (genome[5] / 255 - 0.5) * size * 0.12;
    const dir = traits.orientation;

    if (traits.family === 'orb') {
      const bodyCy = cy + (genome[4] / 255 - 0.5) * 2;
      ellipse(cx, bodyCy, width, height * 1.15);
      const eyeY = bodyCy - height * 0.25;
      eye(cx - width * 0.35, eyeY); eye(cx + width * 0.35, eyeY);
      for (let k = 1; k <= appendage; k++) {
        line(cx - width * 0.55, bodyCy - height, cx - width * 0.55 - k * 0.3, bodyCy - height - k, 2);
        line(cx + width * 0.55, bodyCy - height, cx + width * 0.55 + k * 0.3, bodyCy - height - k, 2);
      }
      line(cx - width * 0.5, bodyCy + height, cx - width * 0.5, bodyCy + height + limb, 1);
      line(cx + width * 0.5, bodyCy + height, cx + width * 0.5, bodyCy + height + limb, 1);
    } else if (traits.family === 'biped') {
      const torsoY = cy + 1;
      ellipse(cx, torsoY, width * 0.75, height * 0.9);
      ellipse(cx + offset * 0.25, torsoY - height * 1.05, width * 0.58, height * 0.5, false, 1);
      eye(cx - width * 0.2 + offset * 0.25, torsoY - height * 1.08);
      eye(cx + width * 0.2 + offset * 0.25, torsoY - height * 1.08);
      line(cx - width * 0.65, torsoY - height * 0.15, cx - width - appendage * 0.5, torsoY + offset * 0.2, 2);
      line(cx + width * 0.65, torsoY - height * 0.15, cx + width + appendage * 0.5, torsoY - offset * 0.2, 2);
      line(cx - width * 0.32, torsoY + height * 0.75, cx - width * 0.45, torsoY + height + limb + 1, 1);
      line(cx + width * 0.32, torsoY + height * 0.75, cx + width * 0.45, torsoY + height + limb + 1, 1);
    } else if (traits.family === 'quadruped') {
      const bodyX = cx - dir * width * 0.15;
      ellipse(bodyX, cy, width * 1.35, height * 0.62);
      const headX = bodyX + dir * width * 1.35;
      ellipse(headX, cy - height * 0.15, width * 0.52, height * 0.5, false, 1);
      eye(headX + dir * width * 0.15, cy - height * 0.28);
      const legXs = [bodyX - width * 0.75, bodyX - width * 0.25, bodyX + width * 0.25, bodyX + width * 0.75];
      legXs.forEach((x, i) => line(x, cy + height * 0.45, x + (i % 2 ? 0.4 : -0.4), cy + height * 0.45 + limb + 2, 1));
      line(bodyX - dir * width * 1.25, cy - height * 0.15, bodyX - dir * (width * 1.55 + appendage), cy - height * 0.65 - appendage * 0.4, 2);
    } else if (traits.family === 'winged') {
      ellipse(cx, cy, width * 0.55, height * 1.0);
      ellipse(cx - width * 0.85, cy + offset * 0.15, width * 0.75, height * 0.72, true, 2);
      ellipse(cx + width * 0.85, cy - offset * 0.15, width * 0.75, height * 0.72, true, 2);
      eye(cx - width * 0.18, cy - height * 0.55); eye(cx + width * 0.18, cy - height * 0.55);
      line(cx - width * 0.18, cy - height * 0.9, cx - width * 0.5, cy - height * 1.2 - appendage, 3);
      line(cx + width * 0.18, cy - height * 0.9, cx + width * 0.5, cy - height * 1.2 - appendage, 3);
    } else if (traits.family === 'crawler') {
      const segments = 4 + (genome[4] % 4);
      const spacing = clamp(width * 0.72, 2, 4.5);
      const start = cx - (segments - 1) * spacing / 2;
      for (let i = 0; i < segments; i++) {
        const sy = cy + Math.sin((i + genome[5] / 32) * 1.2) * Math.min(2, height * 0.22);
        ellipse(start + i * spacing, sy, width * 0.52, height * 0.48, true, i === segments - 1 ? 2 : 1);
        if (i < segments - 1) {
          line(start + i * spacing, sy + height * 0.35, start + i * spacing - 0.7, sy + height * 0.65 + limb, 2);
          line(start + i * spacing, sy + height * 0.35, start + i * spacing + 0.7, sy + height * 0.65 + limb, 2);
        }
      }
      const hx = start + (segments - 1) * spacing;
      eye(hx - 0.7, cy - height * 0.12); eye(hx + 0.7, cy - height * 0.12);
    } else {
      const arms = 5 + (genome[4] % 4);
      const radius = Math.min(size * 0.36, height + appendage + 3);
      ellipse(cx, cy, width * 0.65, height * 0.65, false, 1);
      for (let i = 0; i < arms; i++) {
        const a = (Math.PI * 2 * i / arms) + (genome[5] / 255) * Math.PI;
        const x1 = cx + Math.cos(a) * radius;
        const y1 = cy + Math.sin(a) * radius;
        line(cx + Math.cos(a) * width * 0.45, cy + Math.sin(a) * height * 0.45, x1, y1, i % 2 ? 1 : 2);
        if ((genome[6] + i) % 3 === 0) ellipse(x1, y1, 1.1, 1.1, false, 3);
      }
      eye(cx - 1, cy - 1); eye(cx + 1, cy - 1);
    }

    if (traits.asymmetry) {
      const x = clamp(Math.round(cx + width + 1 + (genome[10] % 3)), 0, size - 1);
      const y = clamp(Math.round(cy + (genome[11] % 5) - 2), 0, size - 1);
      set(x, y, 2);
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

  const api = { FAMILY_NAMES, hashSeed, genomeFromSeed, genomeHex, genomeTraits, paletteFromGenome, renderGenome, mutateGenome, crossGenomes, interpolateGenomes, hammingBits, genomeBitDistance, damage };
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
      const traits = genomeTraits(genome);
      const image = ctx.createImageData(SIZE, SIZE);
      for (let i = 0; i < raster.length; i++) {
        const rgb = palette[raster[i]];
        image.data[i * 4] = rgb[0]; image.data[i * 4 + 1] = rgb[1]; image.data[i * 4 + 2] = rgb[2]; image.data[i * 4 + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
      paintPalette(palette);
      root.querySelector('#genomeHex').textContent = genomeHex(genome);
      root.querySelector('#genomeFamily').textContent = traits.family.toUpperCase();
      root.querySelector('#genomeRasterBits').textContent = (raster.length * BITS_PER_INDEX).toLocaleString();
      root.querySelector('#genomeDescriptionBits').textContent = 128;
      root.querySelector('#genomeRatio').textContent = `${(128 / (raster.length * BITS_PER_INDEX)).toFixed(3)}×`;
    }

    function regenerate(note = 'Regenerated exactly from the current 128-bit genome and the shared six-family procedural interpreter.') {
      raster = renderGenome(genome, SIZE); paint(); root.querySelector('#genomeStatus').textContent = note;
    }

    root.querySelector('#genomeGenerate').addEventListener('click', () => {
      parentA = genomeFromSeed(root.querySelector('#genomeSeed').value); genome = Uint8Array.from(parentA); mutationCounter = 0; regenerate(`Generated ${genomeTraits(genome).family} morphology, four-color palette, and 2-bit indexed raster from the Parent A seed.`);
    });
    root.querySelector('#genomeMutate').addEventListener('click', () => {
      mutationCounter += 1;
      const before = Uint8Array.from(genome);
      const beforeFamily = genomeTraits(before).family;
      genome = mutateGenome(genome, `${root.querySelector('#genomeSeed').value}:mutation:${mutationCounter}`);
      const changed = genomeBitDistance(before, genome);
      const afterFamily = genomeTraits(genome).family;
      regenerate(`Deterministic mutation #${mutationCounter}: flipped exactly ${changed} genome bit${changed === 1 ? '' : 's'}; morphology family ${beforeFamily}${beforeFamily === afterFamily ? ' stayed ' : ' changed to '}${afterFamily}.`);
    });
    root.querySelector('#genomeCross').addEventListener('click', () => {
      const seedA = root.querySelector('#genomeSeed').value;
      const seedB = root.querySelector('#genomeParentB').value;
      parentA = genomeFromSeed(seedA); parentB = genomeFromSeed(seedB);
      genome = crossGenomes(parentA, parentB, `${seedA}:${seedB}:cross`); mutationCounter = 0;
      regenerate(`Crossed the visible Parent A and Parent B genomes byte-by-byte. Child morphology family: ${genomeTraits(genome).family}.`);
    });
    root.querySelector('#genomeInterpolate').addEventListener('input', e => {
      const seedA = root.querySelector('#genomeSeed').value;
      const seedB = root.querySelector('#genomeParentB').value;
      parentA = genomeFromSeed(seedA); parentB = genomeFromSeed(seedB);
      const t = Number(e.target.value) / 100; genome = interpolateGenomes(parentA, parentB, t); mutationCounter = 0;
      regenerate(`Interpolated the visible Parent A and Parent B genomes at t=${t.toFixed(2)}. Current morphology family: ${genomeTraits(genome).family}.`); root.querySelector('#genomeT').textContent = t.toFixed(2);
    });
    root.querySelector('#genomeDamage').addEventListener('click', () => {
      const original = renderGenome(genome, SIZE); const d = damage(original, 0.15, `${genomeHex(genome)}:damage`); raster = d.bits; paint(); root.querySelector('#genomeStatus').textContent = `Damaged ${d.flips}/${raster.length} visible color indices. Genome, morphology family, and derived palette were not changed.`;
    });
    root.querySelector('#genomeRegenerate').addEventListener('click', () => regenerate());
    regenerate();
  });
})();
