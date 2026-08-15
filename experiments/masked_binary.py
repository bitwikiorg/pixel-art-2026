#!/usr/bin/env python3
"""CPU reference for masked binary reconstruction.

This is a small denoising/inpainting control. It is not an MPF advantage claim.
The model sees a 16x16 binary field with a configurable fraction hidden plus an
observed/masked indicator channel, and predicts the complete field. Evaluation
reports accuracy only on held-out hidden pixels and compares a local-majority
baseline on the same deterministic test set.
"""
from __future__ import annotations

import argparse
import json
import math
import random
import time

import torch
from torch import nn


def generate_pattern(size: int, seed: int) -> torch.Tensor:
    r = random.Random(seed)
    x = torch.zeros(size, size, dtype=torch.float32)
    mode = r.randrange(5)
    if mode == 0:
        x0, y0 = r.randrange(1, max(2, size - 5)), r.randrange(1, max(2, size - 5))
        w, h = r.randrange(3, max(4, size // 2 + 1)), r.randrange(3, max(4, size // 2 + 1))
        x1, y1 = min(size - 1, x0 + w - 1), min(size - 1, y0 + h - 1)
        x[y0:y1 + 1, x0] = 1; x[y0:y1 + 1, x1] = 1; x[y0, x0:x1 + 1] = 1; x[y1, x0:x1 + 1] = 1
    elif mode == 1:
        spacing = r.randrange(2, 6)
        if r.randrange(2):
            for col in range(r.randrange(spacing), size, spacing): x[1:-1, col] = 1
        else:
            for row in range(r.randrange(spacing), size, spacing): x[row, 1:-1] = 1
    elif mode == 2:
        off = r.randrange(-2, 3)
        for i in range(size):
            for col in (i, size - 1 - i):
                row = i + off
                if 0 <= row < size: x[row, col] = 1
    elif mode == 3:
        cx, cy = (size - 1) / 2 + r.uniform(-1.5, 1.5), (size - 1) / 2 + r.uniform(-1.5, 1.5)
        rad = size * r.uniform(0.2, 0.38)
        for yy in range(size):
            for xx in range(size):
                if abs(math.hypot(xx - cx, yy - cy) - rad) < 1.2: x[yy, xx] = 1
    else:
        half = math.ceil(size / 2)
        for yy in range(1, size - 1):
            for xx in range(1, half):
                if r.random() < 0.12 + 0.25 * math.exp(-abs(yy - size / 2) / 5):
                    x[yy, xx] = x[yy, size - 1 - xx] = 1
    return x


def make_dataset(count: int, size: int, mask_rate: float, seed: int) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
    inputs, targets, hidden = [], [], []
    for i in range(count):
        target = generate_pattern(size, seed + i * 104729)
        g = torch.Generator().manual_seed(seed ^ (i * 1000003 + 17))
        mask = torch.rand((size, size), generator=g) < mask_rate
        observed = target.clone(); observed[mask] = 0
        inp = torch.stack((observed, (~mask).float()), dim=0)
        inputs.append(inp); targets.append(target.unsqueeze(0)); hidden.append(mask)
    return torch.stack(inputs), torch.stack(targets), torch.stack(hidden)


def majority_baseline(inputs: torch.Tensor, hidden: torch.Tensor) -> torch.Tensor:
    # Average only observed neighboring pixels using 3x3 convolution.
    values = inputs[:, 0:1]
    known = inputs[:, 1:2]
    kernel = torch.ones((1, 1, 3, 3))
    ones = torch.nn.functional.conv2d(values, kernel, padding=1)
    count = torch.nn.functional.conv2d(known, kernel, padding=1)
    pred = (ones >= 0.5 * count.clamp_min(1)).float()
    pred = torch.where(known.bool(), values, pred)
    return pred


class TinyRecon(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(2, 8, 3, padding=1), nn.ReLU(),
            nn.Conv2d(8, 8, 3, padding=1), nn.ReLU(),
            nn.Conv2d(8, 1, 1),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)


def masked_accuracy(logits_or_bits: torch.Tensor, target: torch.Tensor, hidden: torch.Tensor, logits: bool = True) -> float:
    pred = (torch.sigmoid(logits_or_bits) >= 0.5) if logits else (logits_or_bits >= 0.5)
    truth = target.bool()
    mask = hidden.unsqueeze(1)
    return float((pred[mask] == truth[mask]).float().mean())


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument('--epochs', type=int, default=20)
    p.add_argument('--train', type=int, default=512)
    p.add_argument('--test', type=int, default=128)
    p.add_argument('--mask', type=float, default=0.5)
    p.add_argument('--seed', type=int, default=7)
    args = p.parse_args()
    torch.manual_seed(args.seed)
    torch.set_num_threads(max(1, min(4, torch.get_num_threads())))
    train_x, train_y, _ = make_dataset(args.train, 16, args.mask, args.seed)
    test_x, test_y, test_hidden = make_dataset(args.test, 16, args.mask, args.seed + 10_000_000)
    model = TinyRecon()
    opt = torch.optim.Adam(model.parameters(), lr=5e-3)
    loss_fn = nn.BCEWithLogitsLoss()
    started = time.perf_counter()
    for _ in range(args.epochs):
        perm = torch.randperm(args.train)
        for start in range(0, args.train, 64):
            idx = perm[start:start + 64]
            opt.zero_grad(set_to_none=True)
            logits = model(train_x[idx])
            loss = loss_fn(logits, train_y[idx])
            loss.backward(); opt.step()
    with torch.no_grad():
        logits = model(test_x)
        learned = masked_accuracy(logits, test_y, test_hidden, True)
        base = majority_baseline(test_x, test_hidden)
        baseline = masked_accuracy(base, test_y, test_hidden, False)
    result = {
        'seed': args.seed, 'mask_rate': args.mask, 'epochs': args.epochs,
        'train_examples': args.train, 'test_examples': args.test,
        'parameters': sum(p.numel() for p in model.parameters()),
        'baseline_masked_accuracy': baseline,
        'learned_masked_accuracy': learned,
        'seconds': time.perf_counter() - started,
    }
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
