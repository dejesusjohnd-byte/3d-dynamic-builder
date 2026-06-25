# V3 SESSION INIT
**Member 3: Copy and paste the block below at the START of every Claude session.**
**Do not modify it. Do not paraphrase it. Paste it exactly.**
**Wait for Claude's confirmation phrase before proceeding.**

---

## COPY FROM HERE ↓

```
=== 3D DYNAMIC BUILDER — V3 PIPELINE ACTIVE ===

You are the ASSEMBLER in the 3D Dynamic Builder pipeline.
Output: one standalone HTML file per build. No React. No frameworks. No server files.
GSAP + ScrollTrigger via CDN. Everything else inline.

Before doing anything, read ALL of these files in this exact order:

REQUIRED SYSTEM FILES:
1. C:\Users\user\Desktop\3d-dynamic-builder\v3\guardrail_v3.txt
2. C:\Users\user\Desktop\3d-dynamic-builder\v3\CONTEXT_LOG.md
3. C:\Users\user\Desktop\3d-dynamic-builder\v3\PIPELINE_v3.md
4. C:\Users\user\Desktop\3d-dynamic-builder\v3\stages\01-video-dna.md
5. C:\Users\user\Desktop\3d-dynamic-builder\v3\stages\02-site-blueprint.md
6. C:\Users\user\Desktop\3d-dynamic-builder\v3\stages\03-interaction-layer.md
7. C:\Users\user\Desktop\3d-dynamic-builder\v3\templates\build_base.html

PALETTE FILES:
8.  C:\Users\user\Desktop\3d-dynamic-builder\v3\palettes\hero-types.md
9.  C:\Users\user\Desktop\3d-dynamic-builder\v3\palettes\nav-styles.md
10. C:\Users\user\Desktop\3d-dynamic-builder\v3\palettes\section-patterns.md
11. C:\Users\user\Desktop\3d-dynamic-builder\v3\palettes\typography.md
12. C:\Users\user\Desktop\3d-dynamic-builder\v3\palettes\motion-profiles.md
13. C:\Users\user\Desktop\3d-dynamic-builder\v3\palettes\color-systems.md
14. C:\Users\user\Desktop\3d-dynamic-builder\v3\palettes\scroll-video-modes.md

LIBRARY + CONSTRAINTS:
15. C:\Users\user\Desktop\3d-dynamic-builder\v3\library\section-archetypes.json
16. C:\Users\user\Desktop\3d-dynamic-builder\v3\library\scroll-behaviors.json
17. C:\Users\user\Desktop\3d-dynamic-builder\v3\library\interaction-catalog.json
18. C:\Users\user\Desktop\3d-dynamic-builder\v3\constraints\uniqueness-enforcer.md
19. C:\Users\user\Desktop\3d-dynamic-builder\v3\quality-checks\quality-checks.md
20. C:\Users\user\Desktop\3d-dynamic-builder\v3\build-log\fingerprint-log.md

After reading all 20 files, confirm with EXACTLY this phrase:
"V3 pipeline active. Ready to receive brief."

Do NOT generate any HTML, design decisions, or palette selections until confirmed.
=== END INIT ===
```

## COPY TO HERE ↑

---

## WHAT HAPPENS NEXT

After Claude confirms, provide:
1. Filled `brief-template.md` (all fields completed — vague answers = generic output)
2. Video file path: `C:\Users\user\Desktop\3d-dynamic-builder\v3\builds\uploads\{filename.mp4}`
3. Description of the video's key moments (what happens at each chapter)
4. Screenshots of key frames if available

Claude will then run all 5 checkpoints in sequence, section by section, waiting for your approval at each stage.

---

## PIPELINE ESCAPE WARNINGS

If Claude does any of these, STOP and restart with a fresh session:
- Generates a full website without running checkpoints first
- References `~/Downloads/` or any absolute path for the video
- Creates `.bat`, `.sh`, `.py`, `package.json`, or any server file
- Invents a brand name (AETHER, NEXUS, or any other placeholder)
- Creates separate CSS or JS files outside index.html
- Outputs more than one HTML file

These are pipeline escapes. Mid-session fixes do not work.
Start fresh. Paste SESSION_INIT again.

---

## APPROVED OUTPUT PER BUILD

```
v3/builds/{build_name}/
  index.html              ← complete site
  keyframe_map.json       ← Checkpoint 1B output
  brand_fingerprint.json  ← Checkpoint 2 output
```

Nothing else. Any other file is a violation.

---

## AFTER EACH SESSION — MEMBER 1 UPDATES

- `v3/CONTEXT_LOG.md` — what was decided or changed
- `v3/build-log/fingerprint-log.md` — add the completed build fingerprint
- `VERSION_REPORT.md` (root) — changelog entry if pipeline version changed
