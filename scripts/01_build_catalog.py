import os
import duckdb

# Database ko 'data' folder ke andar save karenge
DB_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(DB_DIR, exist_ok=True)
DB_FILE = os.path.join(DB_DIR, "satellite_catalog.duckdb")

def init_catalog():
    print(f"Connecting to DuckDB at: {DB_FILE}")
    conn = duckdb.connect(DB_FILE)
    
    # 1. Spatial Extension install & load karo
    conn.execute("INSTALL spatial;")
    conn.execute("LOAD spatial;")
    
    # 2. Table schema banao
    conn.execute("""
        CREATE TABLE IF NOT EXISTS raster_patches (
            patch_id VARCHAR PRIMARY KEY,
            source_dataset VARCHAR,
            low_res_url VARCHAR,
            high_res_url VARCHAR,
            bounding_box GEOMETRY,
            acquisition_date DATE,
            cloud_cover_percentage FLOAT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    # 3. Fast spatial queries ke liye R-Tree Index banao
    conn.execute("""
        CREATE INDEX IF NOT EXISTS idx_raster_patches_bbox 
        ON raster_patches USING RTREE (bounding_box);
    """)
    
    conn.close()
    print("Database `satellite_catalog.duckdb` successfully built!")

if __name__ == "__main__":
    init_catalog()