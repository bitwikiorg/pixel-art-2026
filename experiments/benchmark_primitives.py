#!/usr/bin/env python3
"""Run equal-state and approximately equal-parameter primitive comparisons."""
from __future__ import annotations
import argparse, json, statistics
from dataclasses import asdict
from pixel_primitives import parameter_count, run_experiment

CANDIDATES = {
    'vector': list(range(4, 33)),
    'tensor': [4, 9, 16, 25, 36],
    'transformer': list(range(4, 34, 2)),
}

def nearest_scalars(mode: str, target: int, steps: int) -> int:
    return min(CANDIDATES[mode], key=lambda s: (abs(parameter_count(mode, s, steps) - target), s))

def aggregate(rows):
    out = {}
    for mode in ('vector','tensor','transformer'):
        rs = [r for r in rows if r['mode'] == mode]
        out[mode] = {
            'scalars_per_pixel': rs[0]['scalars_per_pixel'], 'parameters': rs[0]['parameters'], 'internal_shape': rs[0]['internal_shape'],
            'near_mean': statistics.mean(r['near_accuracy'] for r in rs), 'near_sd': statistics.stdev(r['near_accuracy'] for r in rs) if len(rs) > 1 else 0.0,
            'far_mean': statistics.mean(r['far_accuracy'] for r in rs), 'far_sd': statistics.stdev(r['far_accuracy'] for r in rs) if len(rs) > 1 else 0.0,
            'inference_us_per_example_mean': statistics.mean(r['inference_us_per_example'] for r in rs),
            'train_seconds_mean': statistics.mean(r['train_seconds'] for r in rs),
        }
    return out

def main():
    p = argparse.ArgumentParser(); p.add_argument('--protocol', choices=('equal-state','equal-params'), default='equal-state'); p.add_argument('--state', type=int, default=16); p.add_argument('--target-params', type=int, default=4000); p.add_argument('--steps', type=int, default=6); p.add_argument('--epochs', type=int, default=10); p.add_argument('--train', type=int, default=1024); p.add_argument('--test', type=int, default=256); p.add_argument('--seeds', default='7,17,29'); p.add_argument('--out')
    a = p.parse_args(); seeds = [int(x) for x in a.seeds.split(',') if x.strip()]
    scalars = {m: a.state for m in CANDIDATES} if a.protocol == 'equal-state' else {m: nearest_scalars(m, a.target_params, a.steps) for m in CANDIDATES}
    rows = []
    for mode in ('vector','tensor','transformer'):
        for seed in seeds:
            r = run_experiment(mode, scalars[mode], a.steps, a.epochs, a.train, a.test, 128, seed)
            rows.append(asdict(r))
            print(f"{a.protocol} {mode} seed={seed} scalars={scalars[mode]} params={r.parameters} near={r.near_accuracy:.3f} far={r.far_accuracy:.3f}")
    result = {'protocol': a.protocol, 'steps': a.steps, 'epochs': a.epochs, 'train_examples': a.train, 'test_examples': a.test, 'seeds': seeds, 'selection': scalars, 'summary': aggregate(rows), 'runs': rows, 'note': 'Equal-state and equal-parameter protocols answer different questions. Neither protocol equalizes FLOPs; empirical inference time is reported instead.'}
    text = json.dumps(result, indent=2)
    if a.out: open(a.out, 'w', encoding='utf-8').write(text + '\n')
    print(text)
if __name__ == '__main__': main()
