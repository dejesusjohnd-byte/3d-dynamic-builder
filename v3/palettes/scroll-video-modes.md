# Palette: Scroll Video Modes
Select ONE per build. Log the ID in PALETTE_BLOCK.
Controls how the 3D video background behaves relative to scroll.

---

## V1 — Full Scrub (Signature Mode)
video.currentTime = scrollProgress * video.duration
Video scrubs frame-by-frame as user scrolls. Video does NOT play on its own.
Pinned hero section — user must scroll through the full hero to advance.
**Use when:** carefully composed video, storytelling video, specific scenes matter.
**Hero types:** A, D — full-bleed modes.
```js
ScrollTrigger.create({
  trigger: '.hero',
  start: 'top top',
  end: 'bottom bottom',
  pin: true,
  onUpdate: self => {
    if (video.duration && video.readyState >= 2) {
      video.currentTime = self.progress * video.duration;
    }
  }
});
```

## V2 — Velocity Scrub
Video playback rate changes with scroll speed. Fast scroll = fast video.
Video plays normally at rest but accelerates/decelerates with scroll input.
**Use when:** looping abstract video, brand content where specific frame doesn't matter.
**Hero types:** Any.
```js
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const velocity = (window.scrollY - lastScrollY) * 0.01;
  lastScrollY = window.scrollY;
  video.playbackRate = Math.max(0.1, Math.min(4, 1 + Math.abs(velocity)));
});
```

## V3 — Section-Trigger Swap
Different video timestamps fire as the user enters each section.
On scroll into section: seek to keyframe. On scroll out: hold or reverse.
**Use when:** video has distinct chapters that match page sections.
**Hero types:** Any (especially B — split, where video is one column).
```js
document.querySelectorAll('[data-video-time]').forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    onEnter: () => { video.currentTime = parseFloat(section.dataset.videoTime); }
  });
});
```

## V4 — Ambient Loop (Non-Scrub)
Video loops continuously as atmospheric background only.
No scroll interaction with video playback.
**Use when:** abstract/textural video, video is decorative not narrative.
**NOTE:** Not the signature mechanic — only select if scrub doesn't fit the video.
**Hero types:** F (Minimal Dark Ambient), any with texture overlay.
```js
video.loop = true;
video.play();
```
