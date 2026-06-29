"""
setup.py v5.1 — Keyframe extractor + Motion analyzer for 3D Dynamic Builder pipeline v5
Usage:  python setup.py "builds/[project-name]"
        Run from inside the v5/ root folder.

What it does:
  1. Extracts keyframes — scene detection (ffmpeg) or interval (opencv fallback)
     Filenames encode timestamps: frame_03_t08.7s.jpg
  2. Analyzes motion — frame-by-frame pixel differencing via opencv
     Outputs: logs/motion_profile.json with per-frame motion scores
  3. Generates a suggested videoMap — slow segments get more scroll budget,
     fast segments get less. Claude reads this JSON to build GSAP_CONFIG instead
     of guessing from static frames alone.

Changelog:
  v5.0 — scene detection + timestamp filenames (no Drive download)
  v5.1 — added motion analysis + auto-suggested videoMap in logs/motion_profile.json

No Drive download. Place your video in assets/video/ first.
"""

import os
import sys
import json
import subprocess
import shutil

# ── Paths ─────────────────────────────────────────────────────────────────────
SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR  = os.path.abspath(sys.argv[1].rstrip("\\/")) if len(sys.argv) > 1 else None
if not PROJECT_DIR:
    print("\n  Usage: python setup.py \"builds/[project-name]\"")
    sys.exit(1)

VIDEO_DIR    = os.path.join(PROJECT_DIR, "assets", "video")
KEYFRAME_DIR = os.path.join(PROJECT_DIR, "assets", "images", "keyframes")
LOGS_DIR     = os.path.join(PROJECT_DIR, "logs")
MOTION_FILE  = os.path.join(LOGS_DIR, "motion_profile.json")

VIDEO_EXTS   = {".mp4", ".mov", ".webm"}
MIN_FRAMES   = 9
MAX_FRAMES   = 20

# ── Helpers ───────────────────────────────────────────────────────────────────
def ext(f):
    return os.path.splitext(f)[1].lower()

def ensure_dirs():
    os.makedirs(KEYFRAME_DIR, exist_ok=True)
    os.makedirs(LOGS_DIR, exist_ok=True)

def find_video():
    if not os.path.isdir(VIDEO_DIR):
        return None
    videos = [f for f in os.listdir(VIDEO_DIR) if ext(f) in VIDEO_EXTS]
    return os.path.join(VIDEO_DIR, videos[0]) if videos else None

def has_ffmpeg():
    return shutil.which("ffmpeg") is not None

def has_ffprobe():
    return shutil.which("ffprobe") is not None

# ── Get video duration ────────────────────────────────────────────────────────
def get_duration(video_path):
    if has_ffprobe():
        try:
            result = subprocess.run(
                ["ffprobe", "-v", "error", "-show_entries", "format=duration",
                 "-of", "default=noprint_wrappers=1:nokey=1", video_path],
                capture_output=True, text=True, timeout=15
            )
            return float(result.stdout.strip())
        except Exception:
            pass
    try:
        import cv2
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        cap.release()
        return frames / fps if fps else 0
    except Exception:
        return 0

# ── ffmpeg scene detection ────────────────────────────────────────────────────
def extract_scene_frames(video_path):
    print("\n  Detecting scene changes with ffmpeg...")
    duration = get_duration(video_path)
    print(f"  Duration: {duration:.1f}s")

    cmd = [
        "ffmpeg", "-i", video_path,
        "-vf", "select='gt(scene,0.35)',showinfo",
        "-vsync", "vfr", "-q:v", "3", "-f", "null", "-"
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        timestamps = []
        for line in result.stderr.split("\n"):
            if "pts_time:" in line:
                try:
                    t = float(line.split("pts_time:")[1].split()[0])
                    timestamps.append(round(t, 1))
                except (ValueError, IndexError):
                    pass

        timestamps = sorted(set([0.0] + timestamps))
        if duration > 0 and timestamps[-1] < duration * 0.9:
            timestamps.append(round(duration * 0.95, 1))

        if len(timestamps) < MIN_FRAMES:
            timestamps = _interval_timestamps(duration)
        elif len(timestamps) > MAX_FRAMES:
            step = len(timestamps) / MAX_FRAMES
            timestamps = [timestamps[int(i * step)] for i in range(MAX_FRAMES)]

        print(f"  Found {len(timestamps)} scene points — extracting frames...")
        return _extract_at_timestamps(video_path, timestamps)

    except (subprocess.TimeoutExpired, FileNotFoundError):
        print("  ffmpeg unavailable — falling back to interval extraction...")
        return extract_interval_frames(video_path)

def _interval_timestamps(duration):
    n = max(MIN_FRAMES, min(MAX_FRAMES, int(duration / 5)))
    return [round((i + 1) / (n + 1) * duration, 1) for i in range(n)]

def _extract_at_timestamps(video_path, timestamps):
    saved = []
    for i, t in enumerate(timestamps, 1):
        name = f"frame_{i:02d}_t{t:.1f}s.jpg"
        out  = os.path.join(KEYFRAME_DIR, name)
        cmd  = [
            "ffmpeg", "-ss", str(t), "-i", video_path,
            "-frames:v", "1", "-q:v", "3", "-vf", "scale=960:-1",
            out, "-y"
        ]
        result = subprocess.run(cmd, capture_output=True, timeout=30)
        if result.returncode == 0 and os.path.exists(out):
            print(f"  ✓ {name}")
            saved.append(out)
        else:
            print(f"  ✗ frame at t={t}s failed")
    return saved

# ── opencv fallback ───────────────────────────────────────────────────────────
def extract_interval_frames(video_path):
    try:
        import cv2
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install",
                               "opencv-python", "-q", "--break-system-packages"])
        import cv2

    cap      = cv2.VideoCapture(video_path)
    total    = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps      = cap.get(cv2.CAP_PROP_FPS) or 30
    duration = total / fps
    timestamps = _interval_timestamps(duration)
    saved = []

    for i, t in enumerate(timestamps, 1):
        frame_num = int(t * fps)
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
        ret, frame = cap.read()
        if ret:
            name = f"frame_{i:02d}_t{t:.1f}s.jpg"
            out  = os.path.join(KEYFRAME_DIR, name)
            cv2.imwrite(out, frame)
            print(f"  ✓ {name}")
            saved.append(out)

    cap.release()
    return saved

# ── Motion analysis (v5.1) ────────────────────────────────────────────────────
#
# Computes frame-by-frame pixel difference (motion intensity) for the entire video.
# This tells us WHERE the video is fast vs slow — independent of scene cuts.
#
# Algorithm:
#   1. Sample every N frames (~10 samples/second for speed)
#   2. Compute abs diff between consecutive grayscale frames, resized to 320px
#   3. Normalize 0–1 (1 = max motion observed in this video)
#   4. Smooth with a 5-sample sliding window to reduce flicker noise
#   5. Generate suggested videoMap:
#      - Slow regions (low motion) → more scroll budget
#        Viewer needs time to appreciate subtle floating/floating layers
#      - Fast regions (high motion) → less scroll budget
#        Content is already dramatic; don't drag it out
#
# This inverted relationship is intentio