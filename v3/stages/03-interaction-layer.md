# Stage 3: Interaction Layer

**Input:** BLUEPRINT_BLOCK  
**Output:** INTERACTION_BLOCK  

> This stage assigns micro-interactions, scroll animations, transitions, and hover states.
> Minimum 3 micro-interactions. All must be selected from `library/interaction-catalog.json`.

---

## STEP 1: VIDEO SCROLL BINDING

Open `library/scroll-behaviors.json`.

Select the scroll behavior that matches DNA_BLOCK.suggested_scroll_behavior.

Specify:
- Which scroll range maps to which video timestamp range (e.g., 0–30% scroll = 0s–4s video)
- Whether scroll drives video time (scrub) or video plays based on scroll trigger (trigger)
- Video blend mode with page content

---

## STEP 2: SECTION ENTRANCE ANIMATIONS

For each section in BLUEPRINT_BLOCK.pages[*].sections, assign an entrance animation.

**Rules:**
- No two adjacent sections use the same entrance type
- Entrance type must match the rhythm_type from BLUEPRINT_BLOCK.spacing

Rhythm → entrance style:
- `pulse` → scale-in with slight overshoot (spring physics)
- `drift` → slow fade + translate-up (staggered children)
- `wave` → cascade reveal left-to-right or diagonal
- `cut` → instant reveal with no animation (the cut IS the interaction)
- `stutter` → choppy reveal with micro-delay jitter

---

## STEP 3: MICRO-INTERACTION SELECTION

Open `library/interaction-catalog.json`.

Select **minimum 3** micro-interactions. Select them based on:
1. Brand adjectives from BRIEF_BLOCK
2. Mood tags from DNA_BLOCK
3. The primary action — the interaction closest to the CTA should be the most satisfying/rewarding

For each selected interaction, specify:
- Which element it applies to
- Which section/page it appears on
- What state triggers it (hover, focus, click, scroll-into-view, scroll-progress)

---

## STEP 4: TRANSITION SYSTEM

Define page-to-page transitions (if multi-page):
- Choose one transition style consistent with DNA_BLOCK.timing.rhythm
- Do not use the default browser transition (fade only)

Define state transitions (normal → hover → active → focus):
- All interactive elements must have a defined hover state — no default browser outline only
- Hover color derived from BLUEPRINT_BLOCK.colors.interactive_hover

---

## STEP 5: CURSOR / AMBIENT LAYER (Optional but encouraged)

If DNA_BLOCK.mood_tags include: immersive, cinematic, premium, dark, mysterious, raw, sacred
→ Consider a custom cursor or ambient mouse-follow effect.

If mood_tags include: playful, warm, energetic
→ Consider particle or confetti micro-effects on CTA interaction.

These are optional — only include if it genuinely serves the brand. Mark in INTERACTION_BLOCK.ambient_layer as null if not used.

---

## OUTPUT FORMAT

```json
INTERACTION_BLOCK = {
  "video_scroll": {
    "behavior_id": "",
    "scroll_to_time_map": [
      { "scroll_pct": 0, "video_time": 0 },
      { "scroll_pct": 100, "video_time": 0 }
    ],
    "blend_mode": "",
    "video_opacity": { "min": 0, "max": 1 }
  },
  "entrance_animations": [
    {
      "section_type": "",
      "animation": "",
      "duration": "",
      "delay": "",
      "easing": ""
    }
  ],
  "micro_interactions": [
    {
      "catalog_id": "",
      "element": "",
      "trigger": "",
      "section": "",
      "description": ""
    }
  ],
  "page_transition": {
    "type": "",
    "duration": "",
    "easing": ""
  },
  "ambient_layer": null
}
```

---

## VALIDATION

- [ ] Video scroll behavior_id matches an entry in scroll-behaviors.json
- [ ] Minimum 3 micro_interactions selected from catalog
- [ ] No two adjacent sections share the same entrance animation type
- [ ] All interactive elements have a hover state defined
- [ ] ambient_layer is either a defined effect or explicitly null (not omitted)
