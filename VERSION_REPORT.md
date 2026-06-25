# 3D Dynamic Builder — Version Report
**Latest pipeline:** V4 (active)  
**Previous:** V3 (archived, do not use for new builds)  
**Date last updated:** June 2026

---

## Quick Start for New Contributors

**Read these in order before touching any code:**
1. `v4/SESSION_INIT.md` — build steps Claude must follow
2. `v4/OPERATOR_GUIDE.md` — human-facing guide, GLB handling, all gotchas
3. `v4/builds/Bike Breakdown/SESSION_TRANSFER.md` — full lesson log from latest build

**To run the latest build locally:**
1. Open `v4/builds/Bike Breakdown/`
2. Double-click `START SERVER.bat`
3. Browser opens to `http://localhost:8080/index-v3.html`

---

## Pipeline Versions

| Version | Status | Key Files | Notes |
|---------|--------|-----------|-------|
| V4 | ✅ ACTIVE | `v4/SESSION_INIT.md`, `v4/OPERATOR_GUIDE.md` | Current pipeline. All new builds start here. |
| V3 | ⚠️ Archived | `v3/` folder | Superseded by V4. Reference only — do not start new builds from V3 files. |
| V2 | ❌ Deprecated | `v2/` folder | Early component experiments. Not compatible with current pipeline. |
| V1 | ❌ Deprecated | `v1/` folder | Original prototype. Do not use. |

---

## Active Builds (V4)

| Build | File | Status | Notes |
|-------|------|--------|-------|
| TrailBound — Bike Breakdown | `v4/builds/Bike Breakdown/index-v3.html` | ✅ Active | 17MB, 3D carousel + hero scrub |
| Aether — Particle Dissolution | `v4/builds/Particle Dissolution/index.html` | ✅ Complete | Particle hero build |

---

## V4 Pipeline Summary

V4 strips the pipeline to two documents Claude reads per build (SESSION_INIT + REQUIREMENTS), with a mandatory written Frame Log before any HTML. This prevents Claude from defaulting to templated output.

Key improvements over V3:
- Frame Log is a required written deliverable, not a verbal discussion
- Colors extracted from actual video frames, not preset palettes
- Text position driven by actual negative space in each frame
- Testable requirements checklist (binary pass/fail)
- 3D model-viewer support with full GLB handling guide
- Loading screen pattern for sites with heavy assets
