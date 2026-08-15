---
layout: research
title: Foundations
---

# From one bit to a computational field

A pixel can be treated as more than a color sample. Keep its spatial address, give it a finite state, and define an interpretation that determines what the state represents and what operations can act on it.

```text
pixel = address + carrier state + interpretation
```

That separation is the foundation of Multidimensional Pixel Fields.

## Begin with a field whose information is exact

Consider a 16×16 black-and-white field. Let black be `0` and white be `1`.

```text
16 × 16 addresses = 256 source bits
256 bits ÷ 8 = 32 packed bytes
```

Nothing about the picture is mysterious at this stage. The same 256 bits can be displayed as black and white squares, written as a matrix of zeros and ones, serialized row by row, packed into bytes, or written as hexadecimal. Exact decoding must recover every original bit.

[Binary Pixel Carrier]({{ '/carrier/' | relative_url }}) makes this identity executable.

The binary case matters because later representations can be compared against a source whose information budget is known rather than inferred.

## The address and the object at the address are different things

For a binary field,

```text
B[i,j] = b_ij,   b_ij ∈ {0,1}
```

For a broader computational field,

```text
F[i,j] = O_ij
```

`(i,j)` is the outer spatial address. `O_ij` is the finite computational object stored or instantiated there.

Possible objects include:

- one scalar;
- a vector such as `x_ij ∈ R^D`;
- a tensor with explicit internal axes;
- a bundle of high-dimensional symbolic state;
- several latent tokens with attention between them;
- fast and slow memory state;
- a neural state updated by a shared rule;
- another small field.

A richer object gives the computation more structure to work with. It also costs more state, parameters, or interpreter complexity.

## A visible square can be only a projection

A vector-valued pixel cannot be displayed directly on a two-dimensional screen. A projection converts its internal object into something visible:

```text
visible(i,j) = P(O_ij)
```

For example, three selected vector components might be mapped to RGB. The color is then a view of the internal state, not the complete state itself.

The same distinction appears in ordinary scientific visualization: a high-dimensional quantity can be inspected through selected coordinates, slices, statistics, or dimensionality-reduction projections without becoming identical to the visualization.

## More dimensions do not create more independent source information

Suppose one source bit is deterministically expanded into a 4,096-dimensional vector. The new vector may be easier to separate from other vectors, more tolerant of noise, or more useful for algebraic operations. But every component is still derived from the original bit plus the shared transformation.

A useful accounting identity is

```text
system resources
= source carrier
+ hidden or persistent state
+ metadata
+ codebooks / side information
+ model parameters under a declared amortization rule
```

This distinction prevents a large latent state from being mistaken for free information capacity.

## Pixel type and communication are independent choices

A vector pixel does not imply local communication. A transformer-like pixel does not imply global communication.

Outer addresses can interact through:

- nearest-neighbor or convolutional messages;
- graph edges;
- sparse long-range connections;
- global or windowed attention;
- region summaries;
- learned routing;
- parent/child messages across scales.

Two systems with identical internal pixel state can behave very differently if their communication graphs differ.

## Time is another independent choice

A field may update repeatedly:

```text
F_0 → F_1 → F_2 → ... → F_T
```

Repeated local updates increase the distance over which information can propagate and can support memory or iterative computation. They also add runtime and can introduce instability.

Recurrence is therefore a mechanism to test, not a definition of a computational pixel.

## Memory requires persistence, not merely hidden state

A hidden vector present during one forward pass is not automatically a useful memory. A memory test needs a sequence such as

```text
write → remove source → delay or interference → query
```

The measurement can then include retention time, retrieval accuracy, interference, overwrite, corruption tolerance, and stored-state cost.

A classical Hopfield network provides one transparent baseline: the visible field becomes a bipolar attractor state and the weight matrix stores the associative relationships used for recall.

## Compression requires fewer accounted bits for a chosen fidelity or utility

A 64-dimensional state per pixel is usually larger than RGB, not smaller. Compression begins only when structure reduces the total stored description.

Examples include:

- reusable motif dictionaries;
- vector quantization and codebook indices;
- low-rank or factorized state;
- sparse residuals;
- predictive coding;
- multiscale summaries;
- entropy coding;
- shared recursive rules.

The relevant comparison is a rate–distortion or rate–utility curve: how many accounted bits are required to preserve a chosen reconstruction quality or task performance.

## Several internal pixel forms answer different questions

### Scalar

```text
x_ij ∈ R
```

One number occupies one address. This is the smallest continuous baseline.

### Vector

```text
x_ij ∈ R^D
```

A vector can distribute content across channels. Neural Cellular Automata are an important established example of learned vector-valued cells with shared local updates.

### Tensor

```text
X_ij ∈ R^(A×B×C)
```

A tensor has explicit internal axes. It becomes meaningfully different from a flat vector only when the operations preserve or exploit those axes rather than immediately flattening them.

### Internal token set

```text
X_ij ∈ R^(K×D)
```

Several latent tokens occupy one outer address. Attention can mix those tokens inside the address. This differs from a field Transformer, where outer addresses themselves are the tokens and attention connects different locations.

### Memory object

A cell can contain fast state, slow state, confidence, routing variables, or learned write/read gates. Its value has to be established with a persistence task.

### Subfield

```text
F_outer[i,j] = F_inner^(i,j)
```

An outer address contains an active inner field. Genuine recursive structure requires a reusable interface or operator across levels; ordinary pooling alone is not enough.

[Pixel Interpretation Sandbox]({{ '/experiment/interpretation/' | relative_url }}) executes small fixed-rule examples of these internal forms.

## High dimensionality and hyperbolic geometry are different ideas

Dimensionality asks how many coordinates a representation has. Geometry asks how distance is defined between represented points.

A 4,096-dimensional Euclidean hypervector is high-dimensional but not hyperbolic. A two-dimensional Poincaré disk is hyperbolic but only two-dimensional.

Hyperbolic geometry becomes relevant when the target relationships are genuinely hierarchical and should be compared against an equal-dimensional Euclidean control.

## The central research question

> **What finite computational object should occupy an address, how should many such objects interact, and what representation, memory, robustness, compression, computation, or learning is obtained for the measured cost?**

A useful answer may be positive or negative. If a tensor, memory mechanism, routing scheme, or recursive structure adds cost without improving the measured task, that failure narrows the design space.
