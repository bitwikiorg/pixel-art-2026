#!/usr/bin/env python3
"""Trainable vector/tensor/micro-transformer pixel references.

The models share one synthetic spatial-relation task. This module is designed
for controlled *protocols*, not a single leaderboard. Equal-state and
approximately equal-parameter comparisons answer different questions and are
reported separately by benchmark_primitives.py.
"""
from __future__ import annotations

import argparse
import json
import math
import random
import time
from dataclasses import asdict, dataclass

import torch
from torch import nn
import torch.nn.functional as F
from torch.utils.data import DataLoader, Dataset

LABELS = ("LEFT", "RIGHT", "ABOVE", "BELOW")


class RelationDataset(Dataset):
    def __init__(self, count: int, grid: int, min_dist: int, max_dist: int, seed: int):
        self.count = count; self.grid = grid; self.min_dist = min_dist; self.max_dist = min(max_dist, grid - 1); self.seed = seed
        if self.min_dist < 1 or self.min_dist > self.max_dist: raise ValueError("invalid distance range")
    def __len__(self) -> int: return self.count
    def __getitem__(self, index: int):
        rng = random.Random(self.seed + index * 104729)
        n = self.grid; label = index % 4; dist = rng.randint(self.min_dist, self.max_dist)
        if label == 0:
            ax = rng.randrange(dist, n); ay = rng.randrange(n); bx, by = ax - dist, ay
        elif label == 1:
            ax = rng.randrange(0, n - dist); ay = rng.randrange(n); bx, by = ax + dist, ay
        elif label == 2:
            ax = rng.randrange(n); ay = rng.randrange(dist, n); bx, by = ax, ay - dist
        else:
            ax = rng.randrange(n); ay = rng.randrange(0, n - dist); bx, by = ax, ay + dist
        x = torch.zeros(2, n, n, dtype=torch.float32); x[0, ay, ax] = 1.0; x[1, by, bx] = 1.0
        return x, torch.tensor(label, dtype=torch.long)


class GatedLocalUpdate(nn.Module):
    def __init__(self, dim: int):
        super().__init__(); self.local = nn.Conv2d(dim, dim, 3, padding=1)
        self.update = nn.Sequential(nn.Conv2d(dim, dim * 2, 1), nn.SiLU(), nn.Conv2d(dim * 2, dim * 2, 1))
        nn.init.normal_(self.update[-1].weight, 0.0, 0.02); nn.init.zeros_(self.update[-1].bias)
    def forward(self, state):
        delta, gate = self.update(F.relu(self.local(state))).chunk(2, dim=1)
        return torch.tanh(state + torch.sigmoid(gate) * delta)


class VectorPixelNet(nn.Module):
    def __init__(self, scalars: int, steps: int):
        super().__init__(); self.steps = steps; self.scalars = scalars
        self.writer = nn.Conv2d(2, scalars, 1); self.transition = GatedLocalUpdate(scalars); self.readout = nn.Linear(scalars, 4)
    def forward(self, x):
        state = torch.tanh(self.writer(x))
        for _ in range(self.steps): state = self.transition(state)
        return self.readout(state.amax(dim=(2, 3)))


class TensorPixelUpdate(nn.Module):
    def __init__(self, side: int):
        super().__init__(); self.side = side; self.scalars = side * side
        self.outer = nn.Conv2d(self.scalars, self.scalars, 3, padding=1)
        self.row_mix = nn.Linear(side, side); self.col_mix = nn.Linear(side, side)
        self.update = nn.Sequential(nn.Conv2d(self.scalars * 2, self.scalars * 2, 1), nn.SiLU(), nn.Conv2d(self.scalars * 2, self.scalars * 2, 1))
        nn.init.normal_(self.update[-1].weight, 0.0, 0.02); nn.init.zeros_(self.update[-1].bias)
    def forward(self, state):
        b, c, h, w = state.shape
        outer = F.relu(self.outer(state))
        tensor = state.permute(0, 2, 3, 1).reshape(b, h, w, self.side, self.side)
        row = self.row_mix(tensor); col = self.col_mix(tensor.transpose(-1, -2)).transpose(-1, -2)
        inner = F.silu(row + col).reshape(b, h, w, c).permute(0, 3, 1, 2)
        delta, gate = self.update(torch.cat((outer, inner), dim=1)).chunk(2, dim=1)
        return torch.tanh(state + torch.sigmoid(gate) * delta)


class TensorPixelNet(nn.Module):
    def __init__(self, side: int, steps: int):
        super().__init__(); self.steps = steps; self.scalars = side * side
        self.writer = nn.Conv2d(2, self.scalars, 1); self.transition = TensorPixelUpdate(side); self.readout = nn.Linear(self.scalars, 4)
    def forward(self, x):
        state = torch.tanh(self.writer(x))
        for _ in range(self.steps): state = self.transition(state)
        return self.readout(state.amax(dim=(2, 3)))


class TransformerPixelUpdate(nn.Module):
    def __init__(self, tokens: int, dim: int):
        super().__init__(); self.tokens = tokens; self.dim = dim; self.scalars = tokens * dim
        self.outer = nn.Conv2d(self.scalars, self.scalars, 3, padding=1)
        self.q = nn.Linear(dim, dim); self.k = nn.Linear(dim, dim); self.v = nn.Linear(dim, dim); self.o = nn.Linear(dim, dim)
        self.norm1 = nn.LayerNorm(dim); self.ff = nn.Sequential(nn.Linear(dim, dim * 2), nn.GELU(), nn.Linear(dim * 2, dim)); self.norm2 = nn.LayerNorm(dim); self.gate = nn.Linear(dim, dim)
    def forward(self, state):
        b, h, w, k, d = state.shape
        flat = state.reshape(b, h, w, k * d).permute(0, 3, 1, 2)
        message = self.outer(flat).permute(0, 2, 3, 1).reshape(b, h, w, k, d)
        tokens = state + 0.35 * torch.tanh(message)
        q, key, value = self.q(tokens), self.k(tokens), self.v(tokens)
        attn = torch.softmax(torch.matmul(q, key.transpose(-1, -2)) / math.sqrt(d), dim=-1)
        hidden = self.norm1(tokens + self.o(torch.matmul(attn, value)))
        mixed = self.norm2(hidden + self.ff(hidden)); gate = torch.sigmoid(self.gate(hidden))
        return torch.tanh(hidden + gate * (mixed - hidden))


class TransformerPixelNet(nn.Module):
    def __init__(self, tokens: int, dim: int, steps: int):
        super().__init__(); self.tokens = tokens; self.dim = dim; self.scalars = tokens * dim; self.steps = steps
        self.writer = nn.Conv2d(2, self.scalars, 1); self.token_roles = nn.Parameter(torch.randn(1, 1, 1, tokens, dim) * 0.05)
        self.transition = TransformerPixelUpdate(tokens, dim); self.pixel_read = nn.Sequential(nn.Linear(self.scalars, self.scalars), nn.SiLU()); self.readout = nn.Linear(self.scalars, 4)
    def forward(self, x):
        b, _, h, w = x.shape
        raw = self.writer(x).permute(0, 2, 3, 1).reshape(b, h, w, self.tokens, self.dim)
        state = torch.tanh(raw + self.token_roles)
        for _ in range(self.steps): state = self.transition(state)
        pixel = self.pixel_read(state.reshape(b, h, w, self.scalars))
        return self.readout(pixel.amax(dim=(1, 2)))


def make_model(mode: str, scalars: int, steps: int) -> tuple[nn.Module, str]:
    if mode == "vector": return VectorPixelNet(scalars, steps), f"{scalars}D vector"
    if mode == "tensor":
        side = math.isqrt(scalars)
        if side * side != scalars: raise ValueError("tensor scalars must be a perfect square")
        return TensorPixelNet(side, steps), f"{side}x{side} tensor"
    if mode == "transformer":
        if scalars % 2: raise ValueError("transformer scalars must be even")
        return TransformerPixelNet(2, scalars // 2, steps), f"2 tokens x {scalars // 2}D"
    raise ValueError(mode)


def parameter_count(mode: str, scalars: int, steps: int = 6) -> int:
    model, _ = make_model(mode, scalars, steps)
    return sum(p.numel() for p in model.parameters())


@dataclass
class Result:
    mode: str; scalars_per_pixel: int; internal_shape: str; parameters: int; grid: int; epochs: int; steps: int; seed: int
    train_accuracy: float; near_accuracy: float; far_accuracy: float; train_seconds: float; inference_us_per_example: float


def accuracy(model, loader) -> float:
    model.eval(); good = total = 0
    with torch.no_grad():
        for x, y in loader:
            good += int((model(x).argmax(1) == y).sum()); total += y.numel()
    return good / max(total, 1)


def run_experiment(mode: str, scalars: int = 16, steps: int = 6, epochs: int = 15, train_count: int = 2048, test_count: int = 256, batch: int = 128, seed: int = 7, lr: float = 3e-3, grid: int = 12) -> Result:
    random.seed(seed); torch.manual_seed(seed); torch.set_num_threads(max(1, min(4, torch.get_num_threads())))
    near_max = min(4, grid - 2); far_min = min(5, grid - 1); far_max = min(8, grid - 1)
    train_ds = RelationDataset(train_count, grid, 2, near_max, seed); near_ds = RelationDataset(test_count, grid, 2, near_max, seed + 1_000_000); far_ds = RelationDataset(test_count, grid, far_min, far_max, seed + 2_000_000)
    generator = torch.Generator().manual_seed(seed + 77)
    train_loader = DataLoader(train_ds, batch_size=batch, shuffle=True, generator=generator); train_eval = DataLoader(train_ds, batch_size=batch); near_loader = DataLoader(near_ds, batch_size=batch); far_loader = DataLoader(far_ds, batch_size=batch)
    model, shape = make_model(mode, scalars, steps); opt = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4); loss_fn = nn.CrossEntropyLoss()
    started = time.perf_counter()
    for _ in range(epochs):
        model.train()
        for x, y in train_loader:
            opt.zero_grad(set_to_none=True); logits = model(x); loss = loss_fn(logits, y); loss.backward(); nn.utils.clip_grad_norm_(model.parameters(), 1.0); opt.step()
    train_seconds = time.perf_counter() - started
    probe_x, _ = next(iter(near_loader));
    model.eval()
    with torch.no_grad():
        for _ in range(3): model(probe_x)
        t0 = time.perf_counter()
        repeats = 10
        for _ in range(repeats): model(probe_x)
        inference_us = (time.perf_counter() - t0) * 1e6 / (repeats * probe_x.shape[0])
    return Result(mode, scalars, shape, sum(p.numel() for p in model.parameters()), grid, epochs, steps, seed, accuracy(model, train_eval), accuracy(model, near_loader), accuracy(model, far_loader), train_seconds, inference_us)


def main() -> None:
    p = argparse.ArgumentParser(); p.add_argument('--mode', choices=('vector','tensor','transformer'), default='vector'); p.add_argument('--scalars', type=int, default=16); p.add_argument('--steps', type=int, default=6); p.add_argument('--epochs', type=int, default=15); p.add_argument('--train', type=int, default=2048); p.add_argument('--test', type=int, default=256); p.add_argument('--batch', type=int, default=128); p.add_argument('--seed', type=int, default=7); p.add_argument('--grid', type=int, default=12)
    a = p.parse_args(); print(json.dumps(asdict(run_experiment(a.mode, a.scalars, a.steps, a.epochs, a.train, a.test, a.batch, a.seed, grid=a.grid)), indent=2))
if __name__ == '__main__': main()
