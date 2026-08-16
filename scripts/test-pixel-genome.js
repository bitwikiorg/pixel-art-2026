'use strict';
const assert = require('assert'); const g = require('../assets/js/pixel-genome.js');
const a = g.genomeFromSeed('ALPHA'), a2 = g.genomeFromSeed('ALPHA'); assert.deepEqual(Array.from(a), Array.from(a2)); assert.equal(a.length, 16);
const palette = g.paletteFromGenome(a); assert.equal(palette.length, 4); palette.forEach(rgb => { assert.equal(rgb.length, 3); rgb.forEach(v => assert(v >= 0 && v <= 255)); });
const r = g.renderGenome(a, 24); assert.equal(r.length, 576); r.forEach(v => assert(v >= 0 && v < 4));
assert(g.FAMILY_NAMES.includes(g.genomeTraits(a).family));

const familyRasters = [];
for (let family = 0; family < g.FAMILY_NAMES.length; family++) {
  const genome = new Uint8Array(16);
  genome[0] = family;
  genome[1] = 130; genome[2] = 145; genome[3] = 4; genome[4] = 91; genome[5] = 171;
  genome[6] = 3; genome[7] = 4; genome[8] = 3; genome[9] = family & 3;
  genome[10] = 60 + family * 13; genome[11] = 110; genome[12] = 180; genome[13] = 7; genome[14] = 17; genome[15] = 27;
  assert.equal(g.genomeTraits(genome).family, g.FAMILY_NAMES[family]);
  const raster = g.renderGenome(genome, 24);
  raster.forEach(v => assert(v >= 0 && v < 4));
  familyRasters.push(raster);
}
for (let i = 0; i < familyRasters.length; i++) for (let j = i + 1; j < familyRasters.length; j++) {
  assert(g.hammingBits(familyRasters[i], familyRasters[j]) > 20, `${g.FAMILY_NAMES[i]} and ${g.FAMILY_NAMES[j]} should be visibly distinct grammars`);
}

const seededFamilies = new Set();
for (let i = 0; i < 200; i++) seededFamilies.add(g.genomeTraits(g.genomeFromSeed(`family-seed-${i}`)).family);
assert.equal(seededFamilies.size, g.FAMILY_NAMES.length, 'seeded generator should reach every morphology family');

const m = g.mutateGenome(a, 'mutation'); assert.notDeepEqual(Array.from(m), Array.from(a)); assert(g.genomeBitDistance(a, m) >= 1 && g.genomeBitDistance(a, m) <= 3);
for (let i = 0; i < 2000; i++) { const mutated = g.mutateGenome(a, `mutation-${i}`); const distance = g.genomeBitDistance(a, mutated); assert(distance >= 1 && distance <= 3, `mutation ${i} changed ${distance} bits`); }
const child = g.crossGenomes(a, g.genomeFromSeed('BETA'), 'cross'); assert.equal(child.length, 16); assert.deepEqual(Array.from(g.interpolateGenomes(a, child, 0)), Array.from(a)); assert.deepEqual(Array.from(g.interpolateGenomes(a, child, 1)), Array.from(child));
const damaged = g.damage(r, 0.2, 'damage'); assert(damaged.flips > 0); damaged.bits.forEach(v => assert(v >= 0 && v < 4)); assert(g.hammingBits(r, damaged.bits) === damaged.flips); assert.deepEqual(Array.from(g.renderGenome(a, 24)), Array.from(r));
console.log('pixel-genome indexed-color and morphology-diversity behavioral tests passed');
