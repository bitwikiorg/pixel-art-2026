---
layout: research
title: Start Here
---

# From pixel to computational object

<div class="plain-box"><strong>One-sentence version:</strong> Pixel Neural Net Lab asks what happens when a pixel stops meaning “a few color channels” and becomes a spatial address for an arbitrary computational object: scalar, vector, tensor, neural unit, token set, memory, subfield, or recursively larger structure.</div>

The project is broader than one recurrent neural grid. A recurrent vector field is one important implementation because it is simple enough to train and inspect, but it sits inside a much larger design space.

## 1. Pixel: address first, interpretation second {#cell}

### Plain English

A normal display pixel is associated with a location such as `(i,j)` and a small set of visible channel values. In this project, the useful primitive is the **address**.

What lives at the address is a design choice.

```text
pixel(i,j) → scalar
pixel(i,j) → vector
pixel(i,j) → tensor
pixel(i,j) → neural unit
pixel(i,j) → micro-transformer
pixel(i,j) → memory object
pixel(i,j) → subfield
```

The visible RGB value can still exist, but it is only a projection that helps humans inspect the internal state.

This is why “more colors” is not the point. Hex, RGB and named colors are alternate encodings of visible color; they do not create new independent dimensions. The additional state comes from the computational object associated with the address.

## 2. The dimensionality is open-ended; implementations are finite

Conceptually, there is no architectural rule that says a pixel must stop at 3, 8, 64 or 4,096 dimensions. A pixel could contain nested structured state or even another field.

But a real computer always stores a finite object. So the useful distinction is:

```text
open-ended interpretation space
            ≠
actually infinite stored information
```

Human interpretability is also finite. A person cannot directly inspect thousands of latent dimensions at once. Visualization therefore projects, slices, summarizes or probes the state.

A useful carrier analogy is a photon. Perceived brightness is not a complete physical description; frequency, phase, polarization, momentum and helicity can also matter. A computational pixel is not literally a photon, but the analogy warns us not to confuse what is visible with everything the carrier can represent.

## 3. The interpretation ladder

### Scalar pixel

```text
x_ij ∈ R
```

One value per location. This is the simplest spatial control.

### Vector pixel

```text
x_ij ∈ R^D
```

A learned multidimensional state. This is the structural family used by Neural Cellular Automata and by the current learned MPF-Local experiment.

### Tensor pixel

```text
x_ij ∈ R^(A × B × C)
```

One visible address contains a structured latent object. Two cells can have the same number of scalar values while organizing them differently—for example, a flat 64D vector versus an 8×8 tensor.

Learn more: [Tensor (Wikipedia)](https://en.wikipedia.org/wiki/Tensor).

### Neural-unit pixel

The pixel contains state and is transformed by a shared nonlinear neural rule:

```text
x_ij' = fθ(x_ij, neighborhood_ij)
```

The weights can be shared across locations so the field does not require a completely separate network for every pixel.

### Micro-transformer pixel

One address can contain several internal latent tokens:

```text
X_ij ∈ R^(K × D)
```

A shared attention block can mix those tokens internally while the pixel exchanges a compressed message with other pixels.

This is different from a **field Transformer**, where each pixel is itself one token and attention happens between pixel addresses.

### Memory-object pixel

A cell can separate rapidly changing state from slower persistent state:

```text
x_ij = [activity, memory]
```

Now the address is not merely a feature location; it can become a persistent local memory object.

### Subfield pixel

A visible pixel can itself contain a smaller field:

```text
outer field → pixel → inner field
```

That turns the system into a field of fields and provides a concrete route toward recursive or multiscale organization.

[Run all seven interpretations in the browser]({{ '/experiment/#pixelUniverseLab' | relative_url }}).

## 4. Communication is another independent choice {#local-rule}

Changing the internal pixel does not determine how pixels communicate.

Possible communication rules include:

- fixed local neighborhoods;
- convolution;
- graph message passing;
- sparse long-range links;
- global attention;
- learned routing;
- region summaries;
- communication between fields.

A simple local vector field uses

```text
x_ij^(t+1) = x_ij^t + gθ(x_ij^t, N_ij(F_t))
```

where `N_ij` is a neighborhood and `gθ` is a learned update shared across positions.

This is closely related to [Growing Neural Cellular Automata](https://distill.pub/2020/growing-ca/) and to graph message passing. [Distill: A Gentle Introduction to Graph Neural Networks](https://distill.pub/2021/gnn-intro/).

## 5. Time and recurrence are optional tools, not the definition {#recurrence}

A field can change through repeated updates:

```text
F_0 → F_1 → F_2 → … → F_T
```

Recurrence is useful because local communication needs multiple steps to propagate globally and because repeated computation can create persistent intermediate states.

But an MPF experiment does not have to be recurrent. A tensor pixel, attention pixel, stored-memory field or field-to-field retrieval system can test different parts of the idea.

Related reading: [Scholarpedia: Recurrent neural networks](https://www.scholarpedia.org/article/Recurrent_neural_networks) · [Self-classifying MNIST Digits](https://distill.pub/2020/selforg/mnist/).

## 6. Regions and recursion {#hierarchy}

Spatial addresses naturally permit larger structures:

```text
cell → region → field
```

The stronger recursive version is:

```text
album → field → region → subregion → cell → inner subfield
```

The same representational or computational mechanism might eventually operate at multiple levels. If the same rule is demonstrably reused across scales, “recursive” or possibly “fractal” becomes technically meaningful. Otherwise the safer term is **multiresolution**.

## 7. What can be learned? {#training}

Different experiments can learn different things:

- the contents of vector or tensor states;
- the update rule inside a neural pixel;
- attention weights inside a transformer pixel;
- where information is written;
- which cells communicate;
- regional summaries;
- memory gates;
- codebooks for quantization;
- semantic geometry;
- field-to-field retrieval.

The current TensorFlow.js neural-field experiment learns only a narrow subset: vector-valued cell state, a shared local convolutional update and a classifier readout. That makes it a useful baseline rather than a complete implementation of the project.

## 8. The larger research object

The project becomes a family of questions about **representation + topology + computation + memory + scale + geometry**.

Examples:

- Does a 4×4 tensor inside each pixel behave differently from an equal-size flat vector?
- Does attention work better inside a pixel, between pixels, or at regional scales?
- Can a pixel preserve state after its input disappears?
- Can an outer field route computation into inner subfields only when needed?
- Can semantic organization emerge spatially rather than being assigned?
- Can very high-dimensional or vector-symbolic state improve compositional operations?
- Can hyperbolic geometry help hierarchy-related state? [Poincaré embeddings](https://arxiv.org/abs/1705.08039)
- Can quantized fields preserve useful information per stored bit? [VQ-VAE](https://arxiv.org/abs/1711.00937)
- Can multiple persistent fields retrieve and modify one another as a semantic album?

<div class="note-box"><strong>Where to go next:</strong> the <a href="{{ '/experiment/' | relative_url }}">live laboratory</a> now starts with the pixel-interpretation ladder. The <a href="{{ '/research/02-experiment-protocol/' | relative_url }}">experimental program</a> expands that ladder into trained comparisons, recursive fields, memory, compression, semantic topology and field-to-field systems.</div>
