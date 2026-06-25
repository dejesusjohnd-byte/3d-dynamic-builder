# Uniqueness Enforcer

> Run this during Stage 2 (Site Blueprint) before finalizing BLUEPRINT_BLOCK.
> The purpose: guarantee each generated site is structurally distinct from the last.

---

## VARIATION AXES

Each axis has options. Log which option was selected for this run.
The next run MUST differ on at least 3 of these 6 axes.

### Axis 1: Layout Density
- `A` — Spacious (generous padding, large negative space, few elements per section)
- `B` — Balanced (standard density, comfortable but not sparse)
- `C` — Dense (tight spacing, many elements, information-rich sections)

Selected: ___

### Axis 2: Type Scale Ratio
- `A` — Extreme (display text 5× or more larger than body — high drama)
- `B` — Moderate (display text 3–4× larger than body)
- `C` — Compressed (display text ≤2× larger than body — subtle hierarchy)

Selected: ___

### Axis 3: Color Temperature
- `A` — Warm (reds, oranges, yellows, warm browns)
- `B` — Neutral (balanced, neither warm nor cool)
- `C` — Cool (blues, greens, greys, cold whites)

Selected: ___

### Axis 4: Animation Timing Feel
- `A` — Snappy (fast transitions, sharp easing, <300ms)
- `B` — Smooth (medium transitions, 300–600ms, ease-in-out)
- `C` — Slow & Cinematic (600ms+, spring physics or custom cubic-bezier)

Selected: ___

### Axis 5: Hero Type
(From archetypes — note the ID)
Selected: ___

### Axis 6: Navigation Position
- `A` — Top fixed
- `B` — Top hidden (scroll-up reveal)
- `C` — Side vertical
- `D` — Bottom fixed
- `E` — None / integrated into hero

Selected: ___

---

## FINGERPRINT

After completing axes, generate the fingerprint:

```
FINGERPRINT = "[Axis1]-[Axis2]-[Axis3]-[Axis4]-[HeroID]-[Axis6]"
Example: "A-A-C-C-hero-texture-type-C"
```

Log this fingerprint in the SITE_SPEC.meta.fingerprint field.

---

## FORBIDDEN COMBINATIONS (generic outputs)

The following axis combinations produce generic websites. Do not select them:

| Combination | Why It's Generic |
|---|---|
| B density + B type ratio + B temperature | "Average" in every dimension — no character |
| hero-immersive-scroll + A (top fixed nav) + C (slow cinematic) | Overused premium formula |
| C dense + A extreme type + A warm | Chaotic without purpose |

If your current selections match any forbidden combination, adjust at least one axis.

---

## SECTION ORDER VALIDATOR

Paste your planned section order here and check it against the banned pattern.

**Banned default:**
```
Hero → About → Services → Contact
```

**Your planned order:**
```
1. 
2. 
3. 
4. 
5. 
```

Does it match the banned order exactly? If yes, reorder.

**Tip for reordering:** Think about the visitor's decision journey, not "what websites do."
Ask: what is the ONE action they need to take? What must they feel/know first to take that action?
Build the order around that logic.

---

## GENERIC ELEMENT AUDIT

Before finalizing, check every section for these generic defaults. If found, replace.

- [ ] Hero headline is NOT "Welcome to [Brand Name]"
- [ ] Hero sub-headline is NOT "We provide [service] for [audience]"
- [ ] CTA text is NOT "Learn More", "Get Started", or "Click Here"
- [ ] No section heading is just the section type ("About Us", "Our Services", "Contact Us")
- [ ] No placeholder stock imagery (must be from brand or video stills)
- [ ] No generic grid of 3 equal icon+text feature blocks as the primary content pattern
- [ ] Color palette contains NO pure #ffffff or #000000 (use brand/video derived near-whites and near-blacks)
- [ ] Font is NOT system-default (Arial, Helvetica, Times New Roman, Georgia)

---

## PASS / FAIL

All checks above must pass. If any fail, fix before passing BLUEPRINT_BLOCK to Stage 3.

```
Fingerprint: ___________________
Axes differ from last run (3+): YES / NO
Generic audit: PASS / FAIL
Section order valid: YES / NO
```
