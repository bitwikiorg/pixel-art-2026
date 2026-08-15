(() => {
  'use strict';
  const root = document.querySelector('#neuralFieldLab');
  if (!root) return;
  const Task = window.RelationTask;
  const status = root.querySelector('#neuralStatus');
  if (!Task) { status.textContent = 'Relation-task module failed to load.'; return; }
  if (typeof tf === 'undefined') { status.textContent = 'TensorFlow.js failed to load.'; return; }

  const N = 12, D = 12, CLASSES = Task.LABELS;
  const q = s => root.querySelector(s);
  const canvas = q('#neuralCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = N; canvas.height = N;
  let model = null, layers = null, currentExample = null, currentTrace = [], currentProbs = null;
  let modelSeed = 7, exampleCounter = 0;

  function setStatus(text, kind = 'ready') { q('#neuralStatus').innerHTML = `<span class="status-dot ${kind}"></span>${text}`; }
  function log(text) { const box = q('#trainingLog'); box.textContent += `${text}\n`; box.scrollTop = box.scrollHeight; }
  function clearLog() { q('#trainingLog').textContent = ''; }

  function init(seed, offset) { return tf.initializers.glorotUniform({ seed: seed + offset }); }
  function makeModel(steps = 6) {
    currentTrace.forEach(t => t.dispose?.()); currentTrace = [];
    if (currentProbs) { currentProbs.dispose(); currentProbs = null; }
    if (model) model.dispose();
    const input = tf.input({ shape: [N, N, 2], name: 'field_input' });
    const writer = tf.layers.conv2d({ filters: D, kernelSize: 1, padding: 'same', activation: 'tanh', kernelInitializer: init(modelSeed, 11), biasInitializer: 'zeros', name: 'writer' });
    const local = tf.layers.conv2d({ filters: D, kernelSize: 3, padding: 'same', activation: 'relu', kernelInitializer: init(modelSeed, 23), biasInitializer: 'zeros', name: 'shared_local' });
    const delta = tf.layers.conv2d({ filters: D, kernelSize: 1, padding: 'same', activation: 'tanh', kernelInitializer: init(modelSeed, 37), biasInitializer: 'zeros', name: 'shared_update' });
    const readout = tf.layers.dense({ units: 4, activation: 'softmax', kernelInitializer: init(modelSeed, 53), biasInitializer: 'zeros', name: 'readout' });
    let state = writer.apply(input);
    for (let t = 0; t < steps; t++) {
      const proposal = delta.apply(local.apply(state));
      state = tf.layers.activation({ activation: 'tanh', name: `state_t${t + 1}` }).apply(tf.layers.add().apply([state, proposal]));
    }
    const pooled = tf.layers.globalMaxPooling2d().apply(state);
    model = tf.model({ inputs: input, outputs: readout.apply(pooled), name: 'local_vector_relation_field' });
    model.compile({ optimizer: tf.train.adam(0.003), loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
    layers = { writer, local, delta, readout, steps };
    q('#paramCount').textContent = model.countParams().toLocaleString();
    q('#stepCountNeural').textContent = steps;
    return model;
  }

  function tensorDataset(count, minDist, maxDist, seed) {
    const data = Task.dataset({ count, grid: N, minDist, maxDist, seed });
    return { x: tf.tensor4d(data.xs, [count, N, N, 2]), y: tf.tensor2d(data.ys, [count, 4]), examples: data.examples };
  }

  async function evaluateDistance(distance, count = 128) {
    const data = tensorDataset(count, distance, distance, 800000 + distance * 1009);
    const out = model.evaluate(data.x, data.y, { batchSize: 32, verbose: 0 });
    const ts = Array.isArray(out) ? out : [out];
    const vals = await Promise.all(ts.map(t => t.data()));
    ts.forEach(t => t.dispose()); data.x.dispose(); data.y.dispose();
    return { loss: vals[0][0], acc: vals[1] ? vals[1][0] : NaN };
  }

  async function distanceProfile() {
    const rows = [];
    for (let d = 1; d <= 8; d++) rows.push({ d, ...(await evaluateDistance(d, 96)) });
    q('#distanceProfile').textContent = rows.map(r => `distance ${String(r.d).padStart(2, ' ')}  ${(r.acc * 100).toFixed(1).padStart(5, ' ')}%`).join('\n');
    const mean = (lo, hi) => rows.filter(r => r.d >= lo && r.d <= hi).reduce((s, r) => s + r.acc, 0) / (hi - lo + 1);
    q('#nearAcc').textContent = `${(mean(2, 4) * 100).toFixed(1)}%`;
    q('#farAcc').textContent = `${(mean(5, 8) * 100).toFixed(1)}%`;
  }

  function permuteState(state, seed) {
    return tf.tidy(() => {
      const random = Task.rng(seed), perm = Array.from({ length: N * N }, (_, i) => i);
      for (let i = perm.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
      return tf.gather(state.reshape([N * N, D]), perm).reshape([1, N, N, D]);
    });
  }

  async function traceExample(ex, shuffle = false) {
    currentTrace.forEach(t => t.dispose?.()); currentTrace = [];
    if (currentProbs) { currentProbs.dispose(); currentProbs = null; }
    const input = tf.tensor4d(ex.x, [1, N, N, 2]);
    let state = layers.writer.apply(input);
    currentTrace.push(state.clone());
    for (let t = 0; t < layers.steps; t++) {
      if (shuffle) { const p = permuteState(state, 9000 + t); state.dispose(); state = p; }
      const next = tf.tidy(() => tf.tanh(state.add(layers.delta.apply(layers.local.apply(state)))));
      state.dispose(); state = next; currentTrace.push(state.clone());
    }
    const pooled = state.max([1, 2]); currentProbs = layers.readout.apply(pooled);
    const probs = await currentProbs.data();
    input.dispose(); pooled.dispose(); state.dispose();
    return Array.from(probs);
  }

  async function renderTrace(index) {
    if (!currentTrace.length) return;
    const step = Math.max(0, Math.min(currentTrace.length - 1, index));
    const data = await currentTrace[step].data(), image = ctx.createImageData(N, N);
    for (let i = 0; i < N * N; i++) {
      const k = i * D;
      image.data[i * 4] = (Math.tanh(data[k]) * .5 + .5) * 255;
      image.data[i * 4 + 1] = (Math.tanh(data[k + 1]) * .5 + .5) * 255;
      image.data[i * 4 + 2] = (Math.tanh(data[k + 2]) * .5 + .5) * 255;
      image.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    if (currentExample) {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = .16; ctx.strokeRect(currentExample.a.x + .08, currentExample.a.y + .08, .84, .84);
      ctx.strokeStyle = '#ffe06a'; ctx.strokeRect(currentExample.b.x + .08, currentExample.b.y + .08, .84, .84);
    }
    q('#traceStep').textContent = step;
  }

  function updateScores(probs) {
    let best = 0;
    probs.forEach((p, i) => { q(`#score${i}`).textContent = `${CLASSES[i]} ${(p * 100).toFixed(1)}%`; if (p > probs[best]) best = i; });
    q('#prediction').textContent = CLASSES[best]; q('#truth').textContent = CLASSES[currentExample.label];
    q('#prediction').style.color = best === currentExample.label ? '#166447' : '#9a572d';
  }

  async function newExample() {
    const far = q('#farExample').checked, exampleIndex = exampleCounter++, random = Task.rng(100000 + modelSeed * 1000 + exampleIndex);
    currentExample = Task.sample({ grid: N, direction: exampleIndex % 4, minDist: far ? 5 : 2, maxDist: far ? 8 : 4, random });
    const probs = await traceExample(currentExample, q('#neuralShuffle').checked);
    updateScores(probs); q('#distanceReadout').textContent = currentExample.dist;
    q('#traceSlider').max = layers.steps; q('#traceSlider').value = layers.steps; await renderTrace(layers.steps);
  }

  async function train() {
    q('#trainBtn').disabled = true; q('#newExampleBtn').disabled = true; clearLog(); setStatus(`training seeded model ${modelSeed}`, 'busy');
    const epochs = +q('#epochs').value, trainData = tensorDataset(768, 2, 4, 400000 + modelSeed), started = performance.now();
    try {
      await model.fit(trainData.x, trainData.y, { epochs, batchSize: 32, shuffle: false, callbacks: {
        onEpochEnd: async (epoch, logs) => {
          const acc = logs.acc ?? logs.accuracy ?? 0;
          q('#trainLoss').textContent = (logs.loss ?? 0).toFixed(3); q('#trainAcc').textContent = `${(acc * 100).toFixed(1)}%`;
          q('#trainProgress').style.width = `${((epoch + 1) / epochs) * 100}%`;
          if (epoch === 0 || (epoch + 1) % 5 === 0 || epoch === epochs - 1) log(`epoch ${String(epoch + 1).padStart(2, '0')}  loss ${(logs.loss ?? 0).toFixed(3)}  acc ${(acc * 100).toFixed(1)}%`);
          await tf.nextFrame();
        }
      }});
      await distanceProfile();
      q('#trainTime').textContent = `${((performance.now() - started) / 1000).toFixed(1)} s`;
      log('held-out distance profile computed with deterministic balanced datasets');
      setStatus(`trained · seed ${modelSeed}`, 'ready'); await newExample();
    } catch (err) {
      console.error(err); log(`error: ${err.message}`); setStatus('training error — see log', 'error');
    } finally {
      trainData.x.dispose(); trainData.y.dispose(); q('#trainBtn').disabled = false; q('#newExampleBtn').disabled = false;
    }
  }

  q('#trainBtn').addEventListener('click', train);
  q('#newExampleBtn').addEventListener('click', newExample);
  q('#resetNeuralBtn').addEventListener('click', async () => {
    modelSeed += 1; exampleCounter = 0; makeModel(+q('#recurrentSteps').value); q('#trainProgress').style.width = '0';
    for (const id of ['nearAcc','farAcc','trainAcc','trainLoss']) q(`#${id}`).textContent = '—';
    q('#distanceProfile').textContent = 'Train the model to measure held-out accuracy separately at each distance.';
    clearLog(); setStatus(`new deterministic initialization · seed ${modelSeed}`, 'ready'); await newExample();
  });
  q('#traceSlider').addEventListener('input', e => renderTrace(+e.target.value));
  q('#neuralShuffle').addEventListener('change', newExample); q('#farExample').addEventListener('change', newExample);
  q('#epochs').addEventListener('input', e => q('[data-value="epochs"]').textContent = e.target.value);
  q('#recurrentSteps').addEventListener('input', e => q('[data-value="recurrentSteps"]').textContent = e.target.value);
  q('#recurrentSteps').addEventListener('change', async e => { makeModel(+e.target.value); clearLog(); setStatus(`architecture rebuilt · seed ${modelSeed}`, 'ready'); await newExample(); });

  tf.ready().then(async () => { q('#backend').textContent = tf.getBackend(); makeModel(+q('#recurrentSteps').value); setStatus(`ready · deterministic seed ${modelSeed}`, 'ready'); await newExample(); });
})();
