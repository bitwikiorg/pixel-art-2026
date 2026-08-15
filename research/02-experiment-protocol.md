---
layout: research
title: Experimental Program
---

# Experimental program

<div class="plain-box"><strong>Plain English:</strong> the lab does not assume that a pixel is one specific neural object. It compares multiple interpretations—scalar, vector, tensor, neural unit, attention module, memory object, subfield and beyond—then asks which combinations actually help representation, computation, memory, compression or reasoning.</div>

The experiments are organized as a **family**, not a single linear architecture. Some run entirely in the browser; some need trained reference implementations; some belong later because they require larger compute or more careful benchmarks.

## Experiment 0 — Original multidimensional field dynamics

**Status:** live in browser · hand-designed · no training required

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

[Run the original field]({{ '/experiment/' | relative_url }}).

## Experiment 1 — Pixel interpretation ladder

**Status:** live in browser · pure JavaScript · no external ML runtime

Keep the visible grid fixed at 12×12 while changing the object stored at each address:

| Pixel interpretation | Browser state | Update idea |
|---|---:|---|
| scalar | 1 value | local scalar diffusion |
| vector | 8 values | coupled multidimensional state |
| tensor | 4×4 = 16 values | internal tensor-neighborhood mixing + field messages |
| neural unit | 8 values | shared tiny nonlinear network |
| micro-transformer | 3 tokens × 6D | internal self-attention + neighbor message |
| memory object | 8 fast + 8 slow | gated persistent state |
| subfield | 3×3 inner field | internal diffusion + outer-field communication |

The point is not to declare a winner from these hand-designed dynamics. The point is to make the **computational primitive itself experimentally variable**.

[Run the Pixel Universe]({{ '/experiment/#pixelUniverseLab' | relative_url }}).

## Experiment 2 — Learned vector field

**Status:** live TensorFlow.js model + PyTorch reference implementation

This is the current trained baseline:

```text
pixel = 12D learned vector
communication = shared 3×3 convolution
computation = recurrent local updates
readout = global max pooling + classifier
```

The browser task asks where marker B is relative to marker A. The PyTorch version supports repeatable larger runs.

This experiment answers a narrow question: can useful computation emerge from learned vector-valued pixels with a shared local rule?

It does **not** define MPF.

## Experiment 3 — Flat vector versus tensor pixel

**Status:** next trained comparison

Give each pixel the same number of scalar values but organize them differently.

For example:

```text
Model A: x_ij ∈ R^64
Model B: x_ij ∈ R^(8×8)
```

Match:

- total scalar state;
- trainable parameter count as closely as practical;
- update count;
- task;
- readout strength.

Questions:

- Does explicit internal factorization help?
- Does the tensor develop interpretable rows/columns/subspaces?
- Can structured operations beat flattening when storage is equal?

If the tensor is immediately flattened and processed identically to the vector, the experiment is meaningless. The tensor model needs operations that respect its internal axes.

## Experiment 4 — Neural-unit pixel

**Status:** browser dynamics live · trained version next

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

**Status:** browser attention dynamics live · trained version next

Each pixel contains a small token set:

```text
X_ij ∈ R^(K×D)
```

Self-attention occurs inside the pixel. A compressed message connects it to neighbors.

The first trained version should remain intentionally small, for example:

```text
12×12 outer field
3–4 internal tokens / pixel
16–32 dimensions / token
1 shared attention block
local outer communication
```

The browser implementation uses tiny fixed shared Q/K/V/O matrices so the mechanism can run without training or a GPU. A research result requires learning those weights and comparing against matched controls.

## Experiment 6 — Field Transformer: attention between pixels

**Status:** planned comparison

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

**Status:** planned after Experiments 3–6

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

This is closer to a general-purpose architecture than the current MPF-Local model, but it should only be introduced after the simpler factorizations are understood.

## Experiment 8 — Recursive pixel / field inside field

**Status:** browser subfield dynamics live · trained recursive model planned

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

**Status:** fast/slow browser dynamics live · trained task planned

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

**Status:** planned

The earlier experiments mostly assume where information enters the field. This experiment lets the model learn the placement or connectivity.

Compare:

- fixed Cartesian grid;
- learned coordinates;
- fixed random graph;
- learned sparse graph;
- self-organizing/topographic placement;
- dynamic routing.

The central question is whether **where information lives** becomes computationally useful.

## Experiment 11 — Topology persistence

**Status:** partially available now

Compare:

| Version | What stays stable? | What it probes |
|---|---|---|
| persistent grid | address + neighborhood | full spatial organization |
| one fixed permutation | stable address, changed geometry | addressability versus Cartesian layout |
| fresh permutation each step | no stable identity | dependence on persistent location |
| random fixed graph | stable non-grid structure | whether “pixel” geometry is specifically useful |

The existing browser experiments already expose permutation controls; the stronger study trains matched models under each topology.

## Experiment 12 — Recurrence and computational depth

**Status:** current vector model supports depth changes

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

**Status:** planned

Use tasks where intermediate computation is known.

Good first examples:

- shortest-path wavefront;
- cellular-automata rule execution;
- multi-hop relation composition;
- controlled algorithmic propagation.

This lets us compare field state through time with an explicit algorithmic trace rather than inferring “reasoning” from final accuracy alone.

## Experiment 14 — Quantized pixel universe

**Status:** planned reference implementation

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

**Status:** planned

Use very high-dimensional distributed representations inside cells or regions and test operations such as binding, bundling and permutation.

Questions:

- Can compositional relations be stored robustly?
- Can a field route or spatially organize bound structures?
- Does very high dimensionality improve robustness or systematic composition enough to justify its cost?

This experiment concerns **dimensionality and representation algebra**.

## Experiment 16 — Hyperbolic semantic state

**Status:** planned after hierarchy tasks exist

Hyperbolic geometry is a separate axis from dimensionality.

The first defensible test is to apply hyperbolic geometry only to hierarchy-related representation components and compare against equal-dimensional Euclidean state on tree-like tasks.

## Experiment 17 — Damage, repair and semantic regeneration

**Status:** original browser field already supports damage

Damage a region or selected internal objects after useful state has formed.

Measure:

```text
performance after damage
versus
additional computation / recovery steps
```

Extend the test across vector, memory and recursive fields. Recovery of semantic state is a different question from recovery of a visual pattern.

## Experiment 18 — Semantic Album

**Status:** later-stage system experiment

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
- deterministic or hand-designed dynamics when training would be too expensive;
- one small TensorFlow.js trainable vector-field model.

Training larger tensor, transformer, recursive and compression models belongs in the repository's Python experiments, where runs can be reproduced and logged without freezing the browser.

The site should clearly label which experiments are:

```text
LIVE / TRAINED
LIVE / DYNAMICS ONLY
REFERENCE CODE
PLANNED RESEARCH
```

so an executable visualization is never mistaken for an empirical result.

## Measurements across the experiment family

Different pixel interpretations spend resources differently. For serious comparisons report:

1. task performance;
2. trainable parameters;
3. scalar state per pixel and per field;
4. approximate inference computation;
5. recurrent/update depth when relevant;
6. actual stored bits for memory/compression experiments;
7. robustness to topology changes or damage;
8. out-of-distribution generalization;
9. causal interventions on cells, regions or internal pixel components.

## A practical research sequence

The current executable base is:

```text
Original dynamics
+ Pixel interpretation ladder
+ Learned vector field
```

The next three trained comparisons should be:

```text
1. flat vector vs tensor pixel
2. neural-unit vs micro-transformer pixel
3. attention inside pixels vs attention between pixels
```

Then add:

```text
persistent memory
→ recursive field-inside-field
→ learned semantic topology
→ quantization
→ hyperdimensional / hyperbolic representation
→ semantic albums
```

That sequence preserves the full scope while keeping each experiment small enough to understand.
