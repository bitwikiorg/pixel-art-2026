(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ColorCarrier = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const MAX24 = 0xFFFFFF;
  const D65 = { x: 0.95047, y: 1.0, z: 1.08883 };

  function clamp01(v) { return Math.min(1, Math.max(0, v)); }
  function round(v, n = 4) { const p = 10 ** n; return Math.round(v * p) / p; }

  function parseHex(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
    if (!m) throw new Error("Expected a six-digit RGB hex color");
    const n = Number.parseInt(m[1], 16);
    return { r: (n >>> 16) & 255, g: (n >>> 8) & 255, b: n & 255 };
  }

  function rgbToHex(rgb) {
    return "#" + [rgb.r, rgb.g, rgb.b].map(v => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  function rgbToInt(rgb) { return ((rgb.r << 16) | (rgb.g << 8) | rgb.b) >>> 0; }
  function byteBits(v) { return (v & 255).toString(2).padStart(8, "0"); }
  function rgbBits(rgb) { return byteBits(rgb.r) + byteBits(rgb.g) + byteBits(rgb.b); }

  function srgbChannelToLinear(byte) {
    const c = clamp01(byte / 255);
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }

  function linearRgb(rgb) {
    return {
      r: srgbChannelToLinear(rgb.r),
      g: srgbChannelToLinear(rgb.g),
      b: srgbChannelToLinear(rgb.b)
    };
  }

  function rgbToHsl(rgb) {
    const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const l = (max + min) / 2;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    if (d !== 0) {
      if (max === r) h = 60 * (((g - b) / d) % 6);
      else if (max === g) h = 60 * (((b - r) / d) + 2);
      else h = 60 * (((r - g) / d) + 4);
    }
    if (h < 0) h += 360;
    return { h, s, l };
  }

  function rgbToHsv(rgb) {
    const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
      if (max === r) h = 60 * (((g - b) / d) % 6);
      else if (max === g) h = 60 * (((b - r) / d) + 2);
      else h = 60 * (((r - g) / d) + 4);
    }
    if (h < 0) h += 360;
    return { h, s: max === 0 ? 0 : d / max, v: max };
  }

  function rgbToXyz(rgb) {
    const c = linearRgb(rgb);
    return {
      x: 0.4124564 * c.r + 0.3575761 * c.g + 0.1804375 * c.b,
      y: 0.2126729 * c.r + 0.7151522 * c.g + 0.0721750 * c.b,
      z: 0.0193339 * c.r + 0.1191920 * c.g + 0.9503041 * c.b
    };
  }

  function labF(t) {
    const delta = 6 / 29;
    return t > delta ** 3 ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29;
  }

  function xyzToLab(xyz) {
    const fx = labF(xyz.x / D65.x);
    const fy = labF(xyz.y / D65.y);
    const fz = labF(xyz.z / D65.z);
    return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
  }

  function rgbToLab(rgb) { return xyzToLab(rgbToXyz(rgb)); }

  function rgbToOklab(rgb) {
    const c = linearRgb(rgb);
    const l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
    const m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
    const s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
    const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
    return {
      L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
      a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
      b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    };
  }

  function oklabToOklch(lab) {
    const C = Math.hypot(lab.a, lab.b);
    let h = Math.atan2(lab.b, lab.a) * 180 / Math.PI;
    if (h < 0) h += 360;
    if (C < 1e-12) h = 0;
    return { L: lab.L, C, h };
  }

  function relativeLuminance(rgb) { return rgbToXyz(rgb).y; }
  function deltaE76(a, b) { return Math.hypot(a.L - b.L, a.a - b.a, a.b - b.b); }
  function oklabDistance(a, b) { return Math.hypot(a.L - b.L, a.a - b.a, a.b - b.b); }

  function contrastRatio(rgbA, rgbB) {
    const a = relativeLuminance(rgbA), b = relativeLuminance(rgbB);
    const hi = Math.max(a, b), lo = Math.min(a, b);
    return (hi + 0.05) / (lo + 0.05);
  }

  function assignedReadings(rgb) {
    const n = rgbToInt(rgb);
    return {
      uint24: n,
      class16: n % 16,
      token8192: n % 8192,
      normalized: n / MAX24
    };
  }

  function paletteAccounting(pixelCount, paletteSize = 4, paletteEntryBits = 24) {
    const count = Math.max(1, Math.floor(Number(pixelCount) || 1));
    const indexBits = Math.ceil(Math.log2(paletteSize));
    const paletteBits = paletteSize * paletteEntryBits;
    const indexedBits = count * indexBits + paletteBits;
    const directBits = count * paletteEntryBits;
    return {
      pixelCount: count,
      indexBits,
      paletteBits,
      indexedBits,
      directBits,
      indexedBitsPerPixel: indexedBits / count,
      directBitsPerPixel: paletteEntryBits,
      savesBits: directBits - indexedBits
    };
  }

  function summarizeColor(hex) {
    const rgb = parseHex(hex);
    const xyz = rgbToXyz(rgb);
    const lab = xyzToLab(xyz);
    const oklab = rgbToOklab(rgb);
    const oklch = oklabToOklch(oklab);
    return {
      rgb,
      hex: rgbToHex(rgb),
      int: rgbToInt(rgb),
      bits: rgbBits(rgb),
      linear: linearRgb(rgb),
      hsl: rgbToHsl(rgb),
      hsv: rgbToHsv(rgb),
      xyz,
      lab,
      oklab,
      oklch,
      luminance: xyz.y,
      assigned: assignedReadings(rgb)
    };
  }

  function fmt(v, n = 4) { return round(v, n).toFixed(n); }
  function pct(v) { return (v * 100).toFixed(1) + "%"; }

  function initBrowser() {
    if (typeof document === "undefined") return;
    const lab = document.querySelector("[data-color-carrier]");
    if (!lab) return;

    const colorA = document.getElementById("colorA");
    const colorB = document.getElementById("colorB");
    const paletteCount = document.getElementById("palettePixelCount");
    const paletteCountOut = document.getElementById("palettePixelCountOut");

    function text(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }

    function render() {
      const a = summarizeColor(colorA.value);
      const b = summarizeColor(colorB.value);
      const pal = paletteAccounting(paletteCount.value);

      const swatchA = document.getElementById("colorSwatchA");
      const swatchB = document.getElementById("colorSwatchB");
      if (swatchA) swatchA.style.background = a.hex;
      if (swatchB) swatchB.style.background = b.hex;

      text("storedHex", a.hex);
      text("storedRgb", `${a.rgb.r}, ${a.rgb.g}, ${a.rgb.b}`);
      text("storedInt", a.int.toLocaleString());
      text("storedBits", `${a.bits.slice(0,8)} ${a.bits.slice(8,16)} ${a.bits.slice(16)}`);
      text("storedRBits", byteBits(a.rgb.r));
      text("storedGBits", byteBits(a.rgb.g));
      text("storedBBits", byteBits(a.rgb.b));

      text("derivedLinear", `${fmt(a.linear.r)} · ${fmt(a.linear.g)} · ${fmt(a.linear.b)}`);
      text("derivedHsl", `${fmt(a.hsl.h,1)}° · ${pct(a.hsl.s)} · ${pct(a.hsl.l)}`);
      text("derivedHsv", `${fmt(a.hsv.h,1)}° · ${pct(a.hsv.s)} · ${pct(a.hsv.v)}`);
      text("derivedXyz", `${fmt(a.xyz.x)} · ${fmt(a.xyz.y)} · ${fmt(a.xyz.z)}`);
      text("derivedLab", `${fmt(a.lab.L,2)} · ${fmt(a.lab.a,2)} · ${fmt(a.lab.b,2)}`);
      text("derivedOklab", `${fmt(a.oklab.L)} · ${fmt(a.oklab.a)} · ${fmt(a.oklab.b)}`);
      text("derivedOklch", `${fmt(a.oklch.L)} · ${fmt(a.oklch.C)} · ${fmt(a.oklch.h,1)}°`);
      text("derivedLuminance", fmt(a.luminance));

      text("compareDeltaE", fmt(deltaE76(a.lab, b.lab), 2));
      text("compareOklab", fmt(oklabDistance(a.oklab, b.oklab), 4));
      text("compareContrast", fmt(contrastRatio(a.rgb, b.rgb), 2) + ":1");

      text("assignedUint", a.assigned.uint24.toLocaleString());
      text("assignedClass", String(a.assigned.class16));
      text("assignedToken", String(a.assigned.token8192));
      text("assignedScalar", fmt(a.assigned.normalized, 6));

      paletteCountOut.textContent = pal.pixelCount.toLocaleString();
      text("paletteDirectBits", pal.directBits.toLocaleString());
      text("paletteIndexedBits", pal.indexedBits.toLocaleString());
      text("paletteAmortized", fmt(pal.indexedBitsPerPixel, 3));
      text("paletteDifference", (pal.savesBits >= 0 ? "+" : "") + pal.savesBits.toLocaleString());
      text("paletteVerdict", pal.savesBits > 0 ? "indexed representation is smaller" : pal.savesBits === 0 ? "same accounted size" : "indexed representation is larger");
    }

    [colorA, colorB, paletteCount].forEach(el => el.addEventListener("input", render));
    render();
  }

  if (typeof window !== "undefined") window.addEventListener("DOMContentLoaded", initBrowser);

  return {
    parseHex, rgbToHex, rgbToInt, byteBits, rgbBits, linearRgb,
    rgbToHsl, rgbToHsv, rgbToXyz, xyzToLab, rgbToLab, rgbToOklab,
    oklabToOklch, relativeLuminance, deltaE76, oklabDistance,
    contrastRatio, assignedReadings, paletteAccounting, summarizeColor
  };
});
