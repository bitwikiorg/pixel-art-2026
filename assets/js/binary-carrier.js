(() => {
  'use strict';

  const SIZE = 16;
  const CELL_COUNT = SIZE * SIZE;
  const BYTE_COUNT = CELL_COUNT / 8;
  const HV_DIM = 4096;

  function bitsToBytes(bits) {
    const bytes = new Uint8Array(Math.ceil(bits.length / 8));
    for (let i = 0; i < bits.length; i++) if (bits[i]) bytes[i >> 3] |= 1 << (7 - (i & 7));
    return bytes;
  }

  function bytesToBits(bytes, bitLength = bytes.length * 8) {
    const bits = new Uint8Array(bitLength);
    for (let i = 0; i < bitLength; i++) bits[i] = (bytes[i >> 3] >> (7 - (i & 7))) & 1;
    return bits;
  }

  function bytesToHex(bytes) {
    return Array.from(bytes, b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
  }

  function bitString(bits, width = SIZE) {
    const rows = [];
    for (let i = 0; i < bits.length; i += width) rows.push(Array.from(bits.slice(i, i + width)).join(''));
    return rows.join('\n');
  }

  function binaryEntropy(bits) {
    if (!bits.length) return 0;
    let ones = 0;
    for (const b of bits) ones += b ? 1 : 0;
    const p = ones / bits.length;
    if (p === 0 || p === 1) return 0;
    return -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
  }

  function crc32(bytes) {
    let crc = 0xFFFFFFFF;
    for (const byte of bytes) {
      crc ^= byte;
      for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function crcHex(bytes) {
    return crc32(bytes).toString(16).padStart(8, '0').toUpperCase();
  }

  function textToCarrier(text) {
    const payload = new TextEncoder().encode(text);
    if (payload.length > BYTE_COUNT - 2) throw new Error(`Text is ${payload.length} bytes; this 16×16 carrier can hold at most ${BYTE_COUNT - 2} UTF-8 bytes plus a 2-byte length header.`);
    const bytes = new Uint8Array(BYTE_COUNT);
    bytes[0] = (payload.length >> 8) & 0xFF;
    bytes[1] = payload.length & 0xFF;
    bytes.set(payload, 2);
    return bytesToBits(bytes, CELL_COUNT);
  }

  function carrierToText(bits) {
    const bytes = bitsToBytes(bits);
    const length = (bytes[0] << 8) | bytes[1];
    if (length > BYTE_COUNT - 2) throw new Error(`Length header requests ${length} bytes, beyond this carrier's ${BYTE_COUNT - 2}-byte payload limit.`);
    return new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(2, 2 + length));
  }

  function hamming74Encode(bits) {
    const out = [];
    for (let i = 0; i < bits.length; i += 4) {
      const d1 = bits[i] || 0, d2 = bits[i + 1] || 0, d3 = bits[i + 2] || 0, d4 = bits[i + 3] || 0;
      const p1 = d1 ^ d2 ^ d4;
      const p2 = d1 ^ d3 ^ d4;
      const p3 = d2 ^ d3 ^ d4;
      out.push(p1, p2, d1, p3, d2, d3, d4);
    }
    return Uint8Array.from(out);
  }

  function hamming74Decode(encoded) {
    const data = [];
    let corrected = 0;
    for (let i = 0; i < encoded.length; i += 7) {
      const c = Array.from(encoded.slice(i, i + 7));
      while (c.length < 7) c.push(0);
      const s1 = c[0] ^ c[2] ^ c[4] ^ c[6];
      const s2 = c[1] ^ c[2] ^ c[5] ^ c[6];
      const s3 = c[3] ^ c[4] ^ c[5] ^ c[6];
      const errorPosition = s1 + (s2 << 1) + (s3 << 2);
      if (errorPosition >= 1 && errorPosition <= 7) {
        c[errorPosition - 1] ^= 1;
        corrected += 1;
      }
      data.push(c[2], c[4], c[5], c[6]);
    }
    return { bits: Uint8Array.from(data.slice(0, CELL_COUNT)), corrected };
  }

  function flipRandomBits(bits, probability, random = Math.random) {
    const out = Uint8Array.from(bits);
    let flips = 0;
    for (let i = 0; i < out.length; i++) {
      if (random() < probability) {
        out[i] ^= 1;
        flips += 1;
      }
    }
    return { bits: out, flips };
  }

  function hammingDistance(a, b) {
    const n = Math.min(a.length, b.length);
    let d = Math.abs(a.length - b.length);
    for (let i = 0; i < n; i++) d += a[i] === b[i] ? 0 : 1;
    return d;
  }

  function motifCodec(bits, width = SIZE) {
    const height = Math.floor(bits.length / width);
    const dict = [];
    const ids = [];
    const map = new Map();
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const tile = [bits[y * width + x] || 0, bits[y * width + x + 1] || 0, bits[(y + 1) * width + x] || 0, bits[(y + 1) * width + x + 1] || 0];
        const key = tile.join('');
        if (!map.has(key)) { map.set(key, dict.length); dict.push(tile); }
        ids.push(map.get(key));
      }
    }
    const codeWidth = dict.length <= 1 ? 0 : Math.ceil(Math.log2(dict.length));
    const dictionaryBits = 5 + dict.length * 4;
    const indexBits = ids.length * codeWidth;
    return { dict, ids, codeWidth, dictionaryBits, indexBits, totalBits: dictionaryBits + indexBits, rawBits: bits.length };
  }

  function motifDecode(codec, width = SIZE, height = SIZE) {
    const out = new Uint8Array(width * height);
    let k = 0;
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const tile = codec.dict[codec.ids[k++]] || [0, 0, 0, 0];
        out[y * width + x] = tile[0]; out[y * width + x + 1] = tile[1];
        out[(y + 1) * width + x] = tile[2]; out[(y + 1) * width + x + 1] = tile[3];
      }
    }
    return out;
  }

  function xorshift32(seed) {
    let x = seed >>> 0 || 0x9E3779B9;
    return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return x >>> 0; };
  }

  function seedFor(kind, value) {
    let h = 2166136261 >>> 0;
    const s = `${kind}:${value}`;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h || 1;
  }

  const hvCache = new Map();
  function hypervector(kind, value, dim = HV_DIM) {
    const key = `${kind}:${value}:${dim}`;
    if (hvCache.has(key)) return hvCache.get(key);
    const rand = xorshift32(seedFor(kind, value));
    const v = new Int8Array(dim);
    for (let i = 0; i < dim; i++) v[i] = (rand() & 1) ? 1 : -1;
    hvCache.set(key, v);
    return v;
  }

  function buildFieldHypervector(bits, width = SIZE, dim = HV_DIM) {
    const sums = new Int16Array(dim);
    const hv0 = hypervector('bit', 0, dim), hv1 = hypervector('bit', 1, dim);
    for (let index = 0; index < bits.length; index++) {
      const x = index % width, y = Math.floor(index / width);
      const hx = hypervector('x', x, dim), hy = hypervector('y', y, dim), hb = bits[index] ? hv1 : hv0;
      for (let d = 0; d < dim; d++) sums[d] += hx[d] * hy[d] * hb[d];
    }
    const field = new Int8Array(dim);
    for (let d = 0; d < dim; d++) field[d] = sums[d] >= 0 ? 1 : -1;
    return field;
  }

  function hypervectorQuery(field, x, y, dim = HV_DIM) {
    const hx = hypervector('x', x, dim), hy = hypervector('y', y, dim);
    const hv0 = hypervector('bit', 0, dim), hv1 = hypervector('bit', 1, dim);
    let s0 = 0, s1 = 0;
    for (let d = 0; d < dim; d++) {
      const carrier = field[d] * hx[d] * hy[d];
      s0 += carrier * hv0[d]; s1 += carrier * hv1[d];
    }
    return { score0: s0 / dim, score1: s1 / dim, predicted: s1 > s0 ? 1 : 0 };
  }

  function makeHopfield() {
    const weights = new Float32Array(CELL_COUNT * CELL_COUNT);
    const patterns = [];
    function store(bits) {
      if (patterns.length >= 4) return false;
      const s = new Int8Array(CELL_COUNT);
      for (let i = 0; i < CELL_COUNT; i++) s[i] = bits[i] ? 1 : -1;
      patterns.push(Uint8Array.from(bits));
      const scale = 1 / CELL_COUNT;
      for (let i = 0; i < CELL_COUNT; i++) {
        const base = i * CELL_COUNT;
        for (let j = 0; j < CELL_COUNT; j++) if (i !== j) weights[base + j] += s[i] * s[j] * scale;
      }
      return true;
    }
    function recallStep(bits) {
      const state = new Int8Array(CELL_COUNT);
      for (let i = 0; i < CELL_COUNT; i++) state[i] = bits[i] ? 1 : -1;
      for (let i = 0; i < CELL_COUNT; i++) {
        const base = i * CELL_COUNT;
        let sum = 0;
        for (let j = 0; j < CELL_COUNT; j++) sum += weights[base + j] * state[j];
        state[i] = sum >= 0 ? 1 : -1;
      }
      return Uint8Array.from(state, v => v > 0 ? 1 : 0);
    }
    function nearest(bits) {
      if (!patterns.length) return { index: -1, distance: null };
      let best = Infinity, bestIndex = -1;
      patterns.forEach((p, i) => { const d = hammingDistance(bits, p); if (d < best) { best = d; bestIndex = i; } });
      return { index: bestIndex, distance: best };
    }
    function reset() { weights.fill(0); patterns.length = 0; }
    return { weights, patterns, store, recallStep, nearest, reset };
  }

  function preset(name) {
    const bits = new Uint8Array(CELL_COUNT);
    if (name === 'checker') {
      for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) bits[y * SIZE + x] = (x + y) & 1;
    } else if (name === 'frame') {
      for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) bits[y * SIZE + x] = (x === 1 || x === SIZE - 2 || y === 1 || y === SIZE - 2) ? 1 : 0;
    } else if (name === 'smile') {
      [[4,4],[11,4],[4,5],[11,5],[5,10],[6,11],[7,12],[8,12],[9,11],[10,10]].forEach(([x,y]) => bits[y * SIZE + x] = 1);
    } else if (name === 'random') {
      for (let i = 0; i < bits.length; i++) bits[i] = Math.random() < 0.5 ? 1 : 0;
    }
    return bits;
  }

  function transform(bits, kind) {
    const out = new Uint8Array(CELL_COUNT);
    if (kind === 'not') {
      for (let i = 0; i < CELL_COUNT; i++) out[i] = bits[i] ^ 1;
    } else if (kind === 'mirror') {
      for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) out[y * SIZE + (SIZE - 1 - x)] = bits[y * SIZE + x];
    } else if (kind === 'shift') {
      for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE - 1; x++) out[y * SIZE + x + 1] = bits[y * SIZE + x];
    } else if (kind === 'dilate') {
      for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
        let on = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && bits[ny * SIZE + nx]) on = 1;
        }
        out[y * SIZE + x] = on;
      }
    } else out.set(bits);
    return out;
  }

  const api = { SIZE, CELL_COUNT, BYTE_COUNT, HV_DIM, bitsToBytes, bytesToBits, bytesToHex, bitString, binaryEntropy, crc32, crcHex, textToCarrier, carrierToText, hamming74Encode, hamming74Decode, flipRandomBits, hammingDistance, motifCodec, motifDecode, buildFieldHypervector, hypervectorQuery, makeHopfield, preset, transform };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.BinaryCarrier = api;
  if (typeof document === 'undefined') return;

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('[data-binary-carrier]');
    if (!root) return;
    let bits = preset('smile');
    let originalForNoise = Uint8Array.from(bits);
    let eccEncoded = hamming74Encode(bits);
    let hv = null;
    const hopfield = makeHopfield();
    const grid = root.querySelector('#binaryGrid');
    const recoveredGrid = root.querySelector('#recoveredGrid');
    const bitOut = root.querySelector('#bitStream');
    const hexOut = root.querySelector('#hexStream');
    const textInput = root.querySelector('#textPayload');
    const textStatus = root.querySelector('#textStatus');
    const eccStatus = root.querySelector('#eccStatus');
    const memoryStatus = root.querySelector('#memoryStatus');
    const motifStatus = root.querySelector('#motifStatus');
    const hvStatus = root.querySelector('#hvStatus');

    function makeGrid(target, editable) {
      target.innerHTML = '';
      for (let i = 0; i < CELL_COUNT; i++) {
        const cell = document.createElement(editable ? 'button' : 'span');
        cell.className = 'binary-cell';
        if (editable) {
          cell.type = 'button';
          cell.setAttribute('aria-label', `pixel ${i % SIZE},${Math.floor(i / SIZE)}`);
          cell.addEventListener('click', () => { bits[i] ^= 1; originalForNoise = Uint8Array.from(bits); eccEncoded = hamming74Encode(bits); render(); });
        }
        target.appendChild(cell);
      }
    }
    makeGrid(grid, true); makeGrid(recoveredGrid, false);

    function paint(target, source) { Array.from(target.children).forEach((cell, i) => cell.classList.toggle('on', Boolean(source[i]))); }
    function render() {
      paint(grid, bits);
      const bytes = bitsToBytes(bits);
      bitOut.textContent = bitString(bits); hexOut.textContent = bytesToHex(bytes);
      const ones = bits.reduce((a, b) => a + b, 0);
      root.querySelector('#metricBits').textContent = `${bits.length}`;
      root.querySelector('#metricBytes').textContent = `${bytes.length}`;
      root.querySelector('#metricOnes').textContent = `${ones}`;
      root.querySelector('#metricEntropy').textContent = `${binaryEntropy(bits).toFixed(3)} b/px`;
      root.querySelector('#metricCrc').textContent = crcHex(bytes);
      root.querySelector('#metricAddress').textContent = '16 × 16';
    }

    root.querySelectorAll('[data-preset]').forEach(btn => btn.addEventListener('click', () => { bits = preset(btn.dataset.preset); originalForNoise = Uint8Array.from(bits); eccEncoded = hamming74Encode(bits); render(); }));
    root.querySelectorAll('[data-transform]').forEach(btn => btn.addEventListener('click', () => { bits = transform(bits, btn.dataset.transform); originalForNoise = Uint8Array.from(bits); eccEncoded = hamming74Encode(bits); render(); }));

    root.querySelector('#encodeText').addEventListener('click', () => {
      try { bits = textToCarrier(textInput.value); originalForNoise = Uint8Array.from(bits); eccEncoded = hamming74Encode(bits); textStatus.textContent = `Encoded ${new TextEncoder().encode(textInput.value).length} UTF-8 payload bytes into 32 carrier bytes.`; render(); }
      catch (err) { textStatus.textContent = err.message; }
    });
    root.querySelector('#decodeText').addEventListener('click', () => {
      try { textStatus.textContent = `Decoded: ${JSON.stringify(carrierToText(bits))}`; }
      catch (err) { textStatus.textContent = `Decode error: ${err.message}`; }
    });

    root.querySelector('#applyNoise').addEventListener('click', () => {
      const p = Number(root.querySelector('#noiseRate').value) / 100;
      originalForNoise = Uint8Array.from(bits); eccEncoded = hamming74Encode(bits);
      const rawNoise = flipRandomBits(bits, p), eccNoise = flipRandomBits(eccEncoded, p), decoded = hamming74Decode(eccNoise.bits);
      const rawDistance = hammingDistance(originalForNoise, rawNoise.bits), eccDistance = hammingDistance(originalForNoise, decoded.bits);
      bits = rawNoise.bits; paint(recoveredGrid, decoded.bits);
      eccStatus.textContent = `Raw channel: ${rawNoise.flips} flipped carrier bits (${rawDistance} wrong after transmission). Hamming(7,4): ${eccNoise.flips} encoded-bit flips, ${decoded.corrected} syndromes corrected, ${eccDistance} source bits still wrong.`;
      render();
    });
    root.querySelector('#restoreOriginal').addEventListener('click', () => { bits = Uint8Array.from(originalForNoise); paint(recoveredGrid, bits); eccStatus.textContent = 'Restored the pre-noise source field.'; render(); });

    root.querySelector('#storeMemory').addEventListener('click', () => { const ok = hopfield.store(bits); memoryStatus.textContent = ok ? `Stored pattern ${hopfield.patterns.length}/4. The 256×256 symmetric weight matrix is now the associative memory.` : 'Memory is full (4 patterns). Reset it before storing another.'; });
    root.querySelector('#corruptMemory').addEventListener('click', () => { if (!hopfield.patterns.length) { memoryStatus.textContent = 'Store at least one pattern first.'; return; } bits = flipRandomBits(bits, 0.15).bits; const nearest = hopfield.nearest(bits); memoryStatus.textContent = `Corrupted current field. Nearest stored pattern is #${nearest.index + 1}, Hamming distance ${nearest.distance}.`; render(); });
    root.querySelector('#recallMemory').addEventListener('click', () => { if (!hopfield.patterns.length) { memoryStatus.textContent = 'Store at least one pattern first.'; return; } for (let k = 0; k < 8; k++) bits = hopfield.recallStep(bits); const nearest = hopfield.nearest(bits); memoryStatus.textContent = `Ran 8 asynchronous Hopfield sweeps. Nearest stored pattern #${nearest.index + 1}; Hamming distance ${nearest.distance}.`; render(); });
    root.querySelector('#resetMemory').addEventListener('click', () => { hopfield.reset(); memoryStatus.textContent = 'Associative memory cleared.'; });

    root.querySelector('#runMotifCodec').addEventListener('click', () => { const codec = motifCodec(bits), decoded = motifDecode(codec), ratio = codec.totalBits / codec.rawBits; motifStatus.textContent = `${codec.dict.length} unique 2×2 motifs · ${codec.codeWidth} index bits/tile · ${codec.dictionaryBits} dictionary bits + ${codec.indexBits} index bits = ${codec.totalBits} bits total (${ratio.toFixed(3)}× raw). Exact decode Hamming distance: ${hammingDistance(bits, decoded)}.`; root.querySelector('#motifDictionary').textContent = codec.dict.map((tile, i) => `${i}: ${tile.join('')}`).join(' · '); paint(recoveredGrid, decoded); });

    root.querySelector('#buildHypervector').addEventListener('click', () => { hv = buildFieldHypervector(bits); const x = Number(root.querySelector('#queryX').value), y = Number(root.querySelector('#queryY').value), q = hypervectorQuery(hv, x, y), truth = bits[y * SIZE + x]; hvStatus.textContent = `Bundled all 256 address/value bindings into a ${HV_DIM}-D bipolar hypervector. Query (${x},${y}): score(0)=${q.score0.toFixed(4)}, score(1)=${q.score1.toFixed(4)} → predicted ${q.predicted}; visible source bit = ${truth}. Logical state: ${HV_DIM} bipolar dimensions; browser storage: ${HV_DIM} bytes.`; });

    root.querySelector('#playBits').addEventListener('click', async () => {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) { root.querySelector('#soundStatus').textContent = 'Web Audio is unavailable in this browser.'; return; }
      const ctx = new AudioCtx(), sampleRate = 8000, secondsPerBit = 0.01, samplesPerBit = Math.floor(sampleRate * secondsPerBit);
      const buffer = ctx.createBuffer(1, samplesPerBit * bits.length, sampleRate), data = buffer.getChannelData(0);
      for (let i = 0; i < bits.length; i++) { const f = bits[i] ? 880 : 440; for (let s = 0; s < samplesPerBit; s++) data[i * samplesPerBit + s] = 0.18 * Math.sin(2 * Math.PI * f * (s / sampleRate)); }
      const source = ctx.createBufferSource(); source.buffer = buffer; source.connect(ctx.destination); source.start();
      root.querySelector('#soundStatus').textContent = `Playing ${bits.length} bits as binary FSK: 0 → 440 Hz, 1 → 880 Hz, ${secondsPerBit * 1000} ms per bit. This is a transduction demo, not compression.`;
      source.onended = () => ctx.close();
    });

    root.querySelector('#noiseRate').addEventListener('input', e => { root.querySelector('#noiseValue').textContent = `${e.target.value}%`; });
    render(); paint(recoveredGrid, bits);
  });
})();