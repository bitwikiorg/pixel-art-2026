#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
import statistics

ROOT = Path(__file__).resolve().parents[1]
EQUAL_STATE = ROOT / "experiments" / "results" / "equal-state-audit.json"
EQUAL_PARAMS = ROOT / "experiments" / "results" / "equal-params-smoke.json"
PAGE = ROOT / "experiment" / "primitive-benchmark" / "index.md"
TOL = 5e-4


def close(a: float, b: float, tol: float = TOL) -> bool:
    return abs(float(a) - float(b)) <= tol


def check_summary_from_runs(data: dict, errors: list[str], *, nested_architectures: bool) -> None:
    if nested_architectures:
        for mode, item in data["architectures"].items():
            runs = item["runs"]
            near = [r["near_accuracy"] for r in runs]
            far = [r["far_accuracy"] for r in runs]
            for label, actual, expected in (
                ("near_mean", statistics.mean(near), item["near_mean"]),
                ("near_sd", statistics.stdev(near), item["near_sd"]),
                ("far_mean", statistics.mean(far), item["far_mean"]),
                ("far_sd", statistics.stdev(far), item["far_sd"]),
            ):
                if not close(actual, expected):
                    errors.append(f"equal-state {mode}: {label} {expected} does not match runs ({actual})")
    else:
        rows = data["runs"]
        for mode, item in data["summary"].items():
            runs = [r for r in rows if r["mode"] == mode]
            near = [r["near_accuracy"] for r in runs]
            far = [r["far_accuracy"] for r in runs]
            infer = [r["inference_us_per_example"] for r in runs]
            train = [r["train_seconds"] for r in runs]
            checks = (
                ("near_mean", statistics.mean(near)),
                ("near_sd", statistics.stdev(near)),
                ("far_mean", statistics.mean(far)),
                ("far_sd", statistics.stdev(far)),
                ("inference_us_per_example_mean", statistics.mean(infer)),
                ("train_seconds_mean", statistics.mean(train)),
            )
            for label, actual in checks:
                if not close(actual, item[label], 1e-9):
                    errors.append(f"equal-params {mode}: {label} {item[label]} does not match runs ({actual})")


def main() -> int:
    errors: list[str] = []
    state = json.loads(EQUAL_STATE.read_text(encoding="utf-8"))
    params = json.loads(EQUAL_PARAMS.read_text(encoding="utf-8"))
    page = PAGE.read_text(encoding="utf-8")

    expected_state = {
        "protocol": "equal-state", "steps": 6, "epochs": 12,
        "train_examples": 1536, "test_examples": 384, "seeds": [7, 17, 29],
    }
    expected_params = {
        "protocol": "equal-params", "steps": 6, "epochs": 6,
        "train_examples": 768, "test_examples": 192, "seeds": [7, 17, 29],
    }
    for key, value in expected_state.items():
        if state.get(key) != value:
            errors.append(f"equal-state metadata {key}: expected {value!r}, got {state.get(key)!r}")
    for key, value in expected_params.items():
        if params.get(key) != value:
            errors.append(f"equal-params metadata {key}: expected {value!r}, got {params.get(key)!r}")

    check_summary_from_runs(state, errors, nested_architectures=True)
    check_summary_from_runs(params, errors, nested_architectures=False)

    expected_shapes = {
        ("state", "vector"): (4036, "16D vector"),
        ("state", "tensor"): (4588, "4x4 tensor"),
        ("state", "transformer"): (3396, "2 tokens x 8D"),
        ("params", "vector"): (4036, "16D vector"),
        ("params", "tensor"): (4588, "4x4 tensor"),
        ("params", "transformer"): (4261, "2 tokens x 9D"),
    }
    for (dataset, mode), (expected_count, expected_shape) in expected_shapes.items():
        item = state["architectures"][mode] if dataset == "state" else params["summary"][mode]
        if item["parameters"] != expected_count:
            errors.append(f"{dataset} {mode}: expected {expected_count} parameters, got {item['parameters']}")
        if item["internal_shape"] != expected_shape:
            errors.append(f"{dataset} {mode}: expected shape {expected_shape!r}, got {item['internal_shape']!r}")

    required_page_fragments = (
        "RECORDED MULTI-SEED REFERENCE",
        "4,261",
        "2×9D",
        "--protocol equal-state --state 16 --steps 6 --epochs 12",
        "--train 1536 --test 384 --seeds 7,17,29",
        "--protocol equal-params --target-params 4000 --steps 6 --epochs 6",
        "--train 768 --test 192 --seeds 7,17,29",
        "Runtime was not retained in this equal-state audit file",
    )
    for fragment in required_page_fragments:
        if fragment not in page:
            errors.append(f"benchmark page missing audited fragment: {fragment!r}")
    for stale in ("4,236", "2×8D inner-token attention | 4,236"):
        if stale in page:
            errors.append(f"benchmark page contains stale value: {stale!r}")

    if errors:
        print("BENCHMARK AUDIT FAILED")
        for error in errors:
            print(f"- {error}")
        return 1
    print("BENCHMARK AUDIT PASSED: recorded JSON summaries, parameters, shapes, and reproduction commands agree")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
