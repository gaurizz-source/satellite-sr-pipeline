import os
import duckdb
from tqdm import tqdm

DB_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "satellite_catalog.duckdb")

def ingest_custom_hf_dataset(limit=50):
    if not os.path.exists(DB_FILE):
        print("Error: Database file nahi mili!")
        return

    conn = duckdb.connect(DB_FILE)
    conn.execute("LOAD spatial;")
    
    insert_sql = """
        INSERT INTO raster_patches (
            patch_id, source_dataset, low_res_url, high_res_url,
            bounding_box, acquisition_date, cloud_cover_percentage
        )
        VALUES (?, ?, ?, ?, ST_MakeEnvelope(?, ?, ?, ?), ?, ?)
        ON CONFLICT (patch_id) DO NOTHING;
    """

    for i in tqdm(range(limit), desc="Ingesting Patches"):
        patch_id = f"sen2naip_{i:06d}"
        s2_url = f"hf://datasets/tacofoundation/SEN2NAIPv2/data/s2_{i}.tif"
        naip_url = f"hf://datasets/tacofoundation/SEN2NAIPv2/data/naip_{i}.tif"
        
        # Spatial bbox generator
        min_lon = -122.5 + (i * 0.01)
        min_lat = 37.7 + (i * 0.01)
        max_lon = min_lon + 0.01
        max_lat = min_lat + 0.01
        
        conn.execute(insert_sql, (
            patch_id,
            "SEN2NAIPv2",
            s2_url,
            naip_url,
            min_lon, min_lat, max_lon, max_lat,
            "2023-01-01",
            0.0
        ))

    conn.commit()
    conn.close()
    print(f"\nDone! Successfully generated {limit} entries in DuckDB.")

if __name__ == "__main__":
    ingest_custom_hf_dataset(limit=50)