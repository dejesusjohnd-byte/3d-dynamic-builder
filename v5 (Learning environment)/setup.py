"""
setup.py v5.2 — Keyframe extractor + Motion analyzer + Frame extractor
                for 3D Dynamic Builder pipeline v5
Usage:  python setup.py "builds/[project-name]"
        Run from inside the v5/ root folder.

What it does (all three run by default):
  1. Extracts keyframes — scene detection (ffmpeg) or interval (opencv fallback)
  2. Analyzes motion — frame-by-frame pixel differencing via opencv
     Outputs: logs/motion_profile.json with suggested_videoMap
  3. Extracts ALL frames for v5.2 canvas engine — zero codec lag
     Outputs: assets/images/frames/frame_NNN.jpg

Options:
  --no-frames   Skip full frame extraction (steps 1+2 only)
  --fps N       Frame extraction rate (default: 30)

Changelog:
  v5.0 — scene detection + timestamp filenames
  v5.1 — motion analysis + suggested videoMap
  v5.2 — frame extraction is now default; --no-frames to skip
"""

import os
import sys
import json
import subprocess
import shutil

SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR  = os.path.abspath(sys.argv[1].rstrip("\\/")) if len(sys.argv) > 1 else None
if not PROJECT_DIR:
    print("\n  Usage: python setup.py \"builds/[project-name]\"")
    sys.exit(1)

VIDEO_DIR    = os.path.join(PROJECT_DIR, "assets", "video")
KEYFRAME_DIR = os.path.join(PROJECT_DIR, "assets", "images", "keyframes")
FRAMES_DIR   = os.path.join(PROJECT_DIR, "assets", "images", "frames")
LOGS_DIR     = os.path.join(PROJECT_DIR, "logs")
MOTION_FILE  = os.path.join(LOGS_DIR, "motion_profile.json")

VIDEO_EXTS   = {".mp4", ".mov", ".webm"}
MIN_FRAMES   = 9
MAX_FRAMES   = 20

SKIP_FRAMES  = "--no-frames" in sys.argv
FRAME_FPS    = 30
for i, arg in enumerate(sys.argv):
    if arg == "--fps" and i + 1 < len(sys.argv):
        try: FRAME_FPS = int(sys.argv[i + 1])
        except ValueError: pass

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
            print(f"  + {name}")
            saved.append(out)
        else:
            print(f"  x frame at t={t}s failed")
    return saved

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
            print(f"  + {name}")
            saved.append(out)

    cap.release()
    return saved

def analyze_motion(video_path):
    print("\n  Analyzing motion profile...")
    try:
        import cv2
        import numpy as np
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install",
                               "opencv-python", "-q", "--break-system-packages"])
        import cv2
        import numpy as np

    cap      = cv2.VideoCapture(video_path)
    fps      = cap.get(cv2.CAP_PROP_FPS) or 30
    total    = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total / fps

    sample_interval = max(1, int(fps / 10))
    prev_gray  = None
    raw_motion = []
    frame_idx  = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_idx % sample_interval == 0:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            h, w = gray.shape
            scale = 320 / w if w > 320 else 1.0
            if scale < 1.0:
                gray = cv2.resize(gray, (320, int(h * scale)))
            if prev_gray is not None and gray.shape == prev_gray.shape:
                diff  = cv2.absdiff(gray, prev_gray)
                score = float(np.mean(diff)) / 255.0
                raw_motion.append((round(frame_idx / fps, 2), score))
            prev_gray = gray
        frame_idx += 1

    cap.release()

    if not raw_motion:
        print("  Motion analysis failed — no frames read.")
        return

    max_score = max(s for _, s in raw_motion) or 1.0
    samples   = [{"time": t, "motion": round(s / max_score, 3)} for t, s in raw_motion]

    def smooth(data, window=5):
        out = []
        for i, d in enumerate(data):
            lo  = max(0, i - window // 2)
            hi  = min(len(data), i + window // 2 + 1)
            avg = sum(data[j]["motion"] for j in range(lo, hi)) / (hi - lo)
            out.append({**d, "motion_smooth": round(avg, 3)})
        return out

    samples = smooth(samples)

    N_ANCHORS = min(8, max(4, len(samples) // 5))
    seg_size  = len(samples) / N_ANCHORS
    segments  = []

    for i in range(N_ANCHORS):
        lo  = int(i * seg_size)
        hi  = int((i + 1) * seg_size)
        seg = samples[lo:hi]
        avg = sum(s["motion_smooth"] for s in seg) / len(seg) if seg else 0
        segments.append({"time": samples[lo]["time"], "avg_motion": round(avg, 3)})

    inverted  = [max(0.05, 1.0 - seg["avg_motion"]) for seg in segments]
    total_inv = sum(inverted)
    weights   = [v / total_inv for v in inverted]

    video_map = []
    cumulative = 0.0
    for i, seg in enumerate(segments):
        label = _label_motion(seg["avg_motion"])
        video_map.append({
            "scroll":        round(cumulative, 3),
            "time":          round(seg["time"], 1),
            "label":         label,
            "avg_motion":    seg["avg_motion"],
            "scroll_weight": round(weights[i], 3)
        })
        cumulative += weights[i]

    video_map.append({
        "scroll": 1.0, "time": round(duration, 1),
        "label": "finale", "avg_motion": None, "scroll_weight": None
    })

    output = {
        "_version": "5.2",
        "_note": "Slow segments get more scroll budget, fast get less. Use suggested_videoMap as GSAP_CONFIG.videoMap starting point.",
        "duration_seconds": round(duration, 2),
        "samples": samples,
        "suggested_videoMap": video_map
    }

    with open(MOTION_FILE, "w") as f:
        json.dump(output, f, indent=2)

    print(f"  + Saved to logs/motion_profile.json")
    print(f"\n  Suggested videoMap ({len(video_map)} anchors):")
    for anchor in video_map:
        m = anchor.get("avg_motion") or 0
        bar = "#" * int(m * 20)
        m_str = f"{m:.2f}" if anchor.get("avg_motion") is not None else "---"
        print(f"    scroll {anchor['scroll']:.3f} -> t{anchor['time']:.1f}s  motion:{m_str}  {bar}  [{anchor['label']}]")

def _label_motion(score):
    if score < 0.15: return "slow-elegant"
    if score < 0.35: return "steady"
    if score < 0.60: return "dynamic"
    return "explosive"

def extract_all_frames(video_path):
    print(f"\n  Extracting all frames at {FRAME_FPS}fps for v5.2 canvas engine...")
    os.makedirs(FRAMES_DIR, exist_ok=True)

    existing = [f for f in os.listdir(FRAMES_DIR) if ext(f) in {".jpg", ".jpeg"}]
    if existing:
        print(f"  [{len(existing)} frames already present — skipping]")
        print("  Delete assets/images/frames/ to re-extract.")
        return len(existing)

    duration = get_duration(video_path)
    total_frames = int(duration * FRAME_FPS)
    pad = len(str(total_frames))

    if has_ffmpeg():
        cmd = [
            "ffmpeg", "-i", video_path,
            "-r", str(FRAME_FPS),
            "-q:v", "4",
            "-vf", "scale=1920:-1",
            os.path.join(FRAMES_DIR, f"frame_%0{pad}d.jpg"),
            "-y"
        ]
        result = subprocess.run(cmd, capture_output=True, timeout=300)
        if result.returncode == 0:
            saved = len([f for f in os.listdir(FRAMES_DIR) if f.endswith(".jpg")])
            size_mb = sum(
                os.path.getsize(os.path.join(FRAMES_DIR, f))
                for f in os.listdir(FRAMES_DIR) if f.endswith(".jpg")
            ) / 1_000_000
            print(f"  + {saved} frames extracted ({size_mb:.1f}MB)")
            print(f"  GSAP_CONFIG: frameSrc: '../assets/images/frames/', frameCount: {saved}, fps: {FRAME_FPS}")
            return saved
        else:
            print("  ffmpeg frame extraction failed.")
            return 0
    else:
        try:
            import cv2
        except ImportError:
            subprocess.check_call([sys.executable, "-m", "pip", "install",
                                   "opencv-python", "-q", "--break-system-packages"])
            import cv2

        cap = cv2.VideoCapture(video_path)
        native_fps = cap.get(cv2.CAP_PROP_FPS) or 30
        interval = max(1, int(native_fps / FRAME_FPS))
        frame_idx = 0
        out_idx = 1

        while True:
            ret, frame = cap.read()
            if not ret: break
            if frame_idx % interval == 0:
                name = f"frame_{str(out_idx).zfill(pad)}.jpg"
                cv2.imwrite(os.path.join(FRAMES_DIR, name), frame)
                out_idx += 1
            frame_idx += 1

        cap.release()
        print(f"  + {out_idx - 1} frames extracted via opencv")
        return out_idx - 1

def main():
    print("\n  Setup v5.2")
    print("  ==========")
    print(f"  Project: {PROJECT_DIR}")
    if SKIP_FRAMES:
        print("  Mode: --no-frames (steps 1+2 only)")

    ensure_dirs()
    video_path = find_video()

    # Step 1: Keyframes
    existing_kf = [f for f in os.listdir(KEYFRAME_DIR) if ext(f) in {".jpg", ".jpeg", ".png"}]
    if existing_kf:
        print(f"\n  [Step 1] {len(existing_kf)} keyframes already present — skipping.")
    else:
        if not video_path:
            print("\n  No video in assets/video/ — copy it in first.")
            sys.exit(1)
        print(f"\n  [Step 1] Keyframes — {os.path.basename(video_path)}")
        if has_ffmpeg():
            saved = extract_scene_frames(video_path)
        else:
            print("  ffmpeg not found — using opencv.")
            saved = extract_interval_frames(video_path)
        print(f"  {len(saved)} keyframes -> assets/images/keyframes/")

    # Step 2: Motion analysis
    if os.path.exists(MOTION_FILE):
        print(f"\n  [Step 2] motion_profile.json already present — skipping.")
    else:
        if video_path:
            print(f"\n  [Step 2] Motion analysis")
            analyze_motion(video_path)

    # Step 3: Full frames
    if SKIP_FRAMES:
        print(f"\n  [Step 3] Skipped (--no-frames).")
    else:
        if video_path:
            print(f"\n  [Step 3] Full frame extraction")
            extract_all_frames(video_path)

    print("\n  Done.")
    print("  Outputs:")
    print("    keyframes/          visual context + timestamps")
    print("    motion_profile.json suggested_videoMap anchors")
    if not SKIP_FRAMES:
        print("    frames/             frameSrc + frameCount for GSAP_CONFIG")
    print()

if __name__ == "__main__":
    main()
