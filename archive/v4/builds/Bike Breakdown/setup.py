"""
setup.py — Bike Breakdown asset downloader
Run once after cloning: python setup.py
Downloads all gitignored heavy files from Google Drive into their correct local folders.
Requires: pip install gdown
"""

import os
import sys
import subprocess

# ─── Install gdown if missing ────────────────────────────────────────────────
try:
    import gdown
except ImportError:
    print("Installing gdown...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "gdown", "-q"])
    import gdown

# ─── Asset registry ──────────────────────────────────────────────────────────
# Fill in Drive File IDs from assets/MANIFEST.md before sharing this repo.
# Get IDs from: drive.google.com/file/d/THIS_ID_HERE/view
# Set each file to "Anyone with the link can view"

ASSETS = [
    # Video
    {"id": "PASTE_FILE_ID", "dest": "assets/video/Hero-CloseUp2.mp4"},

    # 3D Assets
    {"id": "PASTE_FILE_ID", "dest": "assets/3d/dirtbike_helmet.glb"},
    {"id": "PASTE_FILE_ID", "dest": "assets/3d/mtb_mongoose_tyax.glb"},
    {"id": "PASTE_FILE_ID", "dest": "assets/3d/bike_gears_cassette.glb"},
    {"id": "PASTE_FILE_ID", "dest": "assets/3d/generic_carbon_fibre_road_bike_wheels.glb"},
    {"id": "PASTE_FILE_ID", "dest": "assets/3d/btwin_triban_100_road_bike.glb"},
    {"id": "PASTE_FILE_ID", "dest": "assets/3d/fixed_gear_bike.glb"},
    {"id": "PASTE_FILE_ID", "dest": "assets/3d/mountain_bicycle.glb"},
    {"id": "PASTE_FILE_ID", "dest": "assets/3d/santa_cruz_v10_downhill_mountain_bicycle.glb"},
]

# ─── Run ─────────────────────────────────────────────────────────────────────
def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    print("\n TrailBound — Bike Breakdown Asset Setup")
    print(" =========================================\n")

    skipped = 0
    downloaded = 0
    failed = []

    for asset in ASSETS:
        dest = asset["dest"]
        file_id = asset["id"]

        if file_id == "PASTE_FILE_ID":
            print(f"  SKIP (no ID set)  {dest}")
            skipped += 1
            continue

        if os.path.exists(dest):
            size_mb = os.path.getsize(dest) / (1024 * 1024)
            print(f"  EXISTS ({size_mb:.1f}MB)     {dest}")
            skipped += 1
            continue

        os.makedirs(os.path.dirname(dest), exist_ok=True)
        print(f"  Downloading → {dest}")

        try:
            gdown.download(id=file_id, output=dest, quiet=False)
            downloaded += 1
        except Exception as e:
            print(f"  FAILED: {e}")
            failed.append(dest)

    print(f"\n Done. {downloaded} downloaded, {skipped} skipped, {len(failed)} failed.")

    if failed:
        print("\n Failed files — check Drive IDs and sharing permissions:")
        for f in failed:
            print(f"   {f}")

    print("\n Run START SERVER.bat to preview the site.\n")

if __name__ == "__main__":
    main()
