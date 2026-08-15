'use strict';
const assert = require('assert'); const m = require('../assets/js/masked-reconstruction.js');
const a = m.generatePattern(16, 12345), b = m.generatePattern(16, 12345); assert.deepEqual(Array.from(a), Array.from(b)); assert.equal(a.length, 256);
const masked = m.maskPattern(a, 16, 0.5, 777); assert.equal(masked.observed.length, 512); assert.equal(masked.hidden.length, 256);
const hiddenCount = Array.from(masked.hidden).reduce((x, y) => x + y, 0); assert(hiddenCount > 80 && hiddenCount < 180);
const baseline = m.majorityBaseline(masked.observed, masked.hidden, 16), acc = m.maskedAccuracy(baseline, a, masked.hidden); assert(acc >= 0 && acc <= 1);
const ds = m.makeDataset(8, 16, 0.5, 123); assert.equal(ds.inputs.length, 8 * 16 * 16 * 2); assert.equal(ds.targets.length, 8 * 16 * 16); assert.equal(ds.hiddenMasks.length, 8 * 16 * 16);
console.log('masked-reconstruction deterministic tests passed');
