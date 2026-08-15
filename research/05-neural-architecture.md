---
layout: research
title: Neural Architecture
---

# From a pixel field to a neural network

<div class="plain-box"><strong>Plain English:</strong> the neural version of MPF is not a file format. It is a recurrent network whose hidden state happens to be arranged as a grid. A small neural rule is copied across all grid locations and reused over several time steps.</div>

## Minimal architecture

Let the field state be

```text
F_t: [B, H, W, D]
```

where `B` is batch size, `H×W` is the grid, and `D` is the hidden width of each cell.

A useful first architecture is:

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

This lets the model discover placement instead of requiring a human-designed semantic map.

## 2. Local perception

The simplest local operation is a 3×3 convolution. Every cell receives information from itself and its eight immediate neighbors.

```python
local = conv3x3(field)
```

Growing NCA often uses fixed derivative filters (such as Sobel-like perception) before a learned update. A learned depthwise convolution is another clean option.

The key property is **shared locality**: parameter count does not grow with the number of cells.

## 3. Shared update

A gated residual update is a strong default:

```text
p_ij = [x_ij, local_ij, region_ij, global]
[Δx, gate] = MLP(p_ij)
x_ij' = x_ij + sigmoid(gate) ⊙ Δx
```

For a tiny browser model, the update can be as simple as

```text
F_(t+1) = tanh(F_t + Conv1x1(ReLU(Conv3x3(F_t))))
```

This is a genuine trainable recurrent convolutional network.

## 4. Recurrence

The same transition weights are reused:

```text
F_1 = Uθ(F_0)
F_2 = Uθ(F_1)
...
F_T = Uθ(F_(T-1))
```

Training can sample `T` from a range, for example 8–16, rather than always using one fixed depth. At evaluation, test a larger range of recurrent steps to see whether extra compute helps or destabilizes the state.

## 5. Multiresolution extension

A hierarchical version adds coarse states:

```text
F32: 32×32×D
  ↓ pool
F8:   8×8×D
  ↓ pool
F4:   4×4×D
  ↓
G:    1×1×D
```

Each fine cell receives its local context plus an upsampled representation of the region it belongs to.

A stronger recursive version reuses the same update function at several scales. That is the architecture in which “fractal” or scale-recursive language could become rigorous.

## 6. Weak readout

Use a deliberately small decoder first:

```text
z = pool(F_T)
y = MLP(z)
```

A powerful Transformer decoder can be tested later, but if the decoder is much more expressive than the field, it becomes difficult to know where the computation happened.

## Reference implementation sizes

### Browser learning model

```text
12×12 cells
D = 12
2 input marker channels
shared 3×3 conv
shared 1×1 update
2–10 recurrent steps
4-way softmax readout
```

This is intentionally small enough to train interactively with TensorFlow.js.

### Research model

A practical next scale from the deep research audit is:

```text
32×32 cells
D = 48–64
hidden update width ≈ 128
3×3 local communication
8–16 recurrent updates during training
optional 8×8 / 4×4 / global hierarchy
```

A 32×32×64 field contains 65,536 scalar state values. Stored in fp16, one raw field state is about 128 KiB before any compression.

## Complexity intuition

For a fixed local neighborhood, spatial communication scales roughly linearly with the number of cells:

```text
O(H × W × T)
```

up to channel/kernel factors.

Full self-attention across all `N = H×W` cells has an `N²` interaction matrix. That does not mean MPF is automatically faster: recurrence may require many steps, and convolutional implementations have their own constants. Report real runtime/FLOPs rather than relying on asymptotics alone.

## Closest implementation analogy

Growing NCA explicitly notes that its model can be viewed as a recurrent residual convolutional network applied locally to cells. That is a useful grounding statement for MPF: the novelty question is **not whether the network is made of unfamiliar primitives**, but whether this particular state organization develops useful computational properties.
