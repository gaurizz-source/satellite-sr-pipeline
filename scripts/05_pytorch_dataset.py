
import re
import duckdb
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
import rasterio
import tacoreader


class SatelliteSRDataset(Dataset):

    def __init__(
        self,
        db_path="data/satellite_catalog.duckdb",
        normalize=True,
    ):
        self.normalize = normalize

        # IMPORTANT:
        # Only select the 62,242 genuine training pairs.
        # The Copernicus live row is completely excluded.
        conn = duckdb.connect(db_path)

        self.samples = conn.execute("""
            SELECT
                patch_id,
                low_res_url
            FROM raster_patches
            WHERE source_dataset = 'SEN2NAIPv2'
              AND low_res_url LIKE 'hf://%'
            ORDER BY patch_id
        """).fetchall()

        conn.close()

        print(f"Loaded {len(self.samples)} SEN2NAIPv2 training pairs.")

        if len(self.samples) == 0:
            raise RuntimeError("No SEN2NAIPv2 training samples found.")

        # Load the remote dataset ONCE.
        self.taco_dataset = tacoreader.load(
            "tacofoundation:sen2naipv2-unet"
        )

    def __len__(self):
        return len(self.samples)

    @staticmethod
    def _get_sample_index(low_res_url):
        match = re.search(r"s2_(\d+)\.tif$", low_res_url)

        if match is None:
            raise ValueError(
                f"Invalid SEN2NAIPv2 URL: {low_res_url}"
            )

        return int(match.group(1))

    def __getitem__(self, idx):

        patch_id, low_res_url = self.samples[idx]

        sample_index = self._get_sample_index(low_res_url)

        # Read the paired LR/HR sample from SEN2NAIPv2.
        sample = self.taco_dataset.read(sample_index)

        lr_path = sample.read(0)
        hr_path = sample.read(1)

        with rasterio.open(lr_path) as src:
            lr = src.read()

        with rasterio.open(hr_path) as src:
            hr = src.read()

        # Convert to float32 tensors.
        lr = torch.from_numpy(
            lr.astype(np.float32)
        )

        hr = torch.from_numpy(
            hr.astype(np.float32)
        )

        # Configurable dataset scaling.
        if self.normalize:
            lr = lr / 3000.0
            hr = hr / 3000.0

        return {
            "lr": lr,
            "hr": hr,
            "patch_id": patch_id,
        }


def create_dataloader(
    db_path="data/satellite_catalog.duckdb",
    batch_size=2,
    shuffle=True,
    num_workers=0,
):

    dataset = SatelliteSRDataset(
        db_path=db_path
    )

    loader = DataLoader(
        dataset,
        batch_size=batch_size,
        shuffle=shuffle,
        num_workers=num_workers,
        pin_memory=torch.cuda.is_available(),
    )

    return dataset, loader
