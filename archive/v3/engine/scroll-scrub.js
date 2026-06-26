/* ================================================================
   V3 SCROLL ENGINE — REFERENCE COPY
   Version: 3.1
   ================================================================
   DO NOT MODIFY THIS FILE.
   This is the reference copy. When building index.html, copy
   this block VERBATIM between the ENGINE START / ENGINE END markers.

   Configure only via window.V3_CONFIG in the block above it.
   All scene data, timing, and behavior is set in V3_CONFIG.
   ================================================================ */

(function V3Engine() {
  'use strict';

  /* ── Config defaults ─────────────────────────────────────── */
  var cfg         = window.V3_CONFIG   || {};
  var SCRUB_MODE  = cfg.scrubMode      || 'full';   // 'full' | 'eased' | 'section-trigger' | 'ambient'
  var VIDEO_RATIO = cfg.videoRatio     || 0.65;     // fraction of total scroll that drives video
  var FADE_RANGE  = cfg.fadeRange      || 0.025;    // scene opacity ramp as fraction of total scroll
  var EASED       = SCRUB_MODE         === 'eased'; // smooth lerp follow
  var STAGGER_LAG = cfg.staggerLag     || 0.55;     // how much of FADE_RANGE each stagger step takes

  /* ── State ───────────────────────────────────────────────── */
  var video, maxScroll, raf;
  var lerpTime = 0, targetTime = 0;

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    video = document.getElementById('v3-video');
    if (!video) { console.warn('[V3] #v3-video not found.'); return; }

    video.muted       = true;
    video.playsInline = true;
    video.preload     = 'auto';

    if (SCRUB_MODE === 'ambient') {
      video.loop = true;
      video.play().catch(function() {});
    } else {
      video.load();

      /* First-frame unlock: Chrome on file:// won't decode any frame until
         play() is called at least once. Fire play→pause on loadedmetadata
         so the first frame is always visible before the user scrolls. */
      video.addEventListener('loadedmetadata', function() {
        video.play().then(function() {
          video.pause();
          video.currentTime = 0.001;
        }).catch(function() {
          try { video.currentTime = 0.001; } catch(e) {}
        });
      }, { once: true });

      /* Mobile unlock: browsers need a play() call before currentTime seeks */
      document.addEventListener('touchstart', function unlockVideo() {
        video.play().then(function() { video.pause(); video.currentTime = 0; });
        document.removeEventListener('touchstart', unlockVideo);
      }, { once: true });
    }

    measure();
    onScroll();
    window.addEventListener('scroll',  onScroll, { passive: true });
    window.addEventListener('resize',  measure);
  }

  function measure() {
    maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  }

  /* ── Scroll handler ──────────────────────────────────────── */
  function onScroll() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function tick() {
    raf = null;
    var p = window.scrollY / maxScroll;

    scrubVideo(p);
    updateScenes(p);
    updateNav(p);
    updateBelowFold(p);

    /* Keep ticking if eased scrub hasn't caught up */
    if (EASED && Math.abs(targetTime - lerpTime) > 0.005) {
      raf = requestAnimationFrame(tick);
    }
  }

  /* ── Video scrub ─────────────────────────────────────────── */
  function scrubVideo(p) {
    if (SCRUB_MODE === 'ambient') return;
    if (video.readyState < 2 || !video.duration) return;

    var videoProgress = Math.min(p / VIDEO_RATIO, 1);
    targetTime = videoProgress * video.duration;

    if (EASED) {
      lerpTime += (targetTime - lerpTime) * 0.10;
      try { video.currentTime = lerpTime; } catch(e) {}
    } else {
      try { video.currentTime = targetTime; } catch(e) {}
    }
  }

  /* ── Scene opacity ───────────────────────────────────────── */
  function updateScenes(p) {
    var scenes = cfg.scenes || [];
    for (var i = 0; i < scenes.length; i++) renderScene(scenes[i], p);
  }

  function renderScene(scene, p) {
    var el = document.getElementById(scene.id);
    if (!el) return;

    var inRange = p >= scene.start && p <= scene.end;
    var opacity = 0;

    if (inRange) {
      var fadeIn  = (p - scene.start) / FADE_RANGE;
      var fadeOut = (scene.end   - p) / FADE_RANGE;
      opacity     = clamp(Math.min(fadeIn, fadeOut), 0, 1);
    }

    el.style.opacity    = opacity;
    el.style.visibility = opacity > 0 ? 'visible' : 'hidden';

    /* ── Staggered child reveals ─────────────────────────────
       data-stagger="0"  →  headline  (enters first)
       data-stagger="1"  →  subhead   (enters second)
       data-stagger="2"  →  pitch     (enters last)
       Text enters by opacity only. No transforms. No movement. */
    if (opacity > 0) {
      var children = el.querySelectorAll('[data-stagger]');
      for (var j = 0; j < children.length; j++) {
        var idx       = parseInt(children[j].getAttribute('data-stagger'), 10) || 0;
        var offset    = idx * STAGGER_LAG * FADE_RANGE;
        var childFade = clamp((p - scene.start - offset) / FADE_RANGE, 0, 1);
        children[j].style.opacity = childFade;
      }
    }
  }

  /* ── Nav reveal ──────────────────────────────────────────── */
  function updateNav(p) {
    var nav = document.getElementById('v3-nav');
    if (!nav) return;
    var threshold = (cfg.nav && cfg.nav.showAfter !== undefined) ? cfg.nav.showAfter : 0.04;
    nav.style.opacity    = p > threshold ? '1' : '0';
    nav.style.visibility = p > threshold ? 'visible' : 'hidden';
  }

  /* ── Below-fold reveal ───────────────────────────────────── */
  function updateBelowFold(p) {
    var el = document.getElementById('v3-below-fold');
    if (!el) return;
    var revealStart = VIDEO_RATIO + 0.02;
    var opacity     = clamp((p - revealStart) / 0.04, 0, 1);
    el.style.opacity = opacity;
  }

  /* ── Helpers ─────────────────────────────────────────────── */
  function clamp(val, min, max) {
    return val < min ? min : val > max ? max : val;
  }

  /* ── Boot ────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
