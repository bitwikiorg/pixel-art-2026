#!/usr/bin/env python3
from __future__ import annotations

from html.parser import HTMLParser
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "_site"
REGISTRY = ROOT / "_data" / "experiments.json"
WIRING = ROOT / "_data" / "experiment_wiring.json"
PROHIBITED = ("todo", "fixme", "placeholder", "mock", "fake", "stub", "not implemented")
RANDOM_ALLOWLIST = {"assets/js/relation-task.js"}


class ApparatusParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.depth = 0
        self.apparatus_depth: int | None = None
        self.controls: set[str] = set()
        self.ids: set[str] = set()
        self.attrs: set[str] = set()
        self.text: list[str] = []

    @property
    def inside(self) -> bool:
        return self.apparatus_depth is not None and self.depth >= self.apparatus_depth

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        self.depth += 1
        if values.get("id") == "apparatus" and self.apparatus_depth is None:
            self.apparatus_depth = self.depth
        if not self.inside:
            return
        node_id = values.get("id")
        if node_id:
            self.ids.add(node_id)
        for key in values:
            if key.startswith("data-"):
                self.attrs.add(key)
        if tag in {"button", "input", "select"}:
            if node_id:
                self.controls.add(f"#{node_id}")
            else:
                data_keys = [key for key in values if key.startswith("data-")]
                if data_keys:
                    self.controls.add(data_keys[0])
                else:
                    self.controls.add(f"<{tag}>")

    def handle_endtag(self, tag: str) -> None:
        if self.apparatus_depth is not None and self.depth == self.apparatus_depth:
            self.apparatus_depth = None
        self.depth = max(0, self.depth - 1)

    def handle_data(self, data: str) -> None:
        if self.inside:
            self.text.append(data)


def rendered_path(url: str) -> Path:
    return SITE / url.strip("/") / "index.html"


def selector_token(selector: str) -> str:
    return selector[1:] if selector.startswith("#") else selector


def main() -> int:
    experiments = json.loads(REGISTRY.read_text(encoding="utf-8"))
    wiring = json.loads(WIRING.read_text(encoding="utf-8"))
    errors: list[str] = []
    ids = {str(exp["id"]) for exp in experiments}
    if set(wiring) != ids:
        errors.append(f"wiring IDs differ from registry: wiring={sorted(wiring)}, registry={sorted(ids)}")

    for exp in experiments:
        exp_id = str(exp["id"])
        spec = wiring.get(exp_id)
        if not isinstance(spec, dict):
            continue
        mode = spec.get("mode")
        if mode not in {"live", "recorded"}:
            errors.append(f"{exp_id}: wiring mode must be live or recorded")
            continue
        browser_js = spec.get("browser_js", [])
        controls = set(spec.get("controls", []))
        outputs = set(spec.get("outputs", []))
        if mode == "live" and not browser_js:
            errors.append(f"{exp_id}: live experiment has no browser implementation")
        if mode == "recorded" and browser_js:
            errors.append(f"{exp_id}: recorded experiment unexpectedly declares browser JS")
        if mode == "recorded" and "LIVE" in str(exp.get("status_label", "")):
            errors.append(f"{exp_id}: recorded experiment status label says LIVE")
        if mode == "live" and "LIVE" not in str(exp.get("status_label", "")):
            errors.append(f"{exp_id}: live experiment status label does not say LIVE")

        code_text = ""
        for rel in browser_js:
            path = ROOT / rel
            if not path.is_file():
                errors.append(f"{exp_id}: browser implementation missing: {rel}")
                continue
            if rel not in exp.get("code", []):
                errors.append(f"{exp_id}: browser implementation not declared in registry code: {rel}")
            text = path.read_text(encoding="utf-8")
            code_text += "\n" + text
            lowered = text.lower()
            for marker in PROHIBITED:
                if re.search(rf"\b{re.escape(marker)}\b", lowered):
                    errors.append(f"{exp_id}: prohibited boilerplate marker {marker!r} in {rel}")
            if "Math.random" in text and rel not in RANDOM_ALLOWLIST:
                errors.append(f"{exp_id}: uncontrolled Math.random in live implementation {rel}")

        if not SITE.exists():
            continue
        page = rendered_path(exp["url"])
        if not page.is_file():
            errors.append(f"{exp_id}: rendered page missing: {page.relative_to(ROOT)}")
            continue
        html = page.read_text(encoding="utf-8")
        parser = ApparatusParser()
        parser.feed(html)
        apparatus_text = " ".join(parser.text)
        expected_label = "LIVE EXPERIMENT" if mode == "live" else "RECORDED BENCHMARK"
        if expected_label not in apparatus_text:
            errors.append(f"{exp_id}: apparatus label must contain {expected_label!r}")
        if mode == "recorded" and parser.controls:
            errors.append(f"{exp_id}: recorded benchmark unexpectedly renders interactive controls: {sorted(parser.controls)}")

        if parser.controls != controls:
            missing = controls - parser.controls
            extra = parser.controls - controls
            if missing:
                errors.append(f"{exp_id}: declared controls missing from apparatus: {sorted(missing)}")
            if extra:
                errors.append(f"{exp_id}: apparatus controls missing from wiring manifest: {sorted(extra)}")

        root = spec.get("root")
        if mode == "live" and root:
            if root.startswith("data-"):
                if root not in parser.attrs:
                    errors.append(f"{exp_id}: root attribute {root!r} missing from apparatus")
            elif root not in parser.ids:
                errors.append(f"{exp_id}: root id {root!r} missing from apparatus")
            if root not in code_text:
                errors.append(f"{exp_id}: root {root!r} is not referenced by browser implementation")

        for selector in controls:
            token = selector_token(selector)
            if token not in code_text:
                errors.append(f"{exp_id}: control {selector} exists in HTML but is not referenced by browser implementation")
        for selector in outputs:
            if not selector.startswith("#"):
                errors.append(f"{exp_id}: output selector must be an id: {selector}")
                continue
            token = selector[1:]
            if token not in parser.ids:
                errors.append(f"{exp_id}: declared output {selector} missing from apparatus")
            if token not in code_text:
                errors.append(f"{exp_id}: output {selector} is never referenced by browser implementation")

    if errors:
        print("EXPERIMENT WIRING AUDIT FAILED")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"EXPERIMENT WIRING AUDIT PASSED: {len(experiments)} experiments match rendered controls, implementations, outputs, and apparatus modes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
