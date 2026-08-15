const assert = require('assert');
const t = require('../assets/js/relation-task.js');
for (const seed of [1, 7, 17, 29, 2026]) {
  const a = t.dataset({count: 80, grid: 12, minDist: 2, maxDist: 8, seed});
  const b = t.dataset({count: 80, grid: 12, minDist: 2, maxDist: 8, seed});
  assert.deepEqual(Array.from(a.xs), Array.from(b.xs)); assert.deepEqual(Array.from(a.ys), Array.from(b.ys));
  const counts = [0,0,0,0]; for (const ex of a.examples) { assert.ok(t.validateExample(ex, 12)); assert.ok(ex.dist >= 2 && ex.dist <= 8); counts[ex.label]++; }
  assert.deepEqual(counts, [20,20,20,20]);
}
console.log('relation-task behavioral tests passed');
