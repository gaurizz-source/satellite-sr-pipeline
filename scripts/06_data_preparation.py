import sys
import torch
import matplotlib.pyplot as plt

from importlib.machinery import SourceFileLoader

sys.path.append("scripts")

dataset_module = SourceFileLoader(
    "pytorch_dataset",
    "scripts/05_pytorch_dataset.py"
).load_module()

SatelliteSRDataset = dataset_module.SatelliteSRDataset

DB_PATH = "data/satellite_catalog.duckdb"
SCALE_FACTOR = 3000.0

dataset = SatelliteSRDataset(
    db_path=DB_PATH,
    normalize=False
)

print("\n========== DATASET INFORMATION ==========")
print("Number of samples:", len(dataset))

sample = dataset[0]

lr = sample["lr"]
hr = sample["hr"]
patch_id = sample["patch_id"]

print("\n========== SAMPLE INFORMATION ==========")
print("Patch ID:", patch_id)
print("LR shape:", lr.shape)
print("HR shape:", hr.shape)
print("LR dtype:", lr.dtype)
print("HR dtype:", hr.dtype)
print("LR minimum:", lr.min().item())
print("LR maximum:", lr.max().item())
print("HR minimum:", hr.min().item())
print("HR maximum:", hr.max().item())

assert lr.ndim == 3, "LR image must have 3 dimensions: [C, H, W]"
assert hr.ndim == 3, "HR image must have 3 dimensions: [C, H, W]"

assert lr.shape[0] == 4, "Expected 4 spectral bands in LR image"
assert hr.shape[0] == 4, "Expected 4 spectral bands in HR image"

print("\n========== SHAPE VALIDATION ==========")
print("LR channels:", lr.shape[0])
print("HR channels:", hr.shape[0])
print("LR spatial size:", lr.shape[1], "x", lr.shape[2])
print("HR spatial size:", hr.shape[1], "x", hr.shape[2])

scale_h = hr.shape[1] / lr.shape[1]
scale_w = hr.shape[2] / lr.shape[2]

print("\n========== SCALE VALIDATION ==========")
print("Height scale:", scale_h)
print("Width scale:", scale_w)

assert scale_h == 4, "Expected 4x height scaling"
assert scale_w == 4, "Expected 4x width scaling"

print("4x LR → HR relationship confirmed.")

lr_normalized = lr / SCALE_FACTOR
hr_normalized = hr / SCALE_FACTOR

print("\n========== NORMALISATION ==========")

print(
    "Normalised LR range:",
    lr_normalized.min().item(),
    "to",
    lr_normalized.max().item()
)

print(
    "Normalised HR range:",
    hr_normalized.min().item(),
    "to",
    hr_normalized.max().item()
)

print("\n========== VALUE VALIDATION ==========")

print(
    "LR contains NaN:",
    torch.isnan(lr_normalized).any().item()
)

print(
    "HR contains NaN:",
    torch.isnan(hr_normalized).any().item()
)

print(
    "LR contains Inf:",
    torch.isinf(lr_normalized).any().item()
)

print(
    "HR contains Inf:",
    torch.isinf(hr_normalized).any().item()
)

rgb = lr_normalized[[0, 1, 2]].permute(1, 2, 0)
rgb = torch.clamp(rgb, 0, 1)

plt.figure(figsize=(6, 6))
plt.imshow(rgb.numpy())
plt.title(f"LR Satellite Image - {patch_id}")
plt.axis("off")
plt.show()

hr_rgb = hr_normalized[[0, 1, 2]].permute(1, 2, 0)
hr_rgb = torch.clamp(hr_rgb, 0, 1)

plt.figure(figsize=(6, 6))
plt.imshow(hr_rgb.numpy())
plt.title(f"HR Reference Image - {patch_id}")
plt.axis("off")
plt.show()

print("\n========== DATA PREPARATION COMPLETE ==========")