#!/usr/bin/env python3
"""Train a small recurrent multidimensional pixel field on spatial relations.

This is the reference implementation behind the browser learning lab.  It is
intentionally small and readable: every grid location holds a D-dimensional
state, a shared local neural rule is applied repeatedly, and a weak global
readout predicts where marker B is relative to marker A.

Examples
--------
python experiments/mpf_relations.py --epochs 20 --steps 6
python experiments/mpf_relations.py --topology per_step --epochs 20 --steps 6
python experiments/mpf_relations.py --grid 16 --dim 32 --steps 10 --epochs 30
"""
from __future__ import annotations

import argparse
import json
import random
import time
from dataclasses import asdict, dataclass

import torch
from torch import nn
from torch.utils.data import DataLoader, Dataset

LABELS = ("LEFT", "RIGHT", "ABOVE", "BELOW")


@dataclass
class Config:
    grid: int = 12
    dim: int = 24
    steps: int = 6
    epochs: int = 20
    train_samples: int = 4096
    test_samples: int = 1024
    batch_size: int = 128
    lr: float = 3e-3
    seed: int = 7
    near_min: int = 2
    near_max: int = 4
    far_min: int = 5
    far_max: int = 8
    topology: str = "persistent"
    device: str = "auto"


class RelationDataset(Dataset):
    """Aligned A/B marker pairs with a four-way relative-direction label."""

    def __init__(self, count: int, grid: int, min_dist: int, max_dist: int, seed: int):
        self.count = count
        self.grid = grid
        self.min_dist = min_dist
        self.max_dist = min(max_dist, grid - 1)
        self.seed = seed

    def __len__(self) -> int:
        return self.count

    def __getitem__(self, index: int):
        rng = random.Random(self.seed + index * 104729)
        n = self.grid
        label = rng.randrange(4)
        dist = rng.randint(self.min_dist, self.max_dist)

        if label == 0:  # B left of A
            ax = rng.randrange(dist, n)
            ay = rng.randrange(n)
            bx, by = ax - dist, ay
        elif label == 1:  # B right of A
            ax = rng.randrange(0, n - dist)
            ay = rng.randrange(n)
            bx, by = ax + dist, ay
        elif label == 2:  # B above A
            ax = rng.randrange(n)
            ay = rng.randrange(dist, n)
            bx, by = ax, ay - dist
        else:  # B below A
            ax = rng.randrange(n)
            ay = rng.randrange(0, n - dist)
            bx, by = ax, ay + dist

        x = torch.zeros(2, n, n, dtype=torch.float32)
        x[0, ay, ax] = 1.0
        x[1, by, bx] = 1.0
        return x, torch.tensor(label, dtype=torch.long)


class SharedLocalUpdate(nn.Module):
    """One learned local transition rule reused at every cell and time step."""

    def __init__(self, dim: int, hidden: int | None = None):
        super().__init__()
        hidden = hidden or dim * 2
        self.local = nn.Conv2d(dim, dim, kernel_size=3, padding=1)
        self.update = nn.Sequential(
            nn.Conv2d(dim, hidden, kernel_size=1),
            nn.SiLU(),
            nn.Conv2d(hidden, dim * 2, kernel_size=1),
        )
        # Small residual updates keep recurrence stable without blocking early spatial learning.
        nn.init.normal_(self.update[-1].weight, mean=0.0, std=0.02)
        nn.init.zeros_(self.update[-1].bias)

    def forward(self, state: torch.Tensor) -> torch.Tensor:
        features = torch.relu(self.local(state))
        delta, gate = self.update(features).chunk(2, dim=1)
        return torch.tanh(state + torch.sigmoid(gate) * delta)


class MPFLocal(nn.Module):
    """Persistent recurrent field with optional location-destroying controls."""

    def __init__(self, grid: int, dim: int, steps: int, topology: str = "persistent"):
        super().__init__()
        if topology not in {"persistent", "fixed", "per_step"}:
            raise ValueError(f"unknown topology mode: {topology}")
        self.grid = grid
        self.dim = dim
        self.steps = steps
        self.topology = topology
        self.writer = nn.Conv2d(2, dim, kernel_size=1)
        self.transition = SharedLocalUpdate(dim)
        self.readout = nn.Linear(dim, len(LABELS))
        self.register_buffer("fixed_perm", torch.randperm(grid * grid), persistent=False)

    def _permute(self, state: torch.Tensor, perm: torch.Tensor) -> torch.Tensor:
        b, d, h, w = state.shape
        flat = state.flatten(2)  # [B,D,N]
        return flat.index_select(2, perm).view(b, d, h, w)

    def forward(self, x: torch.Tensor, return_trace: bool = False):
        state = torch.tanh(self.writer(x))
        if self.topology == "fixed":
            state = self._permute(state, self.fixed_perm)

        trace = [state] if return_trace else None
        for _ in range(self.steps):
            if self.topology == "per_step":
                perm = torch.randperm(self.grid * self.grid, device=state.device)
                state = self._permute(state, perm)
            state = self.transition(state)
            if return_trace:
                trace.append(state)

        # Global max pooling keeps the readout small while allowing a learned local
        # detector to report a relation wherever it emerges in the field.
        pooled = state.amax(dim=(2, 3))
        logits = self.readout(pooled)
        return (logits, trace) if return_trace else logits


def accuracy(model: nn.Module, loader: DataLoader, device: torch.device) -> float:
    model.eval()
    correct = total = 0
    with torch.no_grad():
        for x, y in loader:
            x, y = x.to(device), y.to(device)
            pred = model(x).argmax(dim=1)
            correct += int((pred == y).sum())
            total += y.numel()
    return correct / max(total, 1)


def train(cfg: Config) -> dict:
    random.seed(cfg.seed)
    torch.manual_seed(cfg.seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(cfg.seed)

    if cfg.device == "auto":
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    else:
        device = torch.device(cfg.device)

    train_ds = RelationDataset(cfg.train_samples, cfg.grid, cfg.near_min, cfg.near_max, cfg.seed)
    near_ds = RelationDataset(cfg.test_samples, cfg.grid, cfg.near_min, cfg.near_max, cfg.seed + 1_000_000)
    far_ds = RelationDataset(cfg.test_samples, cfg.grid, cfg.far_min, cfg.far_max, cfg.seed + 2_000_000)
    train_loader = DataLoader(train_ds, batch_size=cfg.batch_size, shuffle=True)
    near_loader = DataLoader(near_ds, batch_size=cfg.batch_size)
    far_loader = DataLoader(far_ds, batch_size=cfg.batch_size)

    model = MPFLocal(cfg.grid, cfg.dim, cfg.steps, cfg.topology).to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=cfg.lr, weight_decay=1e-4)
    criterion = nn.CrossEntropyLoss()
    parameter_count = sum(p.numel() for p in model.parameters())

    started = time.time()
    history = []
    for epoch in range(1, cfg.epochs + 1):
        model.train()
        total_loss = total_correct = total_items = 0
        for x, y in train_loader:
            x, y = x.to(device), y.to(device)
            optimizer.zero_grad(set_to_none=True)
            logits = model(x)
            loss = criterion(logits, y)
            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()

            total_loss += float(loss.detach()) * y.numel()
            total_correct += int((logits.argmax(dim=1) == y).sum())
            total_items += y.numel()

        row = {
            "epoch": epoch,
            "loss": total_loss / total_items,
            "train_accuracy": total_correct / total_items,
        }
        history.append(row)
        if epoch == 1 or epoch % 5 == 0 or epoch == cfg.epochs:
            print(
                f"epoch {epoch:03d} | loss {row['loss']:.4f} | "
                f"train {row['train_accuracy']*100:6.2f}%"
            )

    near = accuracy(model, near_loader, device)
    far = accuracy(model, far_loader, device)
    elapsed = time.time() - started

    results = {
        "config": asdict(cfg),
        "device": str(device),
        "parameters": parameter_count,
        "train_seconds": elapsed,
        "near_accuracy": near,
        "far_accuracy": far,
        "history": history,
    }
    print(f"near-distance accuracy:   {near*100:.2f}%")
    print(f"longer-distance accuracy: {far*100:.2f}%")
    print(f"parameters: {parameter_count:,} | device: {device} | time: {elapsed:.1f}s")
    return results


def parse_args() -> Config:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--grid", type=int, default=12)
    p.add_argument("--dim", type=int, default=24)
    p.add_argument("--steps", type=int, default=6)
    p.add_argument("--epochs", type=int, default=20)
    p.add_argument("--train-samples", type=int, default=4096)
    p.add_argument("--test-samples", type=int, default=1024)
    p.add_argument("--batch-size", type=int, default=128)
    p.add_argument("--lr", type=float, default=3e-3)
    p.add_argument("--seed", type=int, default=7)
    p.add_argument("--near-min", type=int, default=2)
    p.add_argument("--near-max", type=int, default=4)
    p.add_argument("--far-min", type=int, default=5)
    p.add_argument("--far-max", type=int, default=8)
    p.add_argument("--topology", choices=("persistent", "fixed", "per_step"), default="persistent")
    p.add_argument("--device", default="auto")
    p.add_argument("--json", dest="json_path", default=None, help="optional output path for result JSON")
    args = p.parse_args()
    cfg = Config(**{k: v for k, v in vars(args).items() if k != "json_path"})
    cfg._json_path = args.json_path  # convenience, intentionally not serialized
    return cfg


if __name__ == "__main__":
    config = parse_args()
    out_path = getattr(config, "_json_path", None)
    result = train(config)
    if out_path:
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2)
        print(f"wrote {out_path}")
