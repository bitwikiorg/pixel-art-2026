---
layout: default
title: Glossary
description: Operational definitions for multidimensional pixel fields, representation, learning, memory, coding, geometry, color, and evaluation.
---
<div class="page-shell library-page" data-library-page="glossary">
  <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="{{ '/' | relative_url }}">Home</a><span>›</span><span>Glossary</span></nav>

  <header class="library-hero compact-library">
    <div class="library-kicker">Operational definitions</div>
    <h1>Glossary</h1>
    <p class="hero-deck">Terms are defined by the state, operation, resource, or measurement they refer to. Similar words are kept separate when they imply different experiments.</p>
    <nav class="glossary-tools" aria-label="Glossary groups"><a href="#glossary-core">Core state</a><a href="#glossary-compute">Computation</a><a href="#glossary-memory">Memory & coding</a><a href="#glossary-color">Color & light</a><a href="#glossary-geometry">Geometry</a><a href="#glossary-evaluation">Evaluation</a></nav>
  </header>

  <div class="library-map glossary-map">
    <section class="library-map-row glossary-family" id="glossary-core">
      <div class="library-map-label"><small>01</small><h2>Core state</h2></div>
      <div class="glossary-card-grid">
        <article class="glossary-card" id="carrier"><h3>Carrier</h3><p>The finite state that physically or computationally represents source information. A binary pixel carrier stores one bit at each address.</p><div class="links"><a href="{{ '/carrier/' | relative_url }}">Binary carrier</a></div></article>
        <article class="glossary-card" id="computational-pixel"><h3>Computational pixel</h3><p>A spatial address plus finite carrier or computational state plus an interpretation. The internal object is not restricted to visible RGB.</p><div class="links"><a href="{{ '/learn/' | relative_url }}">Foundations</a></div></article>
        <article class="glossary-card" id="source-information"><h3>Source information</h3><p>Independent information supplied before derived representations, hidden state, model parameters, metadata, or side information are added.</p><div class="links"><a href="{{ '/research/00-research-thesis/' | relative_url }}">Research thesis</a></div></article>
        <article class="glossary-card" id="projection"><h3>Projection / visualization</h3><p>A lower-dimensional view of richer internal state. Mapping latent values to color makes them visible without making the color image identical to the stored object.</p></article>
        <article class="glossary-card" id="tensor"><h3>Tensor pixel</h3><p>A pixel whose internal state has explicit array axes, such as a 4×4 latent matrix. The factorization matters only when operations preserve or exploit it.</p><div class="links"><a href="{{ '/experiment/primitive-benchmark/' | relative_url }}">Benchmark</a></div></article>
        <article class="glossary-card" id="micro-transformer"><h3>Internal-token / micro-transformer pixel</h3><p>Several latent tokens occupy one outer address and self-attention mixes them. A field Transformer instead attends between outer addresses.</p><div class="links"><a href="{{ '/experiment/interpretation/' | relative_url }}">Pixel interpretations</a></div></article>
      </div>
    </section>

    <section class="library-map-row glossary-family" id="glossary-compute">
      <div class="library-map-label"><small>02</small><h2>Computation & learning</h2></div>
      <div class="glossary-card-grid">
        <article class="glossary-card" id="nca"><h3>Neural Cellular Automaton (NCA)</h3><p>A differentiable cellular automaton with vector-valued cells and a learned local update rule.</p><div class="links"><a href="https://distill.pub/2020/growing-ca/">Growing NCA</a></div></article>
        <article class="glossary-card" id="recurrence"><h3>Recurrence</h3><p>Reusing state through time so a new state depends on previous state. Recurrence can propagate information, preserve memory, or allocate iterative computation.</p></article>
        <article class="glossary-card" id="attention"><h3>Attention</h3><p>A weighted interaction mechanism in which queries determine how strongly keys and values contribute to an update. It may act inside one pixel or between pixels.</p></article>
        <article class="glossary-card" id="message-passing"><h3>Message passing</h3><p>A graph computation in which nodes aggregate information from connected neighbors and update their state. A regular pixel grid is one possible graph.</p></article>
      </div>
    </section>

    <section class="library-map-row glossary-family" id="glossary-memory">
      <div class="library-map-label"><small>03</small><h2>Memory & coding</h2></div>
      <div class="glossary-card-grid">
        <article class="glossary-card" id="hopfield"><h3>Hopfield memory</h3><p>A recurrent content-addressable memory with attractor dynamics. Stored patterns determine a weight matrix and updates move state toward fixed points.</p><div class="links"><a href="{{ '/experiment/memory/' | relative_url }}">Associative memory</a></div></article>
        <article class="glossary-card" id="hamming"><h3>Hamming(7,4)</h3><p>A block error-correcting code that maps four source bits to seven transmitted bits and corrects any single-bit error within one codeword.</p><div class="links"><a href="{{ '/experiment/reliability/' | relative_url }}">Error correction</a></div></article>
        <article class="glossary-card" id="hdc"><h3>Hyperdimensional Computing / VSA</h3><p>High-dimensional distributed representations with operations such as binding, bundling, permutation, and similarity retrieval. Expansion is derived state, not new source information.</p><div class="links"><a href="{{ '/experiment/hypervector/' | relative_url }}">Hypervector field</a></div></article>
        <article class="glossary-card" id="vq"><h3>Vector quantization</h3><p>Replacing a continuous vector with the index of a codebook entry. Rate accounting includes indices, codebooks, metadata, and residual information required for reconstruction.</p></article>
        <article class="glossary-card" id="rate-utility"><h3>Rate–utility</h3><p>Useful task performance obtained for a declared number of stored or transmitted bits. Rate–distortion substitutes reconstruction distortion for task utility.</p></article>
      </div>
    </section>

    <section class="library-map-row glossary-family" id="glossary-color">
      <div class="library-map-label"><small>04</small><h2>Color & light</h2></div>
      <div class="glossary-card-grid">
        <article class="glossary-card" id="rgb888"><h3>RGB888</h3><p>Three stored 8-bit channels: red, green, and blue. One direct RGB888 pixel contains 24 raw channel bits before other metadata or alpha.</p><div class="links"><a href="{{ '/experiment/color-carrier/' | relative_url }}">Color carrier</a></div></article>
        <article class="glossary-card" id="indexed-color"><h3>Indexed color</h3><p>A small integer at each pixel selects a color from a palette. The index cost and the palette or shared decoder must be counted separately.</p></article>
        <article class="glossary-card" id="colorimetry"><h3>Colorimetry</h3><p>Quantitative description of perceived color under standardized observers and viewing assumptions, commonly using CIE tristimulus values and derived color spaces.</p><div class="links"><a href="{{ '/research/11-color-light-state/' | relative_url }}">Color & light</a></div></article>
        <article class="glossary-card" id="luminance"><h3>Luminance</h3><p>A photometric quantity describing luminous intensity per projected area in a direction. It is not interchangeable with generic brightness or radiometric power.</p></article>
        <article class="glossary-card" id="radiance"><h3>Radiance</h3><p>A radiometric quantity describing radiant power per projected area per solid angle. Ordinary RGB values do not uniquely determine radiance or a source spectrum.</p></article>
        <article class="glossary-card" id="metamerism"><h3>Metamerism</h3><p>Different spectral power distributions can produce the same colorimetric match under specified conditions. Therefore one RGB or XYZ color does not uniquely determine a spectrum.</p></article>
      </div>
    </section>

    <section class="library-map-row glossary-family" id="glossary-geometry">
      <div class="library-map-label"><small>05</small><h2>Geometry & hierarchy</h2></div>
      <div class="glossary-card-grid">
        <article class="glossary-card" id="hyperbolic"><h3>Hyperbolic geometry</h3><p>A negatively curved geometry that can represent branching hierarchies efficiently. Curvature is separate from dimensionality and from HDC.</p></article>
        <article class="glossary-card" id="recursive-field"><h3>Recursive field</h3><p>A field in which an address can contain another active field and a common interface or operator is reused across levels. Ordinary pooling alone is not recursion.</p></article>
        <article class="glossary-card" id="semantic-album"><h3>Semantic Album</h3><p>A higher-order memory in which persistent fields become addressable objects that can be retrieved, compared, updated, combined, or consolidated.</p></article>
      </div>
    </section>

    <section class="library-map-row glossary-family" id="glossary-evaluation">
      <div class="library-map-label"><small>06</small><h2>Evaluation</h2></div>
      <div class="glossary-card-grid">
        <article class="glossary-card" id="ablation"><h3>Ablation</h3><p>A controlled intervention that removes or alters one mechanism while leaving the rest of the system as unchanged as possible.</p><div class="links"><a href="{{ '/research/02-experiment-protocol/' | relative_url }}">Experimental method</a></div></article>
        <article class="glossary-card" id="ood"><h3>OOD / out-of-distribution</h3><p>Evaluation on cases that systematically differ from training, such as longer distances, larger grids, deeper relation chains, or unseen environments.</p></article>
      </div>
    </section>
  </div>
</div>
