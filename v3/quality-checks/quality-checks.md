# V3 Quality Checks
**Member 3:** Run Layer 1 after every section. Run all 4 layers before delivering.
**Claude:** Self-run before outputting QC_BLOCK.

---

## LAYER 1 — LAYOUT
Run after each section is built.

**Hierarchy check**
- [ ] One dominant element per section (large heading, hero video, or primary visual)
- [ ] Supporting element is visibly secondary (smaller, lower contrast, or positioned below)
- [ ] Clear action element or implied next step (CTA, scroll prompt, or visual lead-in)

**Spacing check**
- [ ] Minimum 8rem vertical padding above and below section content
- [ ] No content within 2rem of the viewport edge
- [ ] Negative space between elements feels intentional, not accidental

**Grid check**
- [ ] Column count is consistent within section
- [ ] Card/column widths are consistent unless asymmetry is intentional per PALETTE_BLOCK
- [ ] No section uses the same grid structure as the immediately adjacent section

**Video integration**
- [ ] Video element has `muted playsinline preload="auto"` attributes
- [ ] Video mode matches scroll_video_mode in PALETTE_BLOCK
- [ ] Video does not autoplay audibly

---

## LAYER 2 — MOTION
Run when sections 2+ are built (context of sequence needed).

**Reveal check**
- [ ] New sections animate in on scroll — nothing visible at full opacity before viewport entry
- [ ] gsap.fromTo or from with scrollTrigger — not just CSS transition

**Stagger check**
- [ ] Multiple elements (cards, list items, columns) enter with stagger, NOT simultaneously
- [ ] Stagger delay matches motion profile timing from PALETTE_BLOCK

**Motion profile compliance**
- [ ] Duration matches selected profile (M1: 1.8–2.2s | M2: 0.6–0.8s | M3: 2.2–2.5s | M4: 0.4–0.5s)
- [ ] Easing matches selected profile
- [ ] No abrupt snapping (especially in M1 and M3)

**Volume check**
- [ ] Not every element on the page animates — still elements exist intentionally
- [ ] No section has more than 5 independently animated elements unless planned

---

## LAYER 3 — INTERACTION
Run once all sections are built.

**Hover check**
- [ ] Every interactive element (button, card, nav link) has GSAP hover or meaningful CSS transform
- [ ] No hover state is just `opacity: 0.8` — must change color, scale, position, or add motion
- [ ] Hover speed matches motion profile (slow luxury = slow hover, kinetic = fast hover)

**Scroll interaction**
- [ ] Video scrubs or responds to scroll per selected video mode
- [ ] At least one non-hero element uses parallax (moves at different rate than scroll)
- [ ] ScrollTrigger instances are functional and don't conflict

**Nav behavior**
- [ ] Nav transitions match selected nav style from PALETTE_BLOCK
- [ ] Nav doesn't cover content unexpectedly

---

## LAYER 4 — POLISH
Final check before delivery.

**Copy authenticity**
- [ ] Every headline is specific to this brand (cannot be used on a competitor's site)
- [ ] No generic CTAs: "Learn More", "Get Started", "Click Here", "Read More"
- [ ] No filler text, Lorem Ipsum, or [TODO] markers

**Typography precision**
- [ ] Font pair matches PALETTE_BLOCK typography selection
- [ ] Scale ratio applied (heading significantly larger than body)
- [ ] Label/eyebrow text style differs from body (mono, small caps, or tracked)
- [ ] No orphan single words on key headlines

**Color fidelity**
- [ ] All colors reference CSS custom properties (--color-*) from PLAN_BLOCK.color_tokens
- [ ] No hardcoded hex values in CSS body (only in :root definition)
- [ ] Accent color appears 2–4 times max — not on every element
- [ ] Muted color used for supporting text, labels, secondary elements

**Asset check**
- [ ] All video/image sources reference paths from BRIEF_BLOCK
- [ ] No invented URLs
- [ ] [MISSING_ASSET] markers present for any absent asset

**Final delivery checklist**
- [ ] Single HTML file — everything inline
- [ ] style in head, script before /body
- [ ] File opens correctly as local file (file:// protocol, no server needed)
- [ ] Mobile viewport meta tag present
- [ ] No obvious console errors (undefined variables, missing imports)
