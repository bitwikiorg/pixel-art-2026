"use strict";

const assert = require("assert");
const O = require("../assets/js/pixel-organism.js");

const a = O.genomeFromSeed("PIXEL-ORGANISM-01");
const b = O.genomeFromSeed("PIXEL-ORGANISM-01");
assert.strictEqual(a.length, 32);
assert.deepStrictEqual(Array.from(a), Array.from(b));
assert.strictEqual(O.genomeHex(a).length, 64);

const controller = O.decodeController(a);
assert.strictEqual(controller.inputHidden.length, 8);
assert.strictEqual(controller.recurrent.length, 4);
assert.strictEqual(controller.hiddenBias.length, 2);
assert.strictEqual(controller.hiddenOutput.length, 6);
assert.strictEqual(controller.outputBias.length, 3);
assert.ok(controller.vision >= 2 && controller.vision <= 6);
assert.ok(controller.moveCost >= 0.25 && controller.moveCost <= 0.75);

const body = O.renderBody(a);
assert.strictEqual(body.length, 24 * 24);
assert.ok(Array.from(body).every(v => v >= 0 && v <= 3));
const palette = O.paletteFromGenome(a);
assert.strictEqual(palette.length, 4);
assert.ok(palette.every(rgb => rgb.length === 3 && rgb.every(v => v >= 0 && v <= 255)));

const world = O.makeWorld("WORLD-TEST");
assert.strictEqual(world.food.length, 32 * 32);
assert.strictEqual(Array.from(world.food).reduce((s, v) => s + v, 0), 72);

const run1 = O.simulate(a, "WORLD-TEST", 120);
const run2 = O.simulate(a, "WORLD-TEST", 120);
assert.strictEqual(run1.score, run2.score);
assert.strictEqual(run1.state.eaten, run2.state.eaten);
assert.strictEqual(run1.state.steps, run2.state.steps);
assert.deepStrictEqual(run1.state.path, run2.state.path);
assert.ok(Number.isFinite(run1.score));
assert.ok(run1.state.hidden.every(Number.isFinite));
assert.ok(run1.state.steps <= 120);

const mutation = O.mutateGenome(a, "MUTATION-TEST");
assert.ok(mutation.flips >= 1 && mutation.flips <= 3);
const bitDistance = O.genomeBitDistance(a, mutation.genome);
assert.ok(bitDistance >= 1 && bitDistance <= 3);
const mutatedBody = O.renderBody(mutation.genome);
assert.ok(O.rasterDistance(body, mutatedBody) >= 0);

const held1 = O.heldOutMean(a, "WORLD-TEST", 100);
const held2 = O.heldOutMean(a, "WORLD-TEST", 100);
assert.strictEqual(held1.mean, held2.mean);
assert.strictEqual(held1.scores.length, 3);

const generation = O.selectGeneration(a, "WORLD-TEST", 1, 100);
assert.strictEqual(generation.candidates.length, 9);
assert.ok(generation.winner >= 0 && generation.winner < 9);
assert.ok(generation.selected.train.score >= generation.candidates[0].train.score);
assert.ok(Number.isFinite(generation.selected.heldOut.mean));

console.log("pixel organism tests passed");
