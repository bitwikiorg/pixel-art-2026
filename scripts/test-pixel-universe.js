const fs = require('fs');

class ElementStub {
  constructor(id) {
    this.id = id;
    this.textContent = '';
    this.innerHTML = '';
    this.dataset = {};
    this.handlers = {};
    this.classList = { toggle() {} };
  }

  addEventListener(name, fn) {
    (this.handlers[name] ||= []).push(fn);
  }

  click() {
    (this.handlers.click || []).forEach((fn) => fn({ clientX: 120, clientY: 120 }));
  }
}

const ids = [
  'pixelUniverseCanvas', 'pixelModeTitle', 'pixelModeDesc', 'pixelModeFormula',
  'pixelModeDims', 'pixelModeScalars', 'pixelUniverseStep', 'pixelInspector',
  'pixelUniverseRun', 'pixelUniverseStepBtn', 'pixelUniverseReset',
  'pixelUniverseInject'
];

const elements = Object.fromEntries(ids.map((id) => [id, new ElementStub(id)]));
elements.pixelUniverseCanvas.getContext = () => ({
  clearRect() {}, fillRect() {}, strokeRect() {},
  set fillStyle(_) {}, set strokeStyle(_) {}, set lineWidth(_) {}
});
elements.pixelUniverseCanvas.getBoundingClientRect = () => ({
  width: 600, height: 600, left: 0, top: 0
});

const modeNames = ['scalar', 'vector', 'tensor', 'neural', 'transformer', 'memory', 'subfield'];
const modeButtons = modeNames.map((mode) => {
  const el = new ElementStub(mode);
  el.dataset.pixelMode = mode;
  return el;
});

const documentHandlers = {};
global.document = {
  addEventListener(name, fn) {
    (documentHandlers[name] ||= []).push(fn);
  },
  getElementById(id) {
    return elements[id] || null;
  },
  querySelectorAll(selector) {
    return selector === '[data-pixel-mode]' ? modeButtons : [];
  }
};

global.window = { addEventListener() {} };
global.setInterval = (fn) => { fn(); return 1; };
global.clearInterval = () => {};

const source = fs.readFileSync('assets/js/pixel-universe.js', 'utf8');
eval(source);
(documentHandlers.DOMContentLoaded || []).forEach((fn) => fn());

for (const button of modeButtons) {
  button.click();
  elements.pixelUniverseStepBtn.click();
  elements.pixelUniverseInject.click();
  if (!elements.pixelModeTitle.textContent) throw new Error('Pixel mode title was not rendered');
  if (!elements.pixelInspector.innerHTML) throw new Error('Pixel inspector was not rendered');
}

elements.pixelUniverseCanvas.click();

if (elements.pixelModeTitle.textContent !== 'Subfield pixel') {
  throw new Error(`Unexpected final mode: ${elements.pixelModeTitle.textContent}`);
}
if (elements.pixelUniverseStep.textContent !== '1') {
  throw new Error(`Unexpected step count: ${elements.pixelUniverseStep.textContent}`);
}

console.log('Pixel Universe runtime smoke test passed.');
