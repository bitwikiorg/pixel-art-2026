'use strict';
const assert = require('assert'); const g = require('../assets/js/webgpu-field.js');
const src = new Uint32Array([0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0]);
const inv = g.cpuFieldOp(src, 5, 5, 'not'); assert.equal(inv[0], 1); assert.equal(inv[7], 0);
const dil = g.cpuFieldOp(src, 5, 5, 'dilate'); assert.equal(dil[6], 1); assert.equal(dil[24], 0);
const edge = g.cpuFieldOp(src, 5, 5, 'edge'); assert.equal(edge.length, src.length); assert.equal(g.hammingU32(src, src), 0);
console.log('webgpu CPU-reference tests passed');
