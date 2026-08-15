#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "_data" / "experiments.json"
SITE = ROOT / "_site"
REQUIRED = {
    "id", "title", "category", "status", "status_label", "url",
    "code", "tests", "source", "interpretation", "operation", "measure",
    "shows", "does_not_show",
}
ALLOWED_STATUS = {"exact", "deterministic", "mechanics", "learned", "benchmark"}


def rendered_path(url: str) -> Path:
    if not url.startswith("/") or not url.endswith("/"):
        raise ValueError(f"experiment URL must be a pretty root-relative path ending in '/': {url}")
    return SITE / url.strip("/") / "index.html"


def main() -> int:
    errors: list[str] = []
    data = json.loads(REGISTRY.read_text(encoding="utf-8"))
    if not isinstance(data, list) or not data:
        errors.append("experiment registry must be a non-empty list")
        data = []

    ids: set[str] = set()
    urls: set[str] = set()
    for i, exp in enumerate(data):
        missing = REQUIRED - set(exp)
        if missing:
            errors.append(f"entry {i} missing fields: {sorted(missing)}")
            continue
        exp_id = str(exp["id"])
        if exp_id in ids:
            errors.append(f"duplicate experiment id: {exp_id}")
        ids.add(exp_id)
        url = exp["url"]
        if url in urls:
            errors.append(f"duplicate experiment URL: {url}")
        urls.add(url)
        if exp["status"] not in ALLOWED_STATUS:
            errors.append(f"{exp_id}: unknown status {exp['status']!r}")
        for key in ("title", "source", "interpretation", "operation", "measure", "shows", "does_not_show"):
            if not str(exp[key]).strip():
                errors.append(f"{exp_id}: empty {key}")
        for rel in exp["code"] + exp["tests"]:
            if not (ROOT / rel).is_file():
                errors.append(f"{exp_id}: referenced file missing: {rel}")
        if exp["status"] == "exact" and not exp["tests"]:
            errors.append(f"{exp_id}: exact experiment requires at least one behavioral test")
        if SITE.exists():
            try:
                target = rendered_path(url)
            except ValueError as exc:
                errors.append(f"{exp_id}: {exc}")
            else:
                if not target.is_file():
                    errors.append(f"{exp_id}: rendered experiment page missing: {target.relative_to(ROOT)}")

    expected = {"01", "01C", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "A1"}
    if ids != expected:
        errors.append(f"registry IDs differ from canonical atlas: got {sorted(ids)}, expected {sorted(expected)}")

    if errors:
        print("EXPERIMENT AUDIT FAILED")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"EXPERIMENT AUDIT PASSED: {len(data)} canonical experiments")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
