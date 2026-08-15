---
layout: research
title: Experimental Method
---

# Experimental method

A useful experiment isolates one primary question, defines the source information, states the computational mechanism, measures an observable outcome, and counts the resources required to obtain it.

```text
SOURCE            independent input information
INTERPRETATION    state associated with an address
OPERATION         deterministic or learned rule
OUTPUT            produced object or decision
MEASUREMENT       numeric result
RESOURCE LEDGER   bits, state, parameters, side information, runtime
BOUNDARY          conclusions not licensed by the measurement
```

## Evidence classes

**Exact** evidence applies when a deterministic property can be checked bit-for-bit or address-by-address. A codec either reconstructs every bit or it does not.

**Mechanics** evidence applies when executable state transitions are real but no objective has trained them. Complex motion can be interesting without being evidence of learning.

**Learned** evidence applies when parameters are optimized on a defined training distribution and evaluated on held-out data.

**Benchmark** evidence adds repeated controlled comparisons, including random seeds and explicit resource constraints.

**Procedural baseline** evidence applies to a deterministic generative interpreter. It can establish reproducible generative structure without implying learned intelligence.

## Exact-code standards

Property tests should verify the advertised mathematical behavior rather than only proving that code executes.

Examples include:

- random bitstream → bytes → bitstream identity;
- CRC-32 reference vector `123456789 → CBF43926`;
- exhaustive single-bit Hamming(7,4) correction;
- exact motif dictionary encode/decode round-trips;
- Hopfield energy non-increase under sequential asynchronous updates;
- complete-field hypervector query accuracy;
- CPU reference equality for GPU operators;
- deterministic genome reproduction after regeneration.

A rendered interface can fail while an algorithm is correct, and an interface can appear correct while an algorithm is wrong. Runtime smoke tests and algorithmic property tests therefore answer different questions.

## Learned-model standards

A learned result should report at least:

- training and test distributions;
- held-out metric;
- number of trainable parameters;
- scalar state per address;
- update or recurrent depth;
- optimizer and number of training examples;
- random seeds;
- runtime or approximate compute;
- relevant baselines;
- failure cases and variance.

Results from two implementations should not be combined merely because they share a task name. A browser model and a CPU reference may differ in initialization, optimizer, architecture, batch size, or training schedule.

## Spatial-relation baseline

The four-way relation task predicts LEFT, RIGHT, ABOVE, or BELOW for two aligned markers on a 12×12 field.

Repeated 3×3 convolution expands the receptive radius with recurrent depth. Success therefore has a conventional recurrent-convolution explanation. The useful measurement is not only one aggregate accuracy but a surface such as

```text
A(distance, update_steps)
```

which can reveal whether harder spatial separations require more iterative computation.

## Resource matching

Architecture comparisons depend on what is held constant.

### Equal state

Fix the number of scalar state values per outer address. Internal organization may differ, while parameter count and compute can change.

### Approximately equal parameters

Choose model sizes with similar trainable parameter counts. Internal state and operator cost may differ.

### Approximately equal compute

Match FLOPs, measured inference time, or another operational compute budget. Parameter count and state allocation may differ.

These are different scientific questions. A result under one constraint should not be presented as though it answered all three.

## Strong architecture controls

A serious comparison can include:

- flattened MLP;
- feed-forward CNN;
- recurrent CNN;
- Neural Cellular Automaton;
- pixel-token Transformer;
- graph message-passing network;
- vector-valued local field;
- tensor-valued cell;
- internal-token cell;
- hybrid local/global field.

The control set should be chosen to isolate the mechanism of interest rather than to maximize the number of models.

## Compression protocol

Compression requires total rate accounting:

```text
carrier bits
+ metadata
+ dictionary or codebook
+ instance-specific side information
+ persistent hidden state
+ model cost under a declared amortization rule
```

Then measure exact reconstruction, distortion, perceptual quality, or retained task utility. High dimensionality alone is not compression.

A fair result is a curve, not a single visually appealing example:

```text
stored bits ↔ distortion
stored bits ↔ useful task performance
```

## Memory protocol

Memory requires the source to become unavailable before retrieval:

```text
write → remove source → delay/interference → query
```

Relevant measurements include capacity, retrieval accuracy, corruption tolerance, interference, overwrite, retention duration, and stored-state cost.

Error correction, Hopfield recall, masked reconstruction, and NCA regeneration are different mechanisms. Combining them into one generic “recovery” score can hide what each system is actually doing.

## Causal inspection

Visualizing hidden state is descriptive. Causal evidence requires intervention.

Useful interventions include:

- mute a cell or region;
- freeze its state through time;
- swap two internal states;
- zero fast or slow memory;
- replace hidden state while preserving the visible carrier;
- remove one communication edge or attention path;
- measure the resulting output change.

A stable functional role is stronger when the intervention changes behavior in the predicted way across examples and seeds.

## Progression from mechanism to stronger conclusion

```text
specified question
→ executable mechanism
→ property tests
→ learned task when appropriate
→ matched controls
→ repeated seeds
→ resource-controlled benchmark
→ stronger interpretation only if the result survives
```

Negative and unstable results are valuable when they identify mechanisms that do not justify their cost or protocols that are not yet reliable.
