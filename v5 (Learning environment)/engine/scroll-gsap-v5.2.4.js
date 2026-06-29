// ============================================================
// ENGINE START — scroll-gsap.js v5.2.4
// DO NOT MODIFY — copy verbatim between ENGINE START / ENGINE END
// Requires: GSAP + ScrollTrigger loaded before this script
// Config:   window.GSAP_CONFIG defined before this script
// Changelog: engine/CHANGELOG.md
//
// v5.2.2 patches:
//   1. scrub: true for canvas mode — eliminates post-scroll animation tail.
//      Video no longer "plays" for milliseconds after scroll stops.
//      Number scrub (smoothing) only applies to video fallback mode.
//   2. Approach hold — within approachTolerance of a scene.scroll,
//      text opacity = 1 unconditionally. No dwell required. Text appears
//      as user approaches the scene and holds through snap + dwell.
//   3. Near-instant snap — duration { min: 0.02, max: 0.04 }.
//      Snap completes in <40ms; frame animation during snap is invisible.
//      snapInProgress flag freezes frame at snap start, jumps to
//      destination on complete.
//   4. dwellTime default raised to 4.0s.
//   5. Children (data-stagger) now also get approach hold.
// ============================================================
(function () {
  'use strict';

  // ── GSAP_CONFIG shape (v5.2.2) ────────────────────────────────────────────
  // window.GSAP_CONFIG = {
  //
  //   // Frame-by-frame (v5.2 primary)
  //   frameSrc:    "../assets/images/frames/",
  //   frameCount:  241,
  //   fps:         30,          // for reference only; engine uses frameCount
  //
  //   // Video fallback
  //   videoSrc:    "../assets/video/filename.mp4",
  //
  //   scrollBudget:     "450%",
  //   scrubSmooth:      1,       // VIDEO fallback only. Canvas always uses scrub:true.
  //   fadeRange:        0.18,    // fade curve AFTER approach/dwell zone
  //   approachTolerance: 0.035,  // within this of scene.scroll → opacity 1
  //   dwellTime:        4.0,     // seconds text holds after snap
  //
  //   snapToScenes:  true,
  //   snapDelay:     0.15,
  //
  //   waypoints: [0.45, 0.60],
  //
  //   // [v5.2.4] Extreme value clamp (optional, default 0.10)
  //   maxProgressJump: 0.10,  // max progress delta per RAF frame
  //                           // only fires on extreme flings / Page Down
  //   // videoDuration auto-detected from video.duration; no config needed
  //
  //   videoMap: [ ... ],
  //   scenes:   [ ... ]
  // };
  // ──────────────────────────────────────────────────────────────────────────

  const cfg = window.GSAP_CONFIG;
  if (!cfg) { console.error('[scroll-gsap] window.GSAP_CONFIG not found'); return; }

  gsap.registerPlugin(ScrollTrigger);

  // [v5.2.4] Auto-detect video duration via hidden probe element.
  // Reads video.duration from loadedmetadata — no cfg.videoDuration needed.
  // mapToVideoTime() picks this up as soon as metadata is ready (~1-2s).
  let detectedVideoDuration = null;
  (function probeVideoDuration() {
    if (!cfg.videoSrc) return;
    var probe = document.createElement('video');
    probe.preload = 'metadata';
    probe.muted   = true;
    probe.src     = cfg.videoSrc;
    probe.addEventListener('loadedmetadata', function() {
      detectedVideoDuration = probe.duration;
      probe.removeAttribute('src');
      probe.load(); // release resource
    }, { once: true });
  })();

  const heroSection = document.getElementById('hero-section');
  const progressBar = document.getElementById('hero-progress');
  const scrollHint  = document.getElementById('hero-scroll-hint');
  const nav         = document.getElementById('hero-nav');

  // ── Mode detection ────────────────────────────────────────────────────────
  const useFrames = !!(cfg.frameSrc && cfg.frameCount);
  let   canvas, ctx, frames = [], framesLoaded = 0;
  let   video;
  let   st = null;           // ScrollTrigger reference
  let   snapInProgress    = false;
  let   snapDestProgress  = null;
  let   displayProgress   = 0;   // [v5.2.4] canvas draw position (extreme-value clamped)
  let   targetProgress    = 0;   // [v5.2.4] real scroll position from ST

  // ── Frame preloader ───────────────────────────────────────────────────────
  function preloadFrames(onReady) {
    canvas = document.getElementById('hero-canvas');
    ctx    = canvas ? canvas.getContext('2d') : null;
    const loader = document.getElementById('hero-frame-loader');

    if (!canvas || !ctx) {
      initVideoFallback(onReady);
      return;
    }

    canvas.style.opacity = '0';

    function resize() {
      canvas.width  = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    }
    resize();
    window.addEventListener('resize', () => {
      resize();
      if (st && !snapInProgress) drawFrame(st.progress);
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
      img.onerror = () => { framesLoaded++; if (framesLoaded === total) onReady(); };
      frames.push(img);
    }
  }

  // ── Draw frame ────────────────────────────────────────────────────────────
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
    } else { onReady(); }
  }

  // ── videoMap interpolation ────────────────────────────────────────────────
  // [v5.2.3] cfg.videoDuration overrides the last videoMap entry's time.
  // Fixes "video stops N seconds early" when frame extraction was incomplete.
  function mapToVideoTime(progress) {
    const map = cfg.videoMap;
    if (!map || !map.length) return 0;
    if (progress <= map[0].scroll) return map[0].time;
    const last = map[map.length - 1];
    if (progress >= last.scroll) {
      // Use auto-detected duration, then cfg.videoDuration, then last anchor time
      const fullDuration = detectedVideoDuration || cfg.videoDuration || last.time;
      if (fullDuration > last.time && last.scroll < 1) {
        const t = (progress - last.scroll) / (1 - last.scroll);
        return last.time + t * (fullDuration - last.time);
      }
      return fullDuration;
    }
    for (let i = 0; i < map.length - 1; i++) {
      const a = map[i], b = map[i + 1];
      if (progress >= a.scroll && progress <= b.scroll) {
        const t = (progress - a.scroll) / (b.scroll - a.scroll);
        return a.time + t * (b.time - a.time);
      }
    }
    return 0;
  }

  // ── Dwell system ──────────────────────────────────────────────────────────
  const dwellState   = {};
  const dwellSeconds = cfg.dwellTime !== undefined ? cfg.dwellTime : 4.0;

  function onSnapEngaged(progress) {
    if (progress === undefined || progress === null) return;
    const scenes    = cfg.scenes || [];
    const tolerance = 0.025;
    scenes.forEach(scene => {
      if (Math.abs(progress - scene.scroll) < tolerance) {
        dwellState[scene.id] = { dwellEnd: performance.now() + dwellSeconds * 1000 };
      }
    });
  }

  // ── Scene opacity ─────────────────────────────────────────────────────────
  // v5.2.2: Approach hold — near a scene, opacity = 1 regardless of dwell.
  // Ensures text is visible as the user arrives AND holds through snap+dwell.
  function updateScenes(progress) {
    const fadeRange         = cfg.fadeRange         || 0.18;
    const approachTolerance = cfg.approachTolerance || 0.035;
    const now               = performance.now();

    (cfg.scenes || []).forEach(scene => {
      const el = document.querySelector(`[data-scene="${scene.id}"]`);
      if (!el) return;

      const dist       = Math.abs(progress - scene.scroll);
      const isApproach = dist < approachTolerance;
      const dwell      = dwellState[scene.id];
      const isDwelling = dwell && now < dwell.dwellEnd;

      // Approach hold + dwell both force opacity 1
      const opacity = (isApproach || isDwelling)
        ? 1
        : Math.max(0, 1 - dist / fadeRange);

      el.style.opacity = opacity;

      const children = el.querySelectorAll('[data-stagger]');
      children.forEach(child => {
        const lag    = parseFloat(child.dataset.stagger || 0) * 0.010;
        const delayed = Math.max(0, dist - lag);
        const childOp = (isApproach || isDwelling)
          ? 1
          : Math.max(0, 1 - delayed / fadeRange);
        child.style.opacity = childOp;
      });
    });
  }

  // ── Build snap points ─────────────────────────────────────────────────────
  function buildSnapPoints() {
    if (!cfg.snapToScenes) return false;

    const sceneScrolls    = (cfg.scenes    || []).map(s => s.scroll);
    const waypointScrolls = (cfg.waypoints || []);
    const allPoints       = [0, ...sceneScrolls, ...waypointScrolls, 1];

    const seen = new Set();
    const points = allPoints
      .map(p => Math.round(p * 1000) / 1000)
      .filter(p => { if (seen.has(p)) return false; seen.add(p); return true; })
      .sort((a, b) => a - b);

    return {
      snapTo:   points,
      // [v5.2.2] Near-instant snap — <40ms. Frame animation during snap is invisible.
      duration: { min: 0.02, max: 0.04 },
      delay:    cfg.snapDelay !== undefined ? cfg.snapDelay : 0.15,
      ease:     'none',
      onStart: () => {
        // Freeze frame at snap start — prevents "video plays" during snap ease
        snapInProgress = true;
        if (st) {
          // Find nearest snap point = destination
          const p = st.progress;
          snapDestProgress = points.reduce((a, b) =>
            Math.abs(b - p) < Math.abs(a - p) ? b : a
          );
          drawFrame(snapDestProgress);
        }
      },
      onComplete: () => {
        snapInProgress   = false;
        snapDestProgress = null;
        if (st) {
          // Sync display state to real progress after snap lands
          displayProgress = st.progress;
          targetProgress  = st.progress;
          drawFrame(st.progress);
          onSnapEngaged(st.progress);
        }
      }
    };
  }

  // ── Init ScrollTrigger ────────────────────────────────────────────────────
  function initScrollTrigger() {
    st = ScrollTrigger.create({
      trigger: heroSection,
      start:   'top top',
      end:     `+=${cfg.scrollBudget || '450%'}`,
      pin:     true,

      // [v5.2.2] Canvas: scrub:true = direct sync, zero lag.
      // Video fallback: use scrubSmooth (default 1s).
      scrub: useFrames
        ? true
        : (cfg.scrubSmooth !== undefined ? cfg.scrubSmooth : 1),

      snap:     buildSnapPoints(),

      onUpdate: (self) => {
        // [v5.2.4] Canvas: update targetProgress only. GSAP ticker handles
        // drawFrame with optional extreme-value clamp. Video: direct update.
        targetProgress = self.progress;
        if (!snapInProgress) {
          if (!useFrames && video) {
            video.currentTime = mapToVideoTime(self.progress);
          }
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
          opacity: 1, y: 0, duration: 1, delay, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        }
      );
    });

    // [v5.2.4] GSAP ticker — advances displayProgress toward targetProgress
    // at max maxProgressJump per frame. Normal scroll: delta < jump → instant.
    // Extreme fling (Page Down, momentum): delta > jump → capped advance.
    // Ticker keeps running between scroll events so display always catches up.
    if (useFrames) {
      var maxJump = cfg.maxProgressJump !== undefined ? cfg.maxProgressJump : 0.10;
      gsap.ticker.add(function() {
        if (snapInProgress) return; // snap manages its own drawing
        var delta = targetProgress - displayProgress;
        var absDelta = delta < 0 ? -delta : delta;
        if (absDelta > 0.0005) {
          if (absDelta > maxJump) {
            displayProgress += (delta > 0 ? 1 : -1) * maxJump;
          } else {
            displayProgress = targetProgress;
          }
          drawFrame(displayProgress);
        }
      });
    }

    // Navbar
    if (nav) {
      ScrollTrigger.create({
        trigger: heroSection,
        start:   'top top',
        end:     `+=${cfg.scrollBudget || '450%'}`,
        onUpdate: (self) => { nav.classList.toggle('nav-scrolled', self.progress > 0.05); }
      });
    }
  }


  // ── Start ─────────────────────────────────────────────────────────────────────────
  if (useFrames) {
    preloadFrames(initScrollTrigger);
  } else {
    initVideoFallback(initScrollTrigger);
  }

})();
// ENGINE END — scroll-gsap.js v5.2.4
// ============================================================
