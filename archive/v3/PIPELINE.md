# ⚠ DEPRECATED — Use PIPELINE_v3.md

This file is the old V3 draft. It has been superseded.

**The active pipeline is: `PIPELINE_v3.md`**

Do not reference or use this file. It will be deleted.

---

## HOW THIS PIPELINE WORKS

Each stage produces a **named JSON block**. The next stage consumes that block by name.
You cannot skip a stage because the next stage will explicitly reference its output.

```
[Brief] → BRIEF_BLOCK
    ↓
[Video DNA] → DNA_BLOCK  (references BRIEF_BLOCK)
    ↓
[Site Blueprint] → BLUEPRINT_BLOCK  (references DNA_BLOCK + BRIEF_BLOCK)
    ↓
[Interaction Layer] → INTERACTION_BLOCK  (references BLUEPRINT_BLOCK)
    ↓
[Final Spec] → SITE_SPEC  (all blocks merged, ready for builder)
```

---

## STAGE 0: INTAKE

Read `brief-template.md`. Do not proceed until all three sections are filled.

**Required output — paste this block when complete:**
```json
BRIEF_BLOCK = {
  "goal": "",
  "primary_action": "",
  "brand_name": "",
  "one_line_pitch": "",
  "adjectives": [],
  "colors": [],
  "pages": [],
  "video_source": "",
  "target_audience": ""
}
```

---

## STAGE 1: VIDEO DNA

Read `stages/01-video-dna.md`.

**Input required:** BRIEF_BLOCK  
**Output required:** DNA_BLOCK

Do not proceed to Stage 2 without DNA_BLOCK.

---

## STAGE 2: SITE BLUEPRINT

Read `stages/02-site-blueprint.md` and `library/section-archetypes.json`.

**Input required:** BRIEF_BLOCK + DNA_BLOCK  
**Output required:** BLUEPRINT_BLOCK

Run the uniqueness enforcer (`constraints/uniqueness-enforcer.md`) before finalizing.
Do not proceed to Stage 3 without BLUEPRINT_BLOCK.

---

## STAGE 3: INTERACTION LAYER

Read `stages/03-interaction-layer.md` and `library/interaction-catalog.json`.

**Input required:** BLUEPRINT_BLOCK  
**Output required:** INTERACTION_BLOCK

---

## STAGE 4: FINAL OUTPUT

Merge all blocks into SITE_SPEC. This is what goes to the website builder.

**Required:** BRIEF_BLOCK + DNA_BLOCK + BLUEPRINT_BLOCK + INTERACTION_BLOCK  
**Output:** SITE_SPEC (see format at bottom of this file)

---

## FORBIDDEN DEFAULTS

The following are banned. If any appear in the output, restart the stage.

- Generic hero text: "Welcome to [Brand]", "We are [adjective]"
- Centered full-bleed hero image with overlay text (unless specifically chosen from archetypes)
- Top-fixed transparent navbar that turns solid on scroll (unless it's the only appropriate choice AND you explain why)
- Bootstrap, Tailwind CDN, or any CSS framework unless the brief explicitly requests it
- Placeholder colors (#333, #fff, generic blue) — all colors must derive from DNA_BLOCK
- Font pairings not derived from the brand adjectives
- Generic CTA text: "Learn More", "Click Here", "Get Started"
- Section order: Hero → About → Services → Contact (this exact order is banned by default)

---

## PRE-GENERATION CHECKLIST

Before writing any HTML/CSS/JS, verify:

- [ ] BRIEF_BLOCK is complete with no empty fields
- [ ] DNA_BLOCK has color tokens, timing tokens, and mood tags
- [ ] BLUEPRINT_BLOCK has a section order different from the banned default
- [ ] BLUEPRINT_BLOCK has a hero variant selected from section-archetypes.json
- [ ] INTERACTION_BLOCK has minimum 3 micro-interactions from the catalog
- [ ] Uniqueness fingerprint logged
- [ ] Zero forbidden defaults present

**If any box is unchecked, do not generate. Fix the gap first.**

---

## SITE_SPEC FORMAT

```json
SITE_SPEC = {
  "meta": {
    "brand": "",
    "goal": "",
    "fingerprint": ""
  },
  "design_tokens": {
    "colors": {},
    "typography": {},
    "spacing": {},
    "timing": {},
    "blur": {}
  },
  "video": {
    "source": "",
    "scroll_behavior": "",
    "blend_mode": "",
    "opacity_range": []
  },
  "pages": [],
  "sections": [],
  "interactions": [],
  "scroll_animations": []
}
```
