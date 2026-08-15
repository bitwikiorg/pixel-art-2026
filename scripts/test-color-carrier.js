"use strict";

const assert = require("assert");
const C = require("../assets/js/color-carrier.js");

function near(actual, expected, tol, label) {
  assert.ok(Math.abs(actual - expected) <= tol, `${label}: ${actual} vs ${expected}`);
}

const black = C.summarizeColor("#000000");
assert.deepStrictEqual(black.rgb, { r: 0, g: 0, b: 0 });
assert.strictEqual(black.int, 0);
assert.strictEqual(black.bits, "000000000000000000000000");
near(black.luminance, 0, 1e-12, "black luminance");
near(black.lab.L, 0, 1e-9, "black Lab L");

const white = C.summarizeColor("FFFFFF");
assert.strictEqual(white.hex, "#FFFFFF");
assert.strictEqual(white.int, 0xFFFFFF);
near(white.luminance, 1, 1e-7, "white luminance");
near(white.lab.L, 100, 0.01, "white Lab L");
near(white.lab.a, 0, 0.02, "white Lab a");
near(white.lab.b, 0, 0.02, "white Lab b");

const red = C.summarizeColor("#FF0000");
assert.strictEqual(red.bits, "111111110000000000000000");
near(red.hsl.h, 0, 1e-12, "red HSL hue");
near(red.hsl.s, 1, 1e-12, "red HSL saturation");
near(red.hsl.l, 0.5, 1e-12, "red HSL lightness");
near(red.hsv.h, 0, 1e-12, "red HSV hue");
near(red.hsv.s, 1, 1e-12, "red HSV saturation");
near(red.hsv.v, 1, 1e-12, "red HSV value");

const sample = C.summarizeColor("#123456");
assert.strictEqual(sample.int, 0x123456);
assert.strictEqual(C.rgbToHex(sample.rgb), "#123456");
assert.strictEqual(C.deltaE76(sample.lab, sample.lab), 0);
assert.strictEqual(C.oklabDistance(sample.oklab, sample.oklab), 0);
assert.ok(sample.assigned.normalized >= 0 && sample.assigned.normalized <= 1);
assert.strictEqual(sample.assigned.class16, sample.int % 16);
assert.strictEqual(sample.assigned.token8192, sample.int % 8192);

near(C.contrastRatio(black.rgb, white.rgb), 21, 1e-6, "black/white contrast");

const one = C.paletteAccounting(1);
assert.strictEqual(one.indexBits, 2);
assert.strictEqual(one.paletteBits, 96);
assert.strictEqual(one.indexedBits, 98);
assert.strictEqual(one.directBits, 24);
assert.ok(one.savesBits < 0);

const sixteen = C.paletteAccounting(16);
assert.strictEqual(sixteen.indexedBits, 128);
assert.strictEqual(sixteen.directBits, 384);
assert.strictEqual(sixteen.savesBits, 256);
near(sixteen.indexedBitsPerPixel, 8, 1e-12, "indexed amortized bits/pixel");

console.log("color carrier tests passed");
