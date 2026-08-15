---
layout: research
title: Vector-Field Baseline Architecture
---

# One neural architecture: the learned vector field

<div class="plain-box"><strong>Scope:</strong> this page documents the current trainable baseline, not the definition of MPF. Here a pixel is interpreted as a learned vector and every location shares a recurrent local neural update. Other experiments interpret a pixel as a tensor, neural unit, micro-transformer, memory object or subfield.</div>

The broad project keeps three choices separate:

```text
1. what is inside a pixel?
2. how do pixels communicate?
3. how does the whole system learn / persist / compute?
```

This page chooses:

```text
pixel object      = vector
communication     = local 3×3 neighborhood
update            = shared neural rule
computation       = recurrence
readout            = small pooled classifier
```

That combination is useful because it is close to Neural Cellular Automata, easy to train, and small enough to inspect.

## Minimal vector-field architecture

Let the field state be

```text
F_t: [B, H, W, D]
```

where `B` is batch size, `H×W` is the grid, and `D` is the vector width of each pixel.

```text
input items/query
      ↓
field writer
      ↓
[B,H,W,D]
      ↓
3×3 local perception
      ↓
shared update MLP / 1×1 conv
      ↓
residual recurrent update
      ↺ T times
      ↓
small pooled or query-conditioned readout
```

## 1. Field writer

The writer converts raw input into the initial hidden field `F₀`.

For a grid task, this may be a 1×1 convolution over input channels. For symbolic facts, an encoder can produce item embeddings and a learned assignment can write them into locations.

A learned soft write can use

```text
A[k,i,j] = softmax(q_k · key[i,j])
F_0[i,j] = Σ_k A[k,i,j] value_k
```

This allows placement itself to become learnable.

## 2. Local perception

The current baseline uses a 3×3 convolution. Every pixel receives information from itself and its immediate neighbors.

```python
local = conv3x3(field)
```

The important property is weight sharing: parameter count does not grow with the number of spatial addresses.

## 3. Shared update

A gated residual update is a strong research default:

```text
p_ij = [x_ij, local_ij, region_ij, global]
[Δx, gate] = MLP(p_ij)
x_ij' = x_ij + sigmoid(gate) ⊙ Δx
```

The tiny browser implementation is simpler:

```text
F_(t+1) = tanh(F_t + Conv1x1(ReLU(Conv3x3(F_t))))
```

## 4. Recurrence

The same transition weights are reused:

```text
F_1 = Uθ(F_0)
F_2 = Uθ(F_1)
...
F_T = Uθ(F_(T-1))
```

Recurrence is useful for this architecture because a local neighborhood can only move information a short distance in one update.

It is **not** a requirement for every computational-pixel experiment. A tensor-pixel or Transformer-pixel architecture may factor computation differently.

## 5. Multiresolution extension

A vector-field hierarchy can add coarse states:

```text
F32: 32×32×D
  ↓
F8:   8×8×D
  ↓
F4:   4×4×D
  ↓
G:    1×1×D
```

A stronger recursive architecture would allow the object associated with a location to itself be a field and would reuse related operations at several scales.

## 6. Weak readout

The baseline intentionally uses a small decoder:

```text
z = pool(F_T)
y = MLP(z)
```

A powerful external decoder can hide where computation actually occurred.

## Browser learning model

```text
12×12 addresses
pixel = 12D vector
2 marker input channels
shared 3×3 convolution
shared 1×1 update
2–10 recurrent steps
4-way softmax readout
```

This is small enough to train interactively with TensorFlow.js.

## PyTorch reference baseline

```text
12×12 or larger field
pixel = D-dimensional vector
shared local update
gated residual recurrence
global max readout
```

The reference implementation exists to support repeatable runs, larger batches and controlled topology tests.

## The next architecture comparisons

The useful next step is not simply “make this vector field bigger.” It is to change the pixel primitive while controlling resources.

### Vector versus tensor

```text
R^64
versus
R^(8×8)
```

Same scalar state, different internal organization.

### Neural unit versus micro-transformer

```text
shared MLP update
versus
shared internal attention over K tokens
```

### Attention inside versus between pixels

```text
micro-transformer pixel
versus
field Transformer
```

### Flat pixel versus subfield pixel

```text
one vector state
versus
small inner field at every outer address
```

These comparisons are described in the [experimental program]({{ '/research/02-experiment-protocol/' | relative_url }}).

## Complexity intuition

A fixed local neighborhood communicates with roughly linear scaling in the number of outer addresses, up to channel, tensor and internal-object costs. Full attention between `N = H×W` outer addresses introduces an `N²` interaction matrix. Internal attention inside every pixel instead scales with the square of the **internal token count** per pixel.

That distinction is one reason the pixel interpretation matters: the same ingredients can have very different computational structure depending on where they are placed.

## Closest implementation analogy

Growing Neural Cellular Automata is the closest structural analogy for this **specific vector-field baseline**: recurrent residual local computation over vector-valued cells. The broader Pixel Neural Net Lab deliberately extends beyond that baseline by varying what a cell actually is.
