# Stage 2: Site Blueprint

**Input:** BRIEF_BLOCK + DNA_BLOCK  
**Output:** BLUEPRINT_BLOCK  

> This stage builds the page structure. Section order, layout type, hierarchy, and spacing system.
> Every choice is pulled from the archetypes library and justified by DNA_BLOCK mood tags.

---

## STEP 1: LOAD THE ARCHETYPES

Open `library/section-archetypes.json`.

For each page in BRIEF_BLOCK.pages, you will select sections from the archetypes library.

**Rule:** For any section type (hero, nav, content, CTA, footer), you must select a variant from the library — not invent a generic one. If the library doesn't have a fitting variant, note it and pick the closest match, then describe the modification.

---

## STEP 2: SECTION SELECTION RULES

### Hero Selection
The hero must match the video's camera framing:
- `wide` framing → full-bleed immersive hero (video fills viewport)
- `medium` framing → split hero (video left or right, text opposite)
- `close` framing → texture hero (video as textured background, heavy typography foreground)

Cross-reference with mood tags:
- Urgent/tense mood → hero with immediate CTA above the fold
- Serene/expansive mood → hero with breathing room, CTA below fold
- Industrial/raw mood → hero with high-contrast text, no decorative elements

### Navigation Selection
Match nav style to brand adjectives from BRIEF_BLOCK:
- Premium/elegant → minimal nav, few items, generous spacing
- Playful/warm → nav with personality (custom hover states, color)
- Raw/industrial → nav stripped down, possibly unconventional position (bottom, side)
- Urgent/direct → sticky nav with persistent CTA in nav bar

### Content Section Order
**BANNED default order:** Hero → About → Services → Contact

Build a section order that serves the PRIMARY ACTION from BRIEF_BLOCK.
Ask: "What does a visitor need to see/feel/know to take the primary action, and in what sequence?"

Construct the order from that logic, not from what "websites usually do."

---

## STEP 3: TYPOGRAPHY SYSTEM

Choose a type scale based on DNA_BLOCK.contrast_level:

- `high` contrast → extreme type scale (e.g., 96px display vs 14px body — wide ratio)
- `medium` contrast → balanced scale (e.g., 56px display vs 16px body)
- `low` contrast → compressed scale (e.g., 32px display vs 15px body — subtle hierarchy)

Font personality should match BRIEF_BLOCK.adjectives:
- Elegant/premium → serif display, sans body
- Raw/industrial → condensed sans or mono, heavy weight
- Warm/organic → humanist sans or slab serif
- Playful → variable font with personality, not neutral
- Surgical/precise → geometric sans, tight tracking

Assign actual font names (Google Fonts or system fonts only — no paid fonts).

---

## STEP 4: SPACING SYSTEM

Derive from DNA_BLOCK.rhythm:
- `pulse` rhythm → tight base unit (4px or 6px), sections packed with breathing accents
- `drift` rhythm → generous base unit (8px or 10px), wide section padding, negative space
- `wave` rhythm → asymmetric spacing — sections alternate tight/loose
- `cut` rhythm → minimal spacing, sections that hard-cut into each other
- `stutter` rhythm → irregular spacing — some sections extremely tight, some extreme space

---

## STEP 5: COLOR ASSIGNMENT

Map DNA_BLOCK.colors to roles:

```
background: dominant (or shadow for dark themes)
text primary: highest contrast against background
text secondary: neutral
interactive: accent
hover state: accent shifted ±20% lightness
border/divider: neutral at 20% opacity
```

If BRIEF_BLOCK.colors are specified, blend — video color takes precedence for atmosphere,
brand color takes precedence for interactive/CTA elements.

---

## OUTPUT FORMAT

```json
BLUEPRINT_BLOCK = {
  "typography": {
    "display_font": "",
    "body_font": "",
    "scale": {
      "display": "",
      "h1": "",
      "h2": "",
      "h3": "",
      "body": "",
      "small": ""
    },
    "tracking": "",
    "line_height": ""
  },
  "spacing": {
    "base_unit": "",
    "section_padding": "",
    "rhythm_type": ""
  },
  "colors": {
    "background": "",
    "text_primary": "",
    "text_secondary": "",
    "interactive": "",
    "interactive_hover": "",
    "border": ""
  },
  "pages": [
    {
      "name": "",
      "goal": "",
      "sections": [
        {
          "type": "",
          "archetype_id": "",
          "content_summary": "",
          "justification": ""
        }
      ]
    }
  ],
  "nav": {
    "archetype_id": "",
    "position": "",
    "behavior": ""
  }
}
```

---

## VALIDATION

Before passing to Stage 3:
- [ ] No sections use generic defaults from the banned list in PIPELINE.md
- [ ] Each section has an archetype_id from the library (not invented)
- [ ] Each section has a justification tied to DNA_BLOCK mood tags or BRIEF_BLOCK adjectives
- [ ] Section order is not Hero → About → Services → Contact
- [ ] Run uniqueness enforcer in `constraints/uniqueness-enforcer.md`
