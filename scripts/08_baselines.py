%%writefile scripts/08_baselines.py

import json
import sys
import torch
import torch.nn.functional as F
import matplotlib.pyplot as plt

from importlib.machinery import SourceFileLoader


# ============================================================
# IMPORT DATASET FROM STEP 05
# ============================================================

sys.path.append("scripts")

dataset_module = SourceFileLoader(
    "pytorch_dataset",
    "scripts/05_pytorch_dataset.py"
).load_module()

SatelliteSRDataset = dataset_module.SatelliteSRDataset


# ============================================================
# CONFIGURATION
# ============================================================

DB_PATH = "data/satellite_catalog.duckdb"
SPLIT_PATH = "data/train_val_test_split.json"

SCALE_FACTOR = 3000.0

# We first test a few samples.
# Step 09 will handle full metric evaluation.
NUM_VISUAL_SAMPLES = 3


# ============================================================
# LOAD DATASET
# ============================================================

print("Loading SEN2NAIPv2 dataset...")

dataset = SatelliteSRDataset(
    db_path=DB_PATH,
    normalize=False
)

print("Total dataset samples:", len(dataset))


# ============================================================
# LOAD TRAIN / VALIDATION / TEST SPLIT
# ============================================================

with open(SPLIT_PATH, "r") as f:
    split_data = json.load(f)

test_ids = [str(x) for x in split_data["test"]]

print("Test samples:", len(test_ids))


# ============================================================
# MAP PATCH IDs TO DATASET INDICES
# ============================================================

patch_to_index = {
    str(patch_id): index
    for index, (patch_id, _) in enumerate(dataset.samples)
}

missing_ids = [
    patch_id
    for patch_id in test_ids
    if patch_id not in patch_to_index
]

assert len(missing_ids) == 0, (
    f"Some test patch IDs were not found: {missing_ids[:5]}"
)

print("All test patch IDs found.")


# ============================================================
# BASELINE FUNCTIONS
# ============================================================

def bilinear_baseline(lr):
    """
    Upscale LR image using bilinear interpolation.

    Input:
        [C, 130, 130]

    Output:
        [C, 520, 520]
    """

    lr_batch = lr.unsqueeze(0)

    output = F.interpolate(
        lr_batch,
        size=(520, 520),
        mode="bilinear",
        align_corners=False
    )

    return output.squeeze(0)


def bicubic_baseline(lr):
    """
    Upscale LR image using bicubic interpolation.

    Input:
        [C, 130, 130]

    Output:
        [C, 520, 520]
    """

    lr_batch = lr.unsqueeze(0)

    output = F.interpolate(
        lr_batch,
        size=(520, 520),
        mode="bicubic",
        align_corners=False
    )

    return output.squeeze(0)


# ============================================================
# TEST BASELINES
# ============================================================

print("\n========== BASELINE TEST ==========")

for patch_id in test_ids[:NUM_VISUAL_SAMPLES]:

    dataset_index = patch_to_index[patch_id]

    sample = dataset[dataset_index]

    lr = sample["lr"]
    hr = sample["hr"]

    bilinear = bilinear_baseline(lr)
    bicubic = bicubic_baseline(lr)

    print("\nPatch ID:", patch_id)

    print("LR shape:", tuple(lr.shape))
    print("Bilinear shape:", tuple(bilinear.shape))
    print("Bicubic shape:", tuple(bicubic.shape))
    print("HR shape:", tuple(hr.shape))

    # --------------------------------------------------------
    # Shape validation
    # --------------------------------------------------------

    assert lr.shape == (4, 130, 130)
    assert bilinear.shape == (4, 520, 520)
    assert bicubic.shape == (4, 520, 520)
    assert hr.shape == (4, 520, 520)

    # --------------------------------------------------------
    # Check invalid values
    # --------------------------------------------------------

    assert not torch.isnan(bilinear).any()
    assert not torch.isnan(bicubic).any()

    assert not torch.isinf(bilinear).any()
    assert not torch.isinf(bicubic).any()

    # --------------------------------------------------------
    # Prepare RGB images for visualisation
    # Bands:
    # 0 = Red
    # 1 = Green
    # 2 = Blue
    # 3 = NIR
    # --------------------------------------------------------

    lr_rgb = lr[[0, 1, 2]].permute(1, 2, 0)
    bilinear_rgb = bilinear[[0, 1, 2]].permute(1, 2, 0)
    bicubic_rgb = bicubic[[0, 1, 2]].permute(1, 2, 0)
    hr_rgb = hr[[0, 1, 2]].permute(1, 2, 0)

    lr_rgb = torch.clamp(lr_rgb / SCALE_FACTOR, 0, 1)
    bilinear_rgb = torch.clamp(
        bilinear_rgb / SCALE_FACTOR, 0, 1
    )
    bicubic_rgb = torch.clamp(
        bicubic_rgb / SCALE_FACTOR, 0, 1
    )
    hr_rgb = torch.clamp(hr_rgb / SCALE_FACTOR, 0, 1)

    # --------------------------------------------------------
    # Visual comparison
    # --------------------------------------------------------

    plt.figure(figsize=(16, 4))

    plt.subplot(1, 4, 1)
    plt.imshow(lr_rgb.numpy())
    plt.title("LR Input")
    plt.axis("off")

    plt.subplot(1, 4, 2)
    plt.imshow(bilinear_rgb.numpy())
    plt.title("Bilinear")
    plt.axis("off")

    plt.subplot(1, 4, 3)
    plt.imshow(bicubic_rgb.numpy())
    plt.title("Bicubic")
    plt.axis("off")

    plt.subplot(1, 4, 4)
    plt.imshow(hr_rgb.numpy())
    plt.title("HR Reference")
    plt.axis("off")

    plt.suptitle(
        f"Baseline Comparison - {patch_id}"
    )

    plt.tight_layout()
    plt.show()


print("\n========== STEP 08 COMPLETE ==========")
print("Bilinear baseline: READY")
print("Bicubic baseline: READY")
print("Test split used:", len(test_ids), "samples")
print("No new train/validation/test split was created.")