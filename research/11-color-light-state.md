---
layout: research
title: Color, Light, and Pixel State
description: Digital color, colorimetry, optical measurements, spatial context, material appearance, and computational semantics as distinct layers of pixel state.
---

# Color, light, and computational pixel state

**Color is not one dimension.** It is also not one unlimited bundle of independent dimensions.

Four layers keep the accounting precise:

<div class="layer-map">
  <div><strong>Stored digital state</strong><span>Bits actually carried by a pixel: RGB channels, alpha, palette index, integer, vector, tensor, token state.</span></div>
  <div><strong>Derived color coordinates</strong><span>Alternative descriptions computed from a color stimulus or stored color: HSL, Lab, LCH, chromaticity, hue angle, ΔE.</span></div>
  <div><strong>Measured physical state</strong><span>Properties of emitted, reflected, transmitted, or incident light: spectrum, radiance, irradiance, polarization, direction.</span></div>
  <div><strong>Assigned computational meaning</strong><span>Semantics deliberately encoded into finite state: probability, confidence, class, memory address, relation, instruction, uncertainty.</span></div>
</div>

A value can belong to more than one layer only when the representation explicitly stores it. An RGB triplet does not automatically contain an independently stored hue, Lab coordinate, wavelength, polarization state, material roughness, and confidence value.

<div class="warning-box"><strong>Information rule.</strong> A deterministic transform changes coordinates, not independent source information. RGB → HSL → Lab can produce many useful measurements while still describing overlapping information. New carrier capacity exists only when additional state is actually stored or supplied as side information.</div>

## Binary is the minimum carrier

Black and white can encode a one-bit alphabet:

- black → `0`
- white → `1`

That establishes exact packing, decoding, corruption, and recovery with the smallest possible visible state.

Color increases the finite alphabet. RGB888 stores three 8-bit channels, so one address has 24 stored bits and up to `2^24` codewords before alpha or metadata. That is a larger digital state space, not a continuous physical spectrum.

A color may also be assigned a computational interpretation. For example, an experiment could define green as high confidence and red as low confidence. The confidence is then **semantic meaning assigned to the color code**, not an intrinsic physical property of green or red.

## Perceptual color properties

CIE color science distinguishes several related perceptual attributes rather than treating them as synonyms.

<table class="property-table">
<thead><tr><th>Property</th><th>Meaning</th><th>MPF status</th></tr></thead>
<tbody>
<tr><td>Hue</td><td>The attribute associated with perceived families such as red, yellow, green, blue, and their mixtures.</td><td>Derived / perceived</td></tr>
<tr><td>Brightness</td><td>How much light an area appears to emit or reflect perceptually. It is not identical to a stored RGB channel or physical radiance.</td><td>Perceived</td></tr>
<tr><td>Lightness</td><td>Brightness judged relative to a similarly illuminated white or highly transmitting reference. CIE L* is a standardized correlate.</td><td>Derived / perceived</td></tr>
<tr><td>Colourfulness</td><td>How strongly chromatic a perceived area appears.</td><td>Perceived</td></tr>
<tr><td>Saturation</td><td>Colourfulness judged relative to the area’s brightness.</td><td>Perceived / model-dependent coordinate</td></tr>
<tr><td>Chroma</td><td>Colourfulness judged relative to the brightness of a similarly illuminated neutral reference; in spaces such as LCH it is represented as radial distance from the neutral axis.</td><td>Derived / perceived</td></tr>
<tr><td>Achromaticness</td><td>Degree to which a stimulus is treated as neutral or lacking chromatic content. A numeric value requires a specified appearance model or operational definition.</td><td>Model-dependent</td></tr>
<tr><td>Chromaticness</td><td>Degree to which a stimulus is treated as chromatic rather than neutral. It is not a single universal standardized coordinate.</td><td>Model-dependent</td></tr>
<tr><td>Hue angle</td><td>An angular coordinate around a neutral axis in cylindrical color spaces such as LCH or OKLCH.</td><td>Derived coordinate</td></tr>
<tr><td>Magnitude</td><td>A norm or radial magnitude only after a coordinate system is chosen; chroma is one useful example.</td><td>Derived coordinate</td></tr>
<tr><td>Color difference</td><td>A numerical distance between two color specifications under a defined metric. ΔE formulae are designed to better track perceived differences than raw XYZ distance.</td><td>Relational measurement</td></tr>
</tbody>
</table>

## Chromaticity and colorimetry

Colorimetry reduces a color stimulus under defined observer and viewing assumptions to standardized coordinates. A physical spectrum can contain far more samples than three, while human standard colorimetry commonly represents the resulting color stimulus with three tristimulus values.

<table class="property-table">
<thead><tr><th>Property</th><th>Meaning</th><th>MPF status</th></tr></thead>
<tbody>
<tr><td>Chromaticity</td><td>Color-stimulus property represented by chromaticity coordinates, or by dominant/complementary wavelength together with purity. It removes an overall intensity-like degree of freedom from tristimulus description.</td><td>Derived colorimetric coordinate</td></tr>
<tr><td>Dominant wavelength</td><td>Wavelength of a monochromatic stimulus that can mix with a specified achromatic stimulus to match the considered chromaticity. It is not the statement that the original light contains only that wavelength.</td><td>Derived colorimetric descriptor</td></tr>
<tr><td>Complementary wavelength</td><td>For stimuli without an ordinary dominant wavelength, a monochromatic stimulus that mixes with the considered color to reach the specified achromatic reference.</td><td>Derived colorimetric descriptor</td></tr>
<tr><td>Excitation purity</td><td>Relative distance from the chosen achromatic point toward the spectrum locus in a CIE chromaticity diagram.</td><td>Derived colorimetric descriptor</td></tr>
<tr><td>White point</td><td>The achromatic reference represented as white for a color space, display, illuminant, or viewing condition.</td><td>Reference / metadata</td></tr>
<tr><td>Color temperature</td><td>Temperature of a Planckian radiator whose chromaticity matches the source being described.</td><td>Derived source descriptor</td></tr>
<tr><td>Correlated color temperature</td><td>Temperature associated with the nearby Planckian chromaticity used to describe a non-Planckian source. It is a compact source descriptor, not a full spectrum.</td><td>Derived source descriptor</td></tr>
<tr><td>X, Y, Z</td><td>CIE tristimulus values calculated from a spectral distribution and standard color-matching functions. Y also carries luminance-related weighting in the standard system.</td><td>Derived or stored 3-coordinate state</td></tr>
<tr><td>x, y</td><td>CIE 1931 chromaticity coordinates derived by normalizing XYZ; the third normalized coordinate is redundant because the three sum to one.</td><td>Derived coordinate</td></tr>
<tr><td>u′, v′</td><td>CIE 1976 uniform-chromaticity-scale coordinates designed to improve spacing relative to the older x,y diagram.</td><td>Derived coordinate</td></tr>
<tr><td>CIELAB L*</td><td>Approximate perceptual lightness relative to a reference white.</td><td>Derived coordinate</td></tr>
<tr><td>CIELAB a*</td><td>Opponent-like axis approximately spanning green to red.</td><td>Derived coordinate</td></tr>
<tr><td>CIELAB b*</td><td>Opponent-like axis approximately spanning blue to yellow.</td><td>Derived coordinate</td></tr>
<tr><td>CIELUV L*</td><td>Approximate lightness coordinate in CIELUV.</td><td>Derived coordinate</td></tr>
<tr><td>CIELUV u*, v*</td><td>Chromatic opponent coordinates derived from XYZ and a reference white in the CIELUV system.</td><td>Derived coordinates</td></tr>
<tr><td>ΔE</td><td>Family of color-difference measures. The formula must be named because ΔE76, CIE94, CIEDE2000, and other metrics are not interchangeable.</td><td>Relational measurement</td></tr>
</tbody>
</table>

## Digital color and numerical encodings

Digital color is finite. The bit cost depends on the encoding and precision actually stored.

<table class="property-table">
<thead><tr><th>Property</th><th>Meaning</th><th>MPF status</th></tr></thead>
<tbody>
<tr><td>Red / Green / Blue</td><td>Three component values in an RGB color space. Their physical meaning depends on the selected primaries, white point, and transfer function.</td><td>Stored or derived</td></tr>
<tr><td>Alpha / opacity</td><td>Coverage or opacity component used during compositing. It is separate from the three color components.</td><td>Stored state</td></tr>
<tr><td>Hexadecimal value</td><td>Textual integer notation commonly serializing RGB or RGBA channel values, such as `#2CA791`.</td><td>Encoding / serialization</td></tr>
<tr><td>Integer value</td><td>A packed numerical representation of channel bits. Endianness and channel order must be specified.</td><td>Encoding / serialization</td></tr>
<tr><td>Bit depth</td><td>Total or per-pixel precision allocated to a representation.</td><td>Storage cost</td></tr>
<tr><td>Channel depth</td><td>Precision allocated to an individual channel, such as 8, 10, 12, or 16 bits.</td><td>Storage cost</td></tr>
<tr><td>Color-space identifier</td><td>Metadata naming the coordinate system and assumptions needed to interpret numeric channels correctly.</td><td>Metadata / side information</td></tr>
<tr><td>Gamma / transfer function</td><td>Nonlinear mapping between encoded channel values and linear-light quantities. “Gamma” is often used loosely; real transfer functions can be piecewise or otherwise non-power-law.</td><td>Interpretation metadata / transform</td></tr>
<tr><td>Linear RGB</td><td>RGB values after inverse transfer-function decoding, where channel values are proportional to linear-light primary contributions.</td><td>Derived or stored coordinates</td></tr>
<tr><td>HSL</td><td>Cylindrical re-expression of sRGB-oriented coordinates using hue, saturation, and lightness. HSL lightness is not CIE L*.</td><td>Derived coordinates</td></tr>
<tr><td>HSV / HSB</td><td>Hue, saturation, and value/brightness coordinate model useful for interfaces and image operations; its “brightness” is not CIE perceptual brightness.</td><td>Derived coordinates</td></tr>
<tr><td>HWB</td><td>Hue, whiteness, and blackness representation related to sRGB.</td><td>Derived coordinates</td></tr>
<tr><td>Lab</td><td>Usually CIELAB unless another Lab-like model is named. Requires reference-white assumptions.</td><td>Derived coordinates</td></tr>
<tr><td>LCH</td><td>Cylindrical form of Lab: lightness, chroma, hue angle.</td><td>Derived coordinates</td></tr>
<tr><td>OKLab</td><td>Lab-like perceptual color space designed for improved perceptual behavior in modern image and display workflows.</td><td>Derived coordinates</td></tr>
<tr><td>OKLCH</td><td>Cylindrical form of OKLab: lightness, chroma, hue.</td><td>Derived coordinates</td></tr>
<tr><td>XYZ</td><td>Device-independent tristimulus coordinate system used as a central colorimetric representation.</td><td>Derived or stored coordinates</td></tr>
<tr><td>YUV / Y′CbCr</td><td>Luma/chroma-family encodings used in video systems. YUV and digital Y′CbCr are related but not identical terms; coefficients and range must be specified.</td><td>Derived or stored coordinates</td></tr>
<tr><td>CMYK</td><td>Subtractive device-oriented coordinates for cyan, magenta, yellow, and black colorants. Appearance depends on printing process and profile.</td><td>Stored device coordinates</td></tr>
<tr><td>ICC profile / gamut context</td><td>Side information describing device/color-space behavior and transforms. Gamut identifies the set of colors a representation or device can encode or reproduce.</td><td>Metadata / side information</td></tr>
</tbody>
</table>

## Optical and photon-related properties

The Pixel Photon analogy becomes most useful when the physical quantities remain physically defined. Ordinary RGB display state should not be relabeled as wavelength, photon energy, polarization, or coherence unless those quantities are actually measured or modeled.

<table class="property-table">
<thead><tr><th>Property</th><th>Meaning</th><th>MPF status</th></tr></thead>
<tbody>
<tr><td>Wavelength</td><td>Spatial period associated with a monochromatic electromagnetic wave in a specified medium. Broadband light requires a spectrum rather than one wavelength.</td><td>Measured / modeled physical state</td></tr>
<tr><td>Frequency</td><td>Temporal oscillation rate of the electromagnetic field. In vacuum it is related to wavelength by the speed of light.</td><td>Measured / modeled physical state</td></tr>
<tr><td>Photon energy</td><td>Energy of a photon at frequency ν, proportional to frequency through Planck’s constant.</td><td>Derived physical quantity</td></tr>
<tr><td>Spectral power distribution</td><td>Radiometric or photometric power-like quantity distributed over wavelength or frequency. It preserves spectral structure that three-channel color coordinates discard.</td><td>Measured high-dimensional signal</td></tr>
<tr><td>Spectral bandwidth</td><td>Width of a spectral feature under a stated convention such as full width at half maximum.</td><td>Derived spectral measurement</td></tr>
<tr><td>Intensity</td><td>Ambiguous informal term. Rigorous work should name radiant intensity, irradiance, radiance, luminous intensity, or another defined quantity.</td><td>Avoid without definition</td></tr>
<tr><td>Radiant intensity</td><td>Radiant flux per unit solid angle in a specified direction.</td><td>Measured physical quantity</td></tr>
<tr><td>Radiance</td><td>Directional radiant flux density per projected area and solid angle; crucial for describing how much optical power travels along a direction.</td><td>Measured physical quantity</td></tr>
<tr><td>Irradiance</td><td>Radiant flux arriving per unit area of a surface.</td><td>Measured physical quantity</td></tr>
<tr><td>Luminance</td><td>Photometrically weighted directional quantity corresponding to radiance under the human luminous-efficiency weighting.</td><td>Measured photometric quantity</td></tr>
<tr><td>Luminous intensity</td><td>Photometrically weighted luminous flux per unit solid angle.</td><td>Measured photometric quantity</td></tr>
<tr><td>Reflectance spectrum</td><td>Fraction of incident radiant flux reflected as a function of wavelength, with geometry and polarization conditions potentially relevant.</td><td>Measured material property</td></tr>
<tr><td>Transmittance spectrum</td><td>Fraction of incident radiant flux transmitted as a function of wavelength.</td><td>Measured material property</td></tr>
<tr><td>Absorption spectrum</td><td>Wavelength-dependent fraction or coefficient describing optical energy absorbed by a material.</td><td>Measured material property</td></tr>
<tr><td>Emission spectrum</td><td>Spectral distribution of radiation emitted by a source or material.</td><td>Measured source/material property</td></tr>
<tr><td>Fluorescence</td><td>Emission produced after optical excitation, commonly at different wavelengths and with characteristic temporal behavior.</td><td>Measured material process</td></tr>
<tr><td>Polarization</td><td>State describing transverse electromagnetic-field orientation and phase relationships. Stokes parameters provide a measurable representation for partially polarized light.</td><td>Measured physical state</td></tr>
<tr><td>Coherence</td><td>Degree of stable phase correlation across time or space. It is a property of the optical field/source, not ordinary RGB color.</td><td>Measured/modelled source property</td></tr>
<tr><td>Direction / illumination angle</td><td>Propagation and incidence geometry. Direction can strongly change appearance for glossy, rough, metallic, translucent, or structured surfaces.</td><td>Context / measured geometry</td></tr>
</tbody>
</table>

## Transparency and compositing

<table class="property-table">
<thead><tr><th>Property</th><th>Meaning</th><th>MPF status</th></tr></thead>
<tbody>
<tr><td>Opacity / alpha</td><td>Finite value controlling coverage or contribution during compositing; typically normalized from transparent to opaque.</td><td>Stored state</td></tr>
<tr><td>Premultiplied alpha</td><td>Representation where color components are stored after multiplication by alpha, simplifying and stabilizing many compositing operations.</td><td>Stored encoding choice</td></tr>
<tr><td>Transparency</td><td>Visible result of less-than-opaque contribution. It depends on alpha and the compositing context.</td><td>Derived appearance</td></tr>
<tr><td>Blend mode</td><td>Rule controlling how source and backdrop colors interact where they overlap, such as multiply, screen, hue, or luminosity.</td><td>Operation / metadata</td></tr>
<tr><td>Compositing order</td><td>Sequence in which layers are combined. Noncommutative operations make order part of the computation.</td><td>Structural state / operation</td></tr>
<tr><td>Foreground/background relationship</td><td>Source and backdrop roles used by compositing and perception. The same stored color can produce different visible output against different backgrounds.</td><td>Contextual relation</td></tr>
</tbody>
</table>

## Spatial properties

Once color is attached to an address, geometry becomes part of the computational object.

<table class="property-table">
<thead><tr><th>Property</th><th>Meaning</th><th>MPF status</th></tr></thead>
<tbody>
<tr><td>X / Y position</td><td>Planar address coordinates.</td><td>Address</td></tr>
<tr><td>Z / depth position</td><td>Depth coordinate or layer ordering when the representation includes depth.</td><td>Address / structural state</td></tr>
<tr><td>Neighborhood</td><td>Defined set of nearby or connected addresses available to an operation.</td><td>Topology</td></tr>
<tr><td>Distance from other colors</td><td>Spatial distance, color-space distance, or both; the metric must be named.</td><td>Relational measurement</td></tr>
<tr><td>Direction relative to neighbors</td><td>Orientation from one address to another, useful for directional filters and message passing.</td><td>Relational geometry</td></tr>
<tr><td>Gradient</td><td>Rate and direction of change of a scalar or vector-valued field over position.</td><td>Derived spatial feature</td></tr>
<tr><td>Edge membership</td><td>Whether an address lies on a detected boundary under a defined operator.</td><td>Derived / assigned feature</td></tr>
<tr><td>Region membership</td><td>Assignment of an address to a connected or semantically defined region.</td><td>Derived / assigned relation</td></tr>
<tr><td>Texture</td><td>Spatial statistics or repeated local structure over neighborhoods and scales.</td><td>Derived spatial structure</td></tr>
<tr><td>Spatial frequency</td><td>Rate of spatial variation, often represented through Fourier or filter-bank components.</td><td>Derived measurement</td></tr>
<tr><td>Scale</td><td>Resolution or receptive-field level at which a feature is represented or measured.</td><td>Structural state / metadata</td></tr>
<tr><td>Pattern</td><td>Structured arrangement recognized or generated across multiple addresses.</td><td>Derived or assigned structure</td></tr>
<tr><td>Symmetry</td><td>Invariance or approximate invariance under transformations such as reflection or rotation.</td><td>Derived relation</td></tr>
<tr><td>Repetition</td><td>Repeated motifs or states across positions.</td><td>Derived relation</td></tr>
<tr><td>Hierarchy</td><td>Parent/child, part/whole, or multiscale organization among regions or states.</td><td>Structural relation</td></tr>
<tr><td>Local contrast</td><td>Difference between an address/region and a nearby reference neighborhood.</td><td>Contextual measurement</td></tr>
<tr><td>Global contrast</td><td>Difference measured against a field-wide or image-wide reference.</td><td>Contextual measurement</td></tr>
</tbody>
</table>

## Temporal properties

A changing field adds state transitions rather than merely adding more channels to one static pixel.

<table class="property-table">
<thead><tr><th>Property</th><th>Meaning</th><th>MPF status</th></tr></thead>
<tbody>
<tr><td>Time</td><td>Absolute or relative temporal coordinate associated with a state.</td><td>Address / metadata</td></tr>
<tr><td>Duration</td><td>Interval for which a state, event, or transition persists.</td><td>Derived temporal measurement</td></tr>
<tr><td>Rate of change</td><td>Change in a variable per unit time.</td><td>Derived temporal measurement</td></tr>
<tr><td>Hue velocity</td><td>Rate of hue-coordinate change; angular wraparound and color space must be specified.</td><td>Derived temporal feature</td></tr>
<tr><td>Brightness velocity</td><td>Rate of change of a defined brightness or luminance-related quantity.</td><td>Derived temporal feature</td></tr>
<tr><td>Saturation velocity</td><td>Rate of change of a chosen saturation coordinate.</td><td>Derived temporal feature</td></tr>
<tr><td>Oscillation frequency</td><td>Cycles per unit time of a repeated state variation.</td><td>Derived temporal feature</td></tr>
<tr><td>Phase</td><td>Relative position within an oscillatory cycle. Optical phase and abstract computational phase are different concepts and must not be conflated.</td><td>Measured or assigned, depending on system</td></tr>
<tr><td>Transition function</td><td>Rule mapping the current field state to the next state.</td><td>Operation</td></tr>
<tr><td>Persistence</td><td>Degree to which information remains available across time, interference, or updates.</td><td>Measured memory property</td></tr>
<tr><td>Temporal sequence</td><td>Ordered series of states or events.</td><td>Structured state</td></tr>
<tr><td>Previous state</td><td>Stored or reconstructable state at time t−1.</td><td>Memory state</td></tr>
<tr><td>Next state</td><td>Predicted, prescribed, or computed state at time t+1.</td><td>Output / future state</td></tr>
</tbody>
</table>

## Relational and contextual properties

<table class="property-table">
<thead><tr><th>Property</th><th>Meaning</th><th>MPF status</th></tr></thead>
<tbody>
<tr><td>Contrast</td><td>Difference between a value and a reference, locally or globally.</td><td>Relational measurement</td></tr>
<tr><td>Similarity</td><td>Closeness under a specified metric or learned function.</td><td>Relational measurement</td></tr>
<tr><td>Complementarity</td><td>A relation defined by a color model, opponent structure, or task-specific rule.</td><td>Derived / assigned relation</td></tr>
<tr><td>Opponent relationship</td><td>Representation of chromatic directions along opposing axes, as in red–green or blue–yellow-like coordinates.</td><td>Derived relation</td></tr>
<tr><td>Distance in color space</td><td>Numerical separation under a named space and metric. Raw Euclidean RGB, ΔE2000, and OKLab distance answer different questions.</td><td>Relational measurement</td></tr>
<tr><td>Relative luminance</td><td>Luminance or luminance-like quantity normalized or compared against a reference.</td><td>Derived measurement</td></tr>
<tr><td>Relative saturation</td><td>Saturation compared with another stimulus or reference under a stated model.</td><td>Derived measurement</td></tr>
<tr><td>Relative hue</td><td>Angular or categorical hue difference relative to another state.</td><td>Derived measurement</td></tr>
<tr><td>Local rank</td><td>Ordering of a value among neighboring values.</td><td>Derived relation</td></tr>
<tr><td>Cluster membership</td><td>Assignment produced by a clustering rule or learned representation.</td><td>Derived / assigned relation</td></tr>
<tr><td>Neighborhood density</td><td>Count or weighted concentration of relevant neighbors within a defined region or graph.</td><td>Derived topology feature</td></tr>
<tr><td>Figure/ground role</td><td>Perceptual or computational assignment of a region as foreground object versus background.</td><td>Contextual / assigned role</td></tr>
<tr><td>Adaptation state</td><td>Visual-system state produced by prior and surrounding stimulation; it changes color appearance without changing stored RGB values.</td><td>Observer/context state</td></tr>
</tbody>
</table>

## Material and surface properties

Real objects require illumination, viewing geometry, and material response. These properties are not recoverable uniquely from a single RGB pixel.

<table class="property-table">
<thead><tr><th>Property</th><th>Meaning</th><th>MPF status</th></tr></thead>
<tbody>
<tr><td>Gloss</td><td>Appearance associated with specular reflection; standardized gloss measurements compare reflected light under defined geometry.</td><td>Measured appearance property</td></tr>
<tr><td>Matte-ness</td><td>Low-gloss appearance dominated by diffuse rather than concentrated specular reflection; requires an operational metric if encoded numerically.</td><td>Derived / assigned appearance property</td></tr>
<tr><td>Specularity</td><td>Strength or structure of mirror-like reflection.</td><td>Measured/modelled material property</td></tr>
<tr><td>Diffuse reflectance</td><td>Reflected component distributed broadly rather than concentrated near the specular direction.</td><td>Measured/modelled material property</td></tr>
<tr><td>Roughness</td><td>Surface microgeometry statistic controlling scattering and highlight shape; rendering models may use a model-specific roughness parameter.</td><td>Measured/modelled material property</td></tr>
<tr><td>Metallicity</td><td>Rendering/material classification describing conductor-like versus dielectric-like optical response. A scalar “metallic” value is model-specific.</td><td>Assigned/modelled material parameter</td></tr>
<tr><td>Subsurface scattering</td><td>Light transport entering a material, scattering internally, and exiting elsewhere.</td><td>Measured/modelled transport property</td></tr>
<tr><td>Iridescence</td><td>Color that changes strongly with illumination/viewing geometry, often through interference or structured material effects.</td><td>Measured/modelled material effect</td></tr>
<tr><td>Pearlescence</td><td>Angle-dependent appearance produced by layered or particulate scattering structures; operational definition depends on measurement model.</td><td>Measured/modelled appearance effect</td></tr>
<tr><td>Fluorescence</td><td>Absorption followed by re-emission, producing appearance that depends on excitation spectrum as well as ordinary reflectance.</td><td>Measured material process</td></tr>
<tr><td>Transparency</td><td>Ability to transmit light while preserving substantial image information through the material.</td><td>Measured/modelled material property</td></tr>
<tr><td>Translucency</td><td>Transmission with internal scattering that reduces direct image preservation.</td><td>Measured/modelled material property</td></tr>
<tr><td>Opacity</td><td>Resistance to transmission in a material context; distinct from a purely graphical alpha channel unless explicitly modeled that way.</td><td>Measured/modelled material property</td></tr>
</tbody>
</table>

## Computational properties assigned to a pixel

Any finite state can carry a computational interpretation when an encoder and decoder define the mapping.

<table class="property-table">
<thead><tr><th>Assigned property</th><th>Meaning</th><th>Accounting</th></tr></thead>
<tbody>
<tr><td>Class</td><td>Discrete category label.</td><td>Count class alphabet or code bits.</td></tr>
<tr><td>Token ID</td><td>Index into a vocabulary or codebook.</td><td>Count index bits plus codebook if not shared.</td></tr>
<tr><td>Integer</td><td>Signed or unsigned finite whole-number state.</td><td>Count width and signed encoding.</td></tr>
<tr><td>Float</td><td>Finite-precision real-valued approximation.</td><td>Count fp32/fp16/bfloat/quantized width.</td></tr>
<tr><td>Probability</td><td>Numerical value interpreted as normalized likelihood or predictive probability.</td><td>Count precision; calibration must be measured separately.</td></tr>
<tr><td>Confidence</td><td>Model- or system-specific certainty score.</td><td>Count precision; do not equate automatically with probability.</td></tr>
<tr><td>Vector index</td><td>Reference to an entry in a vector table or codebook.</td><td>Count index and referenced table.</td></tr>
<tr><td>Embedding coordinate</td><td>One or more learned representation values.</td><td>Count vector precision and generating model where relevant.</td></tr>
<tr><td>Semantic category</td><td>Human- or model-defined concept label.</td><td>Count encoding and label ontology if required.</td></tr>
<tr><td>State</td><td>Generic finite dynamical variable.</td><td>Count all state components.</td></tr>
<tr><td>Activation</td><td>Neural-unit or feature response.</td><td>Count precision and producing parameters.</td></tr>
<tr><td>Attention weight</td><td>Coefficient controlling weighted information aggregation.</td><td>Count precision or recomputation cost and model parameters.</td></tr>
<tr><td>Memory address</td><td>Reference identifying a storage location or key.</td><td>Count address width and memory system.</td></tr>
<tr><td>Relation type</td><td>Label describing an edge or relationship.</td><td>Count relation alphabet and topology.</td></tr>
<tr><td>Hierarchy level</td><td>Depth or scale assignment in a hierarchy.</td><td>Count level state and hierarchy description.</td></tr>
<tr><td>Time</td><td>Timestamp, step index, phase, or temporal code.</td><td>Count temporal precision/range.</td></tr>
<tr><td>Agent identity</td><td>Identifier for an actor or subsystem.</td><td>Count identity alphabet and registry if needed.</td></tr>
<tr><td>Instruction</td><td>Opcode, action, routing command, or program fragment.</td><td>Count instruction code and interpreter.</td></tr>
<tr><td>Error state</td><td>Flags, syndrome, residual, or diagnostic value.</td><td>Count diagnostic bits and decoding logic.</td></tr>
<tr><td>Uncertainty</td><td>Variance, entropy, interval width, distribution parameters, or another explicit uncertainty representation.</td><td>Count the chosen representation; uncertainty is not inherent in color.</td></tr>
<tr><td>Logical value</td><td>Boolean, ternary, fuzzy, or other logical state.</td><td>Count logical alphabet and semantics.</td></tr>
<tr><td>Pointer / reference</td><td>Index or address referring to another computational object.</td><td>Count pointer width plus referenced storage.</td></tr>
<tr><td>Hash</td><td>Fixed-width digest or fragment used for identification, integrity, routing, or lookup.</td><td>Count stored hash bits; collision properties depend on hash design and width.</td></tr>
<tr><td>Checksum</td><td>Error-detection value derived from other data.</td><td>Count checksum bits in addition to protected payload.</td></tr>
<tr><td>Compressed payload</td><td>Bit string interpreted by a decoder as a larger structured object.</td><td>Count payload plus decoder/codebook/metadata under the declared accounting rule.</td></tr>
</tbody>
</table>

## Neural-network parallel

A useful architectural parallel is:

<div class="parallel-schema">
  <div class="schema-label">TEXT SYSTEM</div><div><strong>Raw text</strong>source symbols</div><div><strong>Tokenizer / codec</strong>finite IDs or pieces</div><div><strong>Embeddings + network</strong>distributed computation</div><div><strong>Decoded output</strong>tokens, labels, actions</div>
  <div class="schema-label">PIXEL FIELD</div><div><strong>Source object</strong>bits, color, measurements</div><div><strong>Pixel encoder / schema</strong>finite local state</div><div><strong>Field operator</strong>local, graph, recurrent, attention, memory</div><div><strong>Decoded output</strong>image, data, decision, action</div>
</div>

The parallel stops at the mechanism boundary. A tokenizer normally segments or quantizes input into a finite vocabulary. A pixel encoding can be tokenizer-like when it performs a comparable discrete mapping, but a raw RGB tuple or fp32 vector is not automatically a token.

A pixel becomes **self-similar to a larger network** only when the internal object repeats meaningful structure from the larger system—for example a micro-network, internal token set, recurrent cell, or recursively reused subfield operator. An ordinary scalar pixel or standard neuron is not a smaller copy of the whole network.

## Technical section: equations and information accounting

### Color-space transforms do not create independent information

If a stored RGB vector is transformed deterministically,

```text
c_RGB  →  c_XYZ  →  c_Lab  →  c_LCH
```

then the coordinate count may change in presentation, but the transformed values are functions of the original color plus required metadata such as the RGB color space, transfer function, white point, and adaptation assumptions.

For Lab/LCH-style cylindrical conversion:

```text
C = sqrt(a² + b²)
h = atan2(b, a)
```

`C` and `h` reorganize the same two chromatic coordinates `a` and `b`; they are not two additional independent channels.

### Photon energy

For a photon of frequency `ν`:

```text
E = hν
```

In vacuum, frequency and wavelength are related by:

```text
c = λν
E = hc / λ
```

A broadband source requires a distribution across wavelengths or frequencies. A single RGB display code therefore does not uniquely determine one wavelength or one photon energy.

### Tristimulus reduction and metamerism

CIE XYZ values are calculated by integrating a spectral stimulus against standard color-matching functions. Different spectral distributions can map to the same or nearly the same tristimulus coordinates. Those spectra are metamers under the specified observation conditions.

That many-to-one mapping is why RGB/XYZ color does not contain a unique reflectance spectrum, emission spectrum, wavelength distribution, polarization state, or material identity.

### Alpha compositing

For source-over compositing with premultiplied colors:

```text
c_out = c_source + c_backdrop × (1 - α_source)
α_out = α_source + α_backdrop × (1 - α_source)
```

The output depends on both source and backdrop. Foreground/background relation and compositing order therefore participate causally in the visible result.

### Complete computational ledger

A multidimensional pixel field should count all finite resources that are required to interpret or reproduce its state:

```text
B_system
= B_carrier
+ B_hidden
+ B_metadata
+ B_codebook
+ B_topology
+ B_interpreter
+ B_parameters,amortized
```

Derived coordinates such as hue, Lab, luminance, or ΔE add stored bits only when they are cached or transmitted instead of recomputed.

## Primary technical references

- [CIE 015:2018 Colorimetry, 4th Edition](https://www.cie.co.at/publications/colorimetry-4th-edition)
- [ISO/CIE 11664-3:2019 — CIE tristimulus values](https://www.cie.co.at/publications/colorimetry-part-3-cie-tristimulus-values-2)
- [ISO/CIE 11664-5:2023 — CIELUV and u′,v′](https://www.cie.co.at/publications/colorimetry-part-5-cie-1976-luv-colour-space-and-u-v-uniform-chromaticity-scale-1)
- [ISO/CIE 11664-6:2022 — CIEDE2000](https://www.cie.co.at/publications/colorimetry-part-6-ciede2000-colour-difference-formula-1)
- [CIE International Lighting Vocabulary](https://www.cie.co.at/e-ilv)
- [W3C CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/)
- [W3C Compositing and Blending Level 1](https://www.w3.org/TR/compositing-1/)
- [NIST CIE Fundamentals for Color Measurements](https://www.nist.gov/publications/cie-fundamentals-color-measurements-0)
- [NIST Principles of Optical Radiometry and Measurement Uncertainty](https://www.nist.gov/publications/principles-optical-radiometry-and-measurement-uncertainty)
- [NIST Optical Polarization Metrology](https://www.nist.gov/programs-projects/optical-polarization-metrology)
- [NIST Fundamental Physical Constants](https://physics.nist.gov/cuu/Constants/introduction.html)
