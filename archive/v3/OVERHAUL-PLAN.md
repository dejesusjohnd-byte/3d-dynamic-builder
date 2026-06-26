# PopUp-Pipeline V3 Overhaul Plan

## Why V1 Failed (and Why TXT Evaluations Backfired)

### Root Cause 1: Pipeline as Suggestion, Not Contract
V1 was almost certainly written as prose instructions. When Claude reads a prose pipeline, it extracts the *goal* and skips to generation — the intermediate steps become suggestions it quietly bypasses. The output looks fine on the surface but has no connection to the pipeline logic.

**Fix:** Every stage must produce a **named output block** (JSON or structured markdown). The next stage explicitly references that block by name. If the block is missing, the chain visibly breaks. Claude cannot fake continuity.

### Root Cause 2: TXT Evaluations as Noise
Evaluating entire websites and dumping that into a TXT creates two problems:
1. **Volume dilutes signal** — AI averages all patterns into a generic middle. You get "inspired by everything" which equals "inspired by nothing."
2. **No actionability** — "This site looks clean" doesn't tell Claude *which specific element* to replicate or *why* it works in context.

**Fix:** Replace TXT evaluations with a **tagged micro-pattern library** (JSON). Each entry is one specific element (not a whole site), tagged with: what it does, when to use it, when NOT to use it, and what design adjectives it matches.

### Root Cause 3: No Forced Variation
Without explicit constraints forbidding reuse, Claude defaults to familiar/safe patterns. Every hero ends up full-bleed centered. Every nav ends up top-fixed transparent.

**Fix:** Uniqueness enforcer with variation axes. Each generation picks one option per axis (layout density, type ratio, animation timing, color temperature) and logs it. The next run must differ on at least 3 axes.

---

## What to KEEP, FIX, REPLACE

| Element | Status | Reason |
|---|---|---|
| Goal/Brand/Pages intake structure | **KEEP** | Correct framing. Direction before design. |
| V2 scroll-video binding (if working) | **KEEP** | Core mechanic. Don't rebuild what works. |
| Website evaluation concept | **REPLACE** | Whole-site → micro-pattern library |
| V1 prose pipeline instructions | **REPLACE** | Prose → contract checkpoints |
| Generic fallback behaviors | **REPLACE** | Add forbidden-defaults list |
| Optimization rules (Keep/Fix/Replace) | **KEEP** | Solid decision framework |

---

## V3 File Structure

```
PopUp-Pipeline/
├── PIPELINE.md                      ← Master controller (the law)
├── brief-template.md                ← Intake: Goal + Brand + Pages
├── OVERHAUL-PLAN.md                 ← This document
│
├── stages/
│   ├── 01-video-dna.md             ← Extract design tokens from video
│   ├── 02-site-blueprint.md        ← Forced structure selection
│   └── 03-interaction-layer.md     ← Micro-interaction assignments
│
├── library/
│   ├── section-archetypes.json     ← 18 section variants, tagged
│   ├── interaction-catalog.json    ← Micro-interaction patterns, tagged
│   └── scroll-behaviors.json       ← Video scroll binding modes
│
└── constraints/
    └── uniqueness-enforcer.md      ← Variation checklist, axes, forbidden defaults
```

---

## Files to Create / Update

### New Files (V3 additions)
| File | Purpose | Priority |
|---|---|---|
| `PIPELINE.md` | Master controller with checkpoint system | P0 |
| `constraints/uniqueness-enforcer.md` | Forced variation system | P0 |
| `library/section-archetypes.json` | Replaces TXT evaluations | P0 |
| `library/interaction-catalog.json` | Tagged micro-patterns | P1 |
| `library/scroll-behaviors.json` | Scroll→video binding modes | P1 |
| `stages/01-video-dna.md` | Video analysis stage | P0 |
| `stages/02-site-blueprint.md` | Structure selection stage | P0 |
| `stages/03-interaction-layer.md` | Interaction assignment stage | P1 |

### If V2 files exist (from other location)
| Action | What |
|---|---|
| Migrate scroll-video binding logic | Keep the working mechanic |
| Extract any working generation logic | Wrap it in the checkpoint system |
| Archive V1 | Don't delete — reference for what not to repeat |

---

## Code Changes Needed in Generated Websites

When the pipeline produces a website spec, the output HTML/JS must include:

```javascript
// Required: scroll-video sync
// Required: CSS custom properties from design tokens (not hardcoded values)
// Required: intersection observers for section reveals
// Required: at least 3 micro-interactions from the catalog
// Forbidden: Bootstrap, generic template classes, placeholder text
```

---

## How to Use V3

1. Fill out `brief-template.md` (Goal + Brand + Pages)
2. Provide the video file/URL
3. Run the pipeline stages in order — each produces a named output block
4. Feed the final output block to the website builder
5. The uniqueness enforcer logs the variation fingerprint for the next run

---

## Success Criteria
- Claude cannot skip a stage without the next stage failing to reference its output
- No two generated websites share the same fingerprint on 3+ variation axes
- Zero generic defaults (no placeholder text, no generic hero layouts, no Bootstrap)
- Every design decision traces back to either the video DNA or the brand brief
