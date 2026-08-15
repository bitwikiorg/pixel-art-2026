#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "_data" / "experiments.json"
CONTROLS = ROOT / "_data" / "experiment_controls.json"
REFERENCES = ROOT / "_data" / "experiment_references.json"
GROUPS = ROOT / "_data" / "experiment_groups.json"
SITE = ROOT / "_site"
REQUIRED = {
    "id", "title", "category", "status", "status_label", "url",
    "code", "tests", "source", "interpretation", "operation", "measure",
    "shows", "does_not_show",
}
CONTROL_REQUIRED = {"control", "changes", "fixed", "watch"}
REFERENCE_REQUIRED = {"title", "url", "note"}
GROUP_REQUIRED = {"id", "title", "short", "ids"}
ALLOWED_STATUS = {"exact", "deterministic", "mechanics", "learned", "benchmark"}


def rendered_path(url: str) -> Path:
    if not url.startswith("/") or not url.endswith("/"):
        raise ValueError(f"experiment URL must be a pretty root-relative path ending in '/': {url}")
    return SITE / url.strip("/") / "index.html"


def main() -> int:
    errors: list[str] = []
    data = json.loads(REGISTRY.read_text(encoding="utf-8"))
    controls = json.loads(CONTROLS.read_text(encoding="utf-8"))
    references = json.loads(REFERENCES.read_text(encoding="utf-8"))
    groups = json.loads(GROUPS.read_text(encoding="utf-8"))
    if not isinstance(data, list) or not data:
        errors.append("experiment registry must be a non-empty list")
        data = []
    if not isinstance(controls, dict):
        errors.append("experiment controls must be an object keyed by experiment id")
        controls = {}
    if not isinstance(references, dict):
        errors.append("experiment references must be an object keyed by experiment id")
        references = {}
    if not isinstance(groups, list) or not groups:
        errors.append("experiment groups must be a non-empty list")
        groups = []

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
        if str(exp["category"]).strip().lower() == "archive":
            errors.append(f"{exp_id}: Archive is not an allowed experiment category")
        for key in ("title", "source", "interpretation", "operation", "measure", "shows", "does_not_show"):
            if not str(exp[key]).strip():
                errors.append(f"{exp_id}: empty {key}")
        for rel in exp["code"] + exp["tests"]:
            if not (ROOT / rel).is_file():
                errors.append(f"{exp_id}: referenced file missing: {rel}")
        if not exp["tests"]:
            errors.append(f"{exp_id}: every canonical experiment requires at least one behavioral test or recorded-result audit")

        guide = controls.get(exp_id)
        if not isinstance(guide, list) or not guide:
            errors.append(f"{exp_id}: missing non-empty interaction guide")
        else:
            for j, item in enumerate(guide):
                if not isinstance(item, dict) or CONTROL_REQUIRED - set(item):
                    errors.append(f"{exp_id}: control guide entry {j} must contain {sorted(CONTROL_REQUIRED)}")

        refs = references.get(exp_id)
        if not isinstance(refs, list) or not refs:
            errors.append(f"{exp_id}: missing non-empty reference list")
        else:
            for j, item in enumerate(refs):
                if not isinstance(item, dict) or REFERENCE_REQUIRED - set(item):
                    errors.append(f"{exp_id}: reference entry {j} must contain {sorted(REFERENCE_REQUIRED)}")

        if SITE.exists():
            try:
                target = rendered_path(url)
            except ValueError as exc:
                errors.append(f"{exp_id}: {exc}")
            else:
                if not target.is_file():
                    errors.append(f"{exp_id}: rendered experiment page missing: {target.relative_to(ROOT)}")
                else:
                    rendered = target.read_text(encoding="utf-8")
                    for marker in ('class="experiment-side-nav experiment-side-nav-v2"', 'class="side-group-nav"', 'id="controls"', 'id="apparatus"', 'id="evidence"', 'id="references"'):
                        if marker not in rendered:
                            errors.append(f"{exp_id}: rendered clarity marker missing: {marker}")

    expected = {"01", "01C", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "A1"}
    if ids != expected:
        errors.append(f"registry IDs differ from canonical atlas: got {sorted(ids)}, expected {sorted(expected)}")
    if set(controls) != expected:
        errors.append(f"interaction-guide IDs differ from canonical atlas: got {sorted(controls)}, expected {sorted(expected)}")
    if set(references) != expected:
        errors.append(f"reference IDs differ from canonical atlas: got {sorted(references)}, expected {sorted(expected)}")

    grouped_ids: list[str] = []
    group_names: set[str] = set()
    for i, group in enumerate(groups):
        if not isinstance(group, dict) or GROUP_REQUIRED - set(group):
            errors.append(f"group {i} must contain {sorted(GROUP_REQUIRED)}")
            continue
        group_id = str(group["id"])
        if group_id in group_names:
            errors.append(f"duplicate experiment group id: {group_id}")
        group_names.add(group_id)
        if not isinstance(group["ids"], list) or not group["ids"]:
            errors.append(f"{group_id}: group must contain experiment ids")
            continue
        grouped_ids.extend(str(exp_id) for exp_id in group["ids"])
    if len(grouped_ids) != len(set(grouped_ids)):
        errors.append("an experiment appears in more than one navigation group")
    if set(grouped_ids) != expected:
        errors.append(f"navigation groups differ from canonical atlas: got {sorted(set(grouped_ids))}, expected {sorted(expected)}")

    if errors:
        print("EXPERIMENT AUDIT FAILED")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"EXPERIMENT AUDIT PASSED: {len(data)} canonical experiments with verification, grouped navigation, controls and references")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
