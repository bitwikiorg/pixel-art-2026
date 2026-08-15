---
layout: research
title: Geometry and Vector-Symbolic State
---

# Geometry, hierarchy, and vector-symbolic state

A computational field can contain two different notions of distance. The outer grid defines physical or graph proximity between addresses. The internal representation can define a separate semantic distance between states.

```text
physical distance: distance between addresses
semantic distance: distance between representations
```

These distances can agree, disagree, or interact through learned routing.

## Physical geometry

A regular Cartesian field gives every address a fixed coordinate `(i,j)` and a predictable neighborhood. Local communication is inexpensive and translation-compatible, but long-range interaction may require many update steps.

Alternative outer structures include:

- toroidal grids;
- fixed random graphs;
- sparse small-world graphs;
- learned nearest-neighbor graphs;
- hierarchical parent/child edges;
- content-dependent routing;
- global or windowed attention.

Changing the connectivity while holding state and update rule fixed tests whether Cartesian spatial structure itself matters.

## Semantic geometry

A vector state can define similarity independently of physical location. Two distant addresses may contain nearly identical semantic vectors, while neighboring addresses may represent unrelated content.

A hybrid system can therefore use

```text
cheap local physical neighbors
+ occasional semantic long-range neighbors
```

The measurable question is whether semantic routing improves task performance enough to justify the search, indexing, or attention cost required to create those edges.

## Hyperbolic geometry

Hyperbolic space has negative curvature. Its available volume grows rapidly with radius, making it a natural candidate for representing branching structures such as trees and taxonomies.

[Poincaré Embeddings](https://arxiv.org/abs/1705.08039) established an important precedent for hierarchical symbolic data.

Several distinctions matter:

- hyperbolic geometry is not an extra physical dimension;
- high dimensionality is not the same as hyperbolic curvature;
- not all semantic data is hierarchical;
- optimization on a curved manifold introduces additional complexity;
- any benefit should be tested against an equal-dimensional Euclidean representation.

## A conservative hybrid state

A first hierarchy-specific model can separate ordinary content from hierarchy coordinates:

```text
x_ij = [e_ij | h_ij]
```

where `e_ij` is Euclidean content used by ordinary computation and `h_ij` is a smaller representation whose distance is hyperbolic.

The control replaces `h_ij` with an equal-dimensional Euclidean vector while keeping the rest of the architecture unchanged.

Suitable targets contain explicit hierarchy: tree depth, ancestor relationships, taxonomies, nested containment, or hierarchical retrieval. A flat image classification task would not isolate the reason for using hyperbolic geometry.

## Semantic routing with hyperbolic state

A later model can preserve local grid edges and add sparse links between addresses that are close in semantic geometry:

```text
local grid only
vs
local + Euclidean semantic neighbors
vs
local + hyperbolic semantic neighbors
```

Report routing cost, number of active edges, task accuracy, and sensitivity to hierarchy depth.

A positive result would show a hierarchy-specific routing advantage, not generic “higher-dimensional” capacity.

## Vector-Symbolic Architectures and Hyperdimensional Computing

VSA/HDC represents information with high-dimensional distributed vectors and defines algebraic operations for structured composition.

Common operations include:

- **binding** — combine two items into a representation of their relationship;
- **bundling** — superpose several items into one distributed vector;
- **permutation** — encode role, position, or order;
- **similarity** — retrieve a related item from noisy distributed state.

Useful background includes [A Survey on Hyperdimensional Computing](https://arxiv.org/abs/2111.06077) and Plate's [Holographic Reduced Representations](https://pubmed.ncbi.nlm.nih.gov/18263348/).

## Binding address and value

For a binary field, deterministic random hypervectors can represent x-coordinate, y-coordinate, and bit value:

```text
h_xyv = X_x ⊙ Y_y ⊙ V_v
```

Bundling all addresses gives

```text
H = Σ_(x,y) h_xyv
```

Querying an address approximately reverses the coordinate binding and compares the result with the 0 and 1 value vectors. Retrieval is imperfect because all 256 bound items share one superposed vector.

This produces an explicit capacity/robustness tradeoff: increasing dimension can reduce crosstalk but increases derived state and codebook cost.

## Combining VSA with a field

A field and a VSA representation provide different structure:

```text
field position     = persistent address and routing context
VSA state          = distributed compositional representation
local/global rule  = mechanism that changes or moves the state
```

One address might bind an entity with a relation while spatial communication determines which bindings interact next.

The combination should be compared with ordinary learned vectors, because high-dimensional expansion can otherwise be mistaken for an automatic improvement.

## Tests for VSA state

### Compositional binding

Compare explicit binding with learned concatenation plus an MLP under matched state and task conditions.

### Address retrieval

Measure whether stable spatial organization improves recovery of bound structures compared with an unordered store.

### Generalization

Test novel entity combinations and relation chains longer than those seen during training.

### Corruption tolerance

Inject equal amounts of state noise into HDC and ordinary dense latent representations, then compare retrieval accuracy per stored bit.

## Keep the axes separate

Three mechanisms can coexist without being the same thing:

1. **field structure** — where state persists and which addresses communicate;
2. **geometry** — how distance is defined inside some representation components;
3. **VSA/HDC algebra** — how distributed high-dimensional objects are composed and retrieved.

A combined model becomes interpretable only after each mechanism has a control that can fail independently.
