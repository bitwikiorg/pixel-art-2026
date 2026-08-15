---
layout: research
title: Foundations
---

# From one pixel to a computational field

A pixel can be modeled as a spatial address that holds a finite state.

```text
pixel = address + carrier state + interpretation
```

The address answers **where?** The carrier state answers **what finite values are present?** The interpretation answers **what do those values mean, and what operations can act on them?**

For a field,

```text
F[i,j] = O_ij
```

`(i,j)` is the outer address. `O_ij` is the finite object at that address.

## Start with a source whose information is exact

A 16×16 black-and-white field can use black = `0` and white = `1`.

```text
16 × 16 = 256 source bits
256 bits ÷ 8 = 32 packed bytes
```

The bitmap, bit matrix, row-major bitstream, packed bytes, and hexadecimal representation can all describe the same 256 source bits exactly. Decoding is correct only when every recovered bit equals the original.

[Binary Pixel Carrier]({{ '/carrier/' | relative_url }}) executes that round-trip directly.

## One address can hold many finite data types

The word **pixel** does not determine the data type.

| State at one address | Example | Raw state cost |
|---|---|---:|
| bit | `1` | 1 bit |
| unsigned integer | `uint8 = 173` | 8 bits |
| RGB tuple | `(44, 167, 145)` | 24 bits |
| indexed color | index `2` into four colors | 2 bits + palette cost |
| hash fragment | `0xA6F3` | 16 bits |
| float vector | 8 fp32 values | 256 bits |
| tensor | 4×4 fp16 values | 256 bits |
| token set | 3 tokens × 6 fp16 values | 288 bits |
| memory state | 8 fast + 8 slow fp16 values | 256 bits |

These costs describe raw state only. A palette, codebook, neural weights, schema, routing table, or interpreter is an additional resource unless it is already shared or deterministically derived from counted state.

### Indexed color makes the distinction concrete

A four-color image does not need 24 RGB bits at every address. A pixel can store a two-bit index:

```text
00 → palette color 0
01 → palette color 1
10 → palette color 2
11 → palette color 3
```

If the four RGB888 palette entries are stored with the image, the palette costs another

```text
4 colors × 24 bits = 96 bits
```

If the palette is universal or derived from another already-counted object, its accounting changes accordingly.

## Stored color and projected color are different cases

An RGB pixel can literally store three color channels:

```text
O_ij = [R,G,B]
```

A vector-valued computational pixel may instead store eight, sixty-four, or thousands of values. To display it, a projection converts the richer state into visible color:

```text
visible(i,j) = P(O_ij)
```

The rendered RGB square is then a measurement or view of the internal state, not the complete object.

This distinction matters whenever a visualization appears simpler than the state that produced it.

## More state is not more independent source information

Suppose one bit is deterministically expanded into a 4,096-dimensional vector. The vector may improve separability, robustness, retrieval, or algebraic manipulation. It still derives from the original source plus a shared transformation.

A useful resource ledger is

```text
system resources
= source carrier
+ hidden or persistent state
+ metadata
+ codebooks / side information
+ model parameters under a declared amortization rule
```

A larger representation can be useful without creating new independent source information.

## Internal pixel type and communication are independent

What an address contains does not determine how addresses communicate.

A vector, tensor, token set, or memory object can exchange information through:

- local convolution or nearest-neighbor messages;
- graph edges;
- sparse long-range connections;
- global or windowed attention;
- learned routing;
- regional summaries;
- parent/child messages across scales.

Two fields with identical internal state can behave differently if their communication topology differs.

## Time is another independent variable

A field may update repeatedly:

```text
F_0 → F_1 → F_2 → ... → F_T
```

Repeated local updates increase the distance over which information can propagate. They can also support iterative computation and persistence. Each extra update costs runtime and can introduce convergence, oscillation, or instability.

Recurrence is therefore one mechanism, not the definition of a computational pixel.

## Memory requires persistence under removal and interference

Hidden state inside one forward pass is not enough to establish useful memory.

A memory experiment needs a sequence such as

```text
write → remove source → delay/interference → query
```

Measurements can include retention duration, retrieval accuracy, capacity, interference, overwrite, corruption tolerance, and stored-state cost.

A classical Hopfield network provides a transparent baseline: visible pixels become bipolar state while a dense weight matrix stores associative relationships used for recall.

## Compression is a rate question

A 64-dimensional state per address is generally much larger than RGB. Compression begins only when structure reduces the complete accounted description.

Possible mechanisms include:

- reusable motif dictionaries;
- vector quantization and codebook indices;
- low-rank or factorized state;
- predictive residual coding;
- sparsity;
- multiscale summaries;
- entropy coding;
- shared recursive rules.

The useful measurement is a rate–distortion or rate–utility curve:

```text
stored bits ↔ reconstruction quality
stored bits ↔ retained task performance
```

## Richer internal objects change the available computation

### Vector

```text
x_ij ∈ R^D
```

A vector distributes state across channels. Neural Cellular Automata are an established example of learned vector-valued cells with shared local updates.

### Tensor

```text
X_ij ∈ R^(A×B×C)
```

A tensor introduces explicit internal axes. It becomes meaningfully different from a flat vector only when the operator preserves or exploits those axes.

### Internal token set

```text
X_ij ∈ R^(K×D)
```

Several tokens live inside one outer address and can interact through attention. This differs from a field Transformer, where attention connects different outer addresses.

### Memory object

```text
x_ij = [fast state | slow state | gates]
```

Different components can have different temporal roles. Their value has to be established with a persistence task.

### Subfield

```text
F_outer[i,j] = F_inner^(i,j)
```

One outer address contains another active field. Genuine recursion requires reusable cross-level structure or operators; ordinary pooling alone is not enough.

[Pixel Interpretation Sandbox]({{ '/experiment/interpretation/' | relative_url }}) compares finite data types and executes fixed-rule examples of richer active states.

## High dimensionality and hyperbolic geometry are separate

Dimensionality asks how many coordinates a representation contains. Geometry asks how distance is defined between represented points.

A 4,096-dimensional Euclidean hypervector is high-dimensional but not hyperbolic. A two-dimensional Poincaré disk is hyperbolic but only two-dimensional.

Hyperbolic geometry is most defensible when the target relationships are explicitly hierarchical and an equal-dimensional Euclidean control is available.

## Central research question

> **What finite computational object should occupy an address, how should many such objects interact, and what representation, memory, robustness, compression, computation, or learning is obtained for the measured cost?**

A negative result is useful. If a tensor, memory mechanism, routing system, or recursive structure adds state and compute without improving the measured task, that result narrows the design space.
