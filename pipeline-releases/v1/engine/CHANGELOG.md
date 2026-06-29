# scroll-gsap.js — Engine Changelog

Versioned history of the GSAP scroll engine. Each version is archived as
`scroll-gsap-v[X.Y].js` in this folder. `scroll-gsap.js` always points to
the current active version.

To roll back: copy the archived version over `scroll-gsap.js` and update
`GSAP_CONFIG` to remove any fields introduced after that version.

---

## v5.2 — PLANNED (not yet active)

**Two fixes merged into one engine:**

**Fix 1 — Frame-by-frame canvas (replaces video.currentTime scrub)**
- setup.py extracts ALL frames at full fps: `ffmpeg -i video.mp4 -r 30 frames/frame_%04d.jpg`
- JS preloads frames into Image[] array; hero doesn't activate until loaded
- `<canvas id="hero-canvas">` replaces `<video id="hero-video">`
- On scroll: `frameIndex = Math.round(progress * (frames.length - 1))` → `ctx.drawImage(frames[frameIndex], 0, 0)`
- Result: zero codec lag, sub-frame precision, synchronous draw

**Fix 2 — Time-based text dwell (replaces fadeRange-only approach)**
- On snap engagement (when ScrollTrigger snaps to a scene anchor), engine starts a wall-clock timer
- Text stays at full opacity for `cfg.dwellTime` seconds (default 2.0)
- After dwell expires, fade-out begins normally if user scrolls away
- `fadeRange` still controls fade curve shape, but minimum display time is guaranteed
- Result: text always visible for at least N seconds regardless of scroll speed

**New GSAP_CONFIG fields:**
- `frameSrc`: path to frame folder, e.g. `"../assets/images/frames/"` (replaces `videoSrc`)
- `frameCount`: total frame count (output by setup.py)
- `fps`: extraction fps (default 30)
- `dwellTime`: 