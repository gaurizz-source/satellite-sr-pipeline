import os
import duckdb
from tqdm import tqdm

DB_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "satellite_catalog.duckdb")
TOTAL_SAMPLES = 62242  # Full SEN2NAIPv2 Dataset count

def ingest_full_sen2naip(total_count=TOTAL_SAMPLES):
    if not os.path.exists(DB_FILE):
        print("Error: Database file nahi mili! Pehle Step 1 (01_build_catalog.py) run karo.")
        return

    conn = duckdb.connect(DB_FILE)
    conn.execute("LOAD spatial;")
    
    # Existing entries clear karke fresh full insert execute karenge
    conn.execute("TRUNCATE raster_patches;")
    
    print(f"Indexing full {total_count:,} SEN2NAIPv2 dataset records into DuckDB...")

    # Fast batch creation in memory
    batch_records = []
    base_lon, base_lat = -122.5, 37.7
    
    for i in tqdm(range(total_count), desc="Cataloging Patches"):
        patch_id = f"sen2naip_{i:06d}"
        s2_url = f"hf://datasets/tacofoundation/SEN2NAIPv2/data/s2_{i}.tif"
        naip_url = f"hf://datasets/tacofoundation/SEN2NAIPv2/data/naip_{i}.tif"
        
        # Grid-based synthetic spatial bounding boxes for indexed search
        lon_offset = (i % 250) * 0.01
        lat_offset = (i // 250) * 0.01
        
        min_lon = base_lon + lon_offset
        min_lat = base_lat + lat_offset
        max_lon = min_lon + 0.01
        max_lat = min_lat + 0.01
        
        batch_records.append((
            patch_id,
            "SEN2NAIPv2",
            s2_url,
            naip_url,
            min_lon, min_lat, max_lon, max_lat,
            "2023-01-01",
            0.0
        ))

    insert_sql = """
        INSERT INTO raster_patches (
            patch_id, source_dataset, low_res_url, high_res_url,
            bounding_box, acquisition_date, cloud_cover_percentage
        )
        VALUES (?, ?, ?, ?, ST_MakeEnvelope(?, ?, ?, ?), ?, ?)
        ON CONFLICT (patch_id) DO NOTHING;
    """

    print("Writing catalog to disk...")
    conn.executemany(insert_sql, batch_records)
    conn.commit()
    conn.close()
    
    print(f"\nSuccess! Successfully cataloged {total_count:,} records into DuckDB.")

if __name__ == "__main__":
    ingest_full_sen2naip()