# 3D Dynamic Builder — Version Report
**Latest pipeline:** V5 (active)  
**Previous:** V4 (archived, reference only)  
**Date last updated:** 2026-06-29

---

## Quick Start for New Contributors

**Read these in order before touching any code:**
1. `v5 (Learning environment)/SESSION_INIT.md` — build steps, failure patterns, engine rules
2. `v5 (Learning environment)/engine/CHANGELOG.md` — engine version history
3. `PIPELINE_ACTIVITY.md` — session-by-session audit trail

**To run a build locally:**
1. Open the build folder (e.g. `v5 (Learning environment)/builds/VereHomes2/`)
2. Double-click `START SERVER.bat`
3. Navigate to `http://localhost:8080/output/index.html`

---

## Pipeline Versions

| Version | Status | Key Files | Notes |
|---------|--------|-----------|-------|
| V5 | ✅ ACTIVE | `v5 (Learning environment)/SESSION_INIT.md` | Canvas frame-by-frame engine, GSAP snap+dwell. All new builds start here. |
| V4 | ⚠️ Archived | `archive/v4/` | Superseded by V5. Reference only. |
| V3 | ❌ Deprecated | `v3/` | Do not use. |
| V2 | ❌ Deprecated | `v2/` | Do not use. |
| V1 | ❌ Deprecated | `v1/` | Do not use. |

---

## Active Engine

**scroll-gsap.js v5.2.5** — `v5 (Learning environment)/engine/scroll-gsap.js`

| Feature | Status |
|---------|--------|
| Canvas frame-by-frame scrub | ✅ |
| GSAP ScrollTrigger pin | ✅ |
| Snap to scenes + waypoints | ✅ |
| Approach hold + dwell timer | ✅ |
| Video duration auto-detect | ✅ |
| Video fallback mode | ✅ |
| Below-fold gsap-reveal | ✅ |

> **Rule:** Engine must always be inlined in the HTML output. External src breaks the local server path. See SESSION_INIT.md for details.

---

## Active Builds (V5)

| Build | File | Engine | Status | Notes |
|-------|------|--------|--------|-------|
| VereHomes2 | `v5 (Learning environment)/builds/VereHomes2/output/index.html` | v5.2.5 inline | ✅ Active | Canvas, 361 frames, luxury real estate |
| VereHomes | `v5 (Learning environment)/builds/VereHomes/output/index-v1.html` | v5.2.4 | ✅ Complete | Video mode, luxury real estate |
| TrailBound (ApexGears) | `v5 (Learning environment)/builds/TrailBound/output/index-v4.html` | v5.2.4 inline | ✅ Complete | Canvas, 894 frames, bike brand |
| Papa's Burger | `v5 (Learning environment)/builds/Papas Burger/output/index-v7.html` | v5.2.2 | ✅ Complete | Canvas, food brand |

---

## V5 Pipeline Summary

V5 replaces video.currentTime scrub with frame-by-frame canvas rendering, eliminating codec lag and post-scroll playback artifacts. Text display uses a snap+dwell system guaranteeing minimum read time regardless of scroll speed.

Key improvements over V4:
- Frame-by-frame canvas (zero codec lag)
- Snap-to-scene with guaranteed dwell time
- Non-linear videoMap from motion analysis data
- setup.py auto-extracts keyframes + frames + motion profile
- Engine is a single inlineable JS block — no build tools needed
