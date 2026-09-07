import os
import duckdb
from pystac_client import Client
import datetime

DB_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "satellite_catalog.duckdb")
STAC_API_URL = "https://earth-search.aws.element84.com/v1"

def fetch_live_satellite_patch(lat=28.6139, lon=77.2090, buffer=0.05):
    if not os.path.exists(DB_FILE):
        print("Error: Database file nahi mili!")
        return

    print(f"Fetching live Sentinel-2 metadata for Coordinates: Lat {lat}, Lon {lon}...")
    
    bbox = [lon - buffer, lat - buffer, lon + buffer, lat + buffer]
    
    try:
        catalog = Client.open(STAC_API_URL)
        search = catalog.search(
            collections=["sentinel-2-l2a"],
            bbox=bbox,
            max_items=1
        )
        items = list(search.items())
        
        if not items:
            print("No live satellite patches found for these coordinates.")
            return

        item = items[0]
        patch_id = f"live_stac_{item.id}"
        
        # Fixed: pystac Asset object attribute access
        red_asset = item.assets.get("red")
        s2_url = red_asset.href if red_asset else ""
        naip_url = "live_inference_target"
        
        cloud_cover = item.properties.get("eo:cloud_cover", 0.0)
        acq_date = item.properties.get("datetime", str(datetime.date.today()))[:10]

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
        
        conn.execute(insert_sql, (
            patch_id,
            "Copernicus_STAC_Live",
            s2_url,
            naip_url,
            bbox[0], bbox[1], bbox[2], bbox[3],
            acq_date,
            cloud_cover
        ))
        
        conn.commit()
        conn.close()
        print(f"Successfully cataloged live patch: {patch_id} into DuckDB!")

    except Exception as e:
        print(f"STAC API Search Error: {e}")

if __name__ == "__main__":
    fetch_live_satellite_patch(lat=28.6139, lon=77.2090)