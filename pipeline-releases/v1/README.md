# 3D Dynamic Builder — Pipeline v1
**For: Anyone building a scroll-scrubbed video website**
**Read this first. Everything else follows from here.**

---

## What this is
A pipeline for building premium single-file HTML websites with a scroll-scrubbed video hero and 3D model sections. No frameworks. No build steps. One HTML file is the output.

## Who uses this
- **Member 1 (builder)** — has assets locally, fills brief, prompts Claude
- **Member 3 (new user)** — uploads assets to Drive, runs SETUP.bat, prompts Claude

---

## How to start a new project

### Step 1 — Get your assets into the project
Go to `projects/`. Copy the `sample_project/` folder. Rename the copy to your project name.

Do you have your video/3D files locally already?
- **Yes** → drop them into `your-project/assets/video/` and `your-project/assets/3d/` manually
- **No** → upload them to Google Drive first (see `Drive Template/`), then open CMD inside your project folder and run `SETUP.bat`

### Step 2 — Tell Claude what to build
Open Claude (Cowork), point it at this `v1/` folder.
Claude will ask 4 questions if no brief exists:
1. Brand name?
2. What does the visitor do? (book / buy / explore / contact)
3. 3 words for how it should feel?
4. 3 words for what it must NOT feel like?

### Step 3 — Preview
Double-click `START SERVER.bat` inside your project folder.
Opens: http://localhost:8080/output/index.html

---

## Folder structure
```
pipeline-releases/v1/
├── README.md              ← you are here
├── SESSION_INIT.md        ← Claude reads this before building
├── setup.py               ← downloads assets from Google Drive
├── engine/
│   └── scroll-scrub.js   ← the scroll engine, copied into every build
├── projects/
│   └── sample_project/   ← copy + rename this for every new project
│       ├── SETUP.bat      ← downloads assets from Drive
│       ├── START SERVER.bat
│       ├── assets/
│       │   ├── video/
│       │   ├── 3d/
│       │   └── images/keyframes/
│       ├── logs/brief.md  ← fill this before prompting Claude
│       �