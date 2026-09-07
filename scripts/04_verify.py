import duckdb

conn = duckdb.connect('data/satellite_catalog.duckdb')

print("\n--- Live STAC Record Check ---")
stac_df = conn.execute("""
    SELECT patch_id, source_dataset, acquisition_date, cloud_cover_percentage 
    FROM raster_patches 
    WHERE source_dataset = 'Copernicus_STAC_Live'
""").df()
print(stac_df)

print("\n--- Total Records in Catalog ---")
total = conn.execute("SELECT COUNT(*) FROM raster_patches").fetchone()[0]
print(f"Total Rows: {total}")