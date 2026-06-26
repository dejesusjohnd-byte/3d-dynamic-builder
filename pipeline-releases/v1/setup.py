"""
setup.py — Project asset downloader + keyframe extractor
Usage: python setup.py [drive_folder_link]
       python setup.py  (will prompt for link if not provided)

What it does:
  1. Downloads everything from your shared Drive folder
  2. Maps files into correct local folders (video/ 3d/ images/)
  3. Extracts keyframes scaled to video length (1 per 5s, min 9, max 20)
"""

import os, sys, shutil, subprocess

# ── Install dependencies ──────────────────────────────────────────────────────
def install(pkg):
    # Bootstrap pip if missing, then install
    subprocess.call([sys.executable, "-m", "ensurepip", "--upgrade"])
    subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "-q"])

try:
    import gdown
except ImportError:
    print("Installing gdown..."); install("gdown"); import gdown

try:
    import cv2
except ImportError:
    print("Installing opencv..."); install("opencv-python"); import cv2

# ── Config ────────────────────────────────────────────────────────────────────
SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
# argv[2] = project folder path (passed by SETUP.bat). Fall back to script dir if missing.
PROJECT_DIR  = os.path.abspath(sys.argv[2].rstrip("\\/")) if len(sys.argv) > 2 else SCRIPT_DIR
TEMP_DIR     = os.path.join(PROJECT_DIR, "_drive_download")
VIDEO_DIR    = os.path.join(PROJECT_DIR, "assets", "video")
MODEL_DIR    = os.path.join(PROJECT_DIR, "assets", "3d")
IMAGE_DIR    = os.path.join(PROJECT_DIR, "assets", "images")
KEYFRAME_DIR = os.path.join(PROJECT_DIR, "assets", "images", "keyframes")

VIDEO_EXTS  = {".mp4", ".mov", ".webm"}
MODEL_EXTS  = {".glb", ".gltf", ".fbx"}
IMAGE_EXTS  = {".png", ".jpg", ".jpeg", ".webp", ".avif"}
MIN_FRAMES = 9   # always at least 9 frames
MAX_FRAMES = 20  # never more than 20 frames
TARGET_INTERVAL_SECONDS = 5  # aim for one frame every 5 seconds

def calc_keyframe_pcts(duration_seconds):
    """Scale frame count to video length. Short videos get denser coverage."""
    n = int(duration_seconds / TARGET_INTERVAL_SECONDS)
    n = max(MIN_FRAMES, min(MAX_FRAMES, n))
    # Evenly spaced, avoiding 0% (often black) and 100% (often black)
    return [round((i + 1) / (n + 1), 3) for i in range(n)]

# ── Helpers ───────────────────────────────────────────────────────────────────
def ensure_dirs():
    for d in [VIDEO_DIR, MODEL_DIR, IMAGE_DIR, KEYFRAME_DIR]:
        os.makedirs(d, exist_ok=True)

def ext(f):
    return os.path.splitext(f)[1].lower()

def map_file(src_path):
    """Move a downloaded file into the correct assets/ subfolder."""
    e = ext(src_path)
    fname = os.path.basename(src_path)
    if e in VIDEO_EXTS:
        dest = os.path.join(VIDEO_DIR, fname)
    elif e in MODEL_EXTS:
        dest = os.path.join(MODEL_DIR, fname)
    elif e in IMAGE_EXTS:
        dest = os.path.join(IMAGE_DIR, fname)
    else:
        return  # skip unknown types
    if not os.path.exists(dest):
        shutil.move(src_path, dest)
        print(f"  ✓ {fname} → assets/{os.path.relpath(dest, os.path.join(SCRIPT_DIR,'assets'))}")
    else:
        print(f"  EXISTS  {fname}")

def walk_and_map(folder):
    """Recursively find all files and map them."""
    for root, _, files in os.walk(folder):
        for f in files:
            if not f.startswith("."):
                map_file(os.path.join(root, f))

def extract_keyframes():
    """Extract 5 frames from the first video found in assets/video/."""
    videos = [f for f in os.listdir(VIDEO_DIR) if ext(f) in VIDEO_EXTS]
    if not videos:
        print("\n  No video found — skipping keyframe extraction.")
        return
    video_path = os.path.join(VIDEO_DIR, videos[0])
    cap = cv2.VideoCapture(video_path)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps   = cap.get(cv2.CAP_PROP_FPS) or 30
    duration = total / fps
    if total == 0:
        print("  Could not read video frames.")
        cap.release(); return
    pcts = calc_keyframe_pcts(duration)
    print(f"\n  Video: {duration:.1f}s → extracting {len(pcts)} keyframes from {videos[0]}...")
    for i, pct in enumerate(pcts, 1):
        frame_num = int(total * pct)
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
        ret, frame = cap.read()
        if ret:
            name = f"frame_{i:02d}_pct{int(pct*100):03d}.jpg"
            out  = os.path.join(KEYFRAME_DIR, name)
            cv2.imwrite(out, frame)
            print(f"  ✓ {name}")
    cap.release()

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    print("\n  Asset Setup\n  ===========")

    # Get Drive link
    link = sys.argv[1] if len(sys.argv) > 1 else ""
    if not link:
        link = input("\n  Paste your Google Drive folder link: ").strip()
    if not link:
        print("  No link provided. Exiting."); return

    ensure_dirs()

    # Check if assets already present
    existing_videos = [f for f in os.listdir(VIDEO_DIR) if ext(f) in VIDEO_EXTS]
    if existing_videos:
        print(f"\n  Video already present ({existing_videos[0]}) — skipping download.")
    elif not link:
     