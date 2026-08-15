#!/usr/bin/env python3
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys

SITE = Path("_site").resolve()
BASEURL = "/pixel-art-2026"
METADISCOURSE = (
    "this page",
    "this section",
    "this site",
    "the site now",
    "the site is organized",
    "here we",
    "why this page exists",
    "why this experiment exists",
    "the lab is organized",
    "the zoo, organized",
    "plain english:",
    "in simple english",
    "the research library explains",
    "the atlas deliberately",
    "every experiment says",
    "in this project",
    "the project becomes",
)


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[tuple[str, str]] = []
        self.ids: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        node_id = values.get("id")
        if node_id:
            self.ids.append(node_id)
        for attr in ("href", "src"):
            value = values.get(attr)
            if value:
                self.links.append((attr, value))


def resolve_target(source: Path, raw: str) -> tuple[Path | None, str]:
    raw = raw.strip()
    if not raw or raw.startswith(("mailto:", "tel:", "javascript:", "data:")):
        return None, ""
    parsed = urlsplit(raw)
    if parsed.scheme or parsed.netloc:
        return None, ""
    fragment = unquote(parsed.fragment)
    path = parsed.path
    if not path:
        return source, fragment
    if path == BASEURL:
        path = "/"
    elif path.startswith(BASEURL + "/"):
        path = path[len(BASEURL):]
    if path.startswith("/"):
        candidate = SITE / path.lstrip("/")
    else:
        candidate = source.parent / path
    candidate = candidate.resolve()
    try:
        candidate.relative_to(SITE)
    except ValueError:
        return Path("__OUTSIDE_SITE__"), fragment
    if path.endswith("/"):
        candidate = candidate / "index.html"
    elif candidate.is_dir():
        candidate = candidate / "index.html"
    elif not candidate.exists() and not candidate.suffix:
        pretty, html = candidate / "index.html", candidate.with_suffix(".html")
        candidate = pretty if pretty.exists() else html if html.exists() else candidate
    return candidate, fragment


def main() -> int:
    if not SITE.exists():
        print("ERROR: _site does not exist", file=sys.stderr)
        return 1
    errors: list[str] = []
    html_files = sorted(SITE.rglob("*.html"))
    if not html_files:
        errors.append("No rendered HTML files found")

    parsed_pages: dict[Path, PageParser] = {}
    for html_file in html_files:
        text = html_file.read_text(encoding="utf-8")
        lowered = text.lower()
        if "{{" in text or "{%" in text:
            errors.append(f"Unresolved Liquid syntax: {html_file.relative_to(SITE)}")
        for forbidden in ("data-lab-tab=", "#pixelUniverseLab", "#neuralFieldLab", "#originalFieldLab", "PIXEL NEURAL NET LAB"):
            if forbidden in text:
                errors.append(f"Stale omnibus-lab marker {forbidden!r}: {html_file.relative_to(SITE)}")
        for phrase in METADISCOURSE:
            if phrase in lowered:
                errors.append(f"Structural metadiscourse {phrase!r}: {html_file.relative_to(SITE)}")
        parser = PageParser(); parser.feed(text); parsed_pages[html_file.resolve()] = parser
        seen: set[str] = set()
        for node_id in parser.ids:
            if node_id in seen:
                errors.append(f"Duplicate id={node_id!r}: {html_file.relative_to(SITE)}")
            seen.add(node_id)

    for html_file, parser in parsed_pages.items():
        for attr, raw in parser.links:
            target, fragment = resolve_target(html_file, raw)
            if target is None:
                continue
            if str(target) == "__OUTSIDE_SITE__":
                errors.append(f"Path escapes site: {html_file.relative_to(SITE)} {attr}={raw!r}")
                continue
            if not target.exists():
                try:
                    shown = target.relative_to(SITE)
                except ValueError:
                    shown = target
                errors.append(f"Broken internal reference: {html_file.relative_to(SITE)} {attr}={raw!r} -> {shown}")
                continue
            if fragment and target.suffix.lower() == ".html":
                page = parsed_pages.get(target.resolve())
                if page is None:
                    text = target.read_text(encoding="utf-8"); page = PageParser(); page.feed(text); parsed_pages[target.resolve()] = page
                if fragment not in set(page.ids):
                    errors.append(f"Broken fragment: {html_file.relative_to(SITE)} {attr}={raw!r} -> missing id={fragment!r}")

    required = [
        "index.html", "learn/index.html", "experiment/index.html", "carrier/index.html",
        "experiment/color-carrier/index.html", "experiment/reliability/index.html",
        "experiment/memory/index.html", "experiment/motif-codec/index.html",
        "experiment/hypervector/index.html", "experiment/interpretation/index.html",
        "experiment/learned-local-field/index.html", "experiment/webgpu/index.html",
        "experiment/masked-reconstruction/index.html", "experiment/primitive-benchmark/index.html",
        "experiment/pixel-genome/index.html", "experiment/dynamics/index.html", "research/index.html",
        "research/11-color-light-state/index.html", "research/12-generative-pixel-engineering/index.html",
        "glossary/index.html", "assets/css/style.css", "assets/css/atlas.css", "assets/css/clarity.css",
        "assets/css/clarity-v2.css", "assets/js/site.js", "assets/js/pixel-core.js",
        "assets/js/color-carrier.js",
    ]
    for rel in required:
        if not (SITE / rel).exists():
            errors.append(f"Required render output missing: {rel}")

    if errors:
        print("SITE VALIDATION FAILED")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"SITE VALIDATION PASSED: {len(html_files)} HTML files checked, fragments, IDs and copy constraints validated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
