/**
 * V4 Scroll-Scrub Engine
 * Copy this verbatim between ENGINE START and ENGINE END markers in index.html.
 * Do not modify. Configure via window.V4_CONFIG before this script.
 *
 * Supports: single video, two-video crossfade, scene stagger, below-fold reveal.
 * Fixes: heroMaxScroll (container-only), Chrome first-frame unlock, below-fold reset bug.
 */
(function V4Engine() {
  'use strict';

  var cfg            = window.V4_CONFIG || {};
  var VIDEO_RATIO    = cfg.videoRatio     || 0.65;
  var FADE_RANGE     = cfg.fadeRange      || 0.022;
  var STAGGER_LAG    = cfg.staggerLag     || 0.55;
  var VIDEO_SPLIT    = cfg.videoSplit     || null;   // null = single video
  var XFADE_WIDTH    = cfg.crossfadeWidth || 0.06;

  var video1, video2;
  var heroMaxScroll, totalMaxScroll, raf;

  /* Derived two-video split points (only used when VIDEO_SPLIT is set) */
  var V1_END, FADE_LOW, FADE_HIGH;
  if (VIDEO_SPLIT !== null) {
    V1_END    = VIDEO_RATIO * VIDEO_SPLIT;
    FADE_LOW  = V1_END - XFADE_WIDTH / 2;
    FADE_HIGH = V1_END + XFADE_WIDTH / 2;
  }

  /* ── Chrome unlock: play once then pause to decode first frame ── */
  function unlockVideo(v) {
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.load();
    v.addEventListener('loadedmetadata', function() {
      v.play().then(function() {
        v.pause();
        try { v.currentTime = 0.001; } catch(e) {}
      }).catch(function() {
        try { v.currentTime = 0.001; } catch(e) {}
      });
    }, { once: true });
  }

  function init() {
    video1 = document.getElementById('v4-video');
    video2 = document.getElementById('v4-video2') || null;

    if (!video1) { console.warn('[V4] #v4-video not found'); return; }

    unlockVideo(video1);
    unlockVideo(video2);

    /* Touch unlock for mobile */
    document.addEventListener('touchstart', function unlock() {
      [video1, video2].forEach(function(v) {
        if (v) v.play().then(function() { v.pause(); }).catch(function(){});
      });
      document.removeEventListener('touchstart', unlock);
    }, { once: true });

    measure();
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
  }

  /* Use scroll container height only — never document.scrollHeight.
     This isolates the hero scrub from below-fold content height changes. */
  function measure() {
    var container = document.getElementById('v4-scroll-container');
    heroMaxScroll  = container
      ? Math.max(container.offsetHeight - window.innerHeight, 1)
      : Math.max(window.innerHeight * 5, 1);
    totalMaxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  }

  function onScroll() { if (!raf) raf = requestAnimationFrame(tick); }

  function tick() {
    raf = null;
    var scrollY = window.scrollY;
    var p       = Math.min(scrollY / heroMaxScroll, 1.05);  /* hero progress */
    var totalP  = scrollY / totalMaxScroll;                  /* full page progress */

    scrub(p);
    renderScenes(p);
    renderNav(p);
    renderBelowFold(p);
    renderScrollHint(p);
    renderProgressBar(totalP);
  }

  function scrub(p) {
    if (VIDEO_SPLIT === null) {
      /* Single video */
      if (video1 && video1.readyState >= 2 && video1.duration) {
        try { video1.currentTime = Math.min(p / VIDEO_RATIO, 1) * video1.duration; } catch(e) {}
      }
    } else {
      /* Two-video crossfade */
      if (video1 && video1.readyState >= 2 && video1.duration) {
        var p1 = Math.min(p / V1_END, 1);
        try { video1.currentTime = p1 * video1.duration; } catch(e) {}
      }
      if (video2 && video2.readyState >= 2 && video2.duration) {
        var v2Range = VIDEO_RATIO - V1_END;
        var p2 = Math.min(Math.max(p - V1_END, 0) / v2Range, 1);
        try { video2.currentTime = p2 * video2.duration; } catch(e) {}
      }
      /* Crossfade opacity */
      var crossT = Math.min(Math.max((p - FADE_LOW) / (FADE_HIGH - FADE_LOW), 0), 1);
      if (video1) video1.style.opacity = 1 - crossT;
      if (video2) video2.style.opacity = crossT;
    }
  }

  function renderScenes(p) {
    (cfg.scenes || []).forEach(function(scene) {
      var el = document.getElementById(scene.id);
      if (!el) return;
      var op = (p >= scene.start && p <= scene.end)
        ? clamp(Math.min((p - scene.start) / FADE_RANGE, (scene.end - p) / FADE_RANGE), 0, 1)
        : 0;
      el.style.opacity    = op;
      el.style.visibility = op > 0 ? 'visible' : 'hidden';
      if (op > 0) {
        el.querySelectorAll('[data-stagger]').forEach(function(ch) {
          var idx = parseInt(ch.getAttribute('data-stagger'), 10) || 0;
          ch.style.opacity = clamp(
            (p - scene.start - idx * STAGGER_LAG * FADE_RANGE) / FADE_RANGE,
            0, 1
          );
        });
      }
    });
  }

  function renderNav(p) {
    var nav = document.getElementById('v4-nav');
    if (!nav) return;
    var threshold = (cfg.nav && cfg.nav.showAfter != null) ? cfg.nav.showAfter : 0;
    nav.style.opacity       = p >= threshold ? '1' : '0';
    nav.style.pointerEvents = p >= threshold ? 'all' : 'none';
    if (p > 0.05) nav.classList.add('scrolled');
    else          nav.classList.remove('scrolled');
  }

  function renderBelowFold(p) {
    var el = document.getElementById('v4-below-fold');
    if (el) el.style.opacity = clamp((p - (VIDEO_RATIO + 0.02)) / 0.04, 0, 1);
  }

  function renderScrollHint(p) {
    var h = document.getElementById('v4-scroll-hint');
    if (h && p > 0.03) h.classList.add('hidden');
  }

  function renderProgressBar(totalP) {
    var bar = document.getElementById('v4-progress');
    if (bar) bar.style.width = (Math.min(totalP, 1) * 100) + '%';
  }

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
