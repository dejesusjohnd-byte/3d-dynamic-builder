// ============================================================
// ENGINE START — scroll-gsap.js v5
// DO NOT MODIFY — copy verbatim between ENGINE START / ENGINE END
// Requires: GSAP + ScrollTrigger loaded before this script
// Config:   window.GSAP_CONFIG defined before this script
// ============================================================
(function () {
  'use strict';

  // ── GSAP_CONFIG shape ────────────────────────────────────────────────────────
  // window.GSAP_CONFIG = {
  //   videoSrc:     "../assets/video/filename.mp4",
  //   scrollBudget: "350%",        // total scroll distance pinned to hero
  //   scrubSmooth:  1,             // GSAP scrub smoothing (1 = default, 0 = instant)
  //   fadeRange:    0.08,          // scene fade window (fraction of scroll progress)
  //
  //   videoMap: [                  // anchors: scroll position → video timestamp
  //     { scroll: 0.00, time: 0.0,  label: "intro"  },
  //     { scroll: 0.25, time: 4.2,  label: "reveal" },
  //     { scroll: 0.60, time: 14.8, label: "peak"   },
  //     { scroll: 1.00, time: 30.0, label: "outro"  }
  //   ],
  //
  //   scenes: [                    // text overlays, positioned from frame log
  //     {
  //       id:      "scene-1",
  //       scroll:  0.08,           // scroll progress where this scene peaks
  //       headline: "HEADLINE",
  //       subhead:  "Subhead text",
  //       pitch:    "Pitch line",
  //       css: { top: "8%", left: "6%" }
  //     }
  //   ]
  // };
  // ────────────────────────────────────────────────────────────────────────────

  const cfg = window.GSAP_CONFIG;
  if (!cfg) { console.error('[scroll-gsap] window.GSAP_CONFIG not found'); return; }

  gsap.registerPlugin(ScrollTrigger);

  const video       = document.getElementById('hero-video');
  const heroSection = document.getElementById('hero-section');
  const progressBar = document.getElementById('hero-progress');
  const scrollHint  = document.getElementById('hero-scroll-hint');

  // ── Chrome autoplay unlock ───────────────────────────────────────────────────
  if (video) {
    video.addEventListener('loadedmetadata', () => {
      video.play().then(() => video.pause()).catch(() => {});
    });
  }

  // ── videoMap interpolation ───────────────────────────────────────────────────
  // Maps a 0–1 scroll progress to the correct video timestamp via the anchors.
  // Between any two anchors it linearly interpolates — giving you non-linear
  // video pacing without codec tricks.
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

  // ── Scene text rendering ─────────────────────────────────────────────────────
  // Fades each scene overlay in and out based on distance from its scroll anchor.
  // fadeRange controls the window — wider = longer crossfades.
  function updateScenes(progress) {
    const fadeRange = cfg.fadeRange || 0.08;
    (cfg.scenes || []).forEach(scene => {
      const el = document.querySelector(`[data-scene="${scene.id}"]`);
      if (!el) return;
      const dist    = Math.abs(progress - scene.scroll);
      const opacity = Math.max(0, 1 - dist / fadeRange);
      el.style.opacity = opacity;

      // Stagger children: headline → subhead → pitch
      const children = el.querySelectorAll('[data-stagger]');
      children.forEach(child => {
        const lag     = parseFloat(child.dataset.stagger || 0) * 0.015;
        const delayed = Math.max(0, progress - lag);
        const dist2   = Math.abs(delayed - scene.scroll);
        child.style.opacity = Math.max(0, 1 - dist2 / fadeRange);
      });
    });
  }

  // ── Hero ScrollTrigger — pinned ──────────────────────────────────────────────
  // The hero stays fixed on screen while the user scrolls through scrollBudget.
  // When the budget is spent the pin releases and below-fold content flows in.
  ScrollTrigger.create({
    trigger:  heroSection,
    start:    'top top',
    end:      `+=${cfg.scrollBudget || '300%'}`,
    pin:      true,
    scrub:    cfg.scrubSmooth !== undefined ? cfg.scrubSmooth : 1,
    onUpdate: (self) => {
      if (video) video.currentTime = mapToVideoTime(self.progress);
      updateScenes(self.progress);

      if (progressBar) progressBar.style.width = (self.progress * 100) + '%';
      if (scrollHint)  scrollHint.style.opacity = self.progress < 0.04 ? 1 : 0;
    }
  });

  // ── Below-fold reveals ───────────────────────────────────────────────────────
  // Any element with class .gsap-reveal animates in as it enters the viewport.
  // Add data-delay="0.1" (seconds) to stagger siblings manually.
  document.querySelectorAll('.gsap-reveal').forEach(el => {
    const delay = parseFloat(el.dataset.delay || 0);
    gsap.fromTo(el,
      { opacity: 0, y: 60 },
      {
        opacity:  1,
        y:        0,
        duration: 1,
        delay:    delay,
        ease:     'power2.out',
        scrollTrigger: {
          trigger:      el,
          start:        'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // ── Navbar scroll behavior ───────────────────────────────────────────────────
  const nav = document.getElementById('hero-nav');
  if (nav) {
    ScrollTrigger.create({
      trigger:  heroSection,
      start:    'top top',
      end:      `+=${cfg.scrollBudget || '300%'}`,
      onUpdate: (self) => {
        nav.classList.toggle('nav-scrolled', self.progress > 0.05);
      }
    });
  }

})();
// ENGINE END — scroll-gsap.js v5
// ============================================================
