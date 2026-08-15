#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "_data" / "experiments.json"
PATTERNS = (
    r"\bTODO\b",
    r"\bFIXME\b",
    r"\bplaceholder\b",
    r"\bmock(?:ed)?\b",
    r"\bfake\b",
    r"\bstub\b",
    r"\bnot implemented\b",
)


def main() -> int:
    experiments = json.loads(REGISTRY.read_text(encoding="utf-8"))
    errors: list[str] = []
    checked: set[str] = set()
    for exp in experiments:
        exp_id = str(exp["id"])
        for rel in exp["code"]:
            if rel in checked:
                continue
            checked.add(rel)
            path = ROOT / rel
            if not path.is_file():
                continue
            text = path.read_text(encoding="utf-8")
            for pattern in PATTERNS:
                if re.search(pattern, text, flags=re.IGNORECASE):
                    errors.append(f"{exp_id}: prohibited implementation marker {pattern!r} in {rel}")
    if errors:
        print("IMPLEMENTATION BOILERPLATE AUDIT FAILED")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"IMPLEMENTATION BOILERPLATE AUDIT PASSED: {len(checked)} declared code files checked")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
