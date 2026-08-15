---
layout: research
title: Generative Pixel Engineering
---

# Generative pixel engineering

A raster does not have to be stored pixel by pixel before it exists. A smaller program, seed, parameter set, field, or dynamical system can construct the visible pixels.

That changes the research question from only **“what does one pixel store?”** to also ask:

- What process creates the pixel state?
- Which variables control structure, color, motion, and layering?
- Which state is persistent and which state is rendered output?
- How much of the visible field is produced by a shared rule rather than instance-specific bits?
- Can the generating state be inferred, edited, compressed, damaged, or learned?

A useful progression is:

<div class="parallel-schema">
  <div class="schema-label">GENERATIVE PATH</div>
  <div><strong>Description</strong>seed, parameters, palette, latent variables</div>
  <div><strong>Field / rules</strong>symmetry, neighborhoods, vectors, shaders, layers</div>
  <div><strong>Dynamics</strong>iteration, flow, time, interaction, compositing</div>
  <div><strong>Pixels</strong>raster, animation, spritesheet, observable trace</div>
</div>

The visible image can therefore be an **output surface** of a richer computational process.

## Symmetry and local rules can manufacture structure

Deep-Fold's [SpriteGenerator](https://github.com/Deep-Fold/SpriteGenerator) is a compact example. Its generator composes several distinct mechanisms:

1. a seeded map generator creates a binary spatial structure;
2. the map is mirrored across one axis, imposing bilateral symmetry;
3. random walks add connected structure;
4. a cellular-automaton pass changes cells according to local neighbor counts;
5. procedural palettes and noise assign colors;
6. flood-filled connected regions become drawable groups.

The important idea is not the particular sprite style. **Structure is manufactured by constraints and local operators before color is rendered.**

Bilateral symmetry is a prior. Neighbor-count rules are local morphology. Flood filling introduces region identity. Noise adds correlated variation. Palette selection maps continuous or procedural signals into a smaller visible vocabulary.

That suggests controlled MPF experiments in which the same source budget is generated under different structural priors:

- no symmetry versus bilateral symmetry;
- independent random pixels versus local cellular updates;
- fixed palette versus procedural palette;
- independent coloring versus neighborhood-conditioned coloring;
- one update step versus repeated morphology.

Measurements can include connected components, symmetry error, edge density, entropy, motif reuse, perturbation sensitivity, and human- or model-rated recognizability. The latter is semantic evidence and must remain separate from exact information accounting.

## Color can be an output of topology

SpriteGenerator's color filling is especially relevant because color is not assigned independently at every coordinate. Local edge conditions, connected regions, spatial noise, and neighboring color differences influence the selected palette value.

That creates a useful distinction:

**stored color** — RGB or an index is directly present at the address;

**generated color** — RGB or an index is produced from coordinate, neighborhood, region, noise, parameters, or time;

**projected color** — visible RGB is only a view of a larger computational state.

These cases may look identical on a screen while having very different computational and storage structures.

## Layered shaders behave like compositional fields

Deep-Fold's [Pixel Planet Generator](https://github.com/Deep-Fold/PixelPlanets) treats a visible object as the composition of procedural layers and shader-controlled variables. Planet families expose seed, time, lighting, color arrays, pixel scale, rotation, and independently visible layers. The corresponding [interactive generator](https://deep-fold.itch.io/pixel-planet-generator) includes multiple planet families plus stars, galaxies, asteroids, and black holes, with PNG, GIF, and spritesheet output.

The research abstraction is broader than planets:

**one image = several active subfields combined by a shared renderer.**

A layer can represent land, water, cloud, atmosphere, glow, shadow, mask, semantic region, uncertainty, memory, or another computational role. Turning one layer off is then a causal intervention rather than a cosmetic operation.

Useful measurements include:

- output change caused by removing one layer;
- interaction effects between pairs of layers;
- bits or parameters assigned to each layer;
- temporal persistence of each layer;
- whether one layer can predict or reconstruct another;
- whether a compact layer description replaces a larger direct raster representation.

Layer composition also gives a concrete route toward the **Semantic Album** idea: multiple aligned fields can jointly describe one object while preserving distinct roles.

## A vector field can generate an image without storing the image

Deep-Fold's [StarScapes](https://github.com/Deep-Fold/Starscapes) is an unusually direct conceptual match. Noise creates a vector at each grid location. Particles sample those vectors, move through the field, and draw along their trajectories. The [interactive version](https://deep-fold.itch.io/starscapes) describes the work as an experiment in p5.js and vector fields for procedurally producing watercolor-like landscapes.

The key distinction is:

**the field stores directions; the raster stores the history of particles responding to those directions.**

A pixel-addressed computational object can therefore hold something other than the color eventually displayed there. It might hold velocity, force, routing preference, attention direction, local phase, gradient, or transition parameters.

This suggests a **Vector Flow Field** experiment:

- each address stores a 2D vector;
- agents begin from controlled source positions;
- each update samples the local vector and moves the agent;
- agents deposit color or state into a separate raster;
- the generated trace is compared against the underlying control field.

Questions become measurable: How many vector bits are needed to reproduce a trace? How much does one local vector intervention change downstream trajectories? Can the field be reconstructed from the trace? Does a multiscale field reproduce the same image with fewer stored values?

## Particle systems separate computational state from observed pixels

[Particle Soup](https://deep-fold.itch.io/particle-soup) consists of many particles interacting dynamically. The visible canvas is not the complete system state; it is a projection of particle positions and interactions at a moment in time.

This is a useful model for MPF because an image can be treated as a **measurement surface** rather than the whole computation.

A computational field might contain or index:

- local particle density;
- velocity distribution;
- interaction potential;
- occupancy;
- agent identity;
- collision history;
- accumulated energy;
- confidence or uncertainty about hidden agents.

The visible pixel color can expose one projection while the underlying state remains richer and explicitly counted.

## Pixel-space backgrounds expose topology and compositing

Deep-Fold's [Pixel Space Background Generator](https://deep-fold.itch.io/space-background-generator) exposes colors, pixel size, and layers. Later additions include transparent layers and seamless tiling.

Those controls correspond to research variables:

- **pixel size** changes spatial resolution and effective scale;
- **layers** introduce compositional state;
- **transparency** introduces alpha and foreground/background dependence;
- **tiling** changes boundary conditions from finite edges toward periodic topology;
- **darkening and palette changes** alter rendering without necessarily changing structural geometry.

A toroidal or periodically tiled field is not just a visual trick. Neighborhood relationships at the boundary are genuinely different from an ordinary bounded Cartesian grid.

## The generator can be treated as a shared decoder

Procedural generation creates an information-accounting trap if only the seed is counted.

A 64-bit seed can produce a million-pixel image because the generator supplies a large amount of shared structure. The output is compactly described **only relative to that generator family**.

The shared program therefore belongs in the resource ledger. Depending on the experiment, its cost can be:

- counted in full for one object;
- amortized across many generated objects;
- treated as a fixed public decoder, analogous to a codec specification;
- compared against another decoder with similar program or parameter cost.

This makes procedural pixel art scientifically useful rather than merely decorative. It provides clear examples of **description length, restricted representable families, shared interpreters, causal parameters, and structured priors**.

## Generative controls can become latent variables

Procedural tools expose interpretable controls such as seed, palette, symmetry, layer visibility, light direction, scale, time, noise frequency, and flow strength.

A learned generative model often has latent variables that are much harder to interpret.

The procedural controls can therefore provide supervised ground truth for representation experiments:

- render many fields from known controls;
- train or test whether an encoder recovers those controls from pixels;
- intervene on one control at a time;
- measure which internal field regions change;
- compare learned latent geometry with the known procedural parameter geometry.

This creates a bridge from deterministic pixel engineering to learned representation without pretending that procedural rules are already neural reasoning.

## Strong experimental extensions

### Shader Field

A small shared shader generates a color field from coordinate, time, seed, and a compact parameter vector. Direct-raster storage is compared with generator-description storage under a complete decoder-cost ledger.

### Layer Intervention Field

Several aligned procedural layers are composed into one output. Individual layers are muted, swapped, delayed, corrupted, or quantized. Output change and task change are measured separately.

### Symmetry + Cellular Morphogenesis

A seeded binary field is generated with controlled symmetry, then transformed by a fixed local cellular rule. Connectivity, robustness, motif structure, and description length are measured across rule families.

### Vector Flow Field

Each address stores a vector rather than a color. Particles or messages follow the field and leave an observable trace. Local vector interventions reveal causal downstream effects.

### Palette Program

A compact palette generator produces correlated colors from a few parameters. The study compares direct RGB palettes, indexed palettes, procedural palettes, and learned palettes with full side-information accounting.

### Inverse Generator

Given only the raster, an algorithm predicts the seed, layer state, palette, or continuous controls that generated it. Successful inversion tests whether the visible field preserves enough evidence about its hidden generating process.

### Generative Damage and Regeneration

Persistent generator state is retained while the raster is damaged. Re-rendering provides an exact procedural regeneration baseline. Learned regeneration methods can then be compared against a known deterministic source of truth.

## Technical formalization

A deterministic generator can be written as

```text
Y = G(z, θ, t)
```

where `z` is instance-specific state such as a seed or parameter vector, `θ` is shared generator structure, `t` is optional time, and `Y` is the rendered field.

For a layered generator,

```text
Y = C(G₁(z₁, θ₁, t), G₂(z₂, θ₂, t), …, Gₖ(zₖ, θₖ, t))
```

where `C` is a composition rule such as masking, alpha compositing, addition, maximum, learned fusion, or another explicitly defined operator.

A vector-flow generator separates control state from rendered state:

```text
V[i,j] = local vector
p_(t+1) = p_t + sample(V, p_t)
Y_(t+1) = deposit(Y_t, p_(t+1))
```

The vector field `V` is causal state; the raster `Y` is accumulated output.

A complete description-length comparison must distinguish instance state from shared decoder state:

```text
B_total = B_instance + B_shared/amortized + B_metadata + B_output_if_stored
```

A short seed does not by itself establish compression. Compression is established only against a declared comparison representation, representable family, decoder assumption, and complete bit ledger.
