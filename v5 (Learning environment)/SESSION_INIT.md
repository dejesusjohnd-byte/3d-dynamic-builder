# Session Init — Pipeline v5
**You are building a scroll-scrubbed video hero website. Read this. Then build.**

---

## Engine version

Current active engine: **scroll-gsap.js v5.2.5**
Archived versions: `engine/scroll-gsap-v5.0.js` through `engine/scroll-gsap-v5.2.4.js`
Full changelog: `engine/CHANGELOG.md`

To roll back: copy the archived version over `scroll-gsap.js` and update GSAP_CONFIG to remove fields introduced after that version.

> **CRITICAL — Engine must be inlined in every HTML output.**
> `python -m http.server` roots at the build folder. External `<script src="../../engine/scroll-gsap.js">` resolves outside server root → 404 → 0% forever.
> Copy the engine verbatim into a `<script>` block in the HTML. Never use an external src reference.

## What changed from v4

| v4 | v5.0 | v5.1 | v5.2 |
|----|------|------|------|
| Vanilla JS scroll engine | GSAP ScrollTrigger engine | Same | Same |
| scroll% = video% (linear only) | videoMap anchors (non-linear) | Same + motion_profile.json | Same |
| Fixed vh scroll container | Pinned hero — releases cleanly | Same | Same |
| IntersectionObserver reveals | GSAP ScrollTrigger reveals | Same | Same |
| GSAP optional, rarely used | GSAP mandatory | Same | Same |
| Interval keyframes (% based) | Scene-detected + timestamp filenames | Same | Same |
| No motion data | No motion data | logs/motion_profile.json | Same |
| No scroll snap | No scroll snap | snapToScenes holds at scene anchor | Same |
| video.currentTime scrub | video.currentTime scrub | Same | Canvas frame swap — zero codec lag |
| Text fades by scroll progress | Same | fadeRange 0.18 recommended | dwellTime guarantees N seconds minimum |

---

## Startup — every session, every time

**Step 1 — Find the active project**
Look inside `builds/`. Active project = any folder with a video in `assets/video/`.
If only empty folders exist, ask: *"What is your project called? Do you have your video ready locally?"*

**Step 2 — Check keyframes + motion profile + frames**
- `assets/images/keyframes/` has `.jpg` files → read them. Timestamp is in filename: `frame_03_t08.7s.jpg` = t8.7s
- `logs/motion_profile.json` exists → read `suggested_videoMap` from it. Use it as the base for GSAP_CONFIG.videoMap instead of guessing. Adjust scroll values for creative reasons, but anchor the data.
- `assets/images/frames/` has sequential `.jpg` files → note the count. Use as `frameCount` in GSAP_CONFIG.
- Any of the above missing → run: `python setup.py "builds/[project-name]"` from the v5 root.
  - Step 1: Extracts keyframes (ffmpeg scene detection → opencv fallback)
  - Step 2: Runs motion analysis → writes `logs/motion_profile.json`
  - Step 3: Extracts ALL frames → `assets/images/frames/` (for v5.2 canvas engine)
  - All three run automatically. Use `--no-frames` to skip Step 3 if frames already present.

**Step 3 — Check 3D assets**
Check `assets/3d/` — only use GLBs if the brief explicitly asks for 3D or product model display. If the project is video/photo focused, skip 3D sections even if GLB files are present.

**Step 4 — Check brief**
- `logs/brief.md` has content → read silently, proceed
- Empty → ask these questions in one message:
  > Brand name? / What does the visitor do? / 3 words for how it feels? / 3 words for what it must NOT feel like?
  > If this is an AI-generated video: paste the generation prompt too.
  Save answers to `logs/brief.md`.

**If the brief contains an AI video generation prompt — this is the highest-priority input:**
Read it before building the videoMap. Extract:
- How many sequences and their boundaries ("Hard cut" = exact videoMap anchor)
- Speed intent per sequence: "extreme slow-motion" → 40-45% scroll budget; "dynamic burst" → 10-15%; "sweeping arc/orbital" → 25-35%
- Camera movement per sequence: moving camera = text must follow leading edge or stay in clear space; locked/static camera = safe text zone
- Where the camera decelerates or stops = CTA placement moment
- Open space per sequence: vertical explosion → upper corners; outward burst → corners; orbital → flanks

This gives you a prompt-informed videoMap instead of guessing from pixel data alone.

**Step 5 — Build**
Keyframes + brief = ready. Follow build steps below.

---

## What you are building

A single self-contained HTML file. Pinned scroll-scrubbed video hero using GSAP ScrollTrigger. Below-fold sections with GSAP-powered reveals. No frameworks. Output: `output/index.html`.

GSAP is the animation system for the entire page — not just the hero.

---

## Build steps

### 1 — Classify the video (4 types)

**Object-Focused** — camera static, one subject transforms or reveals. Text in open space around subject.

**Location-Focused** — camera moves through environment. Text follows the leading edge of motion.

**Hybrid** — transitions between the two. Treat each segment by its own type, define where the shift happens in the videoMap.

**Cinematic** — cuts, multiple angles, non-continuous motion. Map each cut as a videoMap anchor. Text appears between cuts, not during them.

If you can't tell, ask the user to describe the video in one sentence before continuing.

### 2 — Read keyframes + build videoMap

Read every keyframe image. The filename tells you the exact video timestamp.

Build the videoMap — this is the non-linear scroll-to-video mapping.

**v5.1: use motion_profile.json first.** Read `suggested_videoMap` from `logs/motion_profile.json`. It is generated by setup.py from actual frame-differencing data, not visual guesswork. Use those anchors as the starting point; adjust only where creative intent overrides the data.

```javascript
videoMap: [
  { scroll: 0.00, time: 0.0,  label: "intro"  },
  { scroll: 0.25, time: 4.2,  label: "reveal" },   // slow → wide scroll budget
  { scroll: 0.55, time: 14.8, label: "peak"   },   // fast → narrow scroll budget
  { scroll: 1.00, time: 30.0, label: "outro"  }
]
```

Rules:
- Dramatic slow moments → more scroll budget (wider gap)
- Fast cuts/transitions → less scroll budget (narrow gap)
- motion_profile.json encodes this automatically via avg_motion per segment
- Override with reason — state any creative deviations in the build plan

**v5.2 snap + dwell config:**
```javascript
snapToScenes: true,   // scroll holds at each scene.scroll position so text can be read
snapDelay:    0.25,   // seconds before snap engages. 0.1 = snappy, 0.5 = relaxed
fadeRange:    0.30,   // fade curve shape. dwell overrides minimum visible time.
dwellTime:    2.0,    // [v5.2] seconds text holds full opacity after snap. Guaranteed minimum.
scrubSmooth:  0.5,    // [v5.2 canvas] lower = more responsive. 0 = instant (may look choppy)
```
Set `snapToScenes: false` to disable snap. `dwellTime` only fires when snap is enabled.

### 3 — Frame log

| Frame | Timestamp | Video type | What fills frame | Open space | Headline CSS |
|-------|-----------|-----------|-----------------|------------|--------------|

- CSS must be exact coordinates: `top: 8%; right: 6%` — never descriptions
- No two frames share the same headline position
- Extract: background color, accent color, text color (hex)

### 4 — Build plan (share before writing HTML)

```
Video type:
Colors:      bg / accent / text / muted
Fonts:       display / body
scrollBudget: [e.g. "350%"] — total hero scroll distance
videoMap:    [list anchors with reasoning]
3D assets:   [GLB → section name]
Sections:    [below-fold sections in order]
Copy:        per scene — headline / subhead / pitch
```

Wait for confirm before writing HTML.

### 5 — HTML structure

```html
<!-- GSAP CDN — load before engine -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

<!-- GSAP_CONFIG — defined BEFORE engine script -->
<script>
window.GSAP_CONFIG = {
  // v5.2 canvas engine (primary — use after setup.py extracts frames)
  frameSrc:     "../assets/images/frames/",  // folder with trailing slash
  frameCount:   243,                          // from setup.py output
  fps:          30,
  dwellTime:    2.0,                          // seconds text holds at full opacity after snap

  // fallback to video if frames unavailable
  videoSrc:     "../assets/video/filename.mp4",

  scrollBudget: "350%",
  scrubSmooth:  0.5,     // canvas mode: lower is better (0 = instant, 1 = smooth lag)
  fadeRange:    0.30,
  snapToScenes: true,
  snapDelay:    0.25,
  videoMap: [ ... ],
  scenes:   [ ... ]
};
</script>

<!-- ENGINE START -->
[paste engine/scroll-gsap.js verbatim here]
<!-- ENGINE END -->
```

Required element IDs (engine expects these):
- `#hero-section` — the pinned hero wrapper
- `#hero-canvas` — canvas element for v5.2 frame playback **(replaces #hero-video)**
- `#hero-frame-loader` — loading progress indicator (hidden after frames load)
- `#hero-video` — video element (only needed if frameSrc not set — fallback mode)
- `#hero-nav` — navigation bar
- `#hero-progress` — progress bar element
- `#hero-scroll-hint` — scroll indicator
- `#below-fold` — below-fold content wrapper

**v5.2 hero HTML (canvas mode):**
```html
<section id="hero-section">
  <canvas id="hero-canvas"></canvas>
  <div id="hero-frame-loader">Loading...</div>
  <!-- scene overlays, nav, progress bar, scroll hint here -->
</section>
```

Scene overlays: `<div data-scene="scene-1">` with children using `data-stagger="0/1/2"`.

Below-fold reveals: add class `gsap-reveal` to any element that should animate in on scroll. Add `data-delay="0.1"` to stagger siblings.

### 6 — 3D sections

```html
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"></script>

<model-viewer
  src="../assets/3d/filename.glb"
  auto-rotate camera-controls
  style="display:block; width:100%; height:70vh;">
</model-viewer>
```

- Always explicit height — never `position:absolute; inset:0`
- White/untexture
---

## Known Failure Patterns (do not repeat)

### 1 — External engine src (0% loader forever)
**Never do:** `<script src="../../engine/scroll-gsap.js"></script>`
The build server roots at the build folder. That path resolves to `builds/engine/` — does not exist → 404 → engine never runs → frames never load → stuck at 0%.
**Always do:** Copy engine code verbatim into an inline `<script>` block in the HTML.

### 2 — MutationObserver bridge for loader
Engine calls `loader.textContent = pct + '%'` on every frame load, which wipes ALL child nodes. A naive observer that updates `.loader-pct` will fail because pctEl is detached after the wipe.
**Correct pattern:**
```javascript
(function () {
  var loader   = document.getElementById('hero-frame-loader');
  var wordmark = loader.querySelector('.loader-wordmark');
  var pctEl    = loader.querySelector('.loader-pct');
  var barWrap  = loader.querySelector('.loader-bar-wrap');
  var obs = new MutationObserver(function () {
    var match = loader.textContent.trim().match(/^(\d+)%$/);
    if (match) {
      obs.disconnect();
      loader.textContent = '';
      loader.appendChild(wordmark);
      loader.appendChild(pctEl);
      loader.appendChild(barWrap);
      pctEl.textContent = match[1] + '%';
      loader.style.setProperty('--pct', match[1] + '%');
      obs.observe(loader, { childList: true, subtree: true, characterData: true });
    }
  });
  obs.observe(loader, { childList: true, subtree: true, characterData: true });
})();
```

### 3 — FOUC on below-fold sections
`.gsap-reveal` elements flash fully visible before GSAP initializes.
**Fix:** Always include `.gsap-reveal { opacity: 0; }` in CSS.

### 4 — File corruption on large Edit calls
Multiple Edit tool calls on a large file can truncate it. If a file behaves unexpectedly after edits, use Write tool for a full clean rewrite rather than stacking more edits.

### 5 — Engine syntax error from bad patch
If the loader is stuck at 0% and the engine appears inlined, run `node --check` on the engine file. Stray `});` or `}` from a previous patch will cause silent SyntaxError.
nvented if brief requires it; state that you invented it

---

## Versioning rule — every iteration is a new file

Any build that goes through feedback and reiteration must be versioned:
- First output: `output/index.html` (also save as `index-v1.html`)
- Each revision: `index-v2.html`, `index-v3.html`, etc.
- `index.html` always = current active build
- Never overwrite a previous version — keep all for comparison

This applies to any project with back-and-forth interaction. If the user reviews and gives feedback → new version file before making changes.

---

## Known engine limitations and fixes (as of v5.2)

**FIXED in v5.2 — Text racing (was: fadeRange scroll-progress-based)**
`fadeRange: 0.32` = text visible for 32% scroll progress. A fast trackpad scroll covers that in under 1 second, making text race regardless of fadeRange value.
Fix: `dwellTime` guarantees N seconds minimum visibility after snap. Engine tracks wall-clock time, not scroll progress. Text holds full opacity for `dwellTime` seconds before fade-out begins.

**FIXED in v5.2 — Video scrub lag (was: video.currentTime codec seek delay)**
Every `video.currentTime = X` call triggers a codec seek. H.264 MP4 introduces 1–4 frame lag proportional to keyframe distance. GSAP scrub smoothing hides some of this but scroll and video were never truly in sync.
Fix: Canvas frame-by-frame engine. All frames pre-extracted as JPEG, preloaded into JS Image[] array, drawn via `canvas.drawImage()` on scroll. Zero codec lag. Instant synchronous draw.

**Remaining known trade-off (v5.2 canvas mode):**
- Page load cost: ~10–15MB frame preload for 8s video at 30fps.
- Loading state required: hero shows `#hero-frame-loader` progress until frames ready.
- After load: zero ongoing cost — faster than video decode.

**These were two separate problems with separate fixes — both now in v5.2:**
- Text racing → `dwellTime` (time-based, replaces fadeRange-only)
- Video lag → canvas frame swap (sync, replaces video.currentTime)

---

## videoMap source priority

1. **AI video generation prompt** (best) — "Hard cut", "extreme slow-motion", "dynamic burst" map directly to anchors and scroll budgets. Read brief.md field 5 before building videoMap.
2. **motion_profile.json** (good) — generated by setup.py from actual frame differencing. Data-driven but pixel-level, misses intent.
3. **Visual analysis of keyframes** (fallback) — least accurate. Use only when neither of the above is available.

Speed translation table:
| Prompt phrase | Scroll budget |
|---|---|
| extreme slow-motion | 40–45% |
| slow-motion | 30–35% |
| sweeping / orbital | 25–35% |
| dynamic burst | 10–15% |
| hard cut (between sequences) | anchor point only |
| camera decelerating to stop | CTA placement moment |
| camera locked / static | safe zone for text |

---

## Log this session

Append to `PIPELINE_ACTIVITY.md` in the v1 root:
```
## [YYYY-MM-DD] — [what was built]
- Project: [name]
- Engine: scroll-gsap.js v5.1 / v5.2
- Video type: Object / Location / Hybrid / Cinematic
- videoMap source: AI prompt / motion_profile.json / visual analysis
- videoMap anchors: [list scroll→time pairs]
- Keyframe extraction: ffmpeg scene detection / opencv interval
- 3D assets: YES [list] / NO
- Brief source: 4-field / 4-field + AI prompt / long prompt / extracted
- Scene count: [N] — rationale: [why that many]
- fadeRange: [value] — engine version: [v5.1 / v5.2]
- Creative deviations: [any rules broken and why]
- Versions produced: index-v1 through index-vN
- What worked first try:
- What needed correction:
- Output: [current active filename]
```
