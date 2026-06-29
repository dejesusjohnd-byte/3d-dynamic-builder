// ============================================================
// ENGINE START — scroll-gsap.js v5.2.1
// DO NOT MODIFY — copy verbatim between ENGINE START / ENGINE END
// Requires: GSAP + ScrollTrigger loaded before this script
// Config:   window.GSAP_CONFIG defined before this script
// Changelog: engine/CHANGELOG.md
//
// v5.2.1 patches:
//   1. Fixed dwell timer — snap.onComplete doesn't receive self in GSAP 3.
//      Engine now stores ScrollTrigger reference; reads st.progress on snap complete.
//   2. Added waypoints[] config — snap-only anchors with no text scenes.
//      Useful for marking hard cuts / sequence transitions.
//   3. Canvas fade-in on load — canvas fades from 0→1 after frames ready.
// ============================================================
(function () {
  'use strict';

  // ── GSAP_CONFIG shape (v5.2) ──────────────────────────────────────────────
  // window.GSAP_CONFIG = {
  //
  //   // Frame-by-frame (v5.2 primary) — replaces videoSrc
  //   frameSrc:    "../assets/images/frames/",  // folder path with trailing slash
  //   frameCount:  241,                          // total frames (from setup.py output)
  //   fps:         30,                           // extraction fps
  //
  //   // Video fallback — used if frameSrc not set or frames fail
  //   videoSrc:    "../assets/video/filename.mp4",
  //
  //   scrollBudget: "400%",
  //   scrubSmooth:  0.15,         // canvas mode: near-0 = instant. 0 = sync to scroll exactly.
  //   fadeRange:    0.25,         // fade curve width — dwell overrides minimum visible time
  //   dwellTime:    2.5,          // seconds text holds at full opacity after snap
  //
  //   snapToScenes: true,
  //   snapDelay:    0.2,
  //
  //   waypoints: [0.45, 0.60],   // [v5.2.1] snap anchors with no text — hard cuts etc.
  //
  //   videoMap: [
  //     { scroll: 0.00, time: 0.0,  label: "intro"  },
  //     { scroll: 0.45, time: 3.2,  label: "seq2"   },
  //     { scroll: 0.60, time: 4.8,  label: "seq3"   },
  //     { scroll: 1.00, time: 8.1,  label: "finale" }
  //   ],
  //
  //   scenes: [
  //     { id: "scene-1", scroll: 0.22 },
  //     { id: "scene-2", scroll: 0.85 }
  //   ]
  // };
  // ────────────────────────────────────────────────────────────────────────────

  const cfg = window.GSAP_CONFIG;
  if (!cfg) { console.error('[scroll-gsap] window.GSAP_CONFIG not found'); return; }

  gsap.registerPlugin(ScrollTrigger);

  const heroSection = document.getElementById('hero-section');
  const progressBar = document.getElementById('hero-progress');
  const scrollHint  = document.getElementById('hero-scroll-hint');
  const nav         = document.getElementById('hero-nav');

  // ── Mode detection ───────────────────────────────────────────────────────
  const useFrames = !!(cfg.frameSrc && cfg.frameCount);
  let   canvas, ctx, frames = [], framesLoaded = 0;
  let   video;
  let   st = null;   // [v5.2.1] ScrollTrigger reference — needed for onSnapEngaged

  // ── Frame preloader (v5.2 canvas mode) ───────────────────────────────────
  function preloadFrames(onReady) {
    canvas       = document.getElementById('hero-canvas');
    ctx          = canvas ? canvas.getContext('2d') : null;
    const loader = document.getElementById('hero-frame-loader');

    if (!canvas || !ctx) {
      console.warn('[scroll-gsap] #hero-canvas not found, falling back to video');
      initVideoFallback(onReady);
      return;
    }

    // Canvas starts invisible — fades in after load
    canvas.style.opacity = '0';

    function resize() {
      canvas.width  = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    }
    resize();
    window.addEventListener('resize', () => {
      resize();
      // Redraw current frame after resize
      if (st) drawFrame(st.progress);
    });

    const total = cfg.frameCount;
    const pad   = String(total).length;
    const ext   = cfg.frameExt || 'jpg';

    for (let i = 1; i <= total; i++) {
      const img = new Image();
      img.src   = cfg.frameSrc + 'frame_' + String(i).padStart(pad, '0') + '.' + ext;
      img.onload = () => {
        framesLoaded++;
        if (loader) {
          const pct = Math.round(framesLoaded / total * 100);
          loader.textContent = pct + '%';
          loader.style.setProperty('--pct', pct + '%');
        }
        if (framesLoaded === total) {
          if (loader) {
            // Fade out loader, fade in canvas
            gsap.to(loader, { opacity: 0, duration: 0.4, onComplete: () => {
              loader.style.display = 'none';
              gsap.to(canvas, { opacity: 1, duration: 0.4 });
            }});
          } else {
            gsap.to(canvas, { opacity: 1, duration: 0.3 });
          }
          onReady();
        }
      };
      img.onerror = () => {
        framesLoaded++;
        if (framesLoaded === total) onReady();
      };
      frames.push(img);
    }
  }

  // ── Draw frame at scroll progress ────────────────────────────────────────
  function drawFrame(progress) {
    if (!ctx || !frames.length) return;
    const idx = Math.min(frames.length - 1, Math.round(progress * (frames.length - 1)));
    const f   = frames[idx];
    if (f && f.complete && f.naturalWidth) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const vR = f.naturalWidth  / f.naturalHeight;
      const cR = canvas.width    / canvas.height;
      let sw, sh, sx, sy;
      if (vR > cR) { sh = canvas.height; sw = sh * vR; sx = (canvas.width - sw) / 2; sy = 0; }
      else         { sw = canvas.width;  sh = sw / vR; sx = 0; sy = (canvas.height - sh) / 2; }
      ctx.drawImage(f, sx, sy, sw, sh);
    }
  }

  // ── Video fallback ────────────────────────────────────────────────────────
  function initVideoFallback(onReady) {
    video = document.getElementById('hero-video');
    if (video) {
      video.addEventListener('loadedmetadata', () => {
        video.play().then(() => video.pause()).catch(() => {});
        onReady();
      });
      if (video.readyState >= 1) onReady();
    } else {
      onReady();
    }
  }

  // ── videoMap interpolation ────────────────────────────────────────────────
  function mapToVideoTime(progress) {
    const map = cfg.videoMap;
    if (!map || !map.length) return 0;
    if (progress <= map[0].scroll) return map[0].time;
    if (progress >= map[map.length - 1].scroll) return map[map.length - 1].time;
    for (let i = 0; i < map.length - 1; i++) {
      const a = map[i], b = map[i + 1];
      if (progress >= a.scroll && progress <= b.scroll) {
        const t = (progress - a.scroll) / (b.scroll - a.scroll);
        return a.time + t * (b.time - a.time);
      }
    }
    return 0;
  }

  // ── Time-based text dwell (v5.2) ──────────────────────────────────────────
  // FIX v5.2.1: snap.onComplete in GSAP 3 does NOT receive self as a parameter.
  // Engine now reads st.progress directly from the stored ScrollTrigger reference.
  const dwellState   = {};
  const dwellSeconds = cfg.dwellTime !== undefined ? cfg.dwellTime : 2.0;

  function onSnapEngaged(progress) {
    if (progress === undefined || progress === null) return;
    const scenes    = cfg.scenes || [];
    const tolerance = 0.025;
    scenes.forEach(scene => {
      if (Math.abs(progress - scene.scroll) < tolerance) {
        dwellState[scene.id] = { dwellEnd: performance.now() + dwellSeconds * 1000 };
        console.log('[scroll-gsap] dwell started:', scene.id, 'for', dwellSeconds, 's');
      }
    });
  }

  function updateScenes(progress) {
    const fadeRange = cfg.fadeRange || 0.20;
    const now       = performance.now();

    (cfg.scenes || []).forEach(scene => {
      const el = document.querySelector(`[data-scene="${scene.id}"]`);
      if (!el) return;

      const dist    = Math.abs(progress - scene.scroll);
      let   opacity = Math.max(0, 1 - dist / fadeRange);

      const dwell = dwellState[scene.id];
      if (dwell && now < dwell.dwellEnd) {
        opacity = Math.max(opacity, 1);
      }

      el.style.opacity = opacity;

      const children = el.querySelectorAll('[data-stagger]');
      children.forEach(child => {
        const lag     = parseFloat(child.dataset.stagger || 0) * 0.012;
        const delayed = Math.max(0, progress - lag);
        const dist2   = Math.abs(delayed - scene.scroll);
        let   cop     = Math.max(0, 1 - dist2 / fadeRange);
        if (dwell && now < dwell.dwellEnd) cop = Math.max(cop, 1);
        child.style.opacity = cop;
      });
    });
  }

  // ── Build snap points ─────────────────────────────────────────────────────
  // [v5.2.1] Includes cfg.waypoints[] — snap anchors with no text scenes.
  //           onComplete reads st.progress (not self.progress — self is undefined).
  function buildSnapPoints() {
    if (!cfg.snapToScenes) return false;

    const sceneScrolls    = (cfg.scenes    || []).map(s => s.scroll);
    const waypointScrolls = (cfg.waypoints || []);
    const allPoints       = [0, ...sceneScrolls, ...waypointScrolls, 1];

    // Sort + deduplicate (round to 3 decimal places)
    const seen = new Set();
    const points = allPoints
      .map(p => Math.round(p * 1000) / 1000)
      .filter(p => { if (seen.has(p)) return false; seen.add(p); return true; })
      .sort((a, b) => a - b);

    return {
      snapTo:   points,
      duration: { min: 0.1, max: 0.45 },
      delay:    cfg.snapDelay !== undefined ? cfg.snapDelay : 0.25,
      ease:     'power2.inOut',
      onComplete: () => {
        // [v5.2.1 fix] Read from stored st reference — not self (undefined in GSAP 3)
        if (st) onSnapEngaged(st.progress);
      }
    };
  }

  // ── Init ScrollTrigger ────────────────────────────────────────────────────
  function initScrollTrigger() {
    // [v5.2.1] Store reference so snap onComplete can read st.progress
    st = ScrollTrigger.create({
      trigger:  heroSection,
      start:    'top top',
      end:      `+=${cfg.scrollBudget || '350%'}`,
      pin:      true,
      scrub:    useFrames
                  ? (cfg.scrubSmooth !== undefined ? cfg.scrubSmooth : 0.15)
                  : (cfg.scrubSmooth !== undefined ? cfg.scrubSmooth : 1),
      snap:     buildSnapPoints(),
      onUpdate: (self) => {
        if (useFrames) {
          drawFrame(self.progress);
        } else if (video) {
          video.currentTime = mapToVideoTime(self.progress);
        }
        updateScenes(self.progress);
        if (progressBar) progressBar.style.width = (self.progress * 100) + '%';
        if (scrollHint)  scrollHint.style.opacity = self.progress < 0.04 ? 1 : 0;
      }
    });

    // Below-fold reveals
    document.querySelectorAll('.gsap-reveal').forEach(el => {
      const delay = parseFloat(el.dataset.delay || 0);
      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1, delay: delay, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        }
      );
    });

    // Navbar
    if (nav) {
      ScrollTrigger.create({
        trigger:  heroSection,
        start:    'top top',
        end:      `+=${cfg.scrollBudget || '350%'}`,
        onUpdate: (self) => { nav.classList.toggle('nav-scrolled', self.progress > 0.05); }
      });
    }
  }

  // ── Start ─────────────────────────────────────────────────────────────────
  if (useFrames) {
    preloadFrames(initScrollTrigger);
  } else {
    initVideoFallback(initScrollTrigger);
  }

})();
// ENGINE END — scroll-gsap.js v5.2.1
// ============================================================
