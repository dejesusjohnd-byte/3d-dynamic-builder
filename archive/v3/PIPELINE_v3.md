# Pipeline V3 — Master Controller
**Status: ACTIVE** | Replaces: PIPELINE_v2.md
**Output:** Standalone HTML — self-contained, no build step, no framework.

---

## HOW THIS WORKS

Four checkpoints. Each produces a named block. Next checkpoint references it.
Skipping any checkpoint breaks the chain — do not proceed without the block.

```
BRIEF_BLOCK  →  PALETTE_BLOCK  →  PLAN_BLOCK  →  HTML (section by section)  →  QC_BLOCK
```

---

## SESSION STARTUP PROTOCOL

Before doing ANYTHING, Claude must read these files in order:
1. `v3/guardrail_v3.txt`
2. `v3/CONTEXT_LOG.md`
3. `v3/PIPELINE_v3.md` (this file)
4. `v3/stages/01-video-dna.md`
5. `v3/stages/02-site-blueprint.md`
6. `v3/stages/03-interaction-layer.md`
7. `v3/templates/build_base.html`

Only after all 7 files are read, confirm: **"V3 pipeline active. Ready to receive brief."**

Skipping this protocol produces generic output. This is not a suggestion.

---

## CHECKPOINT 1 — BRIEF

Read v3/brief-template.md. Member 3 provides the filled brief. Do not invent missing fields.

Required output:
```
BRIEF_BLOCK = {
  "site_goal": "",
  "primary_action": "",
  "brand_name": "",
  "brand_pitch": "",
  "brand_adjectives": [],
  "anti_adjectives": [],
  "pages": [],
  "video_source": "",
  "video_description": ""
}
```

---

## CHECKPOINT 1B — VIDEO DIRECTOR ANALYSIS

> This runs INSIDE Checkpoint 1, immediately after BRIEF_BLOCK is complete.
> It is not optional. The video is the site's story — every design decision follows from it.

**Read `stages/01-video-dna.md` in full before this step.**

**Claude's role here is Director, not coder.** Before touching the palette or structure,
read the video as a director would. The very first question is: what TYPE of video is this?

---

### STEP 0 — DECLARE VIDEO TYPE

**Type A — Cinematic:** Camera travels through space. There is a sense of location, movement,
arrival. Examples: walking into a barbershop, a chef moving through a kitchen, a city drive.
→ Map by LOCATIONS. Chapters = places the camera visits.

**Type B — Object:** Camera is fixed or slow. A single subject transforms, assembles,
disassembles, or reveals itself. Examples: a burger breaking apart and reassembling, a product
forming from components, a watch mechanism, a coffee pour.
→ Map by OBJECT STATES. Phases = what the object is doing at each moment.

**This determines everything downstream.** Declare it in DNA_BLOCK before proceeding.

---

### STEP 1 — MAP THE VIDEO TO SCROLL SCENES

**For Type A (Cinematic):** See `stages/01-video-dna.md` → TYPE A CINEMATIC SCENE MAP.
Text placement derives from where the frame has open space around the location subject.
Copy speaks to the journey — where you are, what you feel arriving there.

**For Type B (Object):** See `stages/01-video-dna.md` → TYPE B OBJECT PHASE MAP.
Text placement derives from the NEGATIVE SPACE AROUND THE OBJECT.
As the object moves and transforms, the negative space shifts — text follows it.
Copy speaks to the PRODUCT — what it is, what makes it, why it matters.
Not the camera. Not the journey. The thing itself.

---

### TEXT HIERARCHY IN ALL SCENES (both types)

- **Headline** — largest, 3rem–7rem. Appears FIRST. Speaks the core truth of this moment.
- **Subhead** — medium, 1rem–1.6rem. Appears SECOND. Deepens or contextualizes.
- **Pitch** — smallest, 0.65rem–0.85rem. Appears LAST. A quiet whisper — ingredient, credential, date, invitation.

Text enters by opacity only. No movement. No translateY. The video moves — the text does not.
Positions must differ across every scene. Derive from where the frame has space, not from habit.

---

## CHECKPOINT 2 — PALETTE SELECTION

Open each file in v3/palettes/. Select ONE option per dimension.
Check v3/build-log/fingerprint-log.md — selections must differ from the last build on 3+ dimensions.
Justify each selection using BRIEF_BLOCK.brand_adjectives and video_description.

Required output:
```
PALETTE_BLOCK = {
  "hero_type":         "[ID] — [label]",
  "nav_style":         "[ID] — [label]",
  "section_pattern":   "[ID] — [label]",
  "typography":        "[ID] — [label]",
  "motion_profile":    "[ID] — [label]",
  "color_system":      "[ID] — [label]",
  "scroll_video_mode": "[ID] — [label]",
  "fingerprint":       "[H]-[N]-[P]-[T]-[M]-[C]-[V]",
  "justifications": {
    "hero_type": "why this fits the brand/video",
    "section_pattern": "why this order serves the goal"
  }
}
```

---

## CHECKPOINT 3 — BUILD PLAN

Using BRIEF_BLOCK + PALETTE_BLOCK, write the section-by-section plan before touching HTML.

Required output:
```
PLAN_BLOCK = {
  "section_order": [],
  "sections": [
    {
      "name": "",
      "layout_type": "",
      "content_summary": "",
      "video_role": "background | none | texture | accent",
      "key_interaction": ""
    }
  ],
  "color_tokens": {
    "--color-bg": "",
    "--color-surface": "",
    "--color-text": "",
    "--color-muted": "",
    "--color-accent": "",
    "--color-accent-hover": ""
  },
  "font_pair": { "heading": "", "body": "" },
  "tech_stack": ["GSAP 3.12", "ScrollTrigger", "Three.js r128 (if needed)"]
}
```

All color values must be specific hex codes derived from video_description and color_system palette.
All font names must be real Google Fonts or system fonts.

---

## CHECKPOINT 4 — GENERATE

Build one section at a time. After each section:
1. Output the HTML for that section
2. Run Layout quality check (v3/quality-checks/quality-checks.md — Layer 1 only)
3. Wait for Member 3 approval before the next section

When all sections are built, run the full quality check (all 4 layers).
Then output the final merged single HTML file.

### Output rules:
- Single `.html` file — everything inline
- All CSS in `<style>` block in `<head>`
- All JS in `<script>` block before `</body>`
- All colors as CSS custom properties (--color-*) set on :root
- Video: `muted playsinline preload="auto"` always
- No placeholder text — use `[PLACEHOLDER: description]` if asset is missing
- No Bootstrap, Tailwind, or any CSS framework

---

## CHECKPOINT 5 — QUALITY GATE

Run v3/quality-checks/quality-checks.md layers in order: Layout → Motion → Interaction → Polish.
Fix any failure before delivering. Do not skip layers.

Required output:
```
QC_BLOCK = {
  "layout":      "pass | [specific issue to fix]",
  "motion":      "pass | [specific issue to fix]",
  "interaction": "pass | [specific issue to fix]",
  "polish":      "pass | [specific issue to fix]",
  "delivered":   true
}
```

Only output `"delivered": true` when all 4 pass.
