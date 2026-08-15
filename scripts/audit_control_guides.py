#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTROLS = ROOT / "_data" / "experiment_controls.json"
WIRING = ROOT / "_data" / "experiment_wiring.json"

# Every rendered form control must appear here. A guide may additionally explain
# canvas interactions or recorded protocols that are not form controls.
GUIDE_COVERAGE = {
    "01": [["data-carrier-preset"], ["data-carrier-transform"], ["#carrierDecode"], ["#carrierText", "#carrierEncodeText"], ["#carrierDecodeText"]],
    "01C": [["#colorA"], ["#colorB"], ["#palettePixelCount"]],
    "02": [["data-rel-preset"], ["#relNoise"], ["#relSeed"], ["#relRun"], ["#relTrials"]],
    "03": [["data-mem-preset"], ["#memStore"], ["#memNoise"], ["#memSeed"], ["#memCorrupt"], ["#memSweep"], ["#memConverge"], ["#memReset"]],
    "04": [["data-motif-preset"], ["#motifRun"]],
    "05": [["data-hv-preset"], ["#hvDim"], ["#hvBuild"], ["#hvX", "#hvY"], ["#hvQuery"], ["#hvRunSweep"]],
    "06": [["data-pixel-mode"], ["#pixelUniverseRun"], ["#pixelUniverseStepBtn"], ["#pixelUniverseInject"], ["#pixelUniverseReset"]],
    "07": [["#epochs"], ["#recurrentSteps"], ["#trainBtn"], ["#resetNeuralBtn"], ["#traceSlider"], ["#farExample"], ["#neuralShuffle"], ["#newExampleBtn"]],
    "08": [["#gpuOp"], ["#gpuRun"]],
    "09": [["#maskRate"], ["#maskEpochs"], ["#maskTrain"]],
    "10": [],
    "11": [["#genomeSeed", "#genomeGenerate"], ["#genomeMutate"], ["#genomeParentB"], ["#genomeCross"], ["#genomeInterpolate"], ["#genomeDamage"], ["#genomeRegenerate"]],
    "12": [["#organismSeed", "#organismGenerate"], ["#organismWorldSeed"], ["#organismSteps"], ["#organismRun"], ["#organismMutate"], ["#organismSelect"]],
    "A1": [["#coupling"], ["#memory"], ["#hierarchy"], ["#shuffle"], ["#runBtn"], ["#stepBtn"], ["#resetBtn"], ["#damageBtn"], ["#exportBtn"]],
}


def main() -> int:
    guides = json.loads(CONTROLS.read_text(encoding="utf-8"))
    wiring = json.loads(WIRING.read_text(encoding="utf-8"))
    errors: list[str] = []
    if set(GUIDE_COVERAGE) != set(wiring):
        errors.append("guide-coverage IDs differ from wiring IDs")
    for exp_id, spec in wiring.items():
        expected = set(spec["controls"])
        groups = GUIDE_COVERAGE.get(exp_id, [])
        covered = {selector for group in groups for selector in group}
        if covered != expected:
            missing, extra = expected - covered, covered - expected
            if missing:
                errors.append(f"{exp_id}: DOM controls missing guide coverage: {sorted(missing)}")
            if extra:
                errors.append(f"{exp_id}: guide coverage references nonexistent controls: {sorted(extra)}")
        rows = guides.get(exp_id, [])
        if len(rows) < len(groups):
            errors.append(f"{exp_id}: only {len(rows)} guide rows for {len(groups)} rendered control groups")
    if errors:
        print("CONTROL GUIDE AUDIT FAILED")
        for error in errors:
            print(f"- {error}")
        return 1
    print("CONTROL GUIDE AUDIT PASSED: every rendered form control is covered by an explicit guide row")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
