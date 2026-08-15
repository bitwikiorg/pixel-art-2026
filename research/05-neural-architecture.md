---
layout: research
title: Vector-Field Baseline Architecture
---

# A learned local vector field

One concrete computational-pixel architecture places a learned vector at every spatial address and reuses one local neural update through time.

```text
pixel object      = vector
communication     = local 3×3 neighborhood
update            = shared neural rule
computation       = recurrence
readout            = small classifier
```

This architecture is deliberately close to recurrent convolution and Neural Cellular Automata. Its value is as a controlled baseline for testing which additional structures—tensor factorization, internal attention, memory, routing, or recursion—actually add something.

## Field state

Let

```text
F_t ∈ R^(B×H×W×D)
```

where `B` is batch size, `H×W` is the spatial field, and `D` is the vector width at each address.

A typical computation is

```text
input
  ↓
field writer
  ↓
F_0
  ↓
shared local perception
  ↓
shared nonlinear update
  ↺ repeated T times
  ↓
small readout
```

## Writing input into the field

The writer converts raw input into the initial hidden state `F_0`.

For an image-like task, a 1×1 convolution can map input channels into `D` latent channels at the same location. For symbolic items, an encoder can produce item embeddings and a placement mechanism can assign them to addresses.

A learned soft assignment can take the form

```text
A[k,i,j] = softmax(q_k · key[i,j])
F_0[i,j] = Σ_k A[k,i,j] value_k
```

Now placement itself becomes a learned variable rather than a fixed preprocessing step.

## Local perception

A 3×3 convolution gives each address access to itself and immediate neighbors:

```text
local = Conv3×3(F_t)
```

With stride one, a single update has a small communication radius. Repeating the same update increases the effective receptive field without adding a new parameter set at each depth.

Weight sharing is important: parameter count can stay roughly independent of the number of outer addresses, even though runtime and activation state grow with field size.

## Shared nonlinear update

A general gated residual rule could use

```text
p_ij = [x_ij, local_ij, region_ij, global]
[Δx, gate] = MLP(p_ij)
x_ij' = x_ij + sigmoid(gate) ⊙ Δx
```

A smaller baseline can use

```text
F_(t+1) = tanh(F_t + Conv1x1(ReLU(Conv3x3(F_t))))
```

The shared rule means all addresses execute the same parameterized transition even though their states differ.

## Recurrence and communication distance

Repeated updates give

```text
F_1 = Uθ(F_0)
F_2 = Uθ(F_1)
...
F_T = Uθ(F_(T-1))
```

When communication is strictly local, required update depth grows with the spatial distance over which information must travel. This creates a direct experimental quantity:

```text
accuracy = A(problem distance, recurrent depth)
```

A model that succeeds only when `T` is large may be using recurrence primarily as a communication mechanism rather than as deeper abstract reasoning.

## Readout strength matters

A weak decoder keeps the burden of computation inside the field:

```text
z = pool(F_T)
y = MLP(z)
```

A large Transformer or deep MLP attached after the field could solve the task externally and make the internal dynamics difficult to interpret.

The readout should therefore be strong enough to expose useful state but not so strong that it dominates the problem.

## Browser-scale relation model

A compact configuration uses

```text
12×12 addresses
12 latent values / address
2 marker input channels
shared 3×3 local convolution
shared 1×1 nonlinear update
2–10 recurrent steps
4-way softmax relation output
```

The task predicts LEFT, RIGHT, ABOVE, or BELOW for two markers. It is a pipeline test for learned local state and distance-conditioned propagation, not a claim of novel reasoning.

## Larger CPU reference

A CPU/PyTorch implementation can use wider vector state, larger batches, repeated seeds, and controlled topology variants. The important measurements remain:

- state values per address;
- trainable parameters;
- recurrent depth;
- held-out accuracy by distance;
- runtime or approximate compute;
- sensitivity to topology changes.

## Multiresolution extension

A hierarchy can introduce coarse state alongside fine state:

```text
F32: 32×32×D
  ↓
F8:   8×8×D
  ↓
F4:   4×4×D
  ↓
G:    1×1×D
```

Coarse summaries can reduce long communication paths. The useful comparison is against a flat model with a larger receptive field or occasional global communication at similar compute.

## Changing the internal pixel primitive

### Vector versus tensor

```text
R^64
versus
R^(8×8)
```

The same scalar state count can be organized differently. Tensor-specific operations must preserve the internal axes for the comparison to test factorization rather than a reshape.

### MLP versus internal attention

```text
one shared nonlinear vector update
versus
K internal tokens + shared self-attention
```

Internal attention scales with the square of token count `K` at every outer address, so state and compute must be reported together.

### Attention inside versus between addresses

```text
micro-transformer pixel: attention within O_ij
field Transformer:        attention across (i,j)
```

The two systems place the same broad mechanism at different structural levels and can have very different scaling behavior.

### Flat state versus subfield state

```text
one vector object
versus
small active field inside every outer address
```

Subfields become interesting when inner computation and parent/child communication provide measurable scale generalization or reusable structure rather than merely increasing state.

## Complexity intuition

For `N = H×W` outer addresses, fixed local communication can scale roughly linearly in `N` for fixed channel width and kernel size. Full attention between all outer addresses introduces an `N²` interaction matrix. Internal attention instead introduces approximately `N × K²` interactions for `K` internal tokens per address, before outer communication is counted.

Where an operation is placed—inside an address, between addresses, or between regions—is therefore a first-order computational design choice.
