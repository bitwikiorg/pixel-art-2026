---
layout: research
title: Memory and Compression
---

# Persistent fields as memory—and what “compression” really means

<div class="plain-box"><strong>Plain English:</strong> a multidimensional field can be a useful memory format without being small. Compression only begins when we reduce the number of bits needed to store a field while preserving useful information.</div>

## Raw field size

For a 32×32 field with 64 state values per cell:

```text
1,024 cells × 64 values = 65,536 scalars
```

Approximate raw storage:

| Representation | Field size |
|---|---:|
| fp32 | 256 KiB |
| fp16 / bf16 | 128 KiB |
| int8 | 64 KiB |

So simply replacing RGB pixels with 64-dimensional neural state increases storage dramatically.

## Persistence before compression

First ask whether the field is a useful memory object at all.

Experiments:

1. stop the recurrent computation and serialize `F_T`;
2. restore it later;
3. continue updating;
4. answer new queries from the restored state;
5. compare against recomputing the field from the original input.

If the restored field contains useful working information, persistence has value independent of compression.

## Vector quantization

[VQ-VAE](https://arxiv.org/abs/1711.00937) provides a direct mechanism: replace a continuous vector with the index of a learned codebook vector.

A product-VQ example for a 64-dimensional cell:

```text
64 dimensions → four groups of 16
256 codewords per group → 8 bits per index
4 indices × 8 bits = 32 bits per cell
```

For 1,024 cells:

```text
32,768 bits = 4 KiB of indices
```

But those indices only make sense with a codebook.

If four fp16 codebooks each contain `256 × 16` values, the codebooks themselves occupy roughly 32 KiB. A per-field self-contained encoding would therefore be closer to 36 KiB before headers or entropy coding—not 4 KiB.

If one codebook is shared by millions of fields, its cost can be amortized. Both accounting regimes are useful, but they answer different questions.

## Three meanings of “self-contained”

### Interpreter-dependent
A shared model, codebook and schema are assumed. Only the latent field is stored.

### Instance-self-contained
A fixed universal interpreter/codebook may be shared, but every piece of **instance-specific** state and metadata required to use the field travels with it.

### Strictly self-describing
The field also carries its schema, definitions and decoding metadata. This is much more ambitious and potentially expensive.

The second definition is the best starting point; it resembles a normal codec with a shared decoder.

## Rate–utility rather than “information density”

For reasoning memory, reconstruction pixels may be the wrong objective. Instead measure:

```text
stored bits ↔ retained task performance
```

Examples:

- bits required to answer 95% of stored facts correctly;
- bits required to retain path-planning performance;
- bits required to resume recurrent reasoning without losing accuracy.

Plot a **rate–utility curve** for MPF, flat VQ state, continuous latents and other baselines.

Background: [rate–distortion theory](https://en.wikipedia.org/wiki/Rate%E2%80%93distortion_theory).

## Multiresolution storage

A hierarchy may enable coarse-to-fine storage:

```text
coarse summary + local residuals
```

Potential methods:

- store coarse regions densely and fine cells sparsely;
- predict fine state from parent regions and encode only residuals;
- use different quantization rates by scale;
- retrieve fine detail only for queried regions.

This is where “semantic compression” can become an operational engineering problem rather than a metaphor.

## Damage and error correction

Persistent recurrent state may support repair.

Procedure:

1. obtain a useful field;
2. delete or corrupt a region;
3. continue recurrent updates;
4. measure whether task performance recovers.

If recovery occurs, inspect where the redundant information came from: neighboring state, coarse regions, global memory, or the learned dynamics themselves.

## Albums and associative retrieval

A collection of fields can serve as higher-order memory:

```text
A = {F₁, F₂, ..., Fₙ}
```

A later model might retrieve fields by a learned key, combine related episodes, or consolidate many fields into an abstract field.

The main comparison should be with ordinary key-value memory, vector databases, recurrent memory models and learned external-memory architectures. “Album” is useful only if field-level structure gives something beyond a set of vectors.
