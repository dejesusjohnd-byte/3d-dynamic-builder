# Session Init — Pipeline v1
**You are building a scroll-scrubbed video hero website. Read this. Then build.**

---

## Startup — every session, every time

**Step 1 — Find the active project folder**
Look inside `projects/`. The active project is any folder that is NOT named `sample_project` and has a video in `assets/video/`. If nothing exists yet except `sample_project/`, ask the user what their project is called before doing anything else.

**Step 2 — Check for assets**
- `assets/video/` has a video → check keyframes next:
  - `assets/images/keyframes/` has images → proceed to Step 3
  - Empty → run: `python setup.py "" "projects/[project-name]"` to extract keyframes from the existing video
- `assets/video/` empty → ask for Drive link. Run: `python setup.py [link] "projects/[project-name]"`
- Also check `assets/3d/` — list every `.glb` file found. These become below-fold 3D sections.

**Step 3 — Check for brief**
- `logs/brief.md` has content → read it, proceed to build
- Missing → ask these 4 questions in one message:
  > Brand name? / What does the visitor do? / 3 words for how it feels? / 3 words for what it must NOT feel like?
  Save answers to `logs/brief.md`.

**Step 4 — Build**
Assets + brief = ready. Proceed to build steps below.

---

## What you are building
A single self-contained HTML file. Fullscreen scroll-scrubbed video hero. Below-fold sections. No frameworks. No external scripts except Google Fonts. Output goes in `output/index.html`.

---

## Build steps

### 1 — Identify video type
**Subject/Object-Based** — camera static, one object transforms. Text goes in open space around the object.
**Location-Based** — camera moves through environment. Text follows the leading edge of motion.

### 2 — Frame log
Read keyframe screenshots from `assets/images/keyframes/`. Build this table:

| Frame | Video type | What fills frame | Open space | Headline position (CSS) |
|-------|-----------|-----------------|------------|------------------------|

- Open space = no dominant visual. Text lives there.
- CSS must be exact coordinates: `top: 8%; right: 6%` not descriptions
- No two frames share the same headline position

Extract from screenshots: background color, accent color, text color (hex).

### 3 — Build plan (share before building)
```
Video type:
Colors:     bg / accent / text / muted
Fonts:      display / body
3D assets:  list GLB files found in assets/3d/ — one section per model
Sections:   list of below-fold sections in order
Copy:       per scene — headline / subhead / pitch
```

### 4 — HTML
- Copy engine verbatim from `engine/scroll-scrub.js` between ENGINE START / ENGINE END markers
- Video path: `../assets/video/filename.mp4`
- Scene positions: from frame log only
- Output: `output/index.html`
- 3D sections: load model-viewer from CDN, reference GLBs as `../assets/3d/filename.glb`

### 3D model-viewer rules
```html
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"></script>
<model-viewer src="../assets/3d/filename.glb" auto-rotate camera-controls
  style="display:block; width:100%; height:70vh;"></model-viewer>
```
- **Always set explicit height** — `height: 70vh` minimum