# V4 — Session Init
**Read this file. Then follow the startup check below.**

---

## Startup — Run This First, Every Time

Before anything else, check the project state:

**Step 1 — Check for assets**
Look inside the current build's `assets/video/` folder.
- Has a video file → assets are present, skip to Step 2
- Empty or missing → ask the user: *"Please share your Google Drive folder link so I can download your assets."* Then run: `python setup.py [THEIR_LINK]` — this downloads everything and extracts keyframes automatically. Wait for it to finish before continuing.

**Step 2 — Check for brief**
Look for `logs/brief.md` in the current build folder.
- File exists and has content → read it silently, proceed to build
- Missing or empty → ask these 4 questions in chat (one message, not one at a time):
  > *Brand name? / What does the visitor do (book / buy / explore / contact)? / 3 words for how it should feel? / 3 words for what it must NOT feel like?*
  Save their answers to `logs/brief.md` before proceeding.

**Step 3 — Build**
Assets present + brief ready → proceed to Build Steps below.

---

## First Thing — Log This Session
Before doing anything else, append an entry to `PIPELINE_ACTIVITY.md` in the project root:
```
## [today's date] — [one-line summary of what the user asked]
- Pipeline files read: SESSION_INIT.md, [list others you read]
- Input format: [clean 3-file format / long prompt / partial / unclear]
- Member type detected: [Member 1 — builder / Member 3 — long prompt / unknown]
- Action taken: [built / asked follow-up questions / compensated missing files]
- What worked:
- What didn't / had to be corrected:
```
This is non-negotiable. It is how the project owner audits whether this pipeline is being followed or ignored.

---

## Who Is Using This Pipeline

**Member 1 (builder)** — files already local, brief.md already filled. Startup check completes in seconds, goes straight to Build Steps.

**Member 3 (innovator / long prompter)** — may give a paragraph or page describing vision, values, brand references, frameworks. Does NOT know the required file format. Switch to Exploratory Mode (see below).

**Unknown** — if you can't tell, default to Exploratory Mode.

---

## Exploratory Mode (for verbose / unclear prompts)

Do not block. Do not demand files. Adapt.

1. **Extract what you can** from the prompt — pull out brand name, feeling/vibe, any mentioned colors, actions, references. State what you extracted.
2. **Ask for only what's truly missing** — one question at a time, not a list:
   - No video → ask for it. Offer to proceed with a placeholder if they want to try the layout first.
   - No keyframe screenshots → offer to work from the video timestamps they describe, OR ask them to share 3–5 screenshots of important moments in the video.
   - No brief → ask the 4 fields conversationally: "What's the brand name, what do you want visitors to do, and what should it feel like?"
3. **Compress the prompt** — before building anything, extract the core brief and confirm it:
   > *"Before I start — here's what I pulled from your prompt: Brand: [X]. Visitor action: [Y]. Feels like: [A, B, C]. Must not feel like: [D, E, F]. Is that right?"*
   This takes 10 seconds and prevents building in the wrong direction.
4. **Flag framework requests** — if they mention React, Next.js, Tailwind, Vue, etc.: *"This pipeline builds vanilla HTML/CSS — no build step, no dependencies, ships as a single file. Want to keep that, or are you specifically committed to [framework]?"* Do not switch frameworks silently.
5. **Compensate, don't stall** — if you have enough to make a reasonable first draft, make it and label assumptions clearly. Ask for corrections after they see it, not before.

---

## What Claude Is Building
A single self-contained HTML file. Fullscreen scroll-scrubbed video hero. Below-fold sections. No frameworks. No external scripts except Google Fonts.

---

## What Member 3 Provides

Place all of these inside `v4/builds/{build-name}/` before starting.

| File | Description |
|------|-------------|
| `video.mp4` | Main video. Or `video1.mp4` + `video2.mp4` for two-video builds. |
| `scene-1.png` … `scene-N.png` | Screenshots from the actual video — not reference images. See note below. |
| `brief.md` | Four fields only — see below. |

**On screenshots — what they're actually for:**
Screenshots are spatial maps, not a "put text here" list. Claude reads them to understand where the visual weight is, where open space exists, and how the video flows from scene to scene. Not every frame gets text — that's a creative decision you make. You provide the screenshots, you tell Claude which ones carry headlines. A 60-second video might have 8 frames worth analyzing but only 4 that actually get copy.

Keep it to 5–8 screenshots max. Each image costs ~1,500 tokens to read. 15 frames = ~22,000 tokens burned before a single line of HTML exists.

**The Brief (4 fields, nothing more):**
```
Brand name:
One action (what visitor does — book / buy / explore / contact):
3 adjectives (what it FEELS like):
3 anti-adjectives (what it must NOT feel like):
```

---

## Build Steps

These are guidelines, not a compliance checklist. The order exists because each step informs the next — skipping frame analysis means you're guessing at text placement, which is why builds look templated. Use judgment. If a step doesn't apply to your build, skip it and say why.

### Step 0 — Identify the video type
First thing to do with any new video. Shapes everything else.

**Subject/Object-Based** — Camera is mostly static. One thing transforms, dissolves, builds, or reveals itself. The dominant element holds a consistent region of the frame (usually center or foreground). Open space surrounds it and may shift as the object changes.
- Frame analysis: where is the object, what shape does it leave open, does open space shift as the object transforms
- Text placement: anywhere open space exists — corners, mid-frame, above/below/beside the object. Position comes from the frame, not from a formula.

**Location-Based** — Camera moves through an environment. The whole frame is filled with the world. Open space is directional — it shifts as the camera travels through the scene.
- Frame analysis: what is the leading edge of motion, what is background vs foreground, where does the eye land as the camera moves
- Text placement: follows where the eye goes next — could be in the path of travel, at the horizon, at the edge the camera is moving toward

---

### Step 1 — Frame log
Read the screenshots. Produce this table before writing CSS — it prevents guessing on placement:

| Scene | Video type | What fills the frame | Where open space is | Headline CSS | Subhead CSS | Pitch CSS |
|-------|-----------|----------------------|---------------------|--------------|-------------|-----------|

Notes:
- Open space = anywhere without a dominant visual element. Text lives there — not over the subject.
- CSS must be specific coordinates, not descriptions (`top: 8%; right: 6%`, not "upper right").
- No two scenes should share the same headline position — if they do, the build looks templated.
- Don't write CSS until this table exists. That's the whole point of it.

Also extract from the screenshots:
- Background color (dominant dark or neutral tone)
- Accent color (brightest non-white element — glow, neon, highlight, tint)
- Text color (lightest readable tone)

---

### Step 2 — Build plan
Write this before HTML. Share it, get a thumbs up, then build. Saves everyone from a full rebuild because the font was wrong.

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

---

### Step 3 — HTML
- Copy engine verbatim from `v4/engine/scroll-scrub.js` between ENGINE START / ENGINE END markers
- Video path: filename only (`video.mp4`) — file must be beside index.html
- Scene positions: from Frame Log only — no other source
- Colors: from Build Plan only
- V4_CONFIG: set scenes, videoRatio (0.65), fadeRange, staggerLag, videoSplit (if two-video)

---

### Step 4 — Before you ship
Quick sanity check. These are the bugs that appeared in real builds — not invented rules:
- `src="video.mp4"` — filename only, no `../` or absolute paths
- ENGINE START / ENGINE END markers present in the JS
- `heroMaxScroll` uses the scroll container's height, not `document.scrollHeight`
- Chrome unlock: `loadedmetadata → play().then(pause())` on each video element
- Below-fold content opacity triggers at `VIDEO_RATIO + 0.02`
- No two scenes share the same headline position

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
> **Note (v1 pipeline):** v1 uses `assets/3d/` directly — no `references/` folder, no manifest needed. Every `.glb` in `assets/3d/` is treated as a build asset automatically. The `references/` + manifest system below applies to v4 learning environment builds only.

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
