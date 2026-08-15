---
layout: research
title: What is an MPF?
---

# What is a Multidimensional Pixel Field?

<div class="plain-box"><strong>Plain English:</strong> the project begins by refusing to assume what a pixel must contain. A pixel is a spatial address. Behind that address we can place a scalar, vector, tensor, neural unit, token set, memory object, subfield, or recursively larger structure. The research program compares those interpretations and studies what happens when many such objects are organized into fields.</div>

## The central research question

Can we engineer neural representations in which spatially addressable computational objects have purposeful roles, organize information across neighborhoods and scales, persist as memory, and themselves participate in reasoning?

The minimal vector version can still be written as

```text
F[i,j] = x_ij ∈ R^D
```

but this is the **simplest member of the family**, not the boundary of the idea.

A more general notation is

```text
F[i,j] = O_ij
```

where `O_ij` is the computational object associated with address `(i,j)`.

Depending on the experiment:

```text
O_ij = scalar
O_ij = vector
O_ij = tensor
O_ij = neural state + update
O_ij = latent token set + attention
O_ij = persistent memory object
O_ij = subfield
O_ij = recursively structured object
```

## The important separation: visible pixel versus computational pixel

RGB is a visualization interface, not the dimensional limit.

```text
visible_RGB(i,j) = projection(O_ij)
```

A 4×4 tensor, a 64-dimensional embedding or three internal Transformer tokens can all be projected into one visible square for a human observer. That projection does not imply that the object contains only three numbers.

This is why alternate color notations such as RGB and hexadecimal do not create additional dimensions. Additional representational capacity comes from the computational state associated with the address.

## “Infinite universe” as a research metaphor

There is no useful architectural reason to declare in advance that a pixel may contain only `D` scalar channels. A pixel can contain nested objects and those objects can themselves contain structure. In that sense the **interpretation space is open-ended**.

A physical implementation is never literally infinite: finite hardware stores finite state and executes finite computation. Human interpretability is also finite. We therefore need projections, slices, probes, causal interventions and summaries to inspect what a rich pixel is doing.

A useful analogy is a photon. Human-perceived brightness does not exhaust its physical description; frequency, phase, polarization, momentum and helicity can matter. A computational pixel is not literally a photon. The analogy simply separates the **visible effect** from the **full state carried by the object**.

## The pixel interpretation space

### Scalar

```text
x_ij ∈ R
```

Useful as a control and as the smallest spatial state.

### Vector

```text
x_ij ∈ R^D
```

The closest established structural precedent is Neural Cellular Automata: vector-valued cells, local learned updates and recurrence.

### Tensor

```text
x_ij ∈ R^(A × B × C)
```

A pixel can have internal axes and factorization. A tensor-valued pixel should be compared with a flat vector containing the same total number of scalar values.

### Neural unit

```text
x_ij' = fθ(x_ij, messages_ij)
```

A shared nonlinear program transforms each pixel state. Shared weights allow many pixels to instantiate the same computational rule without storing a separate model at every address.

### Micro-transformer

```text
X_ij ∈ R^(K × D)
X_ij' = Attentionθ(X_ij, message_ij)
```

One visible address contains several internal latent tokens. Attention occurs **inside the pixel**. This is distinct from a field Transformer, where pixels themselves become tokens and attention occurs **between addresses**.

### Memory object

A pixel can contain fast state, slower memory, confidence, routing information or other persistent components.

### Subfield

```text
F_outer[i,j] = F_inner^(i,j)
```

A pixel can itself be a smaller field. This creates an explicit route from cell → region → field → field-of-fields rather than treating hierarchy as pooling alone.

## A field adds another layer of information

The internal object is only one source of structure. A field also provides:

- an address;
- neighborhood relationships;
- distance and direction;
- region membership;
- scale;
- possible learned long-range links;
- a history of state changes.

So representation may be carried simultaneously by

```text
what is inside the pixel
+ where the pixel is
+ what surrounds it
+ what region contains it
+ what scale it occupies
+ how it changes through time.
```

## Representation + memory + workspace + computational substrate

The strongest MPF direction is not “visualize activations as colored pixels.” It is a field in which the state itself becomes useful for several jobs at once:

- **representation** — what information exists;
- **memory** — what persists;
- **workspace** — where intermediate states live;
- **computation** — how those states transform;
- **routing** — which information interacts;
- **hierarchy** — how coarse and fine state relate.

A recurrent trajectory is one mechanism:

```text
F_0 → F_1 → … → F_T
```

but recurrence is not the definition of MPF. Other experiments can focus on internal tensor structure, attention, storage, semantic placement, geometry or field-to-field interaction.

## Recursive and multiresolution organization

The original direction becomes especially interesting when the same representational logic can operate at several levels:

```text
album
  ↓
field
  ↓
region
  ↓
subregion
  ↓
cell
  ↓
inner subfield
```

“Fractal” should be reserved for a design that demonstrates meaningful recursive or self-similar reuse. Until then, **recursive**, **hierarchical** or **multiresolution** is more precise.

## Hyperdimensionality and geometry are different choices

Very high-dimensional state and hyperbolic geometry should not be conflated.

- **dimensionality** asks how many independent coordinates or components a representation uses;
- **geometry** asks how distance and relationships are defined in that representation space.

A field can therefore contain high-dimensional Euclidean vectors, hyperbolic hierarchy-related state, vector-symbolic representations, tensors, or mixtures of several geometries.

## Compression is not automatic

A richer pixel usually costs **more** raw storage, not less. Compression becomes meaningful only when the architecture exploits structure through methods such as quantization, shared codebooks, sparsity, low rank, predictive reconstruction, multiresolution storage, recursive reuse or entropy coding.

The useful measurement is task-relevant utility per stored bit, not the number of dimensions listed in the design.

## The experimental stance

The laboratory should not choose one interpretation by definition. It should compare them.

Examples:

- scalar versus vector;
- flat vector versus equal-size tensor;
- neural unit versus micro-transformer;
- attention inside pixels versus attention between pixels;
- ordinary state versus fast/slow memory;
- flat field versus field-inside-field;
- fixed spatial topology versus learned semantic geography;
- floating state versus quantized state;
- one field versus interacting persistent fields.

The current trainable recurrent vector field is therefore one baseline in a larger experimental zoo.

## Continue

- [Run the Pixel Universe]({{ '/experiment/#pixelUniverseLab' | relative_url }})
- [Start Here: interpretation-by-interpretation]({{ '/learn/' | relative_url }})
- [Experimental program]({{ '/research/02-experiment-protocol/' | relative_url }})
- [Closest research neighbors]({{ '/research/01-prior-art/' | relative_url }})
- [Memory and compression]({{ '/research/07-memory-compression/' | relative_url }})
