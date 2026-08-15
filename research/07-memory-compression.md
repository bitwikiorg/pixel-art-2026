---
layout: research
title: Memory and Compression
---

# Persistent fields, memory, and compression

A multidimensional field can be useful memory without being compact. Memory asks whether state survives and remains usable. Compression asks whether the same useful information can be preserved with fewer accounted bits.

Those questions should remain separate.

## Raw field size

A 32×32 field with 64 state values per cell contains

```text
1,024 cells × 64 values = 65,536 scalars
```

Approximate raw storage is

| Representation | Field size |
|---|---:|
| fp32 | 256 KiB |
| fp16 / bf16 | 128 KiB |
| int8 | 64 KiB |

Replacing RGB pixels with 64-dimensional neural state therefore increases raw storage dramatically before any compression method is applied.

## Persistence as an independent capability

A persistent field can be tested by interrupting computation:

```text
compute → serialize F_T → remove active state → restore → continue or query
```

Useful measurements include:

- whether task-relevant information survives serialization;
- how long the state can remain inactive;
- whether computation can resume without the original input;
- how much state must be stored;
- whether recomputing from the source is cheaper than restoring the field.

Persistence has value only if the saved state contains useful information that is costly or impossible to recover from the source at query time.

## Memory requires removal of the source

A stronger memory protocol uses

```text
write → remove source → delay/interference → query
```

This prevents a model from answering by re-reading the original input.

Report retention length, capacity, retrieval accuracy, interference, overwrite, corruption sensitivity, and total stored state. A model with more memory bits should not be compared with a smaller baseline as though their storage budgets were equal.

## Vector quantization

[VQ-VAE](https://arxiv.org/abs/1711.00937) replaces a continuous vector with the index of a learned codebook entry.

For a 64-dimensional cell, product quantization might split the vector into four groups of sixteen values. If each group chooses among 256 codewords, each index costs eight bits:

```text
4 groups × 8 bits = 32 bits / cell
```

For 1,024 cells:

```text
1,024 × 32 bits = 32,768 bits = 4 KiB of indices
```

The 4 KiB figure is incomplete without the codebook.

Four fp16 codebooks containing `256 × 16` values each occupy roughly

```text
4 × 256 × 16 × 2 bytes ≈ 32 KiB
```

A self-contained field-specific representation would therefore be closer to 36 KiB before headers or entropy coding. If one 32 KiB codebook is shared by millions of fields, its amortized per-field cost can be tiny. Both accounting regimes are legitimate, but they answer different deployment questions.

## Three levels of self-containment

### Interpreter-dependent

A shared model, codebook, and schema already exist. Only the latent instance state is stored.

### Instance-self-contained

A universal interpreter may be shared, but every piece of instance-specific state and metadata required for decoding travels with the field.

### Strictly self-describing

The stored object also carries enough schema, definitions, and decoding metadata to explain its own structure. This is substantially more expensive and should not be assumed by default.

Instance-self-contained storage is the closest analogue to an ordinary codec with a shared decoder.

## Rate–utility

For reasoning or memory, pixel-perfect reconstruction may not be the relevant objective. The stored representation can instead be evaluated by how much task performance it preserves:

```text
stored bits ↔ retained utility
```

Examples include:

- bits required to answer 95% of stored facts correctly;
- bits required to preserve route-planning accuracy;
- bits required to resume recurrent computation with less than a chosen loss in performance.

The result should be a curve because different methods can dominate at different rates.

## Multiresolution storage

Hierarchical state can support coarse-to-fine coding:

```text
coarse prediction + fine residual
```

Possible mechanisms include:

- dense coarse regions with sparse fine cells;
- parent-state prediction of child state;
- residual coding only where prediction fails;
- different quantization rates by scale;
- query-driven restoration of fine detail.

The relevant comparison is with flat quantization, conventional predictive coding, and other hierarchical codecs under the same fidelity or utility target.

## Damage and recovery

A persistent field can be corrupted after it has acquired useful state:

```text
useful field → delete or corrupt region → continue computation → re-evaluate task
```

Recovery should be traced to its actual source:

- redundancy in neighboring state;
- coarse region summaries;
- a global memory;
- learned dynamics;
- external source information that was never removed.

Without that distinction, visual repair can be mistaken for memory.

## Higher-order field memory

A collection of persistent fields can be treated as a memory set

```text
A = {F_1, F_2, ..., F_n}
```

A retrieval system could select one field by key, combine related fields, update an existing field, or consolidate many fields into a summary.

The comparison target is ordinary key-value memory, vector databases, recurrent memory models, and learned external-memory architectures. Field-level structure is useful only if it improves retrieval, composition, persistence, or update behavior for its additional storage cost.
