# V4 — Requirements
**These are not guidelines. Each one is testable. Either the output satisfies it or it doesn't.**

---

## Technical Requirements (Non-Negotiable)

| # | Requirement | Pass condition |
|---|-------------|----------------|
| T1 | Single HTML file | One `index.html`. No linked CSS, no linked JS, no external scripts except Google Fonts. |
| T2 | Video same directory | `src="video.mp4"` — filename only. Never `../`, never absolute path, never localhost URL. |
| T3 | Engine copied verbatim | Content between ENGINE START / ENGINE END markers matches `v4/engine/scroll-scrub.js` exactly. |
| T4 | heroMaxScroll | `maxScroll` measured from scroll container height, not `document.scrollHeight`. |
| T5 | Chrome unlock | Each video element gets `loadedmetadata → play().then(pause())` handler. |
| T6 | Below-fold timing | `#v4-below-fold` opacity triggered at `VIDEO_RATIO + 0.02`. |
| T7 | No placeholder content | No lorem ipsum. No "Your Brand Here." No "Coming Soon." |
| T8 | Scroll container height | Minimum 160vh per scene. 4 scenes = 700vh min. 6 scenes = 1000vh min. More scenes = more height. |
| T9 | Scene window width | Each scene window minimum 0.10 wide (e.g. start: 0.12, end: 0.22). Gaps between scenes minimum 0.02. |
| T10 | Stagger on scene text | Every scene element gets `data-stagger="0"`, `"1"`, `"2"` in order. fadeRange: 0.035–0.05. staggerLag: 0.8–1.2. |
| T11 | Micro-interactions | Build includes: (1) custom cursor dot + ring, (2) IntersectionObserver scroll reveals on all below-fold elements, (3) hover states on all interactive elements (cards, buttons, links). |

---

## Frame Log Requirements

| # | Requirement | Pass condition |
|---|-------------|----------------|
| F1 | Table produced before CSS | Frame Log table exists in conversation before any HTML is written. |
| F2 | Coordinates are specific | Each position is actual CSS (`top: 8%; right: 6%`) not a description ("top right area"). |
| F3 | No repeated headline position | No two scenes may share the same headline CSS anchor pair. |
| F4 | Text avoids visual mass | Headline is not placed over the frame's dominant element (subject, bright glow, centered object). |
| F5 | Colors extracted | bg / accent / text hex codes documented in Frame Log before Build Plan. |
| F6 | No forced 3-element scenes | Not every scene needs headline + subhead + pitch. Match element count to what the frame calls for. A single large headline can be a scene. |
| F7 | No stacking on same axis | If headline is top-left, subhead cannot also be top-left. Elements on the same side must be separated to opposite ends (e.g. headline top-left, subhead bottom-left minimum). |

---

## Design Requirements

| # | Requirement | Pass condition |
|---|-------------|----------------|
| D1 | Colors from video | Color palette derived from frame screenshots, not from a preset list. |
| D2 | Below-fold not symmetric | No section uses equal column widths (50/50). Specify the actual split. |
| D3 | Copy feels inevitable | No "Built for X", "Designed for Y", "Scale your Z". Copy states facts or makes claims the brand believes without needing to justify. |
| D4 | Typography serves brand | Font choice explained by brand feel (from brief adjectives), not assigned from a category. |
| D5 | Sections serve the brief | Each below-fold section exists because it answers the visitor's next question — not because it's a standard section type. |
| D6 | Navbar is brand-specific | Not logo-left / CTA-right template. Navbar structure must reflect the brand. Could be centered, split, minimal monogram, scene counter, or other. Default template is a fail. |
| D7 | One full-viewport section | At least one below-fold section must be `height: 100vh`. Usually a manifesto or CTA section. |
| D8 | Section structure varies | No two below-fold sections may use the same layout pattern. A grid section cannot be followed by another grid section without a structural break. |
| D9 | Negative space is used | Sections must have minimum 160px top/bottom padding. Content must not fill all available width. Use open space deliberately — it carries weight. |

---

## What This Pipeline Does Not Enforce

These are intentionally left open. Variation should come from the video and the brief:

- Section count (could be 2 sections or 6)
- Number of scenes (could be 2 or 6)
- Specific color temperature
- Specific font category
- Which side text appears on (Frame Log decides)

---

## Engine Config Reference

```javascript
window.V4_CONFIG = {
  videoRatio:     0.65,   // % of scroll container that drives video (don't change)
  fadeRange:      0.042,  // scene fade window — use 0.035–0.05 for visible stagger
  staggerLag:     0.95,   // stagger multiplier per text element — use 0.8–1.2
  videoSplit:     null,   // null = single video. 0.5 = two-video split at midpoint
  crossfadeWidth: 0.06,   // two-video only: crossfade overlap window
  nav: { showAfter: 0 },  // 0 = always visible, 0.04 = appears after 4% scroll
  scenes: [
    { id: 'scene-1', start: 0.00, end: 0.10 },
    { id: 'scene-2', start: 0.12, end: 0.22 },
    // minimum 0.10 window, minimum 0.02 gap between scenes
  ]
};
```

Scene timing guide:
- 2 scenes → 500vh min, each window ~0.25 wide
- 4 scenes → 700vh min, each window ~0.14 wide
- 6 scenes → 1000vh min, each window ~0.10 wide

Stagger guide (with fadeRange: 0.042, staggerLag: 0.95):
- data-stagger="0" → appears at scene.start
- data-stagger="1" → appears ~0.04 scroll progress later (headline first, then subhead)
- data-stagger="2" → appears ~0.08 scroll progress later (then pitch)

---

## Micro-interaction Implementation

### Custom Cursor
```html
<div id="cursor-dot"></div>
<div id="cursor-ring"></div>
```
```css
#cursor-dot {
  position: fixed; width: 6px; height: 6px; background: #fff;
  border-radius: 50%; pointer-events: none; z-index: 9999;
  transform: translate(-3px,-3px); mix-blend-mode: difference;
}
#cursor-ring {
  position: fixed; width: 30px; height: 30px;
  border: 1px solid rgba(accent, 0.6); border-radius: 50%;
  pointer-events: none; z-index: 9998; transform: translate(-15px,-15px);
  transition: transform 0.12s cubic-bezier(0.16,1,0.3,1);
}
@media (pointer: coarse) { #cursor-dot, #cursor-ring { display: none; } }
```
```javascript
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  document.getElementById('cursor-dot').style.transform = `translate(${mx-3}px,${my-3}px)`;
});
(function loop() {
  rx += (mx-rx)*0.12; ry += (my-ry)*0.12;
  document.getElementById('cursor-ring').style.transform = `translate(${rx-15}px,${ry-15}px)`;
  requestAnimationFrame(loop);
})();
```

### Scroll Reveals (IntersectionObserver)
```html
<div data-reveal data-delay="0.1">...</div>
```
```css
[data-reveal] { opacity:0; transform:translateY(28px);
  transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
[data-reveal].revealed { opacity:1; transform:translateY(0); }
[data-reveal][data-delay] { transition-delay: attr(data-delay s); }  /* set via JS */
```
```javascript
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('revealed'); ro.unobserve(e.target); }});
}, { threshold: 0.12 });
document.querySelectorAll('[data-reveal]').forEach(el => {
  if(el.dataset.delay) el.style.transitionDelay = el.dataset.delay + 's';
  ro.observe(el);
});
```

---

## Copy Anti-Patterns

Never write these:
- "Built for [audience]"
- "Designed for [use case]"
- "The future of [category]"
- "Powering [vague noun]"
- "Scale your [business term]"
- "[Brand] — [generic tagline]"

Write copy that assumes the visitor already understands the stakes.
