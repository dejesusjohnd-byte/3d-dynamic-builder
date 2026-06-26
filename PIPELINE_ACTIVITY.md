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
