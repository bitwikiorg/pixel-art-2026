#!/usr/bin/env python3
"""CPU-safe trainable comparison of vector, tensor, and micro-transformer pixels.

All modes solve the same synthetic spatial-relation task and use the same number
of scalar state values per outer pixel. The comparison changes the *internal
interpretation* of those scalars rather than pretending MPF is one architecture.

Examples:
  python experiments/pixel_primitives.py --mode vector
  python experiments/pixel_primitives.py --mode tensor
  python experiments/pixel_primitives.py --mode transformer
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


class GatedLocalUpdate(nn.Module):
    """Stable shared recurrent update used by the flat-vector control."""

    def __init__(self, dim: int):
        super().__init__()
        self.local = nn.Conv2d(dim, dim, 3, padding=1)
        self.update = nn.Sequential(
            nn.Conv2d(dim, dim * 2, 1),
            nn.SiLU(),
            nn.Conv2d(dim * 2, dim * 2, 1),
        )
        nn.init.normal_(self.update[-1].weight, mean=0.0, std=0.02)
        nn.init.zeros_(self.update[-1].bias)

    def forward(self, state: torch.Tensor) -> torch.Tensor:
        features = F.relu(self.local(state))
        delta, gate = self.update(features).chunk(2, dim=1)
        return torch.tanh(state + torch.sigmoid(gate) * delta)


class VectorPixelNet(nn.Module):
    """One flat D-dimensional vector at each outer address."""

    def __init__(self, scalars: int, steps: int):
        super().__init__()
        self.steps = steps
        self.writer = nn.Conv2d(2, scalars, 1)
        self.transition = GatedLocalUpdate(scalars)
        self.readout = nn.Linear(scalars, len(LABELS))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        state = torch.tanh(self.writer(x))
        for _ in range(self.steps):
            state = self.transition(state)
        pooled = state.amax(dim=(2, 3))
        return self.readout(pooled)


class TensorPixelUpdate(nn.Module):
    """Shared update that explicitly processes a square tensor inside each pixel."""

    def __init__(self, side: int):
        super().__init__()
        self.side = side
        self.scalars = side * side
        # Outer communication acts over the spatial field.
        self.outer = nn.Conv2d(self.scalars, self.scalars, 3, padding=1)
        # Inner communication respects the two axes *inside* every tensor pixel.
        # Two tiny shared linear maps are much cheaper on CPU than launching a
        # convolution for every outer pixel.
        self.row_mix = nn.Linear(side, side)
        self.col_mix = nn.Linear(side, side)
        self.update = nn.Sequential(
            nn.Conv2d(self.scalars * 2, self.scalars * 2, 1),
            nn.SiLU(),
            nn.Conv2d(self.scalars * 2, self.scalars * 2, 1),
        )
        nn.init.normal_(self.update[-1].weight, mean=0.0, std=0.02)
        nn.init.zeros_(self.update[-1].bias)

    def forward(self, state: torch.Tensor) -> torch.Tensor:
        b, c, h, w = state.shape
        outer = F.relu(self.outer(state))
        tensor = state.permute(0, 2, 3, 1).reshape(b, h, w, self.side, self.side)
        row = self.row_mix(tensor)
        col = self.col_mix(tensor.transpose(-1, -2)).transpose(-1, -2)
        inner = F.silu(row + col).reshape(b, h, w, c).permute(0, 3, 1, 2)
        features = torch.cat((outer, inner), dim=1)
        delta, gate = self.update(features).chunk(2, dim=1)
        return torch.tanh(state + torch.sigmoid(gate) * delta)


class TensorPixelNet(nn.Module):
    """Each outer pixel contains a side×side latent tensor."""

    def __init__(self, side: int, steps: int):
        super().__init__()
        self.side = side
        self.scalars = side * side
        self.steps = steps
        self.writer = nn.Conv2d(2, self.scalars, 1)
        self.transition = TensorPixelUpdate(side)
        self.readout = nn.Linear(self.scalars, len(LABELS))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        state = torch.tanh(self.writer(x))
        for _ in range(self.steps):
            state = self.transition(state)
        pooled = state.amax(dim=(2, 3))
        return self.readout(pooled)


class TransformerPixelUpdate(nn.Module):
    """Shared micro-transformer inside each outer pixel plus outer-grid messages."""

    def __init__(self, tokens: int, dim: int):
        super().__init__()
        self.tokens = tokens
        self.dim = dim
        self.scalars = tokens * dim
        # Communication between outer pixels sees the full flattened token state.
        self.outer = nn.Conv2d(self.scalars, self.scalars, 3, padding=1)
        # Manual tiny self-attention avoids the CPU overhead of launching one
        # MultiheadAttention instance for every outer pixel.
        self.q = nn.Linear(dim, dim)
        self.k = nn.Linear(dim, dim)
        self.v = nn.Linear(dim, dim)
        self.o = nn.Linear(dim, dim)
        self.norm1 = nn.LayerNorm(dim)
        self.ff = nn.Sequential(nn.Linear(dim, dim * 2), nn.GELU(), nn.Linear(dim * 2, dim))
        self.norm2 = nn.LayerNorm(dim)
        self.gate = nn.Linear(dim, dim)

    def forward(self, state: torch.Tensor) -> torch.Tensor:
        # state: [B,H,W,K,D]
        b, h, w, k, d = state.shape
        flat_outer = state.reshape(b, h, w, k * d).permute(0, 3, 1, 2)
        message = self.outer(flat_outer).permute(0, 2, 3, 1).reshape(b, h, w, k, d)
        tokens = state + 0.35 * torch.tanh(message)

        q, key, value = self.q(tokens), self.k(tokens), self.v(tokens)
        scores = torch.matmul(q, key.transpose(-1, -2)) / math.sqrt(d)
        weights = torch.softmax(scores, dim=-1)
        attended = self.o(torch.matmul(weights, value))
        hidden = self.norm1(tokens + attended)
        mixed = self.norm2(hidden + self.ff(hidden))
        gate = torch.sigmoid(self.gate(hidden))
        return torch.tanh(hidden + gate * (mixed - hidden))


class TransformerPixelNet(nn.Module):
    """Each outer pixel contains K internal tokens processed by shared self-attention."""

    def __init__(self, tokens: int, dim: int, steps: int):
        super().__init__()
        self.tokens = tokens
        self.dim = dim
        self.scalars = tokens * dim
        self.steps = steps
        self.writer = nn.Conv2d(2, self.scalars, 1)
        self.token_roles = nn.Parameter(torch.randn(1, 1, 1, tokens, dim) * 0.05)
        self.transition = TransformerPixelUpdate(tokens, dim)
        # Preserve token identity before outer max pooling; do not max tokens away first.
        self.pixel_read = nn.Sequential(
            nn.Linear(self.scalars, self.scalars),
            nn.SiLU(),
        )
        self.readout = nn.Linear(self.scalars, len(LABELS))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        b, _, h, w = x.shape
        raw = self.writer(x).permute(0, 2, 3, 1).reshape(b, h, w, self.tokens, self.dim)
        state = torch.tanh(raw + self.token_roles)
        for _ in range(self.steps):
            state = self.transition(state)
        pixel = self.pixel_read(state.reshape(b, h, w, self.scalars))
        pooled = pixel.amax(dim=(1, 2))
        return self.readout(pooled)


@dataclass
class Result:
    mode: str
    scalars_per_pixel: int
    internal_shape: str
    parameters: int
    grid: int
    epochs: int
    steps: int
    train_accuracy: float
    near_accuracy: float
    far_accuracy: float
    seconds: float
    device: str
    seed: int


def accuracy(model: nn.Module, loader: DataLoader, device: torch.device) -> float:
    model.eval()
    good = total = 0
    with torch.no_grad():
        for x, y in loader:
            x, y = x.to(device), y.to(device)
            good += int((model(x).argmax(1) == y).sum())
            total += y.numel()
    return good / max(1, total)


def make_model(mode: str, scalars: int, steps: int) -> tuple[nn.Module, str]:
    if mode == "vector":
        return VectorPixelNet(scalars, steps), f"{scalars}D vector"
    if mode == "tensor":
        side = math.isqrt(scalars)
        if side * side != scalars:
            raise ValueError("tensor mode requires --scalars to be a perfect square")
        return TensorPixelNet(side, steps), f"{side}x{side} tensor"
    if mode == "transformer":
        tokens = 2
        if scalars % tokens:
            raise ValueError("transformer mode requires --scalars divisible by 2")
        dim = scalars // tokens
        return TransformerPixelNet(tokens, dim, steps), f"{tokens} tokens x {dim}D"
    raise ValueError(mode)


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--mode", choices=("vector", "tensor", "transformer"), default="vector")
    p.add_argument("--grid", type=int, default=12)
    p.add_argument("--scalars", type=int, default=16)
    p.add_argument("--steps", type=int, default=6)
    p.add_argument("--epochs", type=int, default=15)
    p.add_argument("--train", type=int, default=2048)
    p.add_argument("--test", type=int, default=256)
    p.add_argument("--batch", type=int, default=128)
    p.add_argument("--seed", type=int, default=7)
    p.add_argument("--lr", type=float, default=3e-3)
    p.add_argument("--json", action="store_true")
    args = p.parse_args()

    random.seed(args.seed)
    torch.manual_seed(args.seed)
    torch.set_num_threads(max(1, min(4, torch.get_num_threads())))
    device = torch.device("cpu")

    near_max = min(4, args.grid - 2)
    far_min = min(5, args.grid - 1)
    far_max = min(8, args.grid - 1)
    if far_min > far_max:
        far_min = far_max

    train_ds = RelationDataset(args.train, args.grid, 2, near_max, args.seed)
    near_ds = RelationDataset(args.test, args.grid, 2, near_max, args.seed + 1_000_000)
    far_ds = RelationDataset(args.test, args.grid, far_min, far_max, args.seed + 2_000_000)
    train_loader = DataLoader(train_ds, batch_size=args.batch, shuffle=True)
    train_eval_loader = DataLoader(train_ds, batch_size=args.batch)
    near_loader = DataLoader(near_ds, batch_size=args.batch)
    far_loader = DataLoader(far_ds, batch_size=args.batch)

    model, shape = make_model(args.mode, args.scalars, args.steps)
    model = model.to(device)
    opt = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    loss_fn = nn.CrossEntropyLoss()
    started = time.perf_counter()

    for epoch in range(1, args.epochs + 1):
        model.train()
        good = total = 0
        loss_sum = 0.0
        for x, y in train_loader:
            x, y = x.to(device), y.to(device)
            opt.zero_grad(set_to_none=True)
            logits = model(x)
            loss = loss_fn(logits, y)
            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            opt.step()
            loss_sum += float(loss.detach()) * y.numel()
            good += int((logits.argmax(1) == y).sum())
            total += y.numel()
        if not args.json and (epoch == 1 or epoch == args.epochs or epoch % 5 == 0):
            print(f"epoch {epoch:02d} | loss {loss_sum/total:.4f} | train {100*good/total:6.2f}%")

    seconds = time.perf_counter() - started
    result = Result(
        mode=args.mode,
        scalars_per_pixel=args.scalars,
        internal_shape=shape,
        parameters=sum(p.numel() for p in model.parameters()),
        grid=args.grid,
        epochs=args.epochs,
        steps=args.steps,
        train_accuracy=accuracy(model, train_eval_loader, device),
        near_accuracy=accuracy(model, near_loader, device),
        far_accuracy=accuracy(model, far_loader, device),
        seconds=seconds,
        device=str(device),
        seed=args.seed,
    )
    print(json.dumps(asdict(result), indent=2))


if __name__ == "__main__":
    main()
