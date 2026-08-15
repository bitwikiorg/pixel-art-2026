(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PixelOrganism = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const GENOME_BYTES = 32;
  const MORPHOLOGY_BYTES = 16;
  const CONTROLLER_BYTES = 16;
  const WORLD_SIZE = 32;
  const BODY_SIZE = 24;
  const DEFAULT_STEPS = 160;
  const FOOD_COUNT = 72;

  function xorshift32(seed) {
    let x = (seed >>> 0) || 0x9E3779B9;
    return function next() {
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      return x >>> 0;
    };
  }

  function hashSeed(text) {
    let h = 2166136261 >>> 0;
    const s = String(text);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h || 1;
  }

  function hashBytes(bytes) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < bytes.length; i++) {
      h ^= bytes[i];
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h || 1;
  }

  function genomeFromSeed(seedText) {
    const next = xorshift32(hashSeed(seedText));
    const genome = new Uint8Array(GENOME_BYTES);
    for (let i = 0; i < genome.length; i++) genome[i] = next() & 0xFF;
    return genome;
  }

  function genomeHex(genome) {
    assertGenome(genome);
    return Array.from(genome, b => b.toString(16).padStart(2, "0").toUpperCase()).join("");
  }

  function assertGenome(genome) {
    if (!genome || genome.length !== GENOME_BYTES) throw new RangeError("Pixel Organism uses exactly 32 bytes (256 bits)");
  }

  function nibbles(bytes) {
    const out = [];
    for (const byte of bytes) {
      out.push((byte >>> 4) & 15, byte & 15);
    }
    return out;
  }

  function nibbleWeight(value) {
    return (value - 7.5) / 7.5;
  }

  function decodeController(genome) {
    assertGenome(genome);
    const values = nibbles(genome.slice(MORPHOLOGY_BYTES));
    let p = 0;
    const take = n => {
      const result = values.slice(p, p + n).map(nibbleWeight);
      p += n;
      return result;
    };
    const controller = {
      inputHidden: take(8),
      recurrent: take(4),
      hiddenBias: take(2),
      hiddenOutput: take(6),
      outputBias: take(3)
    };
    const traits = values.slice(p);
    controller.vision = 2 + (traits[0] % 5);
    controller.moveCost = 0.25 + (traits[1] / 15) * 0.5;
    controller.foodGain = 6 + traits[2];
    controller.startEnergy = 30 + traits[3] * 2;
    controller.turnBias = (traits[4] - 7.5) / 30;
    controller.sensorGain = 0.75 + traits[5] / 20;
    controller.bodyCost = traits[6] / 50;
    controller.activityGain = 0.75 + traits[7] / 20;
    controller.reserve = traits[8] / 15;
    return controller;
  }

  function paletteFromGenome(genome) {
    assertGenome(genome);
    const g = genome;
    const lift = (b, lo, span) => lo + (b % span);
    return [
      [10 + (g[13] % 26), 13 + (g[14] % 28), 17 + (g[15] % 30)],
      [lift(g[10], 58, 158), lift(g[11], 58, 158), lift(g[12], 58, 158)],
      [lift(g[5], 82, 170), lift(g[7], 82, 170), lift(g[9], 82, 170)],
      [214 + (g[3] % 42), 214 + (g[4] % 42), 214 + (g[6] % 42)]
    ];
  }

  function countNeighbors(bits, size, x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const xx = x + dx, yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < size && yy < size && bits[yy * size + xx]) count++;
      }
    }
    return count;
  }

  function smoothOccupancy(bits, size, birthLimit, deathLimit) {
    const out = Uint8Array.from(bits);
    for (let y = 1; y < size - 1; y++) {
      for (let x = 1; x < size - 1; x++) {
        const i = y * size + x;
        const n = countNeighbors(bits, size, x, y);
        if (bits[i] && n < deathLimit) out[i] = 0;
        else if (!bits[i] && n > birthLimit) out[i] = 1;
      }
    }
    return out;
  }

  function renderBody(genome, size = BODY_SIZE) {
    assertGenome(genome);
    const g = genome;
    const next = xorshift32(hashBytes(genome.slice(0, MORPHOLOGY_BYTES)));
    let occupied = new Uint8Array(size * size);
    const mid = Math.floor(size / 2);
    const density = 0.29 + (g[0] / 255) * 0.22;
    const symmetry = g[1] / 255;
    const radiusX = size * (0.24 + (g[2] / 255) * 0.12);
    const radiusY = size * (0.27 + (g[3] / 255) * 0.15);
    const cy = size * (0.5 + ((g[4] / 255) - 0.5) * 0.08);

    for (let y = 2; y < size - 2; y++) {
      for (let x = 2; x <= mid; x++) {
        const nx = (x - mid) / radiusX;
        const ny = (y - cy) / radiusY;
        if (nx * nx + ny * ny > 1.25) continue;
        const on = (next() / 4294967296) < density;
        if (!on) continue;
        occupied[y * size + x] = 1;
        const mx = size - 1 - x;
        if ((next() / 4294967296) < symmetry) occupied[y * size + mx] = 1;
        else if ((next() / 4294967296) < density * 0.7) occupied[y * size + mx] = 1;
      }
    }

    let wx = mid, wy = Math.max(3, Math.min(size - 4, Math.round(cy)));
    const walkSteps = 45 + (g[5] % 70);
    for (let i = 0; i < walkSteps; i++) {
      if (wx > 1 && wy > 1 && wx < size - 2 && wy < size - 2) {
        occupied[wy * size + wx] = 1;
        const mx = size - 1 - wx;
        if ((next() / 4294967296) < symmetry) occupied[wy * size + mx] = 1;
      }
      wx += (next() % 3) - 1;
      wy += (next() % 3) - 1;
      wx = Math.max(2, Math.min(mid, wx));
      wy = Math.max(2, Math.min(size - 3, wy));
    }

    const steps = 1 + (g[6] % 3);
    const birthLimit = 4 + (g[7] % 2);
    const deathLimit = 2 + (g[8] % 3);
    for (let i = 0; i < steps; i++) occupied = smoothOccupancy(occupied, size, birthLimit, deathLimit);

    for (let y = Math.round(cy) - 2; y <= Math.round(cy) + 2; y++) {
      if (y >= 0 && y < size) {
        occupied[y * size + mid] = 1;
        if (mid - 1 >= 0) occupied[y * size + mid - 1] = 1;
      }
    }

    const pixels = new Uint8Array(size * size);
    const period = 2 + (g[9] % 5);
    const patternMode = g[10] % 3;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = y * size + x;
        if (!occupied[i]) continue;
        let color = 1;
        if (patternMode === 0 && ((x + g[11]) % period === 0)) color = 2;
        if (patternMode === 1 && ((y + g[12]) % period === 0)) color = 2;
        if (patternMode === 2 && ((x + y + g[11]) % period === 0)) color = 2;
        pixels[i] = color;
      }
    }

    const eyeY = Math.max(3, Math.min(size - 4, Math.round(cy - radiusY * 0.25)));
    const eyeOffset = 2 + (g[12] % 4);
    const eyeXs = [mid - eyeOffset, mid - 1 + eyeOffset];
    for (const x of eyeXs) if (x >= 0 && x < size) pixels[eyeY * size + x] = 3;
    return pixels;
  }

  function makeWorld(seedText, size = WORLD_SIZE, foodCount = FOOD_COUNT) {
    const food = new Uint8Array(size * size);
    const next = xorshift32(hashSeed(seedText));
    let placed = 0;
    while (placed < foodCount) {
      const x = next() % size;
      const y = next() % size;
      const center = Math.floor(size / 2);
      if (Math.abs(x - center) + Math.abs(y - center) < 3) continue;
      const i = y * size + x;
      if (!food[i]) {
        food[i] = 1;
        placed++;
      }
    }
    return { size, food };
  }

  function wrap(v, size) {
    return ((v % size) + size) % size;
  }

  function directionVector(heading) {
    const h = ((heading % 4) + 4) % 4;
    return h === 0 ? [0, -1] : h === 1 ? [1, 0] : h === 2 ? [0, 1] : [-1, 0];
  }

  function sensorRay(food, size, x, y, heading, vision) {
    const [dx, dy] = directionVector(heading);
    for (let d = 1; d <= vision; d++) {
      const xx = wrap(x + dx * d, size);
      const yy = wrap(y + dy * d, size);
      if (food[yy * size + xx]) return (vision - d + 1) / vision;
    }
    return 0;
  }

  function argmax(values) {
    let best = 0;
    for (let i = 1; i < values.length; i++) if (values[i] > values[best]) best = i;
    return best;
  }

  function controllerStep(controller, hidden, inputs) {
    const nextHidden = new Float64Array(2);
    for (let h = 0; h < 2; h++) {
      let z = controller.hiddenBias[h];
      for (let i = 0; i < 4; i++) z += controller.inputHidden[h * 4 + i] * inputs[i] * controller.sensorGain;
      for (let j = 0; j < 2; j++) z += controller.recurrent[h * 2 + j] * hidden[j];
      nextHidden[h] = Math.tanh(z);
    }
    const outputs = new Float64Array(3);
    for (let o = 0; o < 3; o++) {
      let z = controller.outputBias[o] + (o === 0 ? -controller.turnBias : o === 2 ? controller.turnBias : 0);
      for (let h = 0; h < 2; h++) z += controller.hiddenOutput[o * 2 + h] * nextHidden[h] * controller.activityGain;
      outputs[o] = z;
    }
    return { hidden: nextHidden, outputs, action: argmax(outputs) };
  }

  function initialState(controller, size = WORLD_SIZE) {
    const center = Math.floor(size / 2);
    return {
      x: center,
      y: center,
      heading: 0,
      energy: controller.startEnergy,
      eaten: 0,
      steps: 0,
      alive: true,
      hidden: new Float64Array(2),
      lastInputs: new Float64Array(4),
      lastOutputs: new Float64Array(3),
      path: [[center, center]]
    };
  }

  function simulate(genome, worldSeed = "WORLD-01", maxSteps = DEFAULT_STEPS) {
    assertGenome(genome);
    const controller = decodeController(genome);
    const world = makeWorld(worldSeed);
    const food = Uint8Array.from(world.food);
    const state = initialState(controller, world.size);
    const consumed = [];

    for (let t = 0; t < maxSteps && state.alive; t++) {
      const leftHeading = state.heading + 3;
      const rightHeading = state.heading + 1;
      const inputs = new Float64Array([
        sensorRay(food, world.size, state.x, state.y, state.heading, controller.vision),
        sensorRay(food, world.size, state.x, state.y, leftHeading, controller.vision),
        sensorRay(food, world.size, state.x, state.y, rightHeading, controller.vision),
        Math.max(0, Math.min(1, state.energy / Math.max(1, controller.startEnergy * 1.5)))
      ]);
      const decision = controllerStep(controller, state.hidden, inputs);
      state.hidden = decision.hidden;
      state.lastInputs = inputs;
      state.lastOutputs = decision.outputs;
      state.heading = wrap(state.heading + (decision.action - 1), 4);
      const [dx, dy] = directionVector(state.heading);
      state.x = wrap(state.x + dx, world.size);
      state.y = wrap(state.y + dy, world.size);
      state.energy -= controller.moveCost + controller.bodyCost;
      const index = state.y * world.size + state.x;
      if (food[index]) {
        food[index] = 0;
        state.eaten += 1;
        state.energy += controller.foodGain;
        consumed.push([state.x, state.y]);
      }
      state.steps += 1;
      state.path.push([state.x, state.y]);
      if (state.energy <= 0) {
        state.energy = 0;
        state.alive = false;
      }
    }

    const score = state.eaten * 20 + state.energy + state.steps * 0.05;
    return {
      worldSeed,
      maxSteps,
      controller,
      state,
      initialFood: world.food,
      remainingFood: food,
      consumed,
      score
    };
  }

  function heldOutMean(genome, baseWorldSeed = "WORLD-01", maxSteps = DEFAULT_STEPS) {
    const scores = [1, 2, 3].map(i => simulate(genome, `${baseWorldSeed}:heldout:${i}`, maxSteps).score);
    return { scores, mean: scores.reduce((a, b) => a + b, 0) / scores.length };
  }

  function mutateGenome(genome, seedText) {
    assertGenome(genome);
    const out = Uint8Array.from(genome);
    const next = xorshift32(hashSeed(seedText));
    const flips = 1 + (next() % 3);
    const touched = [];
    for (let i = 0; i < flips; i++) {
      const bitIndex = next() % (GENOME_BYTES * 8);
      const byteIndex = Math.floor(bitIndex / 8);
      const bit = bitIndex % 8;
      out[byteIndex] ^= 1 << bit;
      touched.push(bitIndex);
    }
    return { genome: out, flips, touched };
  }

  function genomeBitDistance(a, b) {
    assertGenome(a);
    assertGenome(b);
    let distance = 0;
    for (let i = 0; i < a.length; i++) {
      let x = a[i] ^ b[i];
      while (x) {
        distance += x & 1;
        x >>>= 1;
      }
    }
    return distance;
  }

  function rasterDistance(a, b) {
    if (a.length !== b.length) throw new RangeError("rasters must have equal length");
    let distance = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) distance++;
    return distance;
  }

  function selectGeneration(genome, worldSeed = "WORLD-01", generation = 1, maxSteps = DEFAULT_STEPS, mutantCount = 8) {
    assertGenome(genome);
    const candidates = [{ genome: Uint8Array.from(genome), mutation: null }];
    for (let i = 0; i < mutantCount; i++) {
      const mutation = mutateGenome(genome, `${worldSeed}:generation:${generation}:candidate:${i}`);
      candidates.push({ genome: mutation.genome, mutation });
    }
    for (const candidate of candidates) {
      candidate.train = simulate(candidate.genome, worldSeed, maxSteps);
      candidate.heldOut = heldOutMean(candidate.genome, worldSeed, maxSteps);
    }
    let winner = 0;
    for (let i = 1; i < candidates.length; i++) if (candidates[i].train.score > candidates[winner].train.score) winner = i;
    return { generation, candidates, winner, selected: candidates[winner] };
  }

  function rgbHex(rgb) {
    return `#${rgb.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
  }

  function fmt(value, digits = 2) {
    return Number(value).toFixed(digits);
  }

  function initBrowser() {
    if (typeof document === "undefined") return;
    const root = document.querySelector("[data-pixel-organism]");
    if (!root) return;

    const seedInput = root.querySelector("#organismSeed");
    const worldInput = root.querySelector("#organismWorldSeed");
    const stepsInput = root.querySelector("#organismSteps");
    const stepsOut = root.querySelector("#organismStepsOut");
    const bodyCanvas = root.querySelector("#organismBodyCanvas");
    const arenaCanvas = root.querySelector("#organismArenaCanvas");
    const bodyCtx = bodyCanvas.getContext("2d");
    const arenaCtx = arenaCanvas.getContext("2d");
    bodyCanvas.width = BODY_SIZE; bodyCanvas.height = BODY_SIZE;
    arenaCanvas.width = WORLD_SIZE; arenaCanvas.height = WORLD_SIZE;

    let genome = genomeFromSeed(seedInput.value);
    let generation = 0;
    let lastRun = null;
    let previousGenome = Uint8Array.from(genome);

    function text(id, value) {
      const el = root.querySelector(`#${id}`);
      if (el) el.textContent = value;
    }

    function paintBody() {
      const raster = renderBody(genome);
      const palette = paletteFromGenome(genome);
      const image = bodyCtx.createImageData(BODY_SIZE, BODY_SIZE);
      for (let i = 0; i < raster.length; i++) {
        const rgb = palette[raster[i]];
        image.data[i * 4] = rgb[0];
        image.data[i * 4 + 1] = rgb[1];
        image.data[i * 4 + 2] = rgb[2];
        image.data[i * 4 + 3] = 255;
      }
      bodyCtx.putImageData(image, 0, 0);
      root.querySelectorAll("[data-organism-palette]").forEach(node => {
        const index = Number(node.dataset.organismPalette);
        const swatch = node.querySelector("span");
        const code = node.querySelector("code");
        if (swatch) swatch.style.background = rgbHex(palette[index]);
        if (code) code.textContent = `${index.toString(2).padStart(2, "0")} → ${rgbHex(palette[index])}`;
      });
      return raster;
    }

    function paintArena(run) {
      const image = arenaCtx.createImageData(WORLD_SIZE, WORLD_SIZE);
      for (let i = 0; i < WORLD_SIZE * WORLD_SIZE; i++) {
        const food = run.initialFood[i] ? 1 : 0;
        image.data[i * 4] = food ? 142 : 16;
        image.data[i * 4 + 1] = food ? 211 : 23;
        image.data[i * 4 + 2] = food ? 96 : 27;
        image.data[i * 4 + 3] = 255;
      }
      for (let i = 0; i < run.state.path.length; i++) {
        const [x, y] = run.state.path[i];
        const p = (y * WORLD_SIZE + x) * 4;
        image.data[p] = 72;
        image.data[p + 1] = 157;
        image.data[p + 2] = 219;
      }
      for (const [x, y] of run.consumed) {
        const p = (y * WORLD_SIZE + x) * 4;
        image.data[p] = 244;
        image.data[p + 1] = 193;
        image.data[p + 2] = 81;
      }
      const p = (run.state.y * WORLD_SIZE + run.state.x) * 4;
      image.data[p] = 255; image.data[p + 1] = 255; image.data[p + 2] = 255;
      arenaCtx.putImageData(image, 0, 0);
    }

    function renderGenomeState(note) {
      const controller = decodeController(genome);
      const body = paintBody();
      text("organismGenomeHex", genomeHex(genome));
      text("organismGeneration", generation);
      text("organismVision", `${controller.vision} cells`);
      text("organismMoveCost", fmt(controller.moveCost + controller.bodyCost, 3));
      text("organismFoodGain", fmt(controller.foodGain, 1));
      text("organismStartEnergy", fmt(controller.startEnergy, 1));
      text("organismGenomeDistance", genomeBitDistance(previousGenome, genome));
      text("organismBodyDistance", rasterDistance(renderBody(previousGenome), body));
      const weights = [
        ...controller.inputHidden,
        ...controller.recurrent,
        ...controller.hiddenBias,
        ...controller.hiddenOutput,
        ...controller.outputBias
      ];
      text("organismBrainWeights", weights.map(v => (v >= 0 ? "+" : "") + fmt(v, 2)).join("  "));
      if (note) text("organismStatus", note);
    }

    function runLifetime(note) {
      const steps = Number(stepsInput.value);
      lastRun = simulate(genome, worldInput.value, steps);
      const held = heldOutMean(genome, worldInput.value, steps);
      paintArena(lastRun);
      text("organismScore", fmt(lastRun.score, 2));
      text("organismHeldOut", fmt(held.mean, 2));
      text("organismFood", lastRun.state.eaten);
      text("organismEnergy", fmt(lastRun.state.energy, 2));
      text("organismSurvival", `${lastRun.state.steps}/${steps}`);
      text("organismHidden", `[${fmt(lastRun.state.hidden[0], 3)}, ${fmt(lastRun.state.hidden[1], 3)}]`);
      text("organismInputs", `[${Array.from(lastRun.state.lastInputs).map(v => fmt(v, 2)).join(", ")}]`);
      text("organismOutputs", `[${Array.from(lastRun.state.lastOutputs).map(v => fmt(v, 2)).join(", ")}]`);
      text("organismStatus", note || `Ran one deterministic lifetime in ${worldInput.value}. Blue is trajectory; gold marks consumed food.`);
    }

    root.querySelector("#organismGenerate").addEventListener("click", () => {
      previousGenome = Uint8Array.from(genome);
      genome = genomeFromSeed(seedInput.value);
      generation = 0;
      renderGenomeState("Generated a new 256-bit genome: 128 inherited bits for morphology/palette and 128 for controller/physiology.");
      runLifetime();
    });

    root.querySelector("#organismMutate").addEventListener("click", () => {
      previousGenome = Uint8Array.from(genome);
      const result = mutateGenome(genome, `${seedInput.value}:manual:${generation}:${genomeHex(genome)}`);
      genome = result.genome;
      renderGenomeState(`Flipped ${result.flips} inherited genome bit${result.flips === 1 ? "" : "s"}. Any body or behavior change is a consequence of those inherited changes.`);
      runLifetime();
    });

    root.querySelector("#organismRun").addEventListener("click", () => runLifetime());

    root.querySelector("#organismSelect").addEventListener("click", () => {
      previousGenome = Uint8Array.from(genome);
      generation += 1;
      const result = selectGeneration(genome, worldInput.value, generation, Number(stepsInput.value));
      genome = Uint8Array.from(result.selected.genome);
      renderGenomeState(`Generation ${generation}: evaluated parent + 8 deterministic mutants on the same world and selected candidate ${result.winner} by world score.`);
      runLifetime(`Selected generation ${generation}. Selection used only the named world; the held-out mean is reported separately to expose environment-specific overfitting.`);
    });

    stepsInput.addEventListener("input", () => {
      stepsOut.textContent = stepsInput.value;
    });

    renderGenomeState("The same seed always reconstructs the same body and inherited controller.");
    runLifetime();
  }

  if (typeof window !== "undefined") window.addEventListener("DOMContentLoaded", initBrowser);

  return {
    GENOME_BYTES,
    MORPHOLOGY_BYTES,
    CONTROLLER_BYTES,
    WORLD_SIZE,
    BODY_SIZE,
    DEFAULT_STEPS,
    FOOD_COUNT,
    xorshift32,
    hashSeed,
    genomeFromSeed,
    genomeHex,
    decodeController,
    paletteFromGenome,
    renderBody,
    makeWorld,
    sensorRay,
    controllerStep,
    simulate,
    heldOutMean,
    mutateGenome,
    genomeBitDistance,
    rasterDistance,
    selectGeneration
  };
});
