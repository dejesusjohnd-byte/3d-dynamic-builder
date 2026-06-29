// ============================================================
// ENGINE START — scroll-gsap.js v5.2
// DO NOT MODIFY — copy verbatim between ENGINE START / ENGINE END
// Requires: GSAP + ScrollTrigger loaded before this script
// Config:   window.GSAP_CONFIG defined before this script
// Changelog: engine/CHANGELOG.md
//
// What's new in v5.2 vs v5.1:
//   1. Frame-by-frame canvas — replaces video.currentTime scrub
//      Zero codec lag. Instant synchronous frame draw.
//      Requires frames pre-extracted by setup.py --frames
//   2. Time-based text dwell — replaces fadeRange-only approach
//      Text holds at full opacity for dwellTime seconds after snap.
//      User sees text for guaranteed N seconds regardless of scroll speed.
//   3. Graceful fallback — if frames not loaded, falls back to video element
// ============================================================
(function () {
  'use strict';

  // ── GSAP_CONFIG shape (v5.2) ──────────────────────────────────────────────
  // window.GSAP_CONFIG = {
  //
  //   // Frame-by-frame (v5.2 primary) — replaces videoSrc
  //   frameSrc:    "../assets/images/frames/",  // folder path with trailing slash
  //   frameCount:  243,                          // total frames (from setup.py output)
  //   fps:         30,                           // extraction fps
  //
  //   // Video fallback (v5.1 and earlier) — used if frameSrc not set or frames fail
  //   videoSrc:    "../assets/video/filename.mp4",
  //
  //   scrollBudget: "350%",
  //   scrubSmooth:  1,            // GSAP scrub smoothing (canvas mode: set to 0 for instant)
  //   fadeRange:    0.30,         // fade curve width — but dwell overrides minimum visible time
  //   dwellTime:    2.0,          // [v5.2] seconds text holds at full opacity after snap
  //
  //   snapToScenes: true,
  //   snapDelay:    0.3,
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
  // v5.2 prefers canvas frame mode. Falls back to video if frameSrc not set.
  const useFrames = !!(cfg.frameSrc && cfg.frameCount);
  let   canvas, ctx, frames = [], framesLoaded = 0;
  let   video;

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

    // Size canvas to hero section
    function resize() {
      canvas.width  = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const total = cfg.frameCount;
    const pad   = String(total).length;                 // digit padding length
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
          if (loader) loader.style.display = 'none';
          onReady();
        }
      };
      img.onerror = () => { framesLoaded++; if (framesLoaded === total) onReady(); };
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
      // Cover: scale to fill canvas maintaining aspect ratio
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
  // When snap engages at a scene anchor, text holds at full opacity for
  // dwellTime seconds before allowing fade-out. This guarantees minimum
  // visibility regardless of how fast the user scrolls.
  //
  // State: { sceneId → { dwellEnd: timestamp, dwelling: bool } }
  const dwellState   = {};
  const dwellSeconds = cfg.dwellTime !== undefined ? cfg.dwellTime : 2.0;

  function onSnapEngaged(progress) {
    const scenes    = cfg.scenes || [];
    const tolerance = 0.02;
    scenes.forEach(scene => {
      if (Math.abs(progress - scene.scroll) < tolerance) {
        dwellState[scene.id] = { dwellEnd: performance.now() + dwellSeconds * 1000 };
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

      // Dwell override: if within dwell window, hold at full opacity
      const dwell = dwellState[scene.id];
      if (dwell && now < dwell.dwellEnd) {
        opacity = Math.max(opacity, 1);
      }

      el.style.opacity = opacity;

      // Stagger children
      const children = el.querySelectorAll('[data-stagger]');
      children.forEach(child => {
        const lag     = parseFloat(child.dataset.stagger || 0) * 0.015;
        const delayed = Math.max(0, progress - lag);
        const dist2   = Math.abs(delayed - scene.scroll);
        let   cop     = Math.max(0, 1 - dist2 / fadeRange);
        if (dwell && now < dwell.dwellEnd) cop = Math.max(cop, 1);
        child.style.opacity = cop;
      });
    });
  }

  // ── Build snap points ─────────────────────────────────────────────────────
  function buildSnapPoints() {
    if (!cfg.snapToScenes) return false;
    const points = [0, ...(cfg.scenes || []).map(s => s.scroll), 1];
    return {
      snapTo:   points,
      duration: { min: 0.15, max: 0.6 },
      delay:    cfg.snapDelay !== undefined ? cfg.snapDelay : 0.3,
      ease:     'power2.inOut',
      onComplete: (self) => {
        // Snap landed — start dwell timer for this scene
        onSnapEngaged(self.progress);
      }
    };
  }

  // ── Init ScrollTrigger ────────────────────────────────────────────────────
  function initScrollTrigger() {
    ScrollTrigger.create({
      trigger:  heroSection,
      start:    'top top',
      end:      `+=${cfg.scrollBudget || '300%'}`,
      pin:      true,
      scrub:    useFrames ? (cfg.scrubSmooth || 0.5) : (cfg.scrubSmooth !== undefined ? cfg.scrubSmooth : 1),
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
        end:      `+=${cfg.scrollBudget || '300%'}`,
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
// ENGINE END — scroll-gsap.js v5.2
// ============================================================
