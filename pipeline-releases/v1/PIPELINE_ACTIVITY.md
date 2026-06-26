# Pipeline Activity Log

**Purpose:** Every time a fresh Claude session opens this project, it must append one entry here before building. This lets the project owner check whether Claude actually read the pipeline or ignored it.

**Rule:** Append at the bottom. Never overwrite previous entries.

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

