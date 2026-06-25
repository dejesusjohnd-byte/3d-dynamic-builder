# V4 — Session Init
**Read this file. Read REQUIREMENTS.md. Then build. That's it.**

---

## What Claude Is Building
A single self-contained HTML file. Fullscreen scroll-scrubbed video hero. Below-fold sections. No frameworks. No external scripts except Google Fonts.

---

## What Member 3 Provides

Place all of these inside `v4/builds/{build-name}/` before starting.

| File | Description |
|------|-------------|
| `video.mp4` | Main video. Or `video1.mp4` + `video2.mp4` for two-video builds. |
| `scene-1.png` … `scene-N.png` | One screenshot per scene where text appears. **Must be taken from the actual video file** — not reference images or inspiration material. Label them in scroll order. |
| `brief.md` | Four fields only — see below. |

**The Brief (4 fields, nothing more):**
```
Brand name:
One action (what visitor does — book / buy / explore / contact):
3 adjectives (what it FEELS like):
3 anti-adjectives (what it must NOT feel like):
```

---

## Build Steps — Run in Order

### Step 0 — IDENTIFY VIDEO TYPE
Before reading any frames, classify the video. State this at the top of the Frame Log.

**Subject/Object-Based** — Camera is mostly static. One thing transforms, dissolves, builds, or reveals itself. The dominant element holds a consistent region of the frame (usually center or foreground). Open space surrounds it and may shift as the object changes.
- Frame analysis: where is the object, what shape does it leave open, does open space shift as the object transforms
- Text placement: anywhere open space exists — corners, mid-frame, above/below/beside the object. Position comes from the frame, not from a formula.

**Location-Based** — Camera moves through an environment. The whole frame is filled with the world. Open space is directional — it shifts as the camera travels through the scene.
- Frame analysis: what is the leading edge of motion, what is background vs foreground, where does the eye land as the camera moves
- Text placement: follows where the eye goes next — could be in the path of travel, at the horizon, at the edge the camera is moving toward

---

### Step 1 — FRAME LOG
Read every scene screenshot. Produce this table before writing any CSS:

| Scene | Video type | What fills the frame | Where open space is | Headline CSS | Subhead CSS | Pitch CSS |
|-------|-----------|----------------------|---------------------|--------------|-------------|-----------|

Rules:
- Open space = areas with no dominant visual element (dark sky, fog, floor, empty wall, space beside/around the subject)
- Text can go anywhere open space exists: corners, center, mid-frame, spanning a dark band, over negative space — position is determined by the actual frame, never by a pattern
- CSS must be specific coordinates — not descriptions. Examples:
  - `top: 8%; right: 6%`
  - `bottom: 22%; left: 6%`
  - `top: 50%; left: 50%; transform: translate(-50%, -50%)`
  - `top: 38%; left: 6%`
- No two scenes may use the same headline position
- Do not write CSS until this table is complete

Also extract from the screenshots:
- Background color (dominant dark or neutral tone)
- Accent color (brightest non-white element — glow, neon, highlight, tint)
- Text color (lightest readable tone)

---

### Step 2 — BUILD PLAN
Produce before HTML. Requires approval before Step 3.

Output:
```
Video type:  Subject/Object-Based OR Location-Based
Colors:      bg / accent / text / muted (hex codes from frame extraction above)
Fonts:       display font / body font (chosen for brand feel, not from a list)
Video:       single or two-video. If two: which scene range each video covers.
Sections:    list of below-fold sections in order with one-line purpose each
Copy:        per scene — headline / subhead / pitch
              Copy must feel like the brand believes it's inevitable.
              No startup pitch language. No "Built for X" or "Designed for Y."
```

Wait for Member 3 approval. If approved, proceed to Step 3.

---

### Step 3 — HTML
- Copy engine verbatim from `v4/engine/scroll-scrub.js` between ENGINE START / ENGINE END markers
- Video path: filename only (`video.mp4`) — file must be beside index.html
- Scene positions: from Frame Log only — no other source
- Colors: from Build Plan only
- V4_CONFIG: set scenes, videoRatio (0.65), fadeRange, staggerLag, videoSplit (if two-video)

---

### Step 4 — QC
Before delivering, verify:
- [ ] `src="video.mp4"` — no paths, no `../`, no absolute paths
- [ ] ENGINE START and ENGINE END markers present
- [ ] `heroMaxScroll` uses container height, not `document.scrollHeight`
- [ ] Chrome unlock: `loadedmetadata → play().then(pause())` present for each video
- [ ] Below-fold opacity triggered at `VIDEO_RATIO + 0.02`
- [ ] No two scenes share the same headline position
- [ ] No scene has text placed over the frame's dominant visual element

---

## Scroll Timing
Scroll container height determines how long each scene is visible. Too short = scenes flash past before the visitor can read them.

**Rule: 160vh minimum per scene.**
- 2 scenes → 500vh
- 4 scenes → 700vh
- 6 scenes → 1000vh

Each scene window must be at least 0.10 wide. Gaps between scenes at least 0.02.

`fadeRange` must be 0.035–0.05 (not 0.022). `staggerLag` must be 0.8–1.2 so text elements arrive sequentially, not simultaneously. Add `data-stagger="0"`, `"1"`, `"2"` to headline, subhead, pitch in that order.

---

## Navbar
Do not use the default logo-left / CTA-right template. The navbar structure must match the brand. Options:
- Split nav (brand word left / brand word right, content centered)
- Monogram + scene counter dots + minimal text link
- Centered logo with flanking links
- Near-invisible until first scroll, then slides in
The nav is a design element, not a utility strip.

---

## Micro-interactions (Required — Not Optional)
Every build includes three things:

1. **Custom cursor** — dot + ring with lag. See REQUIREMENTS.md for implementation.
2. **Scroll reveals** — all below-fold sections use IntersectionObserver to fade/translate in as they enter viewport. See REQUIREMENTS.md for implementation.
3. **Hover states** — all interactive elements (cards, buttons, links) have visible hover feedback. Buttons: fill or border animation. Cards: lift + glow or border accent.

---

## Below-fold Architecture
Each build requires:
- At least one **full-viewport-height** section (`height: 100vh`) — usually a manifesto or the final CTA
- **No two sections with the same layout pattern** — a spec list cannot be followed by another spec list; a stat band cannot be followed by another stat band
- **Minimum 160px padding** top and bottom on each section
- **Open space is part of the design** — do not fill every column. Empty regions carry visual weight.

---

## References Folder
Every build may include a `references/` folder beside `index.html`. Before building, Claude must:

1. Check if `references/MANIFEST.md` exists. If it does, read it.
2. The manifest lists every file as either `ASSET` (embed it) or `STYLE_REF` (inform design, never embed).
3. If no manifest exists, look for `ASSET_` or `REF_` filename prefixes as a fallback.
4. **Never use a STYLE_REF file as an image src, video src, or model-viewer src.** Style references inform design decisions only.
5. ASSET types and how to handle them:
   - `.glb` / `.gltf` — embed as base64 data URL in `<model-viewer src="data:model/gltf-binary;base64,...">` for `file://` compatibility. See OPERATOR_GUIDE.md for the Python encoding script.
   - `.png` / `.webp` / `.avif` (cutouts, product shots) — embed as `<img src="data:image/...;base64,...">` or reference directly if serving on HTTP.
   - `.mp4` / `.mov` — place beside `index.html` and reference by filename only (`src="video.mp4"`).

---

## Text Hover Interactions (Required)
All white text must be interactive. Each element gets a unique hover movement — no two elements may use the same effect. Minimum effects required:

- Hero headlines: color shift to accent + letter-spacing expand
- Hero subheads: translateY (lift)
- Hero pitch text: translateX + scale
- Section headings: translateY lift + color shift
- Stat numbers: scale from origin
- Card text: translateX slide
- CTA heading: scale
- Footer brand text: color shift + letter-spacing

**Progressive accent on scroll (optional but preferred):** For landmark hero headlines ("PULL IT APART", "NOTHING ADDED"), fade the text color from white to accent color as the scene reaches peak opacity. Pass scene opacity as a CSS custom property and drive `color` transition from it.

---

## Hero CTA Pattern
After the final hero scene, a large call-to-action button should appear at the bottom of the sticky viewport — not present during hero scroll, visible once the user has seen all scenes. This gives users an escape from the hero without forcing them to continue scrolling.

```javascript
var cta = document.getElementById('hero-cta');
window.addEventListener('scroll', function() {
  var p = window.scrollY / (container.offsetHeight - window.innerHeight);
  cta.classList.toggle('visible', p >= 0.62); // adjust threshold to match scene count
}, { passive: true });
```

Button should link to `#v4-below-fold`. Fill-wipe animation on hover. Appears with opacity transition.

---

## Two-Video Builds
If Member 3 provides `video1.mp4` + `video2.mp4`:
- Both files go beside `index.html`
- Both get Chrome unlock in engine
- V4_CONFIG gets `videoSplit: 0.5` (adjust based on relative video lengths or story pacing)
- Crossfade window: `crossfadeWidth: 0.06`
- Scene screenshots: provide one per scene, labeled by scroll order regardless of which video it's from
- Both videos are part of the hero scrub — not separated into hero vs below-fold

---

## 3D Model-Viewer Rules (added after Bike Breakdown v3 session)

### NEVER do these with model-viewer:
1. `position: absolute; inset: 0` — web component shadow DOM ignores it. Model renders 0px tall.
2. `data-reveal` attribute — sets `opacity: 0` via CSS. IntersectionObserver may never fire `.revealed`. Model stays invisible.
3. Duplicate `orientation=` attributes — last one silently wins. Always verify with `html.count('orientation=')`.
4. Loading overlay without `pointer-events: none` — blocks all scroll input. Hero scrub appears broken.
5. Embed GLBs over ~15MB — file bloat. Over 100MB = browser refuses to parse.

### ALWAYS do these with model-viewer:
1. Explicit height: `model-viewer { display: block; width: 100%; height: 70vh; }`
2. For flex fill: `model-viewer { flex: 1; min-height: 85vh; display: block; }`
3. White/untextured models: `environment-image="legacy" exposure="0.75"` + dark radial-gradient background
4. Unknown model scale: `camera-orbit="20deg 75deg auto" field-of-view="25deg"`
5. Wrong model orientation: `orientation="90deg 0deg 0deg"` (stands flat model upright)

### file:// CORS — the immovable constraint
Chrome blocks `fetch()` on `file://`. model-viewer uses fetch. Direct GLB paths silently fail.
Solutions in order:
1. Run `START SERVER.bat` (python -m http.server) → everything works, no code changes needed
2. Base64 embed GLBs under ~10MB → always works anywhere
3. webkitdirectory folder-select → one click maps all GLBs at runtime

### Loading screen pattern
```css
#loader { position: fixed; inset: 0; z-index: 9999; pointer-events: none; } /* NEVER remove pointer-events:none */
```
Track ONLY embedded (data: URL) model-viewers for completion — they load in <2s.
Large HTTP GLBs load in background; model-viewer shows its own progress spinner.
Hard timeout: 4 seconds max, then dismiss regardless.
