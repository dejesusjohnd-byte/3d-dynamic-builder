# Pipeline Activity Log
**Purpose:** Audit trail. Every session a fresh Claude opens this project must append an entry here. This lets the project owner (Derick) check whether the pipeline was read, followed, or ignored.

**How to append:** At the start of every session, copy the template below and fill it in. Append to the bottom of this file — do not overwrite previous entries.

---

## Entry Template

```
## [YYYY-MM-DD] — [one-line summary of what the user asked]
- Pipeline files read: [list every .md file you read before building]
- Input format: clean 3-file format / long prompt / partial / unclear
- Member type detected: Member 1 (builder) / Member 3 (long prompter) / unknown
- Mode used: Standard build / Exploratory Mode
- Missing inputs: [video / keyframes / brief / none]
- Compensations made: [what you inferred or asked for instead]
- What worked first try:
- What had to be corrected:
- Final output:
```

---

## 2026-06-26 — Pipeline restructure: added Member 3 exploratory mode + activity logging

- Pipeline files read: SESSION_INIT.md, OPERATOR_GUIDE.md, SESSION_TRANSFER.md, VERSION_REPORT.md
- Input format: Ongoing conversation (Member 1 / builder session)
- Member type: Member 1 — Derick (builder)
- Mode used: Standard build (Bike Breakdown v3 continuation)
- Missing inputs: none — all files present
- Compensations made: n/a
- What worked first try: hero scrub, carousel, embedded 3D models, loading screen
- What had to be corrected: manifesto helmet clipping (removed overflow:hidden + data-reveal), mountain bike sizing (explicit min-height on flex container), footer models facing down (duplicate orientation= attribute), loading screen blocking scroll (missing pointer-events:none), GitHub push rejected (large GLBs in git history)
- Final output: index-v3.html (17.5MB), SESSION_TRANSFER.md, OPERATOR_GUIDE.md updated, SESSION_INIT.md updated with exploratory mode + activity logging, PIPELINE_ACTIVITY.md created (this file)

## 2026-06-29 — VereHomes2 canvas build + engine syntax fix + inline engine pattern

- Pipeline files read: SESSION_INIT.md, engine/CHANGELOG.md, builds/VereHomes2/logs/brief.md
- Input format: Ongoing builder session — Derick provided brief via VereHomes2 folder
- Member type: Member 1 — Derick (builder)
- Mode used: Standard build
- Missing inputs: Brief was empty in VereHomes2 — confirmed same as VereHomes (VeraHomes, Buy/Rent, Luxurious/Simple/Warm). Video was added mid-session.
- Compensations made: Extracted 361 frames from VereHomes/assets/video/HouseArchitectureShort.mp4 into VereHomes2/assets/images/frames/ via ffmpeg
- What worked first try: Frame extraction (361 frames, 24fps, full 15.04s). Loader UI design. Below-fold layout (numbered collection list, qualities grid, stats strip).
- What had to be corrected:
  1. **Engine syntax error** — scroll-gsap.js v5.2.5 had stray `});` and `}` at line 337 (leftover from a previous patch) causing SyntaxError. Fixed via Python string replacement.
  2. **External engine src breaks server** — All builds use `python -m http.server` rooted at the BUILD folder (e.g., VereHomes2/). A `<script src="../../engine/scroll-gsap.js">` path resolves to `builds/engine/` which does not exist. Result: 0% loader stuck forever. Fix: **always inline the engine directly in the HTML** — that is how every working build (TrailBound) works. Never use an external engine src.
  3. **MutationObserver bridge** — Engine sets `loader.textContent = pct + '%'` on every frame load, wiping all child nodes. Old observer tried to update detached `.loader-pct` element. Fixed with rebuild pattern: observer detects bare `^(\d+)%$` text, disconnects, re-appends cached child nodes, reconnects.
  4. **FOUC on below-fold** — `.gsap-reveal` elements flash visible before GSAP initializes. Fixed with `.gsap-reveal { opacity: 0; }` in CSS.
  5. **File corruption** — Multiple Edit tool calls on a large file caused truncation. Resolved with full Write rewrite.
- Final output: `builds/VereHomes2/output/index.html` — 25KB, canvas mode, 361 frames inlined engine, confirmed loading
