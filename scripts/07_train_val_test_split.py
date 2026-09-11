
import os
import json
import random
import duckdb


# ============================================================
# Configuration
# ============================================================

DB_PATH = "data/satellite_catalog.duckdb"
OUTPUT_PATH = "data/train_val_test_split.json"

SEED = 42

TRAIN_RATIO = 0.80
VAL_RATIO = 0.10
TEST_RATIO = 0.10


# ============================================================
# Validate split ratios
# ============================================================

assert abs(
    TRAIN_RATIO + VAL_RATIO + TEST_RATIO - 1.0
) < 1e-8, "Split ratios must sum to 1."


# ============================================================
# Load valid SEN2NAIPv2 samples from DuckDB
# ============================================================

conn = duckdb.connect(DB_PATH)

rows = conn.execute("""
    SELECT patch_id
    FROM raster_patches
    WHERE source_dataset = 'SEN2NAIPv2'
      AND low_res_url LIKE 'hf://%'
    ORDER BY patch_id
""").fetchall()

conn.close()


patch_ids = [row[0] for row in rows]

print("Total samples:", len(patch_ids))


# ============================================================
# Validate dataset
# ============================================================

assert len(patch_ids) == 62242, (
    f"Expected 62242 SEN2NAIPv2 samples, "
    f"but found {len(patch_ids)}"
)

assert len(patch_ids) == len(set(patch_ids)), (
    "Duplicate patch IDs detected."
)


# ============================================================
# Deterministic shuffle
# ============================================================

random.seed(SEED)

indices = list(range(len(patch_ids)))
random.shuffle(indices)


# ============================================================
# Calculate split sizes
# ============================================================

n = len(indices)

train_size = int(n * TRAIN_RATIO)
val_size = int(n * VAL_RATIO)

train_indices = indices[:train_size]

val_indices = indices[
    train_size:
    train_size + val_size
]

test_indices = indices[
    train_size + val_size:
]


# ============================================================
# Convert indices to patch IDs
# ============================================================

train_ids = [patch_ids[i] for i in train_indices]
val_ids = [patch_ids[i] for i in val_indices]
test_ids = [patch_ids[i] for i in test_indices]


# ============================================================
# Check for overlap
# ============================================================

train_set = set(train_ids)
val_set = set(val_ids)
test_set = set(test_ids)

assert train_set.isdisjoint(val_set), (
    "Train and validation sets overlap."
)

assert train_set.isdisjoint(test_set), (
    "Train and test sets overlap."
)

assert val_set.isdisjoint(test_set), (
    "Validation and test sets overlap."
)

assert (
    len(train_set) +
    len(val_set) +
    len(test_set)
) == len(patch_ids), (
    "Some samples are missing from the splits."
)


# ============================================================
# Save split
# ============================================================

split_data = {
    "seed": SEED,
    "ratios": {
        "train": TRAIN_RATIO,
        "validation": VAL_RATIO,
        "test": TEST_RATIO
    },
    "train": train_ids,
    "validation": val_ids,
    "test": test_ids
}


os.makedirs(
    os.path.dirname(OUTPUT_PATH),
    exist_ok=True
)

with open(OUTPUT_PATH, "w") as f:
    json.dump(
        split_data,
        f,
        indent=2
    )


# ============================================================
# Final report
# ============================================================

print("\n========== SPLIT COMPLETE ==========")

print("Training samples:", len(train_ids))
print("Validation samples:", len(val_ids))
print("Test samples:", len(test_ids))

print("Total:", len(
    train_ids
) + len(
    val_ids
) + len(
    test_ids
))

print("\n========== OVERLAP CHECK ==========")

print("Train ∩ Validation:", len(train_set & val_set))
print("Train ∩ Test:", len(train_set & test_set))
print("Validation ∩ Test:", len(val_set & test_set))

print("\nSplit file saved to:")
print(OUTPUT_PATH)

print("\nSeed:", SEED)
