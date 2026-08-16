---
layout: research
title: Pixel Organisms and Artificial Life
---

# Pixel organisms and artificial life

A generated sprite becomes a different research object when inherited state also controls sensing, memory, action, metabolism, or adaptation.

A compact experimental abstraction is:

```text
genome
  ↓
phenotype + controller + physiology
  ↓
environment interaction
  ↓
lifetime trajectory
  ↓
measured utility / reproduction
  ↓
inherited change
```

The visible raster is only one expression of the organism state. The same inherited description can also specify hidden controller weights, sensor ranges, energy costs, recurrent memory, or developmental rules.

## Randomness is a source of parameters, not a brain

A pseudorandom seed is a finite input to a deterministic generator. It can be expanded into a genome, environment, initial state, or mutation sequence.

The following objects must remain separate:

- **seed** — compact input to a pseudorandom generator;
- **genome** — inherited finite state interpreted as organism parameters;
- **phenotype** — generated body or visible traits;
- **controller** — state-transition mechanism mapping sensors and memory to actions;
- **lifetime state** — position, energy, age, recurrent memory, damage, or other transient values;
- **environment** — external state that affects outcomes;
- **utility / fitness** — explicitly defined measurement used for evaluation or selection.

Random numbers can initialize controller parameters. They become a meaningful “pixel brain” only after a declared interpreter turns them into a mechanism that receives inputs, preserves state, produces actions, and causes measurable consequences.

## Academic foundation: evolving morphology and control together

Karl Sims' **Evolving Virtual Creatures** genetically encoded both virtual morphology and neural control, then evaluated generated creatures in simulated environments.

- [Sims 1994 · ACM DOI](https://doi.org/10.1145/192161.192167)

The relevant precedent is the genotype-to-phenotype-to-behavior chain:

```text
inherited description
→ generated structure
→ controller
→ environment interaction
→ selected outcome
```

Pixel Organism adopts a deliberately smaller version so every resource and intervention can be inspected directly.

## Academic foundation: neuroevolution

Stanley and Miikkulainen's **NEAT** established an influential framework for evolving neural-network structure and parameters through mutation, crossover, speciation, and selection.

- [Stanley & Miikkulainen 2002 · DOI](https://doi.org/10.1162/106365602320169811)

The first Pixel Organism does not implement NEAT. Its controller architecture is fixed and small, and evolution is only a deterministic mutation-and-selection baseline. NEAT is relevant because it establishes that inherited neural structure and evolutionary search are mature research topics that stronger MPF organism experiments must compare against rather than rename.

## Academic foundation: indirect developmental encoding

Compositional Pattern Producing Networks provide a compact coordinate-conditioned representation capable of generating spatial patterns.

- [Stanley 2007 · DOI](https://doi.org/10.1007/s10710-007-9028-8)

This motivates a later distinction between:

```text
direct phenotype genome
bits specify body parameters

versus

developmental genome
bits specify a process that grows the body
```

A developmental organism can then be tested for scaling, damage repair, and reuse of local rules rather than simply being re-rendered from fixed geometry.

## Academic control: neural cellular development

Neural Cellular Automata show that a shared learned local rule can grow and regenerate spatial structures.

- [Growing Neural Cellular Automata · Distill](https://distill.pub/2020/growing-ca/)

That makes NCA an important control for any claim that distributed pixel-local development has special regenerative or morphogenetic value.

## Current Pixel Organism baseline

The live baseline uses one **256-bit inherited genome**:

```text
256 inherited bits
├─ 128 bits → visible morphology + palette
└─ 128 bits → recurrent controller + physiology
```

The visible body is a 24×24 indexed-color phenotype. The controller receives finite food-direction and energy inputs, preserves a two-value recurrent hidden state, and produces a left/straight/right action in a deterministic 32×32 food environment.

The controller uses weighted sums and `tanh` recurrence, but it is **not gradient-trained**. Controller parameters are decoded directly from inherited bits.

This baseline isolates four operations that must not be conflated:

1. **Generate organism** — decode genome into body, controller, and physiology.
2. **Run lifetime** — hold genome fixed and simulate sensors → recurrent state → action → environment update.
3. **Mutate genome** — change 1–3 unique inherited bits and decode again.
4. **Select one generation** — evaluate parent and mutants in one selection world, retain the best measured score, then evaluate the winner on held-out worlds.

## Genotype, phenotype, and behavior can diverge

A one-bit mutation can have several outcomes:

```text
genotype changes → phenotype changes → behavior changes
genotype changes → phenotype changes → behavior stable
genotype changes → phenotype stable → behavior changes
genotype changes → phenotype stable → behavior stable
```

That makes neutral, visible-only, and controller-only mutations experimentally distinguishable.

A complete mutation atlas can flip every inherited bit independently and record:

```text
bit index
→ genome distance
→ morphology family / body-pixel distance
→ palette distance
→ controller-weight distance
→ trajectory distance
→ score change
```

This is more informative than simply watching organisms “evolve.”

## The environment is part of the experiment

Behavioral performance is conditional on environmental assumptions:

```text
utility = f(genome, controller, environment)
```

Food density, movement cost, sensor range, resource reward, hazard level, reproduction threshold, and lifetime horizon should therefore be explicit experimental variables rather than hidden constants.

Useful response surfaces include:

- survival versus movement cost;
- food collection versus sensor bandwidth;
- performance versus resource density;
- mutation rate versus lineage persistence;
- controller state size versus energy or runtime budget;
- selection-world score versus held-out-world score.

## Environment as a multidimensional field

The current world is intentionally simple. A stronger ecological substrate can align several finite fields:

```text
E[i,j] = [temperature,
          biomass,
          light,
          terrain,
          resource,
          hazard,
          pheromone,
          occupancy]
```

The simulator may retain all channels while an organism senses only a declared subset. Hidden environmental state then becomes genuinely inaccessible information rather than just an unrendered convenience.

## Collective complexity does not require an individual neural brain

A neural controller should not be credited for behavior that could arise from simple local agent rules plus environmental interaction.

Matched controller classes should include:

- reactive rule with no memory;
- finite-state machine;
- lookup table;
- recurrent neural controller;
- NCA-style local controller;
- token / micro-transformer controller.

All should be compared under declared inherited-state, transient-state, sensor-bandwidth, and runtime budgets.

## Experimental ladder

### O1 · One genome, one lifetime

Deterministically decode one organism, run one world, and record trajectory, controller state, energy, food, survival, and all resource budgets.

### O2 · Complete mutation atlas

Flip every genome bit independently and measure genotype, phenotype, controller, trajectory, and utility effects.

### O3 · Selection with held-out worlds

Select in one environment and evaluate on unseen worlds. Measure adaptation versus environment-specific overfitting.

### O4 · Population and reproduction

Allow multiple organisms to consume resources and reproduce. Record births, deaths, lineage depth, genotype diversity, phenotype diversity, and resource distribution.

### O5 · Matched controller classes

Hold inherited-state budget approximately fixed while comparing reactive rules, finite-state machines, recurrent neural networks, NCA controllers, and token-based controllers.

### O6 · Developmental organism

Let a genome encode a growth rule rather than final body parameters. Compare direct generation, developmental growth, damage, and genuine regeneration.

### O7 · Multi-field ecology

Replace the single food map with aligned environmental channels. Restrict sensors explicitly and test which hidden environmental variables matter.

### O8 · Open-endedness tests

Only after controlled population experiments are stable should the system test persistent novelty, ecological co-adaptation, speciation, or expanding controller structures.

## Measurements that matter

Artificial-life imagery can look persuasive while the mechanism remains weak. Quantitative reporting should include:

- inherited bits per organism;
- transient state size;
- controller parameter count and precision;
- sensor bandwidth;
- runtime or update cost;
- energy cost per action;
- genome Hamming distance;
- phenotype pixel distance;
- controller-weight distance;
- trajectory distance;
- resource collection;
- survival time;
- reproduction count;
- lineage depth;
- genotype and phenotype diversity;
- held-out environment performance;
- sensitivity to one-bit interventions;
- causal effect of disabling sensors or memory.

A “pixel brain” becomes scientifically useful when these quantities are explicit and reproducible.

## Complete resource boundary

A short inherited genome can generate a larger body and controller only because a shared decoder contributes structure. Runtime memory, environment state, population state, and selection history are additional resources.

```text
B_system
= B_genome
+ B_runtime_state
+ B_environment
+ B_population
+ B_shared_decoder/amortized
+ B_metadata
```

The central question is whether a finite inherited representation produces **measurable causal behavior, adaptation, memory, robustness, or ecological interaction for its declared resource cost**.

## Creative system inspirations · non-evidence

The following games and interactive simulations motivated interface, ecology, and visualization ideas. They are **not academic references or evidence for MPF** and do not appear in the canonical research bibliography.

- [The Bibites](https://thebibites.itch.io/the-bibites) — design inspiration for visibly coupling genes, bodies, neural controllers, sensing, energy, reproduction, and lineages.
- [Evolution simulator with neural network](https://nikitasss128.itch.io/evolution-simulator-with-neroset) — inspiration for exposing mutation, energy, world, and environmental parameters as controls.
- [The Sapling](https://woseseltops.itch.io/thesapling) — inspiration for comparing designed, randomized, and selected organisms and for visual lineage interfaces.
- [PETRI](https://sintel.itch.io/petri) — inspiration for collective emergence from many interacting simple agents rather than assuming every complex behavior requires an individual brain.
- [Gaia Maker](https://garkimasera.itch.io/gaia-maker) — inspiration for treating climate, biomass, terrain, resources, and other ecological quantities as aligned environmental fields.
- [Alignment Jam](https://antoine311200.itch.io/alignmen-jam) — separate visualization inspiration for internal tensor/model interpretability; it is not artificial-life evidence.
