---
layout: research
title: Experimental Program
---

# Experimental program

<div class="plain-box"><strong>Plain English:</strong> the lab does not assume that a pixel is one specific neural object. It compares multiple interpretations—scalar, vector, tensor, neural unit, attention module, memory object, subfield and beyond—then asks which combinations actually help representation, computation, memory, compression or reasoning.</div>

The experiments are organized as a **family**, not a single linear architecture. Some run entirely in the browser; some have trainable CPU reference implementations; some belong later because they require larger compute or more careful benchmarks.

## Status vocabulary

```text
LIVE / DYNAMICS       executable in the browser; not trained
LIVE / TRAINED        trainable directly in the browser
REFERENCE / TRAINED   executable training code in the repository
PLANNED               specified research experiment, not yet implemented
```

That distinction matters. A working visualization demonstrates a mechanism; a trained reference demonstrates end-to-end learnability; neither is automatically a research result.

## Experiment 0 — Original multidimensional field dynamics

**Status:** LIVE / DYNAMICS

The original 32×32 multidimensional field remains a useful mechanical laboratory.

It exposes:

- local coupling;
- state persistence;
- regional feedback;
- position permutation;
- damage;
- recovery dynamics;
- multidimensional-state visualization.

This experiment does not attempt to learn semantics. Its value is that every mechanism is visible and controllable.

[Run the original field]({{ '/experiment/#originalFieldLab' | relative_url }}).

## Experiment 1 — Pixel interpretation ladder

**Status:** LIVE / DYNAMICS · pure JavaScript · no external ML runtime

Keep the visible grid fixed at 12×12 while changing the object stored at each address:

| Pixel interpretation | Browser state | Update idea |
|---|---:|---|
| scalar | 1 value | local scalar diffusion |
| vector | 8 values | coupled multidimensional state |
| tensor | 4×4 = 16 values | internal tensor-axis mixing + field messages |
| neural unit | 8 values | shared tiny nonlinear network |
| micro-transformer | 3 tokens × 6D | internal self-attention + neighbor message |
| memory object | 8 fast + 8 slow | gated persistent state |
| subfield | 3×3 inner field | internal diffusion + outer-field communication |

The point is not to declare a winner from hand-designed dynamics. The point is to make the **computational primitive itself experimentally variable**.

[Run the Pixel Universe]({{ '/experiment/#pixelUniverseLab' | relative_url }}).

## Experiment 2 — Learned vector field

**Status:** LIVE / TRAINED in TensorFlow.js · REFERENCE / TRAINED in PyTorch

This is the current trained vector baseline:

```text
pixel = learned vector
communication = shared 3×3 convolution
computation = recurrent local updates
readout = global max pooling + classifier
```

The browser task asks where marker B is relative to marker A. The PyTorch version supports repeatable larger runs.

This experiment answers a narrow question: can useful computation emerge from learned vector-valued pixels with a shared local rule?

It does **not** define MPF.

[Train the browser vector field]({{ '/experiment/#neuralFieldLab' | relative_url }}).

## Experiment 3 — Flat vector versus tensor pixel

**Status:** REFERENCE / TRAINED prototype available · controlled multi-seed benchmark still planned

Give each pixel the same number of scalar values but organize them differently.

The current CPU reference comparison uses:

```text
Model A: 16D flat vector
Model B: 4×4 latent tensor
```

The tensor update explicitly mixes its two internal axes as well as communicating over the outer field. It therefore does not merely rename 16 flat channels as a tensor.

A stronger benchmark should match or report:

- total scalar state;
- trainable parameter count;
- update count;
- inference compute;
- task and data;
- readout strength;
- multiple random seeds.

Questions:

- Does explicit internal factorization help?
- Does the tensor develop interpretable rows, columns or factors?
- Can structured operations beat flattening when storage is equal?
- Does tensor structure support lower-rank or more efficient compression later?

[Open the trainable primitive code](https://github.com/bitwikiorg/pixel-art-2026/blob/main/experiments/pixel_primitives.py).

## Experiment 4 — Neural-unit pixel

**Status:** LIVE / DYNAMICS · trained comparison planned

Every pixel uses the same compact nonlinear update network.

```text
x_ij' = fθ(x_ij, message_ij)
```

Important variants:

- one globally shared network;
- shared network conditioned by learned role vectors;
- mixture-of-experts where pixels route through a small shared expert set.

This asks whether a location can become a **purposeful computational unit**, not merely a container of activations.

## Experiment 5 — Micro-transformer pixel

**Status:** LIVE / DYNAMICS + REFERENCE / TRAINED prototype · controlled comparison still planned

Each pixel contains a small token set:

```text
X_ij ∈ R^(K×D)
```

Self-attention occurs inside the pixel. A message connects it to other outer addresses.

The browser version uses three 6D internal tokens with tiny deterministic shared attention matrices so it remains fast and dependency-free.

The CPU trainable reference uses:

```text
12×12 outer field
2 internal tokens / pixel
8 dimensions / token
16 scalar state values / pixel
shared tiny self-attention
outer 3×3 communication
```

The reference uses a vectorized tiny attention implementation rather than launching a heavyweight Transformer for every pixel, keeping the experiment practical on CPU.

[Open the trainable primitive code](https://github.com/bitwikiorg/pixel-art-2026/blob/main/experiments/pixel_primitives.py).

## Current trainable primitive smoke test

One fixed-seed CPU smoke run used the same 12×12 task, **16 scalar state values per pixel**, six recurrent updates, 15 epochs and 2,048 training examples.

| Pixel interpretation | Parameters | Near-distance | Longer-distance | CPU train time* |
|---|---:|---:|---:|---:|
| flat 16D vector | 4,036 | 100.0% | 35.5% | 7.8 s |
| 4×4 tensor | 4,588 | 91.8% | 28.1% | 12.9 s |
| 2×8D micro-transformer | 3,396 | 88.3% | 48.8% | 22.0 s |

\*Environment-specific wall-clock measurements.

These numbers are **implementation smoke tests, not comparative conclusions**. The scalar state budget is matched, but parameters and compute are not yet matched and only one seed was run. The useful result is that all three interpretations train end-to-end under small CPU limits. The transformer run's stronger longer-distance score is now a specific hypothesis to investigate under repeated, matched experiments rather than a result to generalize from.

## Experiment 6 — Field Transformer: attention between pixels

**Status:** PLANNED

Invert Experiment 5.

```text
micro-transformer pixel:
attention happens inside each address

field Transformer:
each address is a token; attention happens between addresses
```

This is important because both systems may use similar mathematical ingredients while factoring computation differently.

Useful comparisons:

- full attention between all pixels;
- local/windowed attention;
- regional attention;
- micro-transformer pixels with only local outer messages.

Measure memory and compute carefully because global attention scales differently from fixed-neighborhood communication.

## Experiment 7 — Hybrid pixel

**Status:** PLANNED after Experiments 3–6

Combine:

```text
internal attention
+ local field communication
+ occasional region-level communication
```

A plausible cycle is:

```text
inside-pixel update
→ neighbor exchange
→ inside-pixel update
→ regional summary
→ repeat
```

This is closer to a general-purpose architecture than the current MPF-Local model, but the simpler factorizations should be understood first.

## Experiment 8 — Recursive pixel / field inside field

**Status:** LIVE / DYNAMICS for a 3×3 subfield pixel · trained recursive model PLANNED

The explicit recursive object is:

```text
F_outer[i,j] = F_inner^(i,j)
```

Then extend the same idea:

```text
album → field → region → subfield → cell
```

Key experiment: reuse the **same or closely related update rule** at several scales.

This is what can eventually make “recursive” or “fractal” operationally meaningful. Merely pooling a tensor at several resolutions is not enough.

## Experiment 9 — Persistent memory pixel

**Status:** LIVE / DYNAMICS for fast/slow state · trained memory task PLANNED

Separate state into components such as:

```text
x_ij = [content, working_state, memory, confidence, routing]
```

Tasks should explicitly require persistence:

1. write information;
2. remove the original input;
3. perform unrelated updates;
4. query the stored content later.

Then test selective forgetting, overwrite, interference and memory consolidation.

## Experiment 10 — Learned semantic geography

**Status:** PLANNED

The earlier experiments mostly assume where information enters the field. This experiment lets the model learn placement or connectivity.

Compare:

- fixed Cartesian grid;
- learned coordinates;
- fixed random graph;
- learned sparse graph;
- self-organizing/topographic placement;
- dynamic routing.

The central question is whether **where information lives** becomes computationally useful.

## Experiment 11 — Topology persistence

**Status:** controls partly LIVE now; matched trained comparison supported by the vector reference

Compare:

| Version | What stays stable? | What it probes |
|---|---|---|
| persistent grid | address + neighborhood | full spatial organization |
| one fixed permutation | stable address, changed geometry | addressability versus Cartesian layout |
| fresh permutation each step | no stable identity | dependence on persistent location |
| random fixed graph | stable non-grid structure | whether specifically grid-like geometry is useful |

The existing browser experiments expose permutation controls; the PyTorch vector model includes persistent, fixed-remapping and per-step-remapping modes.

## Experiment 12 — Recurrence and computational depth

**Status:** current vector and primitive references support depth changes

For architectures that update repeatedly, measure:

```text
performance versus update count
```

and test:

- fewer updates than training;
- more updates than training;
- longer-distance or longer-chain tasks;
- stability under extended computation;
- adaptive stopping later.

Recurrence is one axis of the laboratory, not the defining axis.

## Experiment 13 — Ground-truth reasoning traces

**Status:** PLANNED

Use tasks where intermediate computation is known.

Good first examples:

- shortest-path wavefront;
- cellular-automata rule execution;
- multi-hop relation composition;
- controlled algorithmic propagation.

This lets us compare field state through time with an explicit algorithmic trace rather than inferring “reasoning” from final accuracy alone.

## Experiment 14 — Quantized pixel universe

**Status:** PLANNED reference implementation

Apply storage constraints to several pixel interpretations:

- fp16;
- int8;
- vector quantization;
- product VQ;
- sparse state;
- low-rank tensor state;
- shared codebooks;
- multiresolution storage.

Measure:

```text
useful task performance / actual stored bits
```

Richer pixels do not automatically compress information. In raw form they usually cost more.

## Experiment 15 — Hyperdimensional and vector-symbolic pixel state

**Status:** PLANNED

Use very high-dimensional distributed representations inside cells or regions and test operations such as binding, bundling and permutation.

Questions:

- Can compositional relations be stored robustly?
- Can a field route or spatially organize bound structures?
- Does very high dimensionality improve robustness or systematic composition enough to justify its cost?

This experiment concerns **dimensionality and representation algebra**.

## Experiment 16 — Hyperbolic semantic state

**Status:** PLANNED after hierarchy tasks exist

Hyperbolic geometry is a separate axis from dimensionality.

The first defensible test is to apply hyperbolic geometry only to hierarchy-related representation components and compare against equal-dimensional Euclidean state on tree-like tasks.

## Experiment 17 — Damage, repair and semantic regeneration

**Status:** damage mechanism LIVE in the original browser field · trained semantic version PLANNED

Damage a region or selected internal objects after useful state has formed.

Measure:

```text
performance after damage
versus
additional computation / recovery steps
```

Extend the test across vector, memory and recursive fields. Recovery of semantic state is a different question from recovery of a visual pattern.

## Experiment 18 — Semantic Album

**Status:** PLANNED later-stage system experiment

Make the persistent field itself a unit in a larger system.

Test whether fields can:

- retrieve related fields;
- exchange compressed messages;
- modify one another;
- preserve independent identity;
- consolidate several fields into a higher-level field;
- support associative recall.

At this stage the hierarchy becomes:

```text
internal pixel object
→ pixel
→ region
→ field
→ album
```

## Browser limits versus reference experiments

The website should run mechanisms that remain responsive and inspectable on ordinary devices. That currently means:

- small grids;
- small tensors;
- tiny attention modules;
- deterministic or hand-designed dynamics when browser training would be unnecessarily expensive;
- one small TensorFlow.js trainable vector-field model.

The Python reference layer now covers trainable vector, tensor and micro-transformer pixels on CPU. Larger recursive, compression and benchmark models belong in the repository reference experiments, where runs can be reproduced and logged without freezing the browser.

## Measurements across the experiment family

Different pixel interpretations spend resources differently. For serious comparisons report:

1. task performance;
2. trainable parameters;
3. scalar state per pixel and per field;
4. inference computation / measured runtime;
5. recurrent/update depth when relevant;
6. actual stored bits for memory/compression experiments;
7. robustness to topology changes or damage;
8. out-of-distribution generalization;
9. causal interventions on cells, regions or internal pixel components;
10. repeated random seeds.

## Practical research sequence

The current executable base is now:

```text
Original dynamics
+ Pixel interpretation ladder
+ Learned vector field
+ Trainable vector/tensor/micro-transformer CPU references
```

The next controlled comparisons are:

```text
1. flat vector vs tensor with matched parameter / compute views
2. neural-unit pixel vs micro-transformer pixel
3. attention inside pixels vs attention between pixels
```

Then add:

```text
persistent memory
→ recursive field-inside-field
→ learned semantic topology
→ quantization
→ hyperdimensional / hyperbolic representation
→ Semantic Albums
```

That sequence preserves the full scope while keeping each experiment small enough to understand.
