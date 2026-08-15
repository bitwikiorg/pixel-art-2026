(() => {
  'use strict';
  const LABELS = ['LEFT', 'RIGHT', 'ABOVE', 'BELOW'];
  function rng(seed = 1) { let x = (seed >>> 0) || 0x9E3779B9; return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return (x >>> 0) / 4294967296; }; }
  function randint(random, low, highExclusive) { return low + Math.floor(random() * (highExclusive - low)); }
  function sample({ grid = 12, direction = 0, minDist = 2, maxDist = 4, random = Math.random } = {}) {
    const maxAllowed = Math.min(maxDist, grid - 1); if (minDist < 1 || minDist > maxAllowed) throw new Error('invalid distance range');
    const dist = randint(random, minDist, maxAllowed + 1); let ax, ay, bx, by;
    if (direction === 0) { ax = randint(random, dist, grid); ay = randint(random, 0, grid); bx = ax - dist; by = ay; }
    else if (direction === 1) { ax = randint(random, 0, grid - dist); ay = randint(random, 0, grid); bx = ax + dist; by = ay; }
    else if (direction === 2) { ax = randint(random, 0, grid); ay = randint(random, dist, grid); bx = ax; by = ay - dist; }
    else if (direction === 3) { ax = randint(random, 0, grid); ay = randint(random, 0, grid - dist); bx = ax; by = ay + dist; }
    else throw new Error(`unknown direction ${direction}`);
    const x = new Float32Array(grid * grid * 2); x[(ay * grid + ax) * 2] = 1; x[(by * grid + bx) * 2 + 1] = 1;
    return { x, label: direction, a: { x: ax, y: ay }, b: { x: bx, y: by }, dist };
  }
  function dataset({ count, grid = 12, minDist = 2, maxDist = 4, seed = 1 } = {}) {
    if (!Number.isInteger(count) || count <= 0) throw new Error('count must be positive integer');
    const random = rng(seed), xs = new Float32Array(count * grid * grid * 2), ys = new Float32Array(count * 4), examples = [], offset = seed % 4;
    for (let i = 0; i < count; i++) { const direction = (i + offset) % 4; const ex = sample({ grid, direction, minDist, maxDist, random }); xs.set(ex.x, i * grid * grid * 2); ys[i * 4 + ex.label] = 1; examples.push(ex); }
    return { xs, ys, examples };
  }
  function validateExample(ex) { const dx = ex.b.x - ex.a.x, dy = ex.b.y - ex.a.y; if (ex.label === 0) return dy === 0 && dx === -ex.dist; if (ex.label === 1) return dy === 0 && dx === ex.dist; if (ex.label === 2) return dx === 0 && dy === -ex.dist; if (ex.label === 3) return dx === 0 && dy === ex.dist; return false; }
  const api = { LABELS, rng, sample, dataset, validateExample }; if (typeof module !== 'undefined' && module.exports) module.exports = api; if (typeof window !== 'undefined') window.RelationTask = api;
})();
