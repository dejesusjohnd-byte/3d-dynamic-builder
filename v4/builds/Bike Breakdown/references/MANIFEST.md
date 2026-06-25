# References — Manifest
**Build:** TrailBound — Bike Breakdown  
**Rule:** Claude reads this file before building. Files marked ASSET may be embedded. Files marked STYLE_REF inform design only and must never appear in src, url(), or href attributes in the HTML.

---

## Files

| File | Type | Status | Notes |
|------|------|--------|-------|
| `generic_carbon_fibre_road_bike_wheels.glb` | ASSET | Embedded (base64) — v3 | 2.8MB GLB → 3.7MB base64. Used in carousel slide 3 ("Carbon 45mm") and CTA left flank. Model is white/untextured — displays well with `environment-image="legacy"` + `exposure="0.75"`. PBR-textured replacement pending. |
| `discount-sales.avif` | STYLE_REF | Not embedded | Used only as layout reference for the promo section (58/42 split, image left + content right). The actual promo panel visual is canvas-drawn — this file must not be used as an img src. |
| `image and text overlay sample.webp` | STYLE_REF | Not embedded | Flowid website screenshot. Used as inspiration for text layering and micro-interaction style. Do not embed. |
| `sample hero (please do not think this is the source of truth, just a reference).jpg` | STYLE_REF | Not embedded | BIKER website screenshot. Used as visual tone reference for hero composition. Filename explicitly instructs Claude not to treat this as a source-of-truth screenshot for frame positions. Do not embed. |

---

## How to Add New Files

**Adding a usable asset (GLB, PNG cutout, video, audio):**
1. Place file in `references/`
2. Add a row to this table with type = `ASSET`
3. Claude will embed or link it in the HTML

**Adding a style reference (screenshot, mood board, layout inspiration):**
1. Place file in `references/`
2. Add a row to this table with type = `STYLE_REF`
3. Name it descriptively — include a phrase like "reference only" or "style guide" in the filename if possible
4. Claude will read it for visual guidance but will not embed it

**Why this matters:**  
Claude cannot distinguish an asset from a reference based on filename alone. Without this manifest, it may use a layout screenshot as an actual image src (which it did in an earlier iteration of this build). The manifest is the contract.

---

## Naming Convention (Optional — Use When Manifest Isn't Present)

If you don't have time to update MANIFEST.md, prefix the filename:
- `ASSET_` — e.g. `ASSET_wheel-front.glb` → Claude may embed
- `REF_` — e.g. `REF_competitor-layout.jpg` → Claude reads only, never embeds

The manifest is preferred. The prefix is a fallback.
