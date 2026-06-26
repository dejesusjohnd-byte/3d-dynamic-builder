# Context Log — 3D Dynamic Builder
**Purpose:** Running record of key decisions, goals, and session outcomes.
Claude reads this at the start of every session to understand the project history.
Member 1 updates this after any significant session or pipeline change.

---

## PROJECT GOAL
Build a pipeline (AI wrapper) that guides Claude to produce unique, premium,
standalone HTML websites with a 3D video background that plays based on scroll.

Each website must have:
- Scroll-driven video playback (video.currentTime tied to scroll position)
- Distinct structure, style, and theme — not templated
- GSAP animations: reveal, stagger, hover, micro-interactions, parallax
- Three.js only when genuinely needed (not decorative)
- Single self-contained HTML file output

The pipeline guides Claude — it does not replace Claude's intelligence.
Claude selects from palettes and executes. Member 1 controls the palette options.

---

## TEAM ROLES
- **Member 1 (Pipeline Builder):** Builds and maintains the pipeline files.
  Decides what palette options exist. Updates CONTEXT_LOG after sessions.
  Does not prompt Claude for builds — that is Member 3's job.

- **Member 2 (AI Video Generator):** Generates the 3D video assets Claude uses.
  Delivers video URLs or file paths. Not involved in pipeline or prompting.

- **Member 3 (Prompter / Tester):** Pastes SESSION_INIT, fills brief-template,
  hands brief to Claude, reviews section-by-section output, approves or refines.
  Member 1 also acts as Member 3 during testing phases.

- **Claude (Assembler):** Reads pipeline files, selects from palettes, produces
  BRIEF_BLOCK → PALETTE_BLOCK → PLAN_BLOCK → HTML → QC_BLOCK.
  Never modifies pipeline files. Never invents assets. Never skips checkpoints.

---

## VERSION HISTORY
| Version | Status   | Key change |
|---------|----------|-----------|
| Legacy  | Archived | Dual-manifesto, hardcoded dark/gold, 5 chapters |
| V1      | Archived | React component bricks, no theme system, Claude escaped pipeline |
| V2      | Archived | Config-only JSON, 5 themes, SceneRenderer — Claude still escaped pipeline |
| V3      | ACTIVE   | Standalone HTML, checkpoint system, palette-driven variety, scroll-video anchor |

---

## KEY DECISIONS LOG

### 2026-06 — V3 Foundation Session

**Decision:** Replace V2 React architecture with standalone HTML output.
**Why:** Papa's Burger (best output to date) was standalone HTML+GSAP, not React.
React added complexity without improving output quality. Claude kept escaping
the React pipeline and building custom HTML anyway — so we formalize that.

**Decision:** Variety enforced through palette selection, not inspiration injection.
**Why:** Injecting English descriptions of "what good looks like" (TXT evaluations,
Masterclass lessons) caused Claude to average them into generic defaults.
Palette forces specific choices per build. Fingerprint log prevents repetition.

**Decision:** Masterclass lessons inform palette content, not pipeline context.
**Why:** The Masterclass vocabulary (stagger, reveal, parallax, hierarchy, polish)
was extracted into the quality-checks system. The full lesson text is NOT injected
into builds — it's reference material for Member 1 when updating palettes.

**Decision:** Checkpoint chain prevents pipeline bypass.
**Why:** In V1 and V2, Claude read the pipeline goal and then generated from defaults.
The named block system (BRIEF_BLOCK → PALETTE_BLOCK etc.) means skipping a step
produces visibly broken output — Claude cannot fake continuity.

**Decision:** Section-by-section generation with quality check after each section.
**Why:** Masterclass Ep4: "Fix one layer at a time." Building the full page then
fixing it creates cascading problems. Section-by-section keeps quality controlled.

---

## REFERENCE OUTPUT
**Papa's Burger** — `Legacy/Papas Burger.dc.html`
This is the quality bar. Every V3 build must match or exceed this output.

What made it good:
- Scroll-scrubbed video as the anchor mechanic (not ambient loop)
- Bebas Neue at extreme scale — typography as design element
- Mix-blend-mode: difference nav — invisible until it matters
- Hard color break between sections (#0C0C0C → #E8291C) creates rhythm
- Three.js particle field in CTA — earned, not decorative

What to improve on:
- Every section used same eyebrow → massive heading → content grid structure
- Same 9rem padding rhythm throughout — no variation
- GSAP fade-up entrance used on every section — no variety in reveal style

---

## KNOWN ISSUES / WATCH LIST
- Scroll-video sync on mobile requires `video.play().then(() => video.pause())` unlock
- Three.js r128 does NOT have CapsuleGeometry — use CylinderGeometry or SphereGeometry
- v3/ directory had a filesystem corruption from a `mv` operation in bash.
  Files must be written via the Write tool directly to Windows path, not via bash cp/touch.

---

### 2026-06-25 — V3 Hardening Session

**Problem identified:** Icosahedron Intro build showed Claude completely ignoring the pipeline.
**Root cause:** v3/ directory has a filesystem mount issue — bash and some sessions see it as
empty. Claude received the video with no pipeline context, defaulted to training patterns.
**Output quality:** Technically impressive (canvas frame extraction, smooth scrub) but wrong —
invented placeholder brand "AETHER", generated 144 JPEG frames (violating one-file rule),
produced no structure tied to the client brief.

**Decision:** SESSION_INIT.md expanded with explicit 20-file reading list.
**Why:** The original init only listed 4 files. Palette files, library, constraints, and
quality checks were never being read before builds. Claude was designing without the full system.

**Decision:** guardrail_v3.txt hardened with 5 new rules (11–15).
**Why:** The original guardrail had no explicit prohibition on server files, no video path
convention, no text hierarchy stagger rules, and no position variation requirement. These were
the exact failure modes shown in the Icosahedron and v3-first-build outputs.

**Decision:** PIPELINE_v3.md updated with Session Startup Protocol and Checkpoint 1B (Video Director).
**Why:** The checkpoint system was good but had no Director layer. Video analysis was embedded
in stages/01-video-dna.md as a DNA extraction step. The Director layer adds chapter mapping —
the specific connection between video frames and scroll scenes that was missing from every
prior build.

**Decision:** Created engine/scroll-scrub.js and templates/build_base.html.
**Why:** These were described in the pipeline but never existed as actual files. Claude was
expected to invent the scroll engine each build, which produced inconsistent results.
Now the engine is fixed, tested, and Claude copies it verbatim.

**Decision:** Created palettes/typography.md.
**Why:** Referenced in PIPELINE_v3.md checkpoint 2 but file was missing.

**Known issue documented (2026-06-24):** v3/ directory cannot be written via bash.
Must use Write tool with Windows path (C:\Users\user\Desktop\...) directly.
This is not a pipeline issue — it is a mount issue on the Cowork session.

**Decision:** Video path convention — SAME DIRECTORY as index.html.
Correct: `src="burger.mp4"` — video lives beside index.html in v3/builds/{name}/
Reason: Chrome on file:// protocol blocks parent-directory media traversal (../),
even when the path is mathematically correct. Same-directory src is the only
reliable approach for double-click-to-open local HTML.
Convention: Member 3 copies the .mp4 into v3/builds/{name}/ before opening.

---

## NEXT SESSION GOALS
[ ] Run first real V3 build using SESSION_INIT.md + burger.mp4
[ ] Confirm scroll-video scrub works at correct path
[ ] Evaluate section variety and text position variation
[ ] Log fingerprint from first build in fingerprint-log.md
[ ] Add Nexus City and Icosahedron Intro videos to builds/uploads/ for testing

---
*Update this file at the end of any session that produces a completed build or major decision.*
