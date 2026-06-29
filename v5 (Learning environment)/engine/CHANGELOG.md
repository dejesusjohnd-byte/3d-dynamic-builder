# scroll-gsap.js — Engine Changelog

Versioned history of the GSAP scroll engine. Each version is archived as
`scroll-gsap-v[X.Y].js` in this folder. `scroll-gsap.js` always points to
the current active version.

To roll back: copy the archived version over `scroll-gsap.js` and update
`GSAP_CONFIG` to remove any fields introduced after that version.

---

## v5.2 — 2026-06-29 (archived)

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
- `fps`: extraction fps (default: 30)
- `scrubSmooth`: canvas mode default 0.5 (lower = more responsive)
- `dwellTime`: seconds text holds full opacity after snap

**Archived as:** `scroll-gsap-v5.2.js`

---

## v5.2.1 — 2026-06-29 (active — current scroll-gsap.js)

**Bug fixes + waypoints:**

**Fix 1 — Dwell timer was never firing**
GSAP 3's `snap.onComplete` does NOT pass `self` as a parameter. The engine was
calling `onSnapEngaged(self.progress)` where `self` = undefined. Dwell state was
never set, so text behavior was identical to v5.1 (fadeRange-only).
Fix: Engine stores `let st = null` reference. `onComplete: () => { if (st) onSnapEngaged(st.progress); }`

**Fix 2 — waypoints[] config**
New optional config field: `waypoints: [0.45, 0.60]`
Adds snap anchor points with no text scenes — useful for hard cuts and sequence
transitions. Merged with scene scroll values + 0 + 1, sorted, deduplicated.

**Fix 3 — Canvas fade-in on load**
Canvas fades from opacity 0→1 after all frames loaded (instead of instant appear).
Loader fades out simultaneously. Smooth transition instead of pop.

**Fix 4 — Resize redraws current frame**
`window.resize` now also calls `drawFrame(st.progress)` so the cover scaling
recomputes correctly when viewport changes.

**Engine default scrubSmooth** for canvas mode is now 0.15 (was 0.5).
`scrubSmooth` in GSAP_CONFIG still overrides.



---

## v5.2.4 — 2026-06-29

**Removed: Scroll governor**
- `attachScrollGovernor()` and its `passive: false` wheel listener removed entirely.
- Native compositor-thread scroll fully restored. Performance matches Papa's Burger.

**New: Extreme value clamp via GSAP ticker**
- `displayProgress` / `targetProgress` split. Ticker advances `displayProgress` toward `targetProgress` at max `cfg.maxProgressJump` (default 0.10) per RAF frame.
- Normal fast scroll (delta ~0.01–0.04/frame) = pass-through, zero lag.
- Extreme fling / Page Down (delta > 0.10) = capped advance per frame.
- Fully passive — no wheel event interception.
- `snap.onComplete` now syncs `displayProgress = targetProgress` to prevent drift after snap.

**New: Auto-detect video duration**
- Hidden `<video>` probe element reads `video.duration` via `loadedmetadata` at page load.
- `mapToVideoTime()` uses `detectedVideoDuration` → `cfg.videoDuration` → last anchor time (fallback chain).
- No `cfg.videoDuration` config needed. Works for any video length automatically.
- Fixes "stops N seconds early" without manual config.

**Archived as:** `scroll-gsap-v5.2.4.js`

---

## v5.2.3 — 2026-06-29

**New: Scroll speed governor (`cfg.scrollSpeed`)**
- Caps per-tick wheel delta inside the hero zone to prevent fast scrolling making the video unwatchable.
- `cfg.scrollSpeed`: 0.1 (crawl) → 1.0 (native speed). Default: **0.5** (45–50px cap per tick).
- Trackpad micro-events (|deltaY| < 30px) pass through unchanged — only large mouse-wheel ticks are throttled.
- Governor deactivates automatically when scrollY > st.end (below-fold content scrolls normally).
- Implemented as `attachScrollGovernor()`, called after ScrollTrigger init so `st.end` is available.

**Fix: `cfg.videoDuration` — correct video end time**
- `mapToVideoTime()` previously clamped at the last videoMap entry's `time` value.
- When frame extraction was incomplete (e.g., timeout at 59.6s on a 65.7s video), both canvas and video fallback stopped 6s early.
- Fix: if `cfg.videoDuration` is set and > last anchor's time, the function extrapolates linearly from the last anchor to `videoDuration` at scroll=1.0.

**Archived as:** `scroll-gsap-v5.2.3.js`

---

## v5.2.2 — 2026-06-29 (active — current scroll-gsap.js)

**Three bugs fixed — all causing "video plays after pause / on snap":**

**Fix 1 — Post-scroll animation tail (primary scrub bug)**
`scrub: 0.15` meant GSAP continued animating progress for 150ms after scroll stopped.
Canvas drawFrame was called repeatedly → looked like video playback.
Fix: Canvas mode now always uses `scrub: true` (direct sync, zero lag).
`scrubSmooth` in GSAP_CONFIG is now video-fallback only.

**Fix 2 — Approach hold**
New config: `approachTolerance` (default 0.035 = 3.5% of scroll range).
Within that distance of any scene.scroll, opacity = 1 unconditionally.
Text appears as user approaches the scene, no snap required.
Text holds through approach → snap → dwell → fade-out.
No more "ORDER NOW lasts 1 second."

**Fix 3 — Snap frame animation**
Snap duration reduced to { min: 0.02, max: 0.04 } (20–40ms).
`snapInProgress` flag: on snap start, engine draws destination frame immediately,
skips drawFrame during snap animation. Snap is invisible to user.

**Fix 4 — dwellTime default**
Raised from 2.0 → 4.0s. Override via cfg.dwellTime.

**Archived as:** `scroll-gsap-v5.2.2.js`

---

## v5.2.5 — 2026-06-29 (active — current scroll-gsap.js)

**Bug fix: Stray closing brackets causing SyntaxError**

A previous patch left `});` and `}` at line 337 — orphaned tokens from an
incomplete edit. Browser threw `SyntaxError: Unexpected token ')'` before any
engine code ran. ALL canvas builds were silently broken.

Fixed via Python string replacement (Edit tool em-dash encoding was unreliable).

**Rule added: engine must always be inlined**

External `<script src="../../engine/scroll-gsap.js">` fails at runtime because
`python -m http.server` roots at the BUILD folder (e.g. `VereHomes2/`). The path
`../../engine/` resolves to `builds/engine/` which does not exist — 404, nothing
loads, loader stays at 0% forever.

**Correct pattern (mandatory for all builds):**
- Copy engine code verbatim into a `<script>` block inside the HTML output.
- Do NOT use an external `src` reference to the engine file.
- TrailBound, Papa's Burger — all working builds use inlined engine.

**Also documented: MutationObserver rebuild pattern**

Engine's `loader.textContent = pct + '%'` wipes ALL child nodes each frame.
Observer must detect bare `^(\d+)%$` text, disconnect, re-append cached children,
reconnect. Naive `pctEl.textContent` update fails because pctEl is detached.
