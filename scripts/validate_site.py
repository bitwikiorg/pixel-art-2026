#!/usr/bin/env python3
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import sys

SITE = Path("_site").resolve()
BASEURL = "/pixel-art-2026"


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        for attr in ("href", "src"):
            value = values.get(attr)
            if value:
                self.links.append((attr, value))


def resolve_target(source: Path, raw: str) -> Path | None:
    raw = raw.strip()
    if not raw or raw.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
        return None

    parsed = urlsplit(raw)
    if parsed.scheme or parsed.netloc:
        return None

    path = parsed.path
    if not path:
        return None

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
        return Path("__OUTSIDE_SITE__")

    if path.endswith("/"):
        candidate = candidate / "index.html"
    elif candidate.is_dir():
        candidate = candidate / "index.html"
    elif not candidate.exists() and not candidate.suffix:
        pretty = candidate / "index.html"
        html = candidate.with_suffix(".html")
        if pretty.exists():
            candidate = pretty
        elif html.exists():
            candidate = html

    return candidate


def main() -> int:
    if not SITE.exists():
        print("ERROR: _site does not exist", file=sys.stderr)
        return 1

    errors: list[str] = []
    html_files = sorted(SITE.rglob("*.html"))
    if not html_files:
        errors.append("No rendered HTML files found")

    for html_file in html_files:
        text = html_file.read_text(encoding="utf-8")
        if "{{" in text or "{%" in text:
            errors.append(f"Unresolved Liquid syntax: {html_file.relative_to(SITE)}")

        parser = LinkParser()
        parser.feed(text)
        for attr, raw in parser.links:
            target = resolve_target(html_file, raw)
            if target is None:
                continue
            if str(target) == "__OUTSIDE_SITE__":
                errors.append(f"Path escapes site: {html_file.relative_to(SITE)} {attr}={raw!r}")
            elif not target.exists():
                try:
                    shown = target.relative_to(SITE)
                except ValueError:
                    shown = target
                errors.append(
                    f"Broken internal reference: {html_file.relative_to(SITE)} "
                    f"{attr}={raw!r} -> {shown}"
                )

    required = [
        SITE / "index.html",
        SITE / "learn" / "index.html",
        SITE / "experiment" / "index.html",
        SITE / "research" / "index.html",
        SITE / "glossary" / "index.html",
        SITE / "research" / "05-neural-architecture" / "index.html",
        SITE / "research" / "09-current-frontier" / "index.html",
        SITE / "assets" / "css" / "style.css",
        SITE / "assets" / "js" / "site.js",
        SITE / "assets" / "js" / "field.js",
        SITE / "assets" / "js" / "neural-field.js",
    ]
    for path in required:
        if not path.exists():
            errors.append(f"Required render output missing: {path.relative_to(SITE)}")

    if errors:
        print("SITE VALIDATION FAILED")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"SITE VALIDATION PASSED: {len(html_files)} HTML files checked")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
