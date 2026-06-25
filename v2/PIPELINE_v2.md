# Website Builder & Media Assembly Pipeline — V2
### Replaces: PIPELINE_v1.md | Status: ACTIVE

---

## 1. What Changed from V1

V1 gave Claude one job: fill props into a fixed template (GeneratedScene.jsx).
Every site used `#09090b` backgrounds, Playfair Display headings, and gold accents.
Visual variation was impossible because the entire identity was hardcoded in the components.

V2 separates decisions from rendering:
- **Claude writes a config (decisions).** No JSX. No rendering.
- **SceneRenderer reads the config (rendering).** No decisions.
- **Themes carry the visual identity.** Member 1 engineers them once. Claude selects them per brief.

---

## 2. Team Roles — Updated

**Member 1 (Components Builder)**
- Maintains the immutable brick components in `./components/`
- Engineers theme token files in `./themes/`
- Builds new brick variants when needed (e.g. `HeroSection_SplitScreen.jsx`)
- Registers new variants in `./renderer/SceneRenderer.jsx` COMPONENT_MAP
- Owns `./renderer/SceneRenderer.jsx` — nobody else touches this file

**Member 2 (AI Video Generator)**
- Same role as V1: generates cinematic looping video assets
- Delivers final URLs to Member 3 for brief completion

**Member 3 (The Assembler)**
- Fills out `./briefs/brief_template.json` for each client
- Hands the completed brief to Claude
- Pastes Claude's output JSON into `./configs/`
- Previews by swapping the import in `App.jsx`
- Requests refinements from Claude (config edits only, never component edits)

**Claude (AI Orchestrator)**
- Reads the completed brief from `./briefs/`
- Reads PIPELINE_v2.md and guardrail_v2.txt before every session
- Writes the `site_config.json` into `./configs/`
- Never writes JSX. Never modifies components. Never touches SceneRenderer.
- If an asset URL is missing: outputs `"MISSING_ASSET"` — never invents a URL.

---

## 3. Pipeline Flow — Step by Step

```
BRIEF (Member 3 fills)
    ↓
Claude reads brief + PIPELINE_v2.md + guardrail_v2.txt
    ↓
Claude writes site_config.json → /configs/
    ↓
Member 3 imports config in App.jsx
    ↓
SceneRenderer reads config → resolves theme → assembles scene
    ↓
Member 3 previews → requests refinements
    ↓
Claude edits config only → cycle repeats
```

---

## 4. Directory Structure

```
3d-dynamic-builder/
│
├── PIPELINE_v1.md                    ← ARCHIVED — kept for reference
├── PIPELINE_v2.md                    ← ACTIVE — this file
├── guardrail_v1.txt                  ← ARCHIVED
├── guardrail_v2.txt                  ← ACTIVE
│
├── components/                       ← IMMUTABLE — Member 1 only
│   ├── motion_registry.js            ← 4 motion profiles
│   ├── Navigation.jsx
│   ├── HeroSection.jsx
│   ├── CollageIntroduction.jsx
│   ├── StaticOfferingsGrid.jsx
│   ├── TextEditorial.jsx
│   ├── TwoColumnValuePause.jsx
│   └── ClosingCallToAction.jsx
│
├── themes/                           ← Member 1 engineers, Claude selects
│   ├── theme_registry.js             ← Master token map + resolveTheme()
│   ├── warm_earth.js                 ← Brown/gold authority (Quinn-style)
│   ├── cold_tech.js                  ← Navy/blue precision (SaaS/tech)
│   ├── dark_gold.js                  ← Opulent black/deep gold (luxury)
│   ├── light_minimal.js             ← White/black restraint (design/arch)
│   └── editorial_serif.js           ← Cream/red magazine energy (media)
│
├── briefs/                           ← Member 3 fills these
│   ├── brief_template.json           ← Blank starter — copy per client
│   └── brief_[client_name].json      ← One per client
│
├── renderer/                         ← Member 1 builds, nobody else touches
│   └── SceneRenderer.jsx             ← Reads config → assembles scene
│
├── configs/                          ← Claude writes these
│   └── config_[client_name].json     ← One per client build
│
├── variants-registry/                ← Final assembled scenes per niche
│   ├── 01_LawFirm_WarmAuthority/
│   ├── 02_TechProduct_ColdKinetic/
│   ├── 03_LuxuryBrand_DarkEditorial/
│   └── 04_Agency_BoldMinimal/
│
└── App.jsx                           ← Preview sandbox — swap config import
```

---

## 5. Theme System

Every site_config.json declares a `theme_token`. SceneRenderer resolves this to a theme object from `./themes/theme_registry.js` and passes it to every component as a `theme` prop.

### Available Themes

| Token | Personality | Best For | Accent |
|---|---|---|---|
| `warm_earth` | Authoritative, grounded | Law, finance, consulting | Gold `#c8a97e` |
| `cold_tech` | Precise, fast, intelligent | SaaS, AI, infrastructure | Blue `#3b82f6` |
| `dark_gold` | Opulent, cinematic | Luxury goods, private banking | Deep gold `#e8c47a` |
| `light_minimal` | Restrained, content-first | Architecture, design studios | Black `#111111` |
| `editorial_serif` | Bold, cultural authority | Media, publishing, agencies | Red `#c0392b` |

### What a Theme Controls

- Background colors (page, card, nav)
- Border colors (subtle dividers, card edges)
- Text colors (primary, muted, label)
- Accent color (CTA buttons, hover states, particles)
- Font families (heading, body, label)
- Button style (outline / filled / ghost)
- Button border radius (sharp vs rounded)
- Media filter styles (hero bg, card imagery)

### What a Theme Does NOT Control

- GSAP animation timing (that's motion_tempo)
- Section order (that's section_order in config)
- Content/copy (that's the config data objects)

---

## 6. Motion Profiles

Declared in `./components/motion_registry.js`. Claude selects one per build.

| Token | Duration | Ease | Stagger | Use When |
|---|---|---|---|---|
| `slow_luxury` | 2.2s | power4.out | 0.15 | Premium, cinematic, high-end |
| `kinetic_modern` | 0.8s | power2.inOut | 0.05 | Fast-paced, tech, energetic |
| `minimalist_restraint` | 2.5s | power1.inOut | 0.2 | Editorial, design, pure calm |
| `precision_utility` | 0.5s | power2.out | 0.05 | Data-dense, enterprise, utility |

---

## 7. Claude's Config Output Specification

When Claude receives a completed brief, it outputs a single `site_config.json` file.

### Required Top-Level Keys

```json
{
  "_meta": {
    "brief_source": "brief_[client].json",
    "generated_by": "Claude",
    "pipeline_version": "v2",
    "variant_id": "[NicheArchetype]"
  },
  "theme_token": "[one of 5 approved tokens]",
  "motion_tempo": "[one of 4 approved profiles]",
  "section_order": ["Navigation", "HeroSection", ...],
  "omit_sections": [],
  "chapter_label_overrides": {},
  "Navigation": { ... },
  "HeroSection": { ... }
}
```

### Section Data Keys

Each section in `section_order` must have a matching key at the root level of the config containing all props for that component (except `motion_tempo`, `theme`, and `button_style` — SceneRenderer injects those automatically).

### Duplicate Sections

To render `StaticOfferingsGrid` twice (DataHeavy pattern), include it twice in `section_order` and provide data under `StaticOfferingsGrid` (first instance) and `StaticOfferingsGrid_2` (second instance).

### Missing Assets

If a required asset URL is not in the brief, Claude outputs:
```json
"depth_layer_one_url": "MISSING_ASSET"
```
Never invent or guess URLs.

---

## 8. Structural Variation Rules

Claude must use all available variation levers per build — not just swap copy.

### Lever 1: Theme Token
Different visual identity entirely. Never default to warm_earth unless the brief clearly calls for it.

### Lever 2: Motion Tempo
Match the tempo to the emotional tone. A luxury brand getting kinetic_modern is wrong.

### Lever 3: Section Order & Omission
Not every site needs all 7 sections. Minimal sites: 3-4 sections. Data-heavy sites: can repeat StaticOfferingsGrid.

### Lever 4: Chapter Label Overrides
Every site should have its own chapter labels that match the brand voice — not the generic defaults baked into components.

### Lever 5: Copy Personality
Headline style, body tone, CTA energy must all match the brief's emotional_tone and brand_adjectives. Do not write generic placeholder copy.

---

## 9. Variant Registry Naming Convention

Variants in `./variants-registry/` are named by niche archetype, not by motion tempo:

```
01_LawFirm_WarmAuthority        ← warm_earth + slow_luxury
02_TechProduct_ColdKinetic      ← cold_tech + kinetic_modern
03_LuxuryBrand_DarkEditorial    ← dark_gold + minimalist_restraint
04_Agency_BoldMinimal           ← light_minimal + minimalist_restraint
05_MediaBrand_EditorialSerif    ← editorial_serif + slow_luxury
```

Each variant folder contains: `config.json` (Claude's output) + `preview_notes.md` (what worked, what to improve).

---

## 10. Refinement Cycle Rules

When Member 3 requests adjustments after preview:

**Claude may:**
- Edit any value inside a config JSON
- Change `theme_token`, `motion_tempo`, `section_order`
- Rewrite copy, swap asset URLs, adjust chapter labels

**Claude may NOT:**
- Modify any file in `./components/`
- Modify `./renderer/SceneRenderer.jsx`
- Create new theme files (request Member 1)
- Create new component variants (request Member 1)
- Invent asset URLs marked `MISSING_ASSET`
