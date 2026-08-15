'use strict';
const assert = require('assert'); const g = require('../assets/js/pixel-genome.js');
const a = g.genomeFromSeed('ALPHA'), a2 = g.genomeFromSeed('ALPHA'); assert.deepEqual(Array.from(a), Array.from(a2)); assert.equal(a.length, 16);
const palette = g.paletteFromGenome(a); assert.equal(palette.length, 4); palette.forEach(rgb => { assert.equal(rgb.length, 3); rgb.forEach(v => assert(v >= 0 && v <= 255)); });
const r = g.renderGenome(a, 24); assert.equal(r.length, 576); r.forEach(v => assert(v >= 0 && v < 4));
const m = g.mutateGenome(a, 'mutation'); assert.notDeepEqual(Array.from(m), Array.from(a)); assert(g.genomeBitDistance(a, m) >= 1 && g.genomeBitDistance(a, m) <= 3);
for (let i = 0; i < 2000; i++) { const mutated = g.mutateGenome(a, `mutation-${i}`); const distance = g.genomeBitDistance(a, mutated); assert(distance >= 1 && distance <= 3, `mutation ${i} changed ${distance} bits`); }
const child = g.crossGenomes(a, g.genomeFromSeed('BETA'), 'cross'); assert.equal(child.length, 16); assert.deepEqual(Array.from(g.interpolateGenomes(a, child, 0)), Array.from(a)); assert.deepEqual(Array.from(g.interpolateGenomes(a, child, 1)), Array.from(child));
const damaged = g.damage(r, 0.2, 'damage'); assert(damaged.flips > 0); damaged.bits.forEach(v => assert(v >= 0 && v < 4)); assert(g.hammingBits(r, damaged.bits) === damaged.flips); assert.deepEqual(Array.from(g.renderGenome(a, 24)), Array.from(r));
console.log('pixel-genome indexed-color behavioral tests passed');
