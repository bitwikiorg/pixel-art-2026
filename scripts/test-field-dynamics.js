'use strict';

const assert = require('assert');

function element(extra = {}) {
  const listeners = {};
  return Object.assign({
    value: '', checked: false, textContent: '',
    addEventListener(type, fn) { (listeners[type] ||= []).push(fn); },
    dispatch(type) { for (const fn of listeners[type] || []) fn({ target: this }); },
    click() { this.dispatch('click'); }
  }, extra);
}

const nodes = {
  '#coupling': element({ value: '0.72' }),
  '#memory': element({ value: '0.70' }),
  '#hierarchy': element({ checked: true }),
  '#shuffle': element({ checked: false }),
  '#runBtn': element({ textContent: 'Run' }),
  '#stepBtn': element(),
  '#resetBtn': element(),
  '#damageBtn': element(),
  '#exportBtn': element(),
  '#stepCount': element(),
  '#coherence': element(),
  '#energy': element(),
  '#occupancy': element(),
  '#stability': element(),
};

const canvasContext = {
  createImageData(width, height) { return { data: new Uint8ClampedArray(width * height * 4) }; },
  putImageData() {}
};
nodes['#fieldCanvas'] = element({ width: 0, height: 0, getContext() { return canvasContext; } });

const dataValues = {
  coupling: element({ textContent: '0.72' }),
  memory: element({ textContent: '0.70' })
};

global.document = {
  querySelector(selector) {
    const match = selector.match(/^\[data-value="([^"]+)"\]$/);
    if (match) return dataValues[match[1]] || null;
    return nodes[selector] || null;
  },
  querySelectorAll(selector) {
    if (selector === 'input[type=range]') return [nodes['#coupling'], nodes['#memory']];
    return [];
  },
  createElement() { return element(); }
};

global.URL = { createObjectURL() { return 'blob:test'; }, revokeObjectURL() {} };

require('../assets/js/field.js');

function metrics() {
  return [
    nodes['#coherence'].textContent,
    nodes['#energy'].textContent,
    nodes['#occupancy'].textContent,
    nodes['#stability'].textContent,
  ];
}

assert.strictEqual(nodes['#stepCount'].textContent, 0);
const initial = metrics();
assert(initial.every(v => v !== '—' && v !== ''));

nodes['#stepBtn'].click();
nodes['#stepBtn'].click();
assert.strictEqual(nodes['#stepCount'].textContent, 2);
const twoSteps = metrics();
assert.notDeepStrictEqual(twoSteps, initial);

nodes['#resetBtn'].click();
assert.strictEqual(nodes['#stepCount'].textContent, 0);
assert.deepStrictEqual(metrics(), initial, 'Reset must reproduce the exact seeded initial diagnostics');
nodes['#stepBtn'].click();
nodes['#stepBtn'].click();
assert.deepStrictEqual(metrics(), twoSteps, 'Same seeded reset + step sequence must reproduce the same trajectory diagnostics');

nodes['#resetBtn'].click();
const beforeDamage = metrics();
nodes['#damageBtn'].click();
assert.notDeepStrictEqual(metrics(), beforeDamage, 'Zero 8x8 must change the field diagnostics');

nodes['#resetBtn'].click();
nodes['#shuffle'].checked = true;
nodes['#stepBtn'].click();
const shuffledOne = metrics();
nodes['#resetBtn'].click();
nodes['#shuffle'].checked = true;
nodes['#stepBtn'].click();
assert.deepStrictEqual(metrics(), shuffledOne, 'Seeded source remapping must be reproducible after Reset');

nodes['#coupling'].value = '1.10';
nodes['#coupling'].dispatch('input');
assert.strictEqual(dataValues.coupling.textContent, '1.10');

console.log('fixed-field dynamics DOM behavioral tests passed');
