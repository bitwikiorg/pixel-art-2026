---
layout: research
title: Pixel Organisms and Artificial Life
---

# Pixel organisms and artificial life

A generated sprite becomes a different research object when the same inherited description also controls sensing, memory, action, metabolism, reproduction, or adaptation.

A compact abstraction is:

```text
genome → phenotype + controller + physiology
                     ↓
                environment
                     ↓
                  lifetime
                     ↓
            survival / reproduction
                     ↓
               inherited change
```

The visible pixels are then only one expression of an organism state. The same genotype can also determine hidden controller weights, sensor ranges, energy costs, memory, or developmental rules.

## Randomness can specify an organism without being the organism

A pseudorandom seed is a compact finite description. A deterministic decoder can expand that description into body geometry, color, controller weights, environmental parameters, or initial conditions.

The useful distinction is:

- **seed** — compact input to a deterministic pseudorandom generator;
- **genome** — inherited finite state interpreted as organism parameters;
- **phenotype** — expressed body and traits;
- **controller** — state-transition mechanism mapping sensors and memory to actions;
- **lifetime state** — position, energy, recurrent memory, injuries, age, or other transient values;
- **environment** — external state that determines what behavior succeeds;
- **fitness or utility** — an explicitly defined measurement used for selection.

Random numbers can therefore initialize a “pixel brain,” but randomness alone is not cognition. The brain exists only when some of those finite values are interpreted as a controller that receives inputs, carries state, produces actions, and affects measured outcomes.

## Sprite generation is a useful pre-organism

[Deep-Fold SpriteGenerator](https://github.com/Deep-Fold/SpriteGenerator) shows how a compact random process can become a coherent phenotype. A seeded random map is spatially constrained by bilateral mirroring and connected random walks, then transformed by local cellular-automaton rules before procedural color filling creates the visible sprite.

That pipeline has organism-like ingredients without yet being an organism:

```text
random source
→ inherited structural parameters
→ symmetry prior
→ local morphogenesis
→ region/color expression
→ visible phenotype
```

The research extension is to reserve part of the same finite genome for an active controller. Mutation can then change appearance, behavior, both, or neither.

This produces four experimentally distinct mutation classes:

1. genotype changes and phenotype changes;
2. genotype changes and behavior changes;
3. genotype changes but visible phenotype remains unchanged;
4. genotype changes but measured behavior remains unchanged.

Neutral mutations become measurable rather than merely visual curiosities.

## A procedural sprite can carry an inherited controller

The first [Pixel Organism]({{ '/experiment/pixel-organism/' | relative_url }}) baseline uses one 256-bit genome.

```text
256 inherited bits
├─ 128 bits → morphology + four-color palette
└─ 128 bits → recurrent controller + physiology
```

The body is generated as a 24×24 indexed-color phenotype. The controller receives food-direction sensors and current energy, carries a two-value recurrent hidden state, and chooses left/straight/right movement in a deterministic food world.

The controller is neural in the narrow computational sense: weighted sums, recurrent state, `tanh` nonlinearities, and output units. It is **not gradient-trained**. Its weights are directly encoded by inherited four-bit values. Repeated selection changes controller weights only by changing genome bits.

That makes the experiment a bridge between procedural generation and neuroevolution without conflating the two.

## The Bibites: genes, procedural bodies, neural brains, selection

[The Bibites](https://thebibites.itch.io/the-bibites) provides a stronger artificial-life reference because genes, procedural appearance, neural-network brains, energy, reproduction, mutation, sensing, pheromones, digestion, lineage, and environmental scenarios all participate in one evolving system.

The most relevant mechanism is not visual resemblance. It is the coupling:

```text
genes ↔ body ↔ sensors ↔ neural controller ↔ energy ↔ reproduction
```

A mutation can affect whether an organism reaches food, survives long enough to reproduce, or participates in a new ecological strategy. Procedural sprites make inherited state visually inspectable while the neural controller provides hidden causal state.

For MPF, this suggests treating an organism as a bundle of aligned fields:

- phenotype field;
- sensory field;
- recurrent controller state;
- energy/metabolism state;
- memory state;
- communication/pheromone field;
- lineage/genome state;
- environmental resource field.

The visible creature is one projection of that larger computational object.

## Evolution simulator with neural network: expose the experimental knobs

[nikitasss128's Evolution simulator with neural network](https://nikitasss128.itch.io/evolution-simulator-with-neroset) emphasizes explicit world controls: mutation chance, day/night timing, map size, photosynthesis reward, meat reward, life-energy cost, reproduction threshold, sea level, and several diagnostic views including energy, age, children, and mutation-defined species.

That interface suggests an important design rule for MPF artificial-life experiments: **environmental assumptions should be controls, not hidden constants**.

A neural organism that succeeds under abundant food and cheap movement may fail when movement cost rises or resources become sparse. The correct object of study is therefore often a response surface:

```text
performance = f(genome, controller, environment)
```

Useful plots include:

- survival versus movement cost;
- reproduction versus resource density;
- controller complexity versus energy upkeep;
- mutation rate versus lineage persistence;
- phenotype diversity versus selection pressure;
- selected-world score versus held-out-world score.

## The Sapling: designed organisms versus evolutionary search

[The Sapling](https://woseseltops.itch.io/thesapling) allows organisms to be deliberately designed or subjected to random mutation inside an ecosystem.

That distinction is experimentally valuable. A useful MPF organism suite should compare at least three sources of organism structure:

- hand-designed genotype;
- random genotype;
- selected/evolved genotype.

The same evaluation world can then separate whether performance comes from the representation, the search procedure, or a human prior embedded in the starting organism.

Lineage trees and organism reuse also suggest explicit caching and identity questions: when two genotypes differ by one bit, which generated structures can be reused and which must be regenerated?

## PETRI: emergence does not require a neural brain

[PETRI](https://sintel.itch.io/petri) is framed as an exploration of emergent organisation in an interacting bacterial colony.

This is an important control against a brain-centric interpretation of artificial life. Complex-looking collective behavior can arise from local interaction rules, environmental feedback, and many simple agents without an individual neural controller.

A rigorous comparison therefore separates:

```text
individual controller complexity
from
collective interaction complexity
```

Possible matched experiments include:

- reactive agent with no memory;
- recurrent two-state controller;
- local cellular rule;
- pheromone-mediated agents;
- shared environmental field;
- explicit neural controller.

The outcome can be measured by resource collection, clustering, transport, robustness, diversity, or another task rather than by visual complexity alone.

## Gaia Maker: the environment can itself be a multidimensional field

[Gaia Maker](https://garkimasera.itch.io/gaia-maker) models planet-wide quantities including temperature, biomass, carbon cycle, insolation, atmospheric composition, animal life, civilizations, and terraforming interventions.

The MPF connection is direct: an organism does not need to inhabit a single RGB map. It can inhabit several aligned environmental fields.

```text
E[i,j] = [temperature,
          biomass,
          light,
          atmosphere,
          terrain,
          resource,
          hazard,
          occupancy]
```

A pixel organism can sense only selected projections of `E[i,j]`, while the simulator retains the larger environmental state. This gives a controlled path from a toy food grid toward heterogeneous ecological fields without pretending that every channel is visually observable.

## Tensor-network interpretability is a different branch

[Alignment Jam](https://antoine311200.itch.io/alignmen-jam) studies gradient-based interpretability of quantum-inspired tensor-network neural models on CIFAR-10. It is relevant to tensor representation, compression, geometry, and model inspection, but it is not an artificial-life simulator.

Its useful connection belongs elsewhere: compare how different internal factorizations distribute sensitivity and attribution across spatial inputs. It should not be used as evidence for organism evolution or emergence.

## Experimental ladder

### 1. One genome, one lifetime

Deterministically decode body and controller. Run one fixed world. Record trajectory, energy, food, survival, and recurrent state.

### 2. Mutation map

Flip every genome bit independently and measure:

```text
bit index
→ body-pixel distance
→ palette distance
→ controller-weight distance
→ behavior distance
→ score change
```

This creates a complete local genotype-to-phenotype-to-behavior sensitivity map.

### 3. Selection with held-out worlds

Select on one environment and evaluate on unseen resource layouts. Measure adaptation versus overfitting.

### 4. Population and reproduction

Allow multiple organisms to consume resources and reproduce. Count births, deaths, lineage depth, genotype diversity, and resource inequality.

### 5. Competing controller classes

Hold genome budget constant while comparing:

- fixed reactive rules;
- recurrent neural controller;
- tiny NCA controller;
- lookup-table controller;
- finite-state machine;
- token/micro-transformer controller.

Any advantage must be measured under equal inherited-state and runtime budgets.

### 6. Developmental organism

Let a genome encode a local growth rule rather than a finished sprite. The phenotype develops through repeated cellular updates. Damage and regeneration can then be separated from ordinary re-rendering.

### 7. Multi-field ecology

Replace the binary food map with aligned temperature, light, biomass, hazard, pheromone, terrain, and occupancy fields. Restrict each organism to finite sensors so inaccessible environmental state remains genuinely hidden.

### 8. Open-endedness tests

Only after simpler controls work should the system test long-run novelty, ecological co-adaptation, speciation, or expanding controller structure. Open-ended evolution requires evidence that novelty does not collapse to a small repeating family.

## Measurements that matter

Artificial-life imagery can look convincing while the underlying mechanism remains weak. Useful quantitative measurements include:

- inherited bits per organism;
- transient state bits per organism;
- controller parameter count and precision;
- energy cost per action;
- sensor bandwidth;
- genome Hamming distance;
- phenotype pixel distance;
- behavioral trajectory distance;
- resource collection;
- survival time;
- reproduction count;
- lineage depth;
- genotype and phenotype diversity;
- performance across held-out environments;
- sensitivity to one-bit interventions;
- causal effect of disabling memory or sensors.

A “pixel brain” becomes scientifically useful when these quantities are explicit.

## Information and causality boundary

A short genome can generate a large organism only because the shared decoder contributes structure. Runtime memory, environmental state, random world seeds, population state, and selection history are additional resources.

A complete ledger can be written as:

```text
B_system
= B_genome
+ B_runtime_state
+ B_environment
+ B_population
+ B_shared_decoder/amortized
+ B_metadata
```

The central question is not whether random pixels can look alive. It is whether a finite inherited representation produces **measurable causal behavior, adaptation, memory, robustness, or ecological interaction for its declared resource cost**.
