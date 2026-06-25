# TrailBound — Bike Breakdown | Session Transfer Report
**File:** `index-v3.html` (active build)  
**Final size:** ~17MB  
**Date:** June 2026  
**Operator:** Derick

---

## What Was Built

A scroll-scrubbed hero video website for a fictional premium mountain bike brand — TrailBound. Built on the V4 pipeline. The site has a video hero that scrubs frame-by-frame on scroll (6 scenes), then reveals below-fold sections with 3D model-viewer assets.

---

## Final Section Map

| Section | 3D Asset | Status |
|---------|----------|--------|
| Hero (scroll scrub) | Video only — 6 scenes | ✓ Working |
| Choose Your Discipline (carousel) | btwin_triban_100_road_bike.glb, fixed_gear_bike.glb, mtb_mongoose_tyax.glb (embedded), santa_cruz_v10_downhill_mountain_bicycle.glb | ✓ Loads via folder-select or HTTP auto |
| The trail doesn't care (manifesto) | dirtbike_helmet.glb (embedded base64, 1.2MB) | ✓ Embedded, always renders |
| Precision Engineering — 47 Decisions | mountain_bicycle.glb (90MB, folder-select / HTTP) | ✓ Loads, fills full panel |
| One Build. One Price. (footer CTA) | Cassette (embedded) left + Carbon wheels (embedded) right | ✓ Embedded, always renders |

---

## How Loading Works

### On `file://` (opening HTML directly from disk)
Chrome blocks `fetch()` on `file://` — model-viewer uses fetch internally. Embedded (base64) models always work. Large GLBs need the folder-select:

1. A setup screen appears: **"Select References Folder"**
2. User clicks it, picks `v4/builds/Bike Breakdown/references/`
3. JS maps every filename to the corresponding `model-viewer` — all models load at once
4. Loading screen tracks embedded models (fast), then reveals site

### On HTTP server (correct way to serve)
Double-click **`START SERVER.bat`** — opens `http://localhost:8080/index-v3.html`.  
All GLBs load automatically from direct paths. No folder selection needed.

### On production hosting (Netlify, GitHub Pages, etc.)
Upload the entire `Bike Breakdown/` folder. Everything auto-loads.

---

## Embedded Assets (always work, no server needed)

| Asset | Size | Used In |
|-------|------|---------|
| `dirtbike_helmet.glb` | 901KB → 1.2MB b64 | Manifesto section |
| `mtb_mongoose_tyax.glb` | 6.5MB → 8.8MB b64 | Carousel slide 2 |
| `generic_carbon_fibre_road_bike_wheels.glb` | 2.8MB → 3.7MB b64 | Footer right flank |
| `12_speed_cassette.glb` | 3.1MB → 4.1MB b64 | Footer left flank |

## HTTP-Only Assets (need server or folder-select)

| Asset | Size | Used In |
|-------|------|---------|
| `btwin_triban_100_road_bike.glb` | 24MB | Carousel slide 0 |
| `fixed_gear_bike.glb` | 43MB | Carousel slide 1 |
| `santa_cruz_v10_downhill_mountain_bicycle.glb` | 104MB | Carousel slide 3 |
| `mountain_bicycle.glb` | 90MB | 47 Decisions section |

---

## Key Technical Lessons Learned This Session

### 1. Chrome `file://` CORS blocks model-viewer
`model-viewer` uses `fetch()` internally. Chrome's security sandbox kills ALL fetch on `file://` for external files. This is not a code bug — it's browser security.  
**Solutions in order of preference:**
1. Serve via HTTP (even `python -m http.server`)
2. Base64 embed small GLBs (< ~10MB practical limit)
3. `webkitdirectory` folder-select to map files at runtime

### 2. Base64 size limit
33% overhead rule: 10MB GLB → 13.3MB base64. Practical embed limit ~10MB. Above that:
- 24–104MB GLBs: folder-select or HTTP only
- Never try to embed 90MB+ (would make HTML 120MB+ — browsers refuse to parse)

### 3. model-viewer sizing
Custom elements (web components) do NOT respect `position: absolute; inset: 0` reliably.  
**Always size model-viewer with explicit dimensions:**
```css
/* Works */
model-viewer { width: 100%; height: 70vh; display: block; }

/* Fails */
model-viewer { position: absolute; inset: 0; } /* shadow DOM ignores this */
```

### 4. White/untextured GLBs
Many free GLBs have no PBR materials — render flat white.  
**Partial fix:** `environment-image="legacy"` + `exposure="0.75"` + dark radial gradient CSS background.  
**Permanent fix:** Find GLBs tagged "PBR" on Sketchfab.

### 5. data-reveal on model-viewer breaks visibility
The IntersectionObserver reveal pattern (`[data-reveal] { opacity: 0 }`) must NOT be applied to `model-viewer` elements — they hydrate async and may never receive `.revealed`. Remove `data-reveal` from any model-viewer.

### 6. Loading screen must have `pointer-events: none`
A `position: fixed` loading overlay without `pointer-events: none` blocks ALL scroll and mouse input to the underlying page. The hero video scrub appeared broken because the loader was eating every scroll event.

### 7. camera-orbit `auto` + `field-of-view`
For models of unknown scale, use:
```html
camera-orbit="20deg 75deg auto"
field-of-view="25deg"
```
`auto` distance fits the model's bounding sphere. `field-of-view` acts as a zoom lens — smaller value = more zoomed in.

### 8. Orientation attribute for mis-oriented GLBs
When a model "faces down" (e.g., wheel lying flat, cassette face-up), fix with:
```html
orientation="90deg 0deg 0deg"   <!-- tilt 90° around X — stands flat models upright -->
orientation="0deg 0deg 90deg"   <!-- rotate 90° around Z -->
```

### 9. DOM restructuring via string replace is dangerous
Attempted to restructure the manifesto section by injecting HTML via string replacement — introduced an orphan `</div>` that collapsed every section below it. Lesson: rewrite entire sections from scratch rather than splicing.

### 10. Shared base64 via JS (`data-share-src`)
To reuse a large embedded model in multiple viewers without duplicating the base64:
```html
<model-viewer id="source" src="data:...big b64..."></model-viewer>
<model-viewer data-share-src="source" src=""></model-viewer>
```
```js
function applySharedSrc() {
  document.querySelectorAll('[data-share-src]').forEach(v => {
    var src = document.getElementById(v.getAttribute('data-share-src'));
    if (src?.getAttribute('src')) v.setAttribute('src', src.getAttribute('src'));
  });
}
applySharedSrc();
setTimeout(applySharedSrc, 500);
setTimeout(applySharedSrc, 1500); // model-viewer hydrates async
```

---

## Current V4_CONFIG (Hero Timing)

```javascript
window.V4_CONFIG = {
  videoRatio:  0.75,
  fadeRange:   0.024,
  staggerLag:  0.90,
  scenes: [
    { id: 'scene-1', start: 0.00, end: 0.12 },  // hold 0.072
    { id: 'scene-2', start: 0.14, end: 0.25 },  // hold 0.062
    { id: 'scene-3', start: 0.27, end: 0.38 },  // hold 0.062
    { id: 'scene-4', start: 0.40, end: 0.53 },  // Zero tolerance
    { id: 'scene-5', start: 0.54, end: 0.62 },  // Doesn't forgive
    { id: 'scene-6', start: 0.60, end: 0.75 }   // The wheel decides
  ]
};
```
- **videoRatio 0.75** = hero occupies 75% of scroll distance
- **Below-fold appears** at 0.77, fully visible at 0.81
- **Selective orange headlines:** only scenes 1, 3, 6 (`data-orange` attribute)

---

## Files in This Build

```
v4/builds/Bike Breakdown/
├── index-v3.html          ← ACTIVE BUILD (17MB, all embedded assets inside)
├── index-v2.html          ← Preserved baseline
├── index.html             ← Original v1, do not modify
├── START SERVER.bat       ← Double-click to serve locally on :8080
├── SESSION_TRANSFER.md    ← This file
├── BUILD_LOG.md           ← Full iterative change log
└── references/
    ├── MANIFEST.md        ← Asset register (ASSET vs STYLE_REF)
    ├── dirtbike_helmet.glb
    ├── bike_helmet__the_rookies_033_weekly_drills.glb
    ├── btwin_triban_100_road_bike.glb
    ├── fixed_gear_bike.glb
    ├── mtb_mongoose_tyax.glb
    ├── santa_cruz_v10_downhill_mountain_bicycle.glb
    ├── mountain_bicycle.glb
    ├── generic_carbon_fibre_road_bike_wheels.glb
    └── 12_speed_cassette.glb  (or similar cassette filename)
```

---

## Pending / Known Issues

- **Carousel slides 0, 1, 3** (btwin, fixed_gear, santa_cruz): require folder-select on `file://` or HTTP server. Cannot be embedded — 24–104MB each.
- **mountain_bicycle.glb** (47 decisions): same — 90MB, loads via folder-select or HTTP.
- **White/untextured models**: btwin, fixed_gear, santa_cruz, carbon wheels are all untextured GLBs. Renders improve with `environment-image="legacy"` but PBR-textured replacements from Sketchfab would look dramatically better.
- **Manifesto section**: currently shows `dirtbike_helmet.glb` only. User originally requested both dirtbike + big helmet together — layout would need a two-model arrangement if revisited.

---

## If Continuing in a New Session

1. Read `SESSION_INIT.md` (pipeline rules)
2. Read this file (`SESSION_TRANSFER.md`)
3. Read `BUILD_LOG.md` for detailed change history
4. Active file is `index-v3.html` — do not start from scratch
5. Run `START SERVER.bat` before testing any 3D renders

---

## Late-Session Fixes (same session, appended)

### Manifesto helmet
- Replaced `bike_helmet__the_rookies_033_weekly_drills.glb` (16MB b64) with `dirtbike_helmet.glb` (1.2MB b64) — file shrunk from 31MB → 17MB
- Column width: 42%, model-viewer: `height: 70vh; max-height: 560px`
- Removed `overflow: hidden` from column — was clipping the helmet visually
- Camera: `15deg 72deg 0.65m`
- Removed `data-reveal` attribute — it was keeping the model-viewer at `opacity: 0` permanently

### Footer flanks (cassette + wheels) — duplicate orientation bug
- Two rounds of orientation patching left DUPLICATE `orientation` attributes on both flank viewers
- The second `orientation="0deg 0deg 0deg"` silently overrode the first, canceling all rotation
- Fix: removed duplicates, final values:
  - Cassette: `orientation="0deg 0deg 90deg"` + `camera-orbit="-20deg 75deg 2m"`
  - Wheels: `orientation="90deg 0deg 0deg"` + `camera-orbit="0deg 82deg 2.5m"`

### Loading screen
- Added `pointer-events: none` to `#tb-loader` CSS — was silently eating all scroll/mouse input, breaking hero video scrub
- Reduced hard timeout from 18s → 4s
- Loader now only tracks embedded (data: URL) model-viewers for completion — large HTTP GLBs load in background

### 47 Decisions mountain bike sizing
- Root cause was CSS, not rendering: `.cassette-right` had no height, `#mountain-viewer` had no height
- Fix: `.cassette-right { display: flex; min-height: 85vh }` + `#mountain-viewer { flex: 1; min-height: 85vh }`
- Camera: `field-of-view="25deg"` added alongside `camera-orbit auto` to force zoom

### Key lesson: duplicate HTML attributes
When patching the same attribute in multiple steps, always verify the final tag has only ONE instance. Use `html.count('orientation=')` to catch duplicates before saving.
