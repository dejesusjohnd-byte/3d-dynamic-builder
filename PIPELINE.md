# 3D Dynamic Builder — Pipeline Documentation & Passdown

## 1. Architectural Mandate: Shift from Generation to Assembly

The local AI pipeline (Hermes / Owl Alpha) has been stripped of all creative layout, styling, and architectural generation licenses.

**The Problem:** Allowing the model to generate file branches, custom GSAP timelines, or setup raw Vite servers created context drift, duplicate iteration paths (v1 through v4), and unstable build environments.

**The Solution:** We have completely inverted the pipeline. The visual constraints, spatial layers, responsive parameters, and interaction physics are hardcoded permanently into 5 core React bricks.

The AI's operational boundary is down-leveled from **Architect** to **Assembly Line Worker**. It must strictly parse unstructured scraped data according to `extraction_manifesto.json` and inject those variables straight into the properties (props) of `GeneratedScene.jsx`.

---

## 2. The 5 Locked Foundational Bricks

The `./components/` directory is now locked down. You are strictly forbidden from writing code that overrides these structural styles, dimensions, or timelines.

### Chapter 1: HeroSection.jsx (The Arrival Engine)
**Masterclass Style Reference:** Neverland Agency.

**Hardcoded Mechanics:** Scroll-linked Z-axis scale-down tunnel, multi-layered depth container splits, and deliberate typography entrance delays.

**Prop Signatures:** `hook_headline`, `hook_context`, `primary_action_label`, `motion_tempo`, `depth_layer_one_url`, `depth_layer_two_url`, `depth_layer_three_url`.

### Chapter 2: CollageIntroduction.jsx (The Narrative Engine)
**Masterclass Style Reference:** Damai / Springs Estate.

**Hardcoded Mechanics:** Asymmetric floating grid layout with strict white-space boundaries. Images are pinned to independent, non-uniform scroll travel velocities and structural spatial tilts to eliminate repetitive slop.

**Prop Signatures:** `introStatement`, `collageImages` (Constrained to an array slice of exactly 4).

### Chapter 3: StaticOfferingsGrid.jsx (The Capability Engine)
**Masterclass Style Reference:** Refokus / Zera Studio.

**Hardcoded Mechanics:** Strict architectural grid symmetry (replaces cheap repeating sliders). Integrates local matrix hover coordinates that gracefully deform card borders and scale monochromatic graphic assets on pointer track paths.

**Prop Signatures:** `offering_units` (Array objects: `item_title`, `item_summary`, `item_cover_url`).

### Chapter 4: TwoColumnValuePause.jsx (The Trust Engine)
**Masterclass Style Reference:** Quin Global Tax Law.

**Hardcoded Mechanics:** High-contrast asymmetric layout pause. Features an integrated Dynamic 3D Asset Detector that parses incoming data to mount an interactive Sketchfab IFrame viewer automatically if a UID token is present, otherwise defaulting to a clean static visual anchor.

**Prop Signatures:** `philosophy_anchor`, `philosophy_deep_dive`, `singular_master_visual`, `sketchfab_embed_uid`.

### Chapter 5: ClosingCallToAction.jsx (The Immersive Closer)
**Masterclass Style Reference:** Portman.

**Hardcoded Mechanics:** Full-screen minimal terminal focused entirely on a single conversion metric. Powered by a background Three.js WebGL `<Canvas>` rendering 350 responsive gold micro-particles operating under continuous rotation and scroll physics.

**Prop Signatures:** `closing_invitation`, `target_conversion_label`, `corporate_copyright`, `direct_contact_strings`.

---

## 3. Active Prompt Engineering Instructions

Your upcoming system prompts for data extraction must enforce this strict mapping protocol.

**Enforce Structural Ingestion:** Ensure your prompt commands the model to extract and group components exactly matching the keys outlined above.

**Revoke Code Permissions:** Explicitly state in the system guardrails that the model is forbidden from writing custom `<style>` tags, installing node components, or mutating file locations.

**Format Bound Constraints:** The final output from the AI node must be exactly one single wrapper file named `GeneratedScene.jsx` which imports the 5 components cleanly and maps the values without modification.

---

## 4. Repository Structure

```
3d-dynamic-builder/
├── guardrail.txt                  # AI behavioral rules (DO NOT MODIFY)
├── manifesto.json                 # Design system + component specs (DO NOT MODIFY)
├── extraction_manifesto.json     # Data extraction rules (DO NOT MODIFY)
├── components/                    # 5 locked React bricks (DO NOT MODIFY)
│   ├── HeroSection.jsx
│   ├── CollageIntroduction.jsx
│   ├── StaticOfferingsGrid.jsx
│   ├── TwoColumnValuePause.jsx
│   └── ClosingCallToAction.jsx
├── zens-renovations-premium/      # v1 output (legacy, read-only)
├── zens-renovations-v2/           # v2 output (legacy, read-only)
└── zens-renovations-v3/           # v3 output (legacy, read-only)
```

---

## 5. Execution Protocol

1. **Ingest** unstructured web text data from target site
2. **Filter** through `extraction_manifesto.json` — discard anything not matching the 5 bucket schema
3. **Map** extracted values into the exact prop signatures of the 5 components
4. **Output** a single `GeneratedScene.jsx` file — no HTML, no CSS, no JS, no build tools
5. **Never** create new folders, install packages, or modify existing files

---

*Last updated: 2026-06-19. This document is the single source of truth for the 3D Dynamic Builder pipeline.*
