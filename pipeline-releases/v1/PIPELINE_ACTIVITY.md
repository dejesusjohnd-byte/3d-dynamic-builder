# Pipeline Activity Log

**Purpose:** Every time a fresh Claude session opens this project, it must append one entry here before building. This lets the project owner check whether Claude actually read the pipeline or ignored it.

**Rule:** Append at the bottom. Never overwrite previous entries.

---

## 2026-06-29 — v5 pipeline built, skill and init updated

- Project folder: n/a (pipeline architecture session)
- Engine: scroll-gsap.js v5 written and locked
- Setup.py: rewritten — Drive download removed, ffmpeg scene detection primary, opencv fallback, timestamps encoded in filenames (frame_03_t08.7s.jpg)
- SKILL.md: full rewrite — detects v4 vs v5 by engine present, videoMap construction, 4-type video classification, technical vs creative rules separated, GSAP mandatory in v5
- SESSION_INIT.md (v5): new file written for v5 learning environment
- v5 folder: scaffolded at v5 (Learning environment)/
- Skill packaged: 3d-pipeline-builder.skill updated in v1/ and v5/
- Key fixes from Member 3 cold test: removed Drive dependency, timestamp filenames, model-viewer CDN exception clarified, creative deviations explicitly allowed
- Next: test v5 with bike-breakdown video using GSAP engine

---

## 2026-06-29 — Papas Burger website built (v5 first build)

- Project: Papas Burger
- Engine: scroll-gsap.js v5
- Video type: Hybrid (Object-Focused throughout — studio elegant t0–t3.2s, explosive burst t3.2–t4.8s, double-stack assembly t4.8–t8.1s)
- Video duration: 8.1s — 9 keyframes via ffmpeg scene detection
- videoMap anchors: 0.00→t0.0 / 0.20→t0.8 / 0.40→t2.4 / 0.55→t3.2 / 0.65→t4.0 / 0.75→t4.8 / 0.88→t6.4 / 1.00→t8.1
- Keyframe extraction: ffmpeg scene detection (9 frames)
- 3D assets: NO (brief is video/photo focused)
- Brief source: 4-field
- Colors: bg #111418 / accent #e84a0c (extracted from ketchup in footage) / text #f5f0ea
- Fonts: Bebas Neue (display) / DM Sans (body)
- scrollBudget: 350%
- 5 scenes: PULL IT APART / NOTHING HIDDEN / THE BURST / DOUBLE DOWN / MAKE IT YOURS
- Creative deviations: accent #e84a0c pulled directly from ketchup/sauce in footage — not invented
- Below-fold: The Build (ingredient list) → Order CTA (accent bg) → Footer
- Mandatory GSAP: progress bar, scroll hint, .nav-scrolled, .gsap-reveal on all below-fold, hero CTA at scroll >78%, ingredient hover translateX, nav letter-spacing expand, order headline scale reveal, custom cursor with GSAP ring
- Output: v5 (Learning environment)/builds/Papas Burger/output/index.html

---

## 2026-06-29 — Engine v5.1 + motion analysis (post-first-test feedback)

- Trigger: Papas Burger test revealed text racing + lag still present
- Engine updated: scroll-gsap.js v5.0 → v5.1
  - Added: snapToScenes (bool) — scroll snaps and holds at each scene anchor
  - Added: snapDelay (number) — engagement delay before snap kicks in
  - fadeRange default: 0.09 → 0.18 (text visible ~2x longer per scene)
  - Archived: engine/scroll-gsap-v5.0.js, engine/scroll-gsap-v5.1.js
  - CHANGELOG: engine/CHANGELOG.md created
- setup.py updated: v5.0 → v5.1
  - Added: analyze_motion() — opencv frame differencing, ~10 samples/sec
  - Added: suggest_videoMap() — inverts motion to scroll weight (slow = more budget)
  - Output: logs/motion_profile.json (suggested_videoMap + per-frame motion scores)
  - Archived: setup-v5.0.py in both v5/ and v1/
- Papas Burger index.html updated: fadeRange 0.09→0.18, snapToScenes:true, snapDelay:0.25, engine v5.1
- SESSION_INIT.md updated: engine version table, motion_profile.json step, snap config docs
- Deferred: frame-by-frame canvas engine (Apple/Draftly approach) — v5.2 candidate if lag persists
- Deferred: YOLOv9 object velocity analysis — post v5.1 test

---

## 2026-06-29 — Papas Burger v3 — 2-scene minimal (less is more)

- Trigger: v2 text still racing. 5 scenes in 8.1s video = too little breathing room per scene
- Decision: reduce to 2 scenes. Let the video carry the story. Text = punctuation only.
- Scene 1 (scroll 0.12, t0.8s): "BUILT DIFFERENT." — identity, vertically centered left
- Scene 2 (scroll 0.88, t7.3s): "ORDER NOW →" — CTA, bottom right, clickable
- fadeRange: 0.20 (wider — no overlap risk with 2 scenes)
- snapToScenes: true, snapDelay: 0.3 (unchanged from v2)
- videoMap: unchanged (motion data is correct, scene count doesn't affect it)
- Versioning: index-v1.html (original 5 scenes no snap), index-v2.html (5 scenes + snap), index-v3.html (2 scenes)
- Rule established: each output iteration = new versioned file. index.html = current active.
- Output: index-v3.html

---

## 2026-06-29 — Papas Burger v4 — prompt-informed videoMap + fadeRange 0.32

- Trigger: text still disappearing too fast. Root cause identified: videoMap was guessed, not data-derived
- Key insight: AI video generation prompt is the most accurate source of sequence timing and speed intent
- Pipeline change: brief.md now has field 5 — AI generation prompt (optional). SESSION_INIT + SKILL updated.
- videoMap rebuilt from prompt:
  - Seq 1 "extreme slow-motion" (t0–t3.2s) → 45% scroll budget
  - Seq 2 "dynamic burst" (t3.2–t4.8s) → 15% scroll budget
  - Seq 3 "sweeping orbital → deceleration" (t4.8–t8.1s) → 40% scroll budget
- Text placement derived from camera knowledge:
  - Scene 1 (scroll 0.22): seq-1 mid, camera mid-pullback, layers floated UP → lower-left clear
  - Scene 2 (scroll 0.85): seq-3 deceleration → camera stopped, right flank clear
- fadeRange: 0.32 (32% of scroll visible per scene = ~112vh — deliberate pacing)
- Skill repackaged with new brief question 5 (AI gen prompt)
- Pending: frame-by-frame canvas engine (v5.2) to eliminate video scrub lag
- Output: index-v4.html

---

## 2026-06-29 — v5.2 engine promoted to active + setup.py frames default

- Engine promoted: scroll-gsap.js v5.1 → v5.2 (canvas frame swap + dwellTime)
  - scroll-gsap.js is now v5.2 — zero codec lag, guaranteed text dwell
  - v5.2 is backward compatible: falls back to video if frameSrc not set
  - Both fixes (text racing + video lag) are now in the live engine
- setup.py updated: v5.1 → v5.2
  - Frame extraction now runs as Step 3 of default flow (no flag needed)
  - `--no-frames` flag added to skip frame extraction if frames already present
  - All three outputs in one command: keyframes + motion_profile.json + frames/
- SESSION_INIT.md updated:
  - Engine version table now includes v5.2 column
  - Step 2 now lists frames/ folder as expected output
  - HTML structure section now shows canvas element + #hero-frame-loader
  - GSAP_CONFIG block updated with frameSrc/frameCount/fps/dwellTime/scrubSmooth
  - Required element IDs updated (#hero-canvas, #hero-frame-loader added)
  - Known limitations section rewritten: both v5.2 fixes documented as FIXED
- CHANGELOG.md: v5.2 marked as active (was: PLANNED)
- Terminal access Q: Claude can run commands from sandbox shell. User terminal not needed.
- Papas Burger next: run setup.py, then build index-v5.html with v5.2 engine

---

## Entry Template

```
## [YYYY-MM-DD] — [what the user asked for]
- Project folder: [name of folder inside projects/]
- Pipeline files read: [list every .md file read before building]
- Input format: clean brief / long prompt / partial / no brief yet
- Assets present: video YES/NO — 3D YES/NO — keyframes YES/NO
- Missing inputs and how handled: [what was asked / inferred]
- What worked first try:
- What needed correction:
- Final output: [filename or "none yet"]
```

---


## 2026-06-29 — Papas Burger index-v5.html (v5.2 canvas engine)

- Project: Papas Burger
- Engine: scroll-gsap.js v5.2 (canvas frame-by-frame + time-based dwell)
- Video type: Hybrid (Object → orbital → stop)
- setup.py: ran full 3-step flow — frames extracted (241 frames, 23.7MB, 30fps)
- frameCount: 241, frameSrc: ../assets/images/frames/, fps: 30
- dwellTime: 2.0s — text guaranteed visible 2 seconds after snap
- scrubSmooth: 0.5 (canvas mode — lower = more responsive than v5.1's 1.0)
- fadeRange: 0.30
- videoMap: unchanged from v4 — AI prompt informed (best source of truth)
- scenes: unchanged from v4 — 2 scenes (camera-knowledge placement)
  - scene-1 (scroll 0.22): lower-left, seq-1 mid, layers floating UP
  - scene-2 (scroll 0.85): bottom-right, seq-3 orbital stopped at 3/4
- Copy improvements: added s1-sub "Every ingredient. Every time." as 3rd stagger child
- Loading screen: animated brand + percentage + progress bar (styled, not raw text)
- Custom cursor maintained; ingredient hover, order scale reveal, nav letter-spacing, footer stagger
- Output: index-v5.html (also set as index.html active)
- Versions: v1 (5 scenes) → v2 (snap added) → v3 (2 scenes) → v4 (prompt videoMap) → v5 (canvas)
- What this test proves: whether canvas eliminates lag AND dwell fixes text racing

---

## 2026-06-29 — Engine v5.2.1 patch + Papas Burger index-v6.html

- Engine patched: scroll-gsap.js v5.2 → v5.2.1 (3 bugs fixed)
  - Fix 1 (critical): dwell timer never fired — GSAP snap.onComplete does NOT pass self.
    Engine now stores `let st = null` ScrollTrigger reference; reads `st.progress` in onComplete.
  - Fix 2: waypoints[] config — snap-only anchors for hard cuts / sequence boundaries.
    Merged with scene scrolls, sorted, deduplicated before building snap points array.
  - Fix 3: Canvas fades in (opacity 0→1) after frame load; loader fades out simultaneously.
  - Fix 4: window.resize redraws current frame after canvas resize.
  - Engine archived: scroll-gsap-v5.2.1.js
- index-v6.html built — Papas Burger (engine v5.2.1)
  - scrubSmooth: 0.5 → 0.15 (canvas mode: near-instant, removes overshoot)
  - scrollBudget: 350% → 400% (more breathing room per sequence)
  - dwellTime: 2.0 → 2.5 (extra half-second after snap)
  - fadeRange: 0.30 → 0.25 (tighter fade curve; dwell covers minimum time)
  - snapDelay: 0.30 → 0.20 (faster snap engagement)
  - waypoints: [0.45, 0.60] — snap anchors at hard cuts (seq1→seq2, seq2→seq3)
  - Snap points: 0 → 0.22 → 0.45 → 0.60 → 0.85 → 1.0
  - Dwell now works: text guaranteed visible 2.5s after scroll stops at scene
  - Frame skip expected to improve: scrubSmooth overshoot was cause
  - Speed confinement added: waypoints prevent full-speed slide between scene-1 and scene-2
- Versions: v1 → v2 → v3 → v4 → v5 → v6 (current active = index.html)

---

## 2026-06-29 — Engine v5.2.2 + Papas Burger index-v7.html

- Engine: scroll-gsap.js v5.2.1 → v5.2.2
  - Fix 1 (CRITICAL): scrub:true for canvas mode — eliminates post-scroll animation.
    Video no longer "plays" for ms after pause. Canvas draws are instant; smoothing was the bug.
  - Fix 2: Approach hold — within ±approachTolerance (default 3.5%) of scene.scroll → opacity 1.
    Text appears as user approaches, holds through snap + dwell. No more "1 second ORDER NOW."
  - Fix 3: Snap duration 0.02–0.04s (near-instant). snapInProgress flag freezes frame during snap.
    Snap no longer animates through intermediate frames ("video plays on snap").
  - Fix 4: dwellTime default raised 2.0 → 4.0s.
  - Archived: scroll-gsap-v5.2.2.js
- index-v7.html — Papas Burger
  - dwellTime: 4.5s (was 2.5)
  - approachTolerance: 0.035 (new config field)
  - scrollBudget: 450% (was 400%)
  - fadeRange: 0.18 (was 0.25 — approach hold covers the near zone now)
  - snapDelay: 0.15 (was 0.20)
  - scrubSmooth removed — canvas engine always uses scrub:true
  - Remaining: frameCount 241 at 30fps. Re-extract at 60fps for smoother scrub.
    Delete frames/, run: python setup.py "builds/Papas Burger" --fps 60, update frameCount to ~482.
- Versions: v1→v2→v3→v4→v5→v6→v7 (current active = index.html)

---

## 2026-06-29 — ApexGears TrailBound index-v1.html (v5.2.2 engine)

- Project: TrailBound — Brand: ApexGears
- Engine: scroll-gsap.js v5.2.2
- Video type: Hybrid (Object-Focused throughout — studio white → dark → forest environment)
- Video duration: 65.7s — 13 keyframes via ffmpeg interval
- Frame extraction: 894 frames at 15fps (~59.6s coverage, timeout before finale, forest included)
- frameCount: 894, frameSrc: ../assets/images/frames/, fps: 15
- Colors: bg #0c0c0e / accent #a8ff3e (acid lime — forest reference, bold, cool) / text #f2f0ec
- Fonts: Barlow Condensed 800 (display) / DM Sans (body)
- scrollBudget: 500%
- Scenes (3 scenes):
  - scene-1 (scroll 0.22): dark bg revealed, full profile, upper-right clear — "THE APEX."
  - scene-2 (scroll 0.46): macro drivetrain, upper-left clear — "12 Speed System / ZERO COMPROMISE."
  - scene-3 (scroll 0.86): forest environment, lower-right CTA — "RIDE NOW →"
- Waypoints: [0.38, 0.68] — dark bg full & environment entry
- Snap points: 0 → 0.22 → 0.38 → 0.46 → 0.68 → 0.86 → 1.0
- 3D assets: mountain_bicycle.glb (configure section) + bike_gears_cassette.glb (components section)
- Brief source: 4-field (ApexGears, Buy, Bold/Cool/Adventurous, not Cluttered/Cute/Soft)
- videoMap source: motion_profile.json (data-driven) adjusted for creative scene placement
- Below-fold: Carbon specs + stats → 3D configure (mountain_bicycle) → Gears (cassette) → Buy CTA
- Loader: light bg (#f5f3f0) matching frame 1 white studio → seamless canvas reveal
- Note: START SERVER.bat required for GLB models. Video too long for 30fps canvas (65.7s × 30 = ~2000 frames). 15fps chosen as optimal balance (985 expected, 894 extracted).
- Output: index-v1.html (also set as index.html active)

---

## 2026-06-29 — TrailBound index-v2 (prompt-informed videoMap)

**Session context:** v1 tested → user reported "bike movements are very fast / fast paced". User then shared full AI generation prompts for `ImprovedVersion_Bicycle.mp4`.

**Root cause identified:**
- v1 videoMap built from motion_profile.json (pixel differencing) — no knowledge of camera intent
- Prompts revealed 8 distinct segments with explicitly different speeds: slow orbit, medium push-in, **FAST reassembly**, 4 slow detail shots, slow pull-back
- motion_profile treated the video as 8 roughly-equal segments → fast segment got too much budget

**v2 fixes:**
- `scrollBudget`: 500% → 700%
- `videoMap`: rebuilt with 14 anchors derived from AI generation prompts + keyframe verification
- `waypoints`: [0.38, 0.44, 0.50, 0.73] — dense around fast assembly segment to force pause
- `dwellTime`: 4.5 → 5.0s
- `approachTolerance`: 0.035 → 0.025 (scenes are closer together)
- `fadeRange`: 0.18 → 0.12

**Scenes updated:**
- scene-1: scroll 0.18 (mid-orbit, 3/4 view, upper-right) → "THE APEX."
- scene-2: scroll 0.56 (saddle macro, lower-left) → "12 Speed. Race-Spec."
- scene-3: scroll 0.94 (forest environment, lower-right) → "RIDE NOW →"

**File:** builds/TrailBound/output/index-v2.html

---

## 2026-06-29 — Engine v5.2.3 + TrailBound index-v3

**Issues identified by user:**
1. Scroll too fast → video unwatchable (no speed ceiling on canvas scrub)
2. Video truncated at 1:00 on a 1:05 video (ffmpeg timed out at 59.6s; videoMap last entry set to time:59.6)

**Engine patches (v5.2.3):**
- `attachScrollGovernor()` — caps wheel deltaY to `100 * cfg.scrollSpeed` px per tick inside hero zone
- `cfg.videoDuration` support in `mapToVideoTime` — extrapolates linearly to true video end
- Trackpad passthrough: events with |deltaY| < 30px bypass governor unchanged
- Governor auto-deactivates below hero zone (window.scrollY > st.end)

**TrailBound index-v3.html config changes:**
- `scrollSpeed: 0.45` — 45px cap per tick
- `videoDuration: 65.7` — fixes early stop
- Last videoMap entry: `time: 59.6 → 65.7`
- Added inline ffmpeg command for extracting remaining frames 895–985

**Files updated:**
- engine/scroll-gsap.js (v5.2.3)
- engine/scroll-gsap-v5.2.3.js (archive)
- engine/CHANGELOG.md
- builds/TrailBound/output/index-v3.html


---

## 2026-06-29 — Engine v5.2.4 + TrailBound index-v4

**User confirmed diagnosis:** governor's passive:false killed compositor-thread scroll. Video cutoff because canvas frame count hard-capped, videoDuration fix only hit video fallback path.

**Engine v5.2.4:**
- Removed scroll governor entirely (passive:false gone)
- Added displayProgress/targetProgress + gsap.ticker clamp (maxProgressJump: 0.10 default)
- Added probeVideoDuration() — auto-detects video.duration via hidden video element
- mapToVideoTime uses detectedVideoDuration automatically

**TrailBound index-v4:**
- v5.2.4 engine
- scrollSpeed removed from config (governor gone)
- videoDuration now auto-detected (commented out in config)
- maxProgressJump note added

**Still pending:** text timing, micro-interactions, visual uniqueness, Claude Design test

---

## 2026-06-29 — VeraHomes index-v1 (video-mode, luxury real estate)

**Pivot:** TrailBound canvas issues (4K frames = 120MB memory, extraction incomplete) prompted switch to video-direct mode for VereHomes.

**Key decisions:**
- Video element only (no canvas) — 21.3s at 4K is too heavy for frame extraction
- scrubSmooth: true → scrub:true for direct video sync (no animation tail)
- Auto video duration via engine probe (21.3s auto-detected)
- scrollBudget: 450% (short video, less room needed)

**Design:** VeraHomes — Luxurious, Simple, Warm
- Cormorant Garamond serif + DM Sans
- Warm dark palette (#0e0c09 bg, #c8a96a gold accent)
- Scenes: exterior approach (0.18), main interior (0.60), finale CTA (0.88)
- Below fold: intro + stats grid, features list, location map art, CTA

**Still pending:** text timing fine-tuning, videoMap calibration after user tests with actual video

---

## 2026-06-29 — Engine v5.2.5 + VeraHomes index-v2 (canvas, HouseArchitectureShort)

**Engine v5.2.5:**
- Removed displayProgress/targetProgress GSAP ticker (v5.2.4 regression)
- Restored direct drawFrame(self.progress) in onUpdate — pure scrub:true
- "Lay off the control" — scroll follows video naturally
- Video probe (auto-duration) retained

**VeraHomes v2:**
- HouseArchitectureShort.mp4 — 15.04s, 1080p, 24fps (vs 4K original)
- 361 frames @ 24fps extracted = full coverage, 49MB total (~136KB/frame avg)
- Canvas mode (not video element) — frame-by-frame scrub
- scrollBudget: 420%, waypoints: [0.38, 0.68]
- Loader: bridge pattern — hidden #hero-frame-loader for engine, MutationObserver updates visible #hero-loader
