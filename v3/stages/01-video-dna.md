# Stage 1: Video DNA Extraction

**Input:** BRIEF_BLOCK  
**Output:** DNA_BLOCK  

> This stage has two jobs:
> 1. Extract visual DNA — colors, timing, texture, mood — that drives the design system.
> 2. Classify the video type and map it into scroll scenes.
> Every design decision in the site traces back to this stage.

---

## STEP 0 — CLASSIFY THE VIDEO TYPE (DO THIS FIRST)

Before any analysis, determine which type of video you are working with.
This changes how you map the video to scroll scenes.

### Type A — CINEMATIC / LOCATION-TO-LOCATION
The camera travels through space. There is a sense of place, movement, arrival.
Examples: walking into a barbershop, driving through a city, exploring a building,
a chef moving through a kitchen, a craftsperson moving through a workshop.

**Chapters = locations or spatial moments.**
The video tells a journey. Scroll = moving through that journey.

### Type B — OBJECT / TRANSFORMATION
The camera is mostly fixed or slow. A single subject changes state, assembles,
disassembles, transforms, or reveals itself.
Examples: a burger breaking apart and reassembling, a watch mechanism, a coffee
pour, a flower blooming, a product forming from its components, a dish being plated.

**Phases = object states.**
The video tells a product story. Scroll = the transformation progressing.

---

Declare the type at the top of DNA_BLOCK before proceeding:
```
"video_type": "cinematic" | "object"
```

If genuinely mixed (e.g., camera moves AND subject transforms), pick the dominant one.

---

## STEP 1 — COLOR EXTRACTION

Pull 5–7 dominant colors from the video. Label each:
- Dominant (most screen presence throughout)
- Accent (the color that punches through — often the product's hero color)
- Shadow (darkest value in the video)
- Highlight (brightest value)
- Neutral (background / negative space)

Convert to hex. These become the entire site's color system.
Do NOT bring in external colors unless the brief explicitly requires specific brand hex codes.

If BRIEF_BLOCK.colors are specified: find the closest video color to each, use the
video color as the base, shift toward the brand color but never fully replace it.

---

## STEP 2 — TIMING & MOTION

Answer these questions from the video:
- Is the motion fast or slow overall?
- Is it sharp/cut or smooth/flowing?
- What is the dominant rhythm? (pulse, drift, stutter, wave)

Map to CSS timing values:
```
fast + sharp   → transition: 0.15s cubic-bezier(0.4, 0, 1, 1)
slow + smooth  → transition: 0.8s cubic-bezier(0.16, 1, 0.3, 1)
pulse          → animation: ease-in-out, 1.2s–2s cycle
drift          → animation: linear or ease, 3s–8s cycle
stutter        → animation: steps(4), 0.3s–0.6s
```

---

## STEP 3 — TEXTURE & DEPTH

- Is the video grainy, clean, sharp, soft, filmic, digital?
- Is there depth of field (bokeh, blur layers)?
- Is there light flare, glow, or sharp contrast?

Map to CSS:
```
grain          → noise SVG filter or film-grain overlay div
bokeh          → backdrop-filter: blur() on UI surfaces
glow           → box-shadow with spread + video accent color
sharp contrast → high contrast typography, no midtone text colors
```

---

## STEP 4 — MOOD TAGS (3–5 words)

Describe the video's emotional register — not the subject matter, the feeling.
Examples: appetizing, precise, warm, industrial, sacred, playful, melancholic, energetic

Used in Stage 2 to select section archetypes and Stage 3 for micro-interactions.

---

## STEP 5 — SCROLL SCENE MAP

This is the Director step. Map the video into scenes for the scroll experience.
**The method differs by video type.**

---

### TYPE A — CINEMATIC SCENE MAP

Identify distinct locations or spatial moments in the video. Each becomes a scroll scene.

Per scene, extract:

| Field | What it means |
|---|---|
| `scene_id` | Slug — e.g. `city-exterior`, `barbershop-entry` |
| `timestamp_range` | [start, end] in seconds |
| `scroll_range` | [start, end] as 0–1 progress (allocate based on dwell time) |
| `location` | Where the camera is — name it simply |
| `camera_motion` | push-forward / pull-back / rotate / pan / static |
| `frame_openness` | open / medium / packed |
| `emotional_tone` | arrive / enter / discover / reveal / settle / invite |
| `text_avoid_zone` | Where NOT to place text (where the main visual subject is) |
| `text_safe_zone` | Where open space exists for text |
| `scene_copy` | Headline + subhead + pitch for this scene |

**Copy logic for cinematic:**
- Headline speaks to the MOMENT — where you are, what you feel arriving here
- Subhead contextualizes — what this place means, what happens here
- Pitch whispers — a detail, a credential, an invitation

Example:
```
Scene: city-exterior
Headline: "The City Finds You"       → 5rem, top: 15%, left: 7%
Subhead:  "Every cut starts here."   → 1.1rem, top: 72%, right: 8%
Pitch:    "Harlem · Est. 2019"       → 0.72rem, bottom: 6%, right: 5%
```

---

### TYPE B — OBJECT PHASE MAP

Identify distinct states or phases of the object's transformation.
Each phase becomes a scroll scene.

Per phase, extract:

| Field | What it means |
|---|---|
| `phase_id` | Slug — e.g. `intact`, `breaking-apart`, `components`, `reassembling`, `complete` |
| `timestamp_range` | [start, end] in seconds |
| `scroll_range` | [start, end] as 0–1 progress |
| `object_state` | What is happening to the object — describe in 3–5 words |
| `object_position` | Where the object sits in the frame — center / left / right / scattered / filling-frame |
| `negative_space_zone` | Where there is OPEN SPACE around the object (this is where text goes) |
| `emotional_tone` | establish / reveal / deconstruct / showcase / reunite / complete |
| `scene_copy` | Headline + subhead + pitch for this phase |

**Copy logic for object-based:**
- Headline speaks to what the OBJECT IS or what it MEANS — not what's happening
- Subhead reveals the WHY — craft, ingredient, intention behind this state
- Pitch names a detail — an ingredient, a process, a brand value

**Negative space shifts as the object moves/transforms — text follows the space.**
If the burger is center-frame in phase 1 → text goes to margins.
If components scatter in phase 2 → a gap opens in the center → text can move in.
If the burger reassembles to the right → text can anchor left.

**Positions MUST vary across phases** — the object's movement creates the variation naturally.

Example (burger video):
```
Phase: intact
Object: complete burger, centered, fills ~40% of frame
Negative space: top-left, top-right, bottom margins
Headline: "This Is the Standard"  → 4.5rem, top: 10%, left: 6%
Subhead:  "Everything you expect. Nothing less."  → 1rem, bottom: 10%, right: 6%
Pitch:    "Premium Beef · Brioche · House Sauce"  → 0.72rem, bottom: 5%, left: 50%

Phase: breaking-apart
Object: burger deconstructing, parts separating, motion center-outward
Negative space: corners open up as pieces spread
Headline: "Every Layer, Earned"   → 5rem, top: 12%, right: 7%
Subhead:  "We don't hide what's inside."  → 1rem, top: 65%, left: 6%
Pitch:    "Crafted. Not assembled."  → 0.7rem, bottom: 7%, left: 6%

Phase: components-floating
Object: individual ingredients visible and spread
Negative space: center (pieces scattered to edges) OR a clear band between layers
Headline: "Fresh. Always."  → 4rem, center-top at 8%
Subhead:  "Sourced daily."  → 1rem, center at 55%
Pitch:    "No shortcuts."   → 0.7rem, center-bottom at 90%

Phase: reassembling
Object: pieces pulling back together, motion inward
Negative space: side margins open as object narrows toward center
Headline: "Back to One"    → 5rem, top: 14%, left: 8%
Subhead:  "Perfected."     → 1rem, bottom: 12%, right: 7%
Pitch:    "[Brand Name]"   → 0.72rem, bottom: 6%, left: 50%

Phase: complete
Object: full burger, possibly slightly different angle than Phase 1
Negative space: similar to Phase 1
Headline: "Now You Know Why."   → 4.5rem, top: 15%, right: 8%
Subhead:  "Come get one."       → 1rem, bottom: 11%, left: 6%
Pitch:    "Open daily."         → 0.72rem, bottom: 5%, right: 5%
```

---

## OUTPUT FORMAT

```json
DNA_BLOCK = {
  "video_type": "cinematic | object",
  "colors": {
    "dominant":    "#______",
    "accent":      "#______",
    "shadow":      "#______",
    "highlight":   "#______",
    "neutral":     "#______"
  },
  "color_temperature": "warm | cool | neutral",
  "timing": {
    "base_transition":    "0.___s cubic-bezier(...)",
    "entrance_animation": "0.___s cubic-bezier(...)",
    "rhythm":             "pulse | drift | stutter | wave | cut"
  },
  "texture": {
    "grain":          true,
    "blur_layers":    false,
    "glow":           false,
    "contrast_level": "high | medium | low"
  },
  "mood_tags": ["", "", ""],
  "suggested_scroll_behavior": "",
  "video_scroll_ratio": 0.65,
  "scenes": [
    {
      "scene_id":        "",
      "timestamp_range": [0, 0],
      "scroll_range":    [0.00, 0.00],
      "emotional_tone":  "",
      "text_safe_zone":  "",
      "scene_copy": {
        "headline": { "copy": "", "size": "", "position": {} },
        "subhead":  { "copy": "", "size": "", "position": {} },
        "pitch":    { "copy": "", "size": "", "position": {} }
      }
    }
  ]
}
```

For object videos: replace `text_safe_zone` with `negative_space_zone` and add `object_state` and `object_position` fields per scene.

---

## VALIDATION

Before passing DNA_BLOCK to Stage 2:
- [ ] `video_type` is declared — "cinematic" or "object"
- [ ] All color hex codes are filled (no empty strings)
- [ ] Timing values are actual CSS — not descriptions
- [ ] At least 3 mood tags
- [ ] `suggested_scroll_behavior` matches an ID in `library/scroll-behaviors.json`
- [ ] Every scene has a `scene_copy` block with headline, subhead, and pitch
- [ ] No two scenes share the same text layout / position
- [ ] Headline size is always larger than subhead; subhead always larger than pitch
