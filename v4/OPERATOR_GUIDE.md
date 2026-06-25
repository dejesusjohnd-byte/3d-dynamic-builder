# V4 Pipeline — Operator Guide
**For the human running builds. Written so you can hand this project to someone new.**

---

## What This Project Is

A pipeline for building scroll-scrubbed video websites — single HTML files where scrolling controls the video timeline. The visitor scrolls, the video plays forward. Text appears and disappears as specific scenes are reached. Below the video hero, there are content sections.

The pipeline exists because AI (Claude) defaults to templated-looking output when given vague instructions. This project is built around forcing specific, verifiable steps that prevent that default behavior.

---

## The Problem We Solved

**Why AI generates templated websites:**
- It averages across everything it was trained on and produces the statistical mean of "website"
- Too many pipeline documents make it read all of them and average into a safe default
- Instructions like "place text in negative space" can be rationalized away — Claude decides where negative space is based on assumptions, not actual frame analysis
- Colors default to the same 4-5 safe palettes regardless of what's in the video
- Text positions rotate through corners formulaically (top-left / top-right / bottom-left / bottom-right) regardless of what's actually in the frame

**How V4 fixes it:**
- Only 2 documents Claude reads (SESSION_INIT + REQUIREMENTS), not 15
- Frame Log is a required deliverable — a table Claude must produce before writing any CSS. It's structurally impossible to skip.
- Colors are extracted from actual frame screenshots, not chosen from a preset list
- Text position comes from where open space actually is in each frame — could be corners, center, mid-frame, anywhere
- Requirements are testable (either the output has `src="video.mp4"` or it doesn't) — not instructions Claude can rationalize around

---

## File Structure

```
v4/
├── SESSION_INIT.md        ← Claude reads this first (build steps)
├── REQUIREMENTS.md        ← Testable checklist (Claude reads before building)
├── OPERATOR_GUIDE.md      ← This file (you read this)
├── engine/
│   └── scroll-scrub.js    ← The scroll engine — DO NOT MODIFY
└── builds/
    └── {build-name}/
        ├── index.html     ← Output
        ├── video.mp4      ← Or video1.mp4 + video2.mp4 for two-video
        ├── scene-1.png    ← Screenshots from the actual video
        ├── scene-2.png
        └── brief.md       ← 4-field brand brief
```

The engine (`scroll-scrub.js`) is immutable. Claude copies it verbatim into every build. Never edit it between builds or the output behavior becomes unpredictable.

---

## How to Run a Build

### Step 1 — Create the build folder
Inside `v4/builds/`, create a folder named after the project. Example: `v4/builds/Particle Dissolution/`

### Step 2 — Drop in the videos
- Single video: name it `video.mp4`
- Two videos: name them `video1.mp4` and `video2.mp4`
- Both must live in the same folder as the output `index.html`

**Why:** Chrome blocks media loaded from parent directories on `file://` protocol. The file must be beside the HTML, not above it.

### Step 3 — Take scene screenshots
Open the video. Scrub to each moment where text will appear. Take a screenshot at that exact frame. Save as `scene-1.png`, `scene-2.png`, etc. in scroll order.

**Critical rule: screenshots must be from the actual video file, not reference images, inspiration boards, or stock photos.** The entire text placement and color system depends on what is literally in the frame. Wrong input = wrong output.

### Step 4 — Write the brief
Create `brief.md` in the build folder with exactly these 4 fields:
```
Brand name:
One action (what visitor does — book / buy / explore / contact):
3 adjectives (what it FEELS like):
3 anti-adjectives (what it must NOT feel like):
```

### Step 5 — Tell Claude to start
Open Claude with the `3d-dynamic-builder` folder connected. Say:

> "Build `v4/builds/{build-name}/`. Read SESSION_INIT.md and REQUIREMENTS.md first."

Claude will then:
1. Identify video type (Subject/Object-Based or Location-Based)
2. Produce a Frame Log table — one row per scene with CSS coordinates
3. Produce a Build Plan — colors, fonts, sections, copy
4. Wait for your approval
5. Write the HTML
6. QC before delivering

### Step 6 — Approve the Build Plan
After Step 3 in the pipeline, Claude pauses and shows you the Build Plan. Review:
- Do the colors match the video's actual feel?
- Do the fonts match the brand adjectives?
- Does the copy feel inevitable, not generic?
- Are the below-fold sections answering real visitor questions?

Say "go" to approve. Give specific feedback to change anything before HTML is written.

### Step 7 — Open in Chrome
The output is `index.html` inside the build folder. Open it directly in Chrome (`file://`). Do not use Safari for testing — Chrome handles the video unlock correctly.

---

## Two Video Types

Understanding the type changes how Claude reads frames and places text.

### Subject/Object-Based
The camera is mostly static. Something in the frame transforms, dissolves, builds, or reveals itself. Examples: a crystal dissolving into particles, a product being assembled, a material changing state.

- The object occupies a consistent region (usually center or foreground)
- Open space is what surrounds the object
- Text placement: wherever the object isn't — could be any position, including center if the object is small or off-center
- Scene transitions are about the object's state changing

### Location-Based
The camera moves through an environment. The whole frame is full of world. Examples: aerial approach to a city, walking through a space, driving through a landscape.

- Open space is directional — it shifts as the camera travels
- Text placement follows the leading edge of motion — where the eye goes next as the camera moves
- Scene transitions are about where in the environment you've arrived

---

## Two-Video Builds

Both videos form a single continuous hero scrub. The visitor scrolls through Video 1, then seamlessly transitions into Video 2, then reaches below-fold content. There is no separation.

**How the crossfade works:**
- `videoSplit: 0.5` means Video 1 covers the first half of the scrub window, Video 2 covers the second half
- A 6% crossfade overlap window (`crossfadeWidth: 0.06`) blends opacity between them
- Each video independently scrubs its full duration within its range

**When to use two videos:**
- The story has two distinct phases (e.g., crystal form → dissolved form)
- Two separate video files show different angles of the same subject
- You want to contrast two environments or states

**Combining more than two videos:** not currently supported by the engine. To combine 3+ videos, the recommended approach is to edit them into a single file before the build.

---

## Common Mistakes

| Mistake | What happens | Fix |
|---------|-------------|-----|
| Screenshots not from actual video | Text positions and colors calibrated to wrong content | Re-take screenshots from the .mp4 file directly |
| Video in parent directory | Chrome shows black screen on file:// | Move video to same folder as index.html |
| Skipping the Frame Log approval | Claude writes CSS from memory patterns | Follow the pipeline in order; don't say "go" until Frame Log is shown |
| Editing scroll-scrub.js | Engine behavior changes across builds | Never edit the engine file — it gets copied verbatim |
| Using Safari to test | Video scrubbing may not work correctly | Always test in Chrome |
| Approving copy that sounds generic | Output reads like every other website | Push back during Build Plan step before HTML is written |

---

## What Each File Does

| File | Who reads it | Purpose |
|------|-------------|---------|
| `SESSION_INIT.md` | Claude | Build steps, Frame Log format, two-video rules |
| `REQUIREMENTS.md` | Claude | Testable checklist, engine config reference, copy anti-patterns |
| `OPERATOR_GUIDE.md` | You (human) | Context, procedures, how to run a build |
| `engine/scroll-scrub.js` | Claude (copies verbatim) | The scroll engine — immutable |
| `brief.md` (per build) | Claude | Brand input — 4 fields only |
| `scene-N.png` (per build) | Claude | Frame analysis source — must be from actual video |

---

## What the Engine Does (Technical)

The scroll engine (`scroll-scrub.js`) handles all JavaScript behavior. Claude copies it unchanged into every build.

Key behaviors:
- **Scroll → video time**: `video.currentTime` is driven by `scrollY / heroMaxScroll`
- **heroMaxScroll**: measured from the scroll container element height, not `document.scrollHeight`. This prevents the video from "resetting" when below-fold content adds to the page height.
- **Chrome first-frame unlock**: each video does `play().then(pause())` on `loadedmetadata` so Chrome decodes the first frame on `file://` protocol
- **Two-video crossfade**: Video 1 scrubs its full duration over the first half of the scrub window; Video 2 over the second half; opacity blends through a 6% overlap
- **Scene visibility**: scenes fade in/out based on scroll progress matching `scene.start` and `scene.end` in the config
- **Progress bar**: uses `totalMaxScroll` (full document height) so it represents total page progress, not just hero progress

IDs the engine expects:
- `v4-scroll-container` — the outer div that sets hero height (typically 500–700vh)
- `v4-video` — Video 1
- `v4-video2` — Video 2 (two-video builds only)
- `v4-nav` — navigation bar
- `v4-below-fold` — below-fold sections wrapper
- `v4-scroll-hint` — scroll indicator (hidden after first scroll)
- `v4-progress` — progress bar element

---

## History and Context

This pipeline was developed over multiple build sessions starting with a V3 pipeline that had too many documents (15+) and too many approval gates (5). V3 produced good structural variation in color and layout but averaged into sameness when the document set became too large for Claude to read distinctly.

**Key builds and what they taught:**
- **Papa's Burger** — Early V3 build. Established scroll-scrub mechanics and below-fold sections. Hero section worked.
- **Nexus City (AICity_Video1 + AICity_Video2)** — First two-video build. Identified the video reset bug (heroMaxScroll using document.scrollHeight). Established the two-video crossfade architecture. Text positions were still formula-based (corner rotation pattern).
- **Aether / Particle Dissolution** — First V4 build. Pipeline ran correctly end-to-end for the first time. Failed only because input screenshots were reference images, not frames from the actual video. Confirmed: pipeline works when input is correct.

**The corner rotation problem:** In early builds, text positions rotated through top-left / top-right / bottom-left / bottom-right across scenes regardless of what was in the video frame. This happened because Claude was generating positions from a positional formula, not from frame analysis. The Frame Log requirement was created specifically to break this pattern — Claude must produce specific CSS coordinates derived from actual screenshots before writing any HTML.

**Text placement principle:** Text position is not a formula. It is not always corners. Text goes wherever open space exists in the actual frame — this could be corners, center, mid-frame, spanning a dark horizontal band, anywhere. The Frame Log table enforces that this comes from the video, not from Claude's defaults.

- **TrailBound (Bike Breakdown)** — First build to reveal two new classes of problem: (1) architectural DNA — Claude produced the same navbar and section layout as all previous builds even with different content/colors. Fixed by adding explicit navbar, micro-interactions, and below-fold architecture requirements to both SESSION_INIT.md and REQUIREMENTS.md. (2) 3D assets on file:// — model-viewer uses fetch() which Chrome blocks locally; fixed by base64 embedding the GLB directly in HTML. Also introduced the canvas-drawn visual panel pattern as an alternative to external images in promo sections.

---

## 3D Assets (GLB/GLTF)

### Using a GLB in a build
The pipeline supports `<model-viewer>` from Google's model-viewer web component. It handles loading, auto-rotate, orbit controls, and lighting.

```html
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>
<model-viewer
  id="my-viewer"
  src="data:model/gltf-binary;base64,AAAA..."
  auto-rotate
  rotation-per-second="18deg"
  camera-controls
  shadow-intensity="0.4"
  environment-image="neutral"
  exposure="1.1"
></model-viewer>
```

### Why you must base64 embed the GLB
Chrome blocks `fetch()` on `file://` protocol. model-viewer uses fetch() to load GLB files. A direct path like `src="references/model.glb"` will silently fail — the 3D canvas renders empty. The solution is to encode the binary file as base64 and set it as a data URL. The browser reads it directly from the HTML string — no fetch required.

**Python encoding script (run once per build):**
```python
import base64
with open('references/your-model.glb', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('ascii')
data_url = f'data:model/gltf-binary;base64,{b64}'
# Set model-viewer src to data_url
```

**Size tradeoff:** Base64 adds ~33% overhead. A 2.8MB GLB becomes ~3.7MB of text. The final HTML file will be large (3–5MB). This is fine for local/demo use. For production on a real domain, use a direct path (`src="model.glb"`) — no base64 needed, no size penalty.

### Sources for free GLB models
- **Sketchfab** (sketchfab.com/features/free-3d-models) — largest library. Filter "Downloadable" and check license.
- **Poly Pizza** (poly.pizza) — smaller, clean CC0 models
- **KhronosGroup glTF sample models** — reference quality models, good for testing
- For bikes specifically: search "road bike", "bicycle", "carbon fiber wheel" with "glb" or "gltf" filter

---

## Canvas-Drawn Visual Panels

When a build needs a promo or feature panel that calls for a "product environment" visual but you don't have a real product photo, use a canvas element instead of an external image.

The canvas approach:
- Draws directly in the browser using JavaScript
- Fully self-contained — no external image files
- Can include: texture patterns, geometric product silhouettes, gradient lighting, motion lines, typographic overlays
- Adapts to container size on resize

Basic setup:
```html
<canvas id="promo-canvas" class="promo-canvas"></canvas>
```
```css
.promo-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
```
```javascript
(function drawCanvas() {
  var canvas = document.getElementById('promo-canvas');
  function draw() {
    canvas.width  = canvas.offsetWidth  * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    var ctx = canvas.getContext('2d');
    // ... draw background, shapes, text
  }
  window.addEventListener('resize', draw);
  document.fonts.ready.then(draw);
})();
```

---

## References Folder

Place supporting files in `references/` inside the build folder. **Create a `MANIFEST.md`** listing each file as either `ASSET` (Claude embeds it) or `STYLE_REF` (Claude reads it for inspiration only, never embeds it).

Without a manifest, Claude cannot distinguish a layout screenshot from a usable asset — it may attempt to use a competitor's website screenshot as an `<img src>`. The manifest is the contract between you and Claude.

See `v4/builds/Bike Breakdown/references/MANIFEST.md` for a working example.

**Fallback naming convention (when manifest isn't ready):**
- `ASSET_filename.ext` → Claude may embed
- `REF_filename.ext` → Claude reads only, never embeds

---

## Pipeline Compliance Note

The pipeline works best when all steps are followed in order. The most common shortcut is skipping the formal Frame Log — doing the frame analysis verbally in conversation instead of as a written table. This works when the operator is live and reviewing each output message, but it carries risk:

- A cold Claude starting a new session has no memory of verbal frame analysis
- The Frame Log table is the only proof that positions came from the video, not from Claude's training defaults
- For multi-session builds, always write the Frame Log before writing HTML — even if it slows the conversation down

**If you're restarting a build mid-session:** Tell Claude explicitly — "Read `BUILD_LOG.md` in the build folder before continuing." The build log captures what was decided and why.

---

## Updated: 3D Assets — Full GLB Handling Guide (v3 Session Lessons)

### The three loading modes

| Mode | Works on file:// | Works on HTTP | Setup required |
|------|-----------------|---------------|----------------|
| Base64 embed | ✓ Always | ✓ Always | Python encode script |
| Direct path src | ✗ Silently fails | ✓ Always | None |
| webkitdirectory folder-select | ✓ One-time click | N/A | JS setup screen |

### Base64 embed size limits
- Under ~8MB GLB → embed. Overhead is manageable (~10MB in HTML).
- 8–15MB → embed if needed, but HTML gets heavy.
- Over 15MB → do NOT embed. Use HTTP or folder-select.
- Over 100MB → cannot embed under any circumstances. Browsers refuse to parse 130MB+ HTML strings.

### START SERVER.bat — always include this in builds with large GLBs
```bat
@echo off
cd /d "%~dp0"
start "" "http://localhost:8080/index-v3.html"
python -m http.server 8080
pause
```
Drop it in the build folder. Double-click = instant local server, browser opens to the right file.

### webkitdirectory folder-select — for file:// with large GLBs
Instead of per-model upload prompts, show ONE folder picker at page load. JS maps filenames to all `[data-glb-src]` model-viewers at once:
```html
<input type="file" id="tb-folder-input" webkitdirectory multiple style="display:none">
```
```js
document.getElementById('tb-folder-input').addEventListener('change', function(e){
  var registry = {};
  Array.from(e.target.files).forEach(function(f){ registry[f.name] = URL.createObjectURL(f); });
  document.querySelectorAll('[data-glb-src]').forEach(function(v){
    var fname = v.getAttribute('data-glb-src').split('/').pop();
    if (registry[fname]) v.setAttribute('src', registry[fname]);
  });
});
```

### model-viewer sizing rules (web component gotchas)
```css
/* ✓ CORRECT — explicit block dimensions */
model-viewer { display: block; width: 100%; height: 70vh; }

/* ✗ WRONG — custom elements ignore this */
model-viewer { position: absolute; inset: 0; }

/* For filling a flex parent: */
.parent { display: flex; min-height: 85vh; }
model-viewer { flex: 1; min-height: 85vh; display: block; }
```

### Never add data-reveal to model-viewer
`[data-reveal] { opacity: 0 }` + IntersectionObserver works on divs. On `model-viewer` (a web component that hydrates async), `.revealed` may never fire — the model stays invisible forever. If you want a reveal effect on a 3D viewer, wrap it in a div with `data-reveal` instead.

### Loading screen must have pointer-events: none
A full-screen `position: fixed` loader without `pointer-events: none` blocks ALL scroll input. The hero video scrub will appear broken because scroll events are captured by the overlay instead of reaching `window`. Always add:
```css
#loader { pointer-events: none; }
```

### Duplicate HTML attribute bug
When patching model-viewer attributes across multiple script runs, it's easy to end up with two `orientation=` values on the same tag. The last one wins — silently overriding the first. Always verify with:
```python
html.count('orientation=')  # should equal number of model-viewers, not double
```

### White/flat GLBs — partial fix
Many free GLBs have no PBR textures and render solid white. Mitigation:
```html
environment-image="legacy"
exposure="0.75"
```
```css
model-viewer { background: radial-gradient(ellipse at 40% 35%, rgba(194,107,46,0.07), #080A0C 65%); }
```
This makes them look studio-lit rather than broken. Permanent fix: find PBR-textured replacements on Sketchfab (filter: downloadable + PBR).

### camera-orbit for unknown model scale
```html
camera-orbit="20deg 75deg auto"
field-of-view="25deg"
```
`auto` radius fits the model's bounding sphere. `field-of-view` zooms in like a telephoto lens — smaller = more zoomed. Start at 25deg and adjust.

### Fixing models that face the wrong direction
```html
orientation="90deg 0deg 0deg"   <!-- tilts flat-lying model upright (X axis) -->
orientation="0deg 0deg 90deg"   <!-- rotates face-up model to side-on (Z axis) -->
```
