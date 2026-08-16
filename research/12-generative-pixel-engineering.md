---
layout: research
title: Generative Pixel Engineering
---

# Generative pixel engineering

A raster does not need to exist as independently stored RGB values before it can be displayed. A finite seed, parameter vector, program, local rule, vector field, shader, or learned generator can produce visible pixels from a smaller persistent description plus shared machinery.

Three objects must remain separate:

```text
stored pixel
address → directly stored finite state

generated pixel
instance description + shared generator → pixel state

projected pixel
richer hidden state → visible RGB or another observable channel
```

The visible raster may therefore be the **result** of computation rather than the computational substrate itself.

## Core model

A deterministic generator can be written as

```text
R = G(z, p, t; θ_shared)
```

where:

- `z` is instance-specific seed or latent state;
- `p` is an explicit parameter vector;
- `t` is optional time;
- `θ_shared` is the shared generator or interpreter;
- `R` is the generated raster or sequence.

A complete resource ledger is

```text
B_system
= B_z
+ B_p
+ B_metadata
+ B_shared/amortized
+ B_persistent_output_if_required
```

A short seed producing a large image is not, by itself, evidence of general compression. The generator restricts which outputs are representable and contributes shared information.

## Academic foundation: indirect genotype-to-phenotype encoding

Kenneth Stanley's **Compositional Pattern Producing Networks** formalize an indirect encoding in which a compact network receives coordinates and other geometric quantities and produces spatial patterns.

- [Stanley 2007 · DOI](https://doi.org/10.1007/s10710-007-9028-8)

The important mechanism for MPF is that visible state can be generated from **coordinate + compact description + shared rule** instead of being independently specified at every address.

This gives a clean comparison:

```text
direct raster
R[i,j] stored independently

versus

indirect field
R[i,j] = G(i,j,z; θ_shared)
```

The indirect representation is useful only when its restricted output family, generator cost, reconstruction quality, and task utility are explicitly measured.

## Academic foundation: generated morphology and control

Karl Sims' **Evolving Virtual Creatures** is an early rigorous example of a genetic description generating both morphology and neural control inside a simulated environment.

- [Sims 1994 · ACM DOI](https://doi.org/10.1145/192161.192167)

The relevant abstraction is broader than virtual creatures:

```text
finite inherited state
→ generated structure
→ generated controller or dynamics
→ observable behavior
```

This directly motivates experiments where one pixel-addressed description controls visible structure while another part controls hidden behavior or computation.

## Local rules can manufacture spatial structure

Classical cellular automata establish that repeated local state-transition rules can create global patterns without storing the final pattern directly.

- [Cellular automata · Scholarpedia](https://www.scholarpedia.org/article/Cellular_automata)

Neural Cellular Automata extend that idea with learned multidimensional state and learned local update rules.

- [Growing Neural Cellular Automata · Distill](https://distill.pub/2020/growing-ca/)

For generative MPF experiments, these are important controls because local recurrent morphogenesis is already established. The question is not whether local rules can generate images. Stronger tests ask what persistent addressability, alternate pixel primitives, multiscale communication, memory, or resource accounting add beyond a standard CA/NCA formulation.

## Shader fields are real computational fields

A shader can map coordinate, time, texture state, and explicit parameters to output pixels. WebGPU and WGSL provide a concrete browser-compute substrate for testing this directly rather than treating shaders as a metaphor.

- [WebGPU specification](https://www.w3.org/TR/webgpu/)
- [WGSL specification](https://www.w3.org/TR/WGSL/)

A minimal shader-field experiment can use

```text
R[i,j,t] = shader(i, j, t, z, p)
```

and compare:

- direct RGB storage;
- compact instance parameters;
- shared shader size;
- exact or approximate reconstruction;
- runtime;
- sensitivity to one-parameter interventions.

The shared shader must be counted or explicitly amortized.

## Vector fields separate causal state from rendered history

A pixel address can store a vector instead of a color:

```text
V[i,j] = [vx, vy]
```

Particles or messages can then sample the field and move:

```text
p_(t+1) = p_t + sample(V, p_t)
R_(t+1) = deposit(R_t, p_(t+1))
```

`V` is causal control state. `R` is an accumulated observable trace. The two objects may have different storage budgets, resolutions, and information content.

This allows direct causal measurements:

- perturb one vector and measure downstream trajectory change;
- remove a region and measure path failure;
- infer the vector field from visible traces;
- compare dense vector storage with multiscale or generated vector fields.

## Layers are independently intervenable subfields

A generated image can be modeled as several aligned fields:

```text
R = C(F1, F2, …, Fk)
```

where `C` is an explicit composition rule such as masking, alpha compositing, addition, maximum, or learned fusion.

A layer is experimentally meaningful when it has independent state and can be intervened on. Useful tests include:

- mute one layer;
- swap layers between instances;
- delay one layer in time;
- corrupt one layer;
- quantize one layer;
- predict one layer from the others.

The resulting output change is a causal measurement of that layer's role.

## Procedural controls provide known latent ground truth

A procedural generator can expose known variables such as:

- seed;
- symmetry;
- morphology family;
- palette;
- light direction;
- layer state;
- scale;
- time;
- vector-field strength;
- noise frequency.

Those variables can become ground truth for learned representation experiments:

```text
known generator controls
→ rendered raster
→ learned encoder
→ predicted controls
```

This bridges deterministic pixel engineering and learned representation without pretending the deterministic generator itself is a learned reasoning system.

## Experimental program

### G1 · Symmetry + cellular morphogenesis

Generate a binary structure under controlled priors:

```text
independent random cells
vs bilateral symmetry
vs symmetry + local cellular updates
```

Measure connected components, symmetry error, edge density, motif statistics, damage sensitivity, and complete description length.

### G2 · Shader field

Use a fixed WGSL shader family:

```text
coordinate + seed + time + finite controls → raster
```

Compare direct RGB storage against generator-description cost while counting or amortizing the shared shader.

### G3 · Vector flow field

Store a 2D vector at each address. Particles or messages follow the field and deposit visible traces. Measure path predictability, reconstruction, intervention sensitivity, and storage cost.

### G4 · Layer intervention field

Compose independently controlled subfields. Mute, swap, corrupt, quantize, or delay them and measure output change and task change separately.

### G5 · Generative parameter causality

Sweep one explicit parameter at a time and measure morphology, entropy, edge statistics, color statistics, and downstream task effects. Stable causal effects make the parameters interpretable rather than decorative controls.

### G6 · Inverse generator

Given only the raster, infer seed class, morphology family, palette, layer state, or continuous controls. This tests recoverability of the hidden generative description.

### G7 · Palette program

Compare direct RGB, indexed fixed palette, instance palette, procedurally generated palette, and learned palette under the same output data and complete side-information accounting.

### G8 · Pixel microprogram

Let an outer address carry a small finite program identifier plus parameters executed by a shared runtime. This tests the stronger idea that a pixel can designate local computation rather than merely store a value.

### G9 · Damage and regeneration

Preserve the generative description, damage only the raster, then regenerate. The deterministic generator provides an exact recovery baseline before learned regeneration is introduced.

## What would count as evidence

A visually interesting raster is not enough. Useful evidence includes:

- exact description length;
- reconstruction error;
- rate–distortion or rate–utility;
- causal effect of parameter interventions;
- stability across seeds;
- recovery after damage;
- inverse recovery of known latent variables;
- comparison with direct storage and simpler generators;
- matched decoder or parameter accounting.

The research object is the relationship between **finite description, shared computational process, generated field, and measured consequence**.

## Creative mechanism inspirations · non-evidence

The following projects motivated interface and mechanism ideas. They are **not academic references, scientific baselines, or evidence for MPF**. Their role is equivalent to a design sketch: they show interesting ways of engineering pixels that can later be converted into controlled experiments.

- [Deep-Fold SpriteGenerator](https://github.com/Deep-Fold/SpriteGenerator) and [interactive generator](https://deep-fold.itch.io/pixel-sprite-generator) — visual inspiration for symmetry, local morphology, connected regions, and procedural palettes.
- [Deep-Fold Pixel Planets](https://github.com/Deep-Fold/PixelPlanets) and [interactive generator](https://deep-fold.itch.io/pixel-planet-generator) — inspiration for shader parameters, lighting controls, and independently visible layers.
- [Deep-Fold StarScapes](https://github.com/Deep-Fold/Starscapes) and [interactive version](https://deep-fold.itch.io/starscapes) — inspiration for vector fields whose trajectories create a separate visible raster.
- [Pixel Space Background Generator](https://deep-fold.itch.io/space-background-generator) — inspiration for tiling, pixel scale, transparency, and compositional layers.
- [Particle Soup](https://deep-fold.itch.io/particle-soup) — inspiration for visible pixels as projections of hidden agent dynamics.

These examples may suggest experiment designs, but the supporting research bibliography is restricted to academic work, standards, specifications, and technical documentation.
