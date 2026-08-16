#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANONICAL = ROOT / "research" / "04-references.md"
EXPERIMENT_REFS = ROOT / "_data" / "experiment_references.json"
GLOSSARY = ROOT / "glossary" / "index.md"

CREATIVE_REFERENCE_MARKERS = (
    "deep-fold",
    "itch.io",
    "0xmons",
    "the bibites",
    "pixel sprite generator",
    "pixel planet generator",
    "particle soup",
    "gaia maker",
    "the sapling",
)

ACADEMIC_OR_TECH_DOMAINS = (
    "doi.org",
    "pnas.org",
    "arxiv.org",
    "scholarpedia.org",
    "distill.pub",
    "cie.co.at",
    "w3.org",
    "nist.gov",
    "neurips.cc",
    "nips.cc",
    "aclanthology.org",
    "utexas.edu",
    "arcprize.org",
    "research.facebook.com",
    "stanford.edu",
    "js.tensorflow.org",
    "pytorch.org",
    "openreview.net",
    "pubmed.ncbi.nlm.nih.gov",
)


def main() -> int:
    errors: list[str] = []
    canonical = CANONICAL.read_text(encoding="utf-8")
    canonical_lower = canonical.lower()
    refs = json.loads(EXPERIMENT_REFS.read_text(encoding="utf-8"))
    glossary = GLOSSARY.read_text(encoding="utf-8")

    for marker in CREATIVE_REFERENCE_MARKERS:
        if marker in canonical_lower:
            errors.append(f"creative inspiration leaked into canonical bibliography: {marker}")

    for exp_id, items in refs.items():
        for item in items:
            url = str(item.get("url", ""))
            title = str(item.get("title", ""))
            lower = f"{title} {url}".lower()
            for marker in CREATIVE_REFERENCE_MARKERS:
                if marker in lower:
                    errors.append(f"{exp_id}: creative inspiration used as experiment reference: {title}")
            if url.startswith("http") and not any(domain in url for domain in ACADEMIC_OR_TECH_DOMAINS):
                errors.append(f"{exp_id}: external experiment reference is not on the approved academic/technical domain list: {url}")

    if glossary.count('class="external-ref"') < 20:
        errors.append("glossary must contain at least 20 explicit external reference links")
    for required in ("Wikipedia", "Scholarpedia", "Distill", "CIE", "Shannon", "Hopfield"):
        if required not in glossary:
            errors.append(f"glossary source coverage missing expected reference family: {required}")

    if "Creative mechanism inspirations" not in (ROOT / "research" / "12-generative-pixel-engineering.md").read_text(encoding="utf-8"):
        errors.append("generative research must explicitly separate creative inspirations from evidence")
    if "Creative system inspirations" not in (ROOT / "research" / "13-pixel-organisms-artificial-life.md").read_text(encoding="utf-8"):
        errors.append("artificial-life research must explicitly separate creative inspirations from evidence")

    if errors:
        print("REFERENCE AUDIT FAILED")
        for error in errors:
            print(f"- {error}")
        return 1

    print("REFERENCE AUDIT PASSED: canonical bibliography and experiment sources are academic/technical; glossary source links and inspiration boundaries verified")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
