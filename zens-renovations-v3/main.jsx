/* ═══════════════════════════════════════════════════════════════
   main.jsx — Zens Renovations v3
   React entry point: mounts GeneratedScene + Three.js + GSAP
   Transpiled by @babel/standalone via index.html
   ═══════════════════════════════════════════════════════════════ */

const {
  useRef, useState, useEffect, useCallback, useMemo,
  createElement, Fragment, Component
} = React;

/* ═══════════════════════════════════════════════════════════════
   THREE.JS — Hero Particle Field
   Matches HeroSection.jsx → AmbientParticles pattern
   2000 particles inSphere distribution, scroll-linked parallax
   ═══════════════════════════════════════════════════════════════ */
function initHeroScene(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x09090b);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 1;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle sphere — inSphere distribution matching maath/random pattern from HeroSection.jsx
  const pCount = 2000;
  const positions = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const r = Math.cbrt(Math.random()) * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xa1a1aa, size: 0.004, transparent: true,
    opacity: 0.6, sizeAttenuation: true, depthWrite: false,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Wireframe cubes — structural/building metaphor
  const wMat = new THREE.MeshBasicMaterial({ color: 0xc8a97e, wireframe: true, transparent: true, opacity: 0.06 });
  const wCube1 = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), wMat);
  wCube1.position.set(16, -7, -12);
  scene.add(wCube1);
  const wCube2 = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.5, 3.5), wMat.clone());
  wCube2.material.opacity = 0.04;
  wCube2.position.set(-20, 9, -16);
  scene.add(wCube2);

  // Ambient light sphere
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(12, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xc8a97e, transparent: true, opacity: 0.015 })
  );
  orb.position.set(0, 0, -25);
  scene.add(orb);

  let scrollY = 0;
  const onScroll = () => { scrollY = window.scrollY; };
  window.addEventListener('scroll', onScroll, { passive: true });

  function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.0004;
    particles.rotation.x = Math.sin(Date.now() * 0.0002) * 0.1;
    wCube1.rotation.x += 0.001;
    wCube1.rotation.y += 0.002;
    wCube2.rotation.x -= 0.0008;
    wCube2.rotation.y -= 0.0015;
    // Scroll-linked parallax
    const targetY = -(scrollY * 0.0005);
    particles.position.y += (targetY - particles.position.y) * 0.05;
    renderer.render(scene, camera);
  }
  animate();

  // GSAP scroll-linked parallax
  gsap.to(particles.rotation, {
    z: 0.3,
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });
  gsap.to(wCube1.position, {
    y: -16,
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  // Resize
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
  };
}

/* ═══════════════════════════════════════════════════════════════
   THREE.JS — Closing Particle Field
   Subtle gold particles for terminal CTA atmosphere
   ═══════════════════════════════════════════════════════════════ */
function initClosingScene(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const cpCount = 350;
  const cpPos = new Float32Array(cpCount * 3);
  for (let i = 0; i < cpCount; i++) {
    cpPos[i * 3]     = (Math.random() - 0.5) * 60;
    cpPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
    cpPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;
  }
  const cpGeo = new THREE.BufferGeometry();
  cpGeo.setAttribute('position', new THREE.BufferAttribute(cpPos, 3));
  const cpMat = new THREE.PointsMaterial({
    color: 0xc8a97e, size: 0.05, transparent: true,
    opacity: 0.25, sizeAttenuation: true,
  });
  const cParticles = new THREE.Points(cpGeo, cpMat);
  scene.add(cParticles);

  function animate() {
    requestAnimationFrame(animate);
    cParticles.rotation.y += 0.0002;
    cParticles.rotation.x += 0.0001;
    renderer.render(scene, camera);
  }
  animate();

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('resize', onResize);
    renderer.dispose();
  };
}

/* ═══════════════════════════════════════════════════════════════
   GSAP — Global ScrollTrigger Animations
   Staggered reveals per manifesto.json motion rules
   ═══════════════════════════════════════════════════════════════ */
function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  const heroTl = gsap.timeline({ delay: 0.6 });
  heroTl
    .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
    .to('.hero-title-v3', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=0.6')
    .to('.hero-sub-v3', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
    .to('.hero-cta-v3', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.6');

  // Collage
  gsap.to('.collage-chapter-v3', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '#collage', start: 'top 75%' } });
  gsap.to('.collage-statement-v3', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: '#collage', start: 'top 70%', toggleActions: 'play none none reverse' } });
  gsap.to('.collage-float-img', { opacity: 1, scale: 1, duration: 1.5, stagger: 0.15, ease: 'power3.out',
    scrollTrigger: { trigger: '#collage', start: 'top 60%', toggleActions: 'play none none reverse' } });
  // Collage parallax — different speeds per image for depth
  document.querySelectorAll('.collage-float-img').forEach((el, i) => {
    gsap.to(el, {
      y: -(40 + i * 15),
      scrollTrigger: { trigger: '#collage', start: 'top bottom', end: 'bottom top', scrub: 1 + i * 0.3 }
    });
  });

  // Offerings
  gsap.to('.offerings-chapter-v3', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '#offerings', start: 'top 80%' } });
  gsap.to('.offerings-title-v3', { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#offerings', start: 'top 75%' } });
  gsap.to('.offering-card-v3', { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.offerings-grid-v3', start: 'top 75%' } });

  // Value Pause
  gsap.to('.value-chapter-v3', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '#value-pause', start: 'top 75%' } });
  gsap.to('.value-headline-v3', { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#value-pause', start: 'top 70%' } });
  gsap.to('.value-body-v3', { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#value-pause', start: 'top 65%' } });
  ScrollTrigger.create({
    trigger: '#value-pause', start: 'top 60%',
    onEnter: () => document.getElementById('value-img')?.classList.add('reveal'),
    toggleActions: 'play none none reverse'
  });

  // Closing
  gsap.to('.closing-title-v3', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: '#closing', start: 'top 70%' } });
  gsap.to('.closing-cta-v3', { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#closing', start: 'top 60%' } });
}

/* ═══════════════════════════════════════════════════════════════
   DATA — Extracted from zensrenovation.com
   Per extraction_manifesto.json 5 locked buckets
   ═══════════════════════════════════════════════════════════════ */
const DATA = {
  brand_identity_logo: 'https://zensrenovation.com/_next/image?url=%2Fimages%2Flogo-v3.png&w=3840&q=75',
  hook_headline: 'Built to Last, Crafted to Impress',
  hook_context: 'Zens Renovations specializes in custom decks, privacy fences, and roofing across Hamilton, Niagara, and surrounding areas. Quality outdoor builds and interior renovations, done right.',
  primary_action_label: 'Start Your Project',

  introStatement: 'Transforming Homes with Precision & Care',
  collageImages: [
    'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-4.png&w=3840&q=75',
    'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-5.png&w=3840&q=75',
    'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-1.png&w=3840&q=75',
    'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-2.png&w=3840&q=75',
  ],

  offering_units: [
    {
      item_title: 'Decks & Fences',
      item_summary: 'Extend your living space outdoors with custom-built decks and privacy fences. We use premium materials to create durable, stylish structures that enhance your home\'s curb appeal.',
      item_cover_url: 'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-1.png&w=3840&q=75',
    },
    {
      item_title: 'Roofing Services',
      item_summary: 'Protect your home with our professional roofing services. Whether you need repairs or a full replacement, we deliver weather-resistant solutions using top-tier materials.',
      item_cover_url: 'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-2.png&w=3840&q=75',
    },
    {
      item_title: 'General Contracting',
      item_summary: 'We handle every aspect of your construction project with precision. From permits and planning to the final coat of paint, our general contracting services ensure a seamless, stress-free experience.',
      item_cover_url: 'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-4.png&w=3840&q=75',
    },
    {
      item_title: 'Interior Renovations',
      item_summary: 'Transform your living spaces into modern masterpieces. We specialize in custom kitchens, spa-like bathrooms, and finished basements that maximize both comfort and property value.',
      item_cover_url: 'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-5.png&w=3840&q=75',
    },
  ],

  philosophy_anchor: 'A streamlined, transparent process that makes your renovation journey smooth and stress-free.',
  philosophy_deep_dive: 'We start with a conversation about your vision, needs, and budget. Together we plan your project in detail, selecting materials, layouts, and finishes that bring your vision to life. You receive a transparent, itemized quote with no hidden surprises. Once approved, our expert team transforms your space with precision and care, followed by a complete final walkthrough.',
  singular_master_visual: 'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-4.png&w=3840&q=75',

  closing_invitation: 'Ready to Transform Your Home?',
  target_conversion_label: 'Start Your Project',
  baseline_essentials: {
    corporate_copyright: '\u00a9 2025 Zens Renovations. Hamilton & Niagara.',
    direct_contact_strings: '(437) 410-5329',
  },
};

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 1 — HERO
   Component spec: components/HeroSection.jsx
   ═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section id="hero" style={{
      position: 'relative', width: '100vw', height: '100vh',
      overflow: 'hidden', background: '#09090b',
    }}>
      {/* Three.js Canvas — Z:-10 layer */}
      <canvas id="hero-canvas" style={{
        position: 'absolute', inset: 0, zIndex: 0, width: '100%', height: '100%',
      }} />

      {/* Navigation — Z:10 layer */}
      <header style={{
        position: 'absolute', top: 0, left: 0, width: '100%',
        padding: '1.5rem 3.5rem', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', zIndex: 10,
      }}>
        <img src={DATA.brand_identity_logo} alt="Zens Renovations" style={{ height: '24px', width: 'auto' }} />
        <nav style={{ display: 'flex', gap: '2.5rem' }} className="nav-links">
          {['Services', 'Process', 'Contact'].map((label, i) => (
            <a key={i} href={['#offerings', '#value-pause', '#closing'][i]} style={{
              fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#a1a1aa', textDecoration: 'none', fontWeight: 400, opacity: 0.8,
              transition: 'opacity 0.3s ease',
            }}>
              {label}
            </a>
          ))}
        </nav>
        <a href="#closing" style={{
          fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#f4f4f5', textDecoration: 'none', padding: '0.6rem 1.4rem',
          border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.4s ease',
        }}>
          Get Quote
        </a>
      </header>

      {/* Center Typography — Z:1 layer */}
      <div className="hero-inner" style={{
        position: 'relative', width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: '0 10%', textAlign: 'center', zIndex: 2,
      }}>
        <p className="hero-eyebrow" style={{
          fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'var(--accent)', marginBottom: '1.5rem', fontWeight: 400,
          opacity: 0, transform: 'translateY(20px)',
        }}>
          Decks · Fences · Roofing
        </p>
        <h1 className="hero-title-v3" style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 600, color: '#f4f4f5', letterSpacing: '-0.03em',
          lineHeight: 1.1, maxWidth: '900px', margin: '0 0 1.5rem',
          opacity: 0, transform: 'translateY(30px)',
        }}>
          {DATA.hook_headline}
        </h1>
        <p className="hero-sub-v3" style={{
          fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', color: '#a1a1aa',
          maxWidth: '560px', lineHeight: 1.7, fontWeight: 300,
          margin: '0 0 3rem', opacity: 0, transform: 'translateY(20px)',
        }}>
          {DATA.hook_context}
        </p>
        <button className="hero-cta-v3" onClick={() => document.getElementById('closing').scrollIntoView({ behavior: 'smooth' })} style={{
          padding: '1rem 2.5rem', fontSize: '0.85rem', letterSpacing: '0.15em',
          textTransform: 'uppercase', background: 'transparent', color: '#c8a97e',
          border: '1px solid #c8a97e', cursor: 'pointer', fontWeight: 500,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: 0, transform: 'translateY(20px)',
        }}>
          {DATA.primary_action_label}
        </button>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 2 — COLLAGE INTRODUCTION
   Component spec: components/CollageIntroduction.jsx
   ═══════════════════════════════════════════════════════════════ */
function CollageIntroduction() {
  const imgs = DATA.collageImages.slice(0, 4);
  const positions = [
    { top: '10%', left: '3%', w: 220, h: 280, rot: '-4deg', z: -1, op: 0.25 },
    { bottom: '5%', right: '2%', w: 260, h: 340, rot: '3deg', z: 5, op: 0.3 },
    { top: '5%', right: '5%', w: 200, h: 240, rot: '-2deg', z: -2, op: 0.15 },
    { bottom: '8%', left: '8%', w: 240, h: 300, rot: '6deg', z: -1, op: 0.2 },
  ];

  return (
    <section id="collage" style={{
      width: '100vw', minHeight: '100vh', padding: '12rem 4rem',
      background: '#09090b', color: '#f4f4f5', position: 'relative',
      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'relative', width: '100%', maxWidth: '1200px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2,
      }}>
        <span className="collage-chapter-v3 chapter-label" style={{
          marginBottom: '3rem', opacity: 0, transform: 'translateY(15px)',
        }}>
          02 / Origin DNA
        </span>
        <h2 className="collage-statement-v3" style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(1.5rem, 3.5vw, 2.75rem)',
          fontWeight: 400, lineHeight: 1.4, textAlign: 'center',
          maxWidth: '850px', color: '#f4f4f5', position: 'relative',
          zIndex: 10, margin: 0, opacity: 0, transform: 'translateY(40px)',
        }}>
          {DATA.introStatement}
        </h2>

        {/* Floating collage images */}
        <div style={{
          position: 'absolute', top: '-10%', left: 0, width: '100%', height: '120%',
          pointerEvents: 'none', zIndex: 1,
        }}>
          {imgs.map((src, i) => {
            const p = positions[i];
            return (
              <div key={i} className="collage-float-img" style={{
                position: 'absolute', top: p.top, left: p.left, right: p.right,
                bottom: p.bottom, width: p.w, height: p.h, opacity: 0,
                transform: `rotate(${p.rot}) scale(0.95)`, zIndex: p.z,
                borderRadius: '4px', overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}>
                <img src={src} alt={`Context ${i}`} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  filter: 'grayscale(100%) contrast(1.05)',
                }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 3 — STATIC OFFERINGS GRID
   Component spec: components/StaticOfferingsGrid.jsx
   ═══════════════════════════════════════════════════════════════ */
function StaticOfferingsGrid() {
  const items = DATA.offering_units.slice(0, 4);

  return (
    <section id="offerings" className="section-pad" style={{
      width: '100vw', padding: '10rem 4rem', background: '#09090b',
      color: '#f4f4f5', display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: '1400px', marginBottom: '5rem' }}>
        <span className="offerings-chapter-v3 chapter-label" style={{
          marginBottom: '1rem', opacity: 0, transform: 'translateY(15px)',
        }}>
          03 / Capabilities Matrix
        </span>
        <h2 className="offerings-title-v3" style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
          fontWeight: 500, color: '#f4f4f5', opacity: 0, transform: 'translateY(20px)',
        }}>
          What We Build
        </h2>
        <div className="section-divider" />
      </div>

      <div className="offerings-grid offerings-grid-v3" style={{
        width: '100%', maxWidth: '1400px', display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', background: '#27272a',
      }}>
        {items.map((item, i) => (
          <div key={i} className="offering-card-v3" style={{
            background: '#09090b', padding: '3.5rem 2.5rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: '420px', transition: 'background 0.3s ease',
            opacity: 0, transform: 'translateY(30px)',
          }}>
            <div>
              <div style={{
                width: '100%', height: '180px', overflow: 'hidden',
                marginBottom: '2.5rem', background: '#18181b', position: 'relative',
              }}>
                {item.item_cover_url ? (
                  <img src={item.item_cover_url} alt={item.item_title} style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    filter: 'grayscale(100%) contrast(1.1)',
                    transition: 'filter 0.5s ease',
                  }} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, #18181b, #27272a)', opacity: 0.6,
                  }} />
                )}
              </div>
              <h3 style={{
                fontFamily: 'var(--serif)', fontSize: '1.25rem',
                fontWeight: 500, marginBottom: '1rem', color: '#f4f4f5',
              }}>
                {item.item_title}
              </h3>
              <p style={{
                fontSize: '0.9rem', color: '#a1a1aa', lineHeight: 1.7, fontWeight: 300,
              }}>
                {item.item_summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 4 — TWO COLUMN VALUE PAUSE
   Component spec: components/TwoColumnValuePause.jsx
   ═══════════════════════════════════════════════════════════════ */
function TwoColumnValuePause() {
  return (
    <section id="value-pause" className="section-pad" style={{
      width: '100vw', minHeight: '90vh', padding: '6rem 4rem',
      background: '#09090b', color: '#f4f4f5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="value-grid" style={{
        width: '100%', maxWidth: '1400px', display: 'grid',
        gridTemplateColumns: '1.2fr 1fr', gap: '6rem', alignItems: 'center',
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        }}>
          <span className="value-chapter-v3 chapter-label" style={{
            marginBottom: '2rem', opacity: 0, transform: 'translateY(15px)',
          }}>
            04 / Value Paradigm
          </span>
          <h2 className="value-headline-v3" style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 500, lineHeight: 1.3, color: '#f4f4f5',
            margin: '0 0 2.5rem', opacity: 0, transform: 'translateY(30px)',
          }}>
            {DATA.philosophy_anchor}
          </h2>
          <p className="value-body-v3" style={{
            fontSize: '1.05rem', color: '#a1a1aa', lineHeight: 1.7,
            fontWeight: 300, maxWidth: '550px', margin: 0,
            opacity: 0, transform: 'translateY(20px)',
          }}>
            {DATA.philosophy_deep_dive}
          </p>
        </div>
        <div className="value-img-frame" style={{
          width: '100%', height: '500px', background: '#18181b',
          overflow: 'hidden', position: 'relative',
        }}>
          <img id="value-img" src={DATA.singular_master_visual} alt="Craftsmanship" style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: 'grayscale(100%) contrast(1.05)',
            opacity: 0, transform: 'scale(1.1)',
            transition: 'opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1), transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 5 — CLOSING CTA
   Component spec: components/ClosingCallToAction.jsx
   ═══════════════════════════════════════════════════════════════ */
function ClosingCallToAction() {
  const { corporate_copyright, direct_contact_strings } = DATA.baseline_essentials;

  return (
    <section id="closing" style={{
      position: 'relative', width: '100vw', height: '100vh',
      background: '#09090b', color: '#f4f4f5',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', overflow: 'hidden',
    }}>
      {/* Three.js Canvas */}
      <canvas id="closing-canvas" style={{
        position: 'absolute', inset: 0, zIndex: 0, width: '100%', height: '100%',
      }} />

      {/* Top bar */}
      <div className="closing-bar" style={{
        width: '100%', padding: '3rem 4rem 0', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', zIndex: 2,
      }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#71717a' }}>
          05 / Terminal Conversion
        </span>
        <div style={{ width: '100px', height: '1px', background: '#27272a' }} />
      </div>

      {/* Center content */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '0 10%', zIndex: 2,
      }}>
        <h2 className="closing-title-v3" style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 5vw, 4rem)',
          fontWeight: 600, letterSpacing: '-0.02em', color: '#f4f4f5',
          marginBottom: '2rem', maxWidth: '800px',
          opacity: 0, transform: 'translateY(30px)',
        }}>
          {DATA.closing_invitation}
        </h2>
        <button className="closing-cta-v3" onClick={() => window.location.href = 'tel:4374105329'} style={{
          padding: '1.2rem 3.5rem', fontSize: '0.9rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', background: '#c8a97e', color: '#09090b',
          border: 'none', cursor: 'pointer', fontWeight: 600,
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
          opacity: 0, transform: 'translateY(20px)',
        }}>
          {DATA.target_conversion_label}
        </button>
      </div>

      {/* Footer */}
      <div className="closing-foot" style={{
        width: '100%', padding: '0 4rem 3rem', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        fontSize: '0.8rem', color: '#71717a', letterSpacing: '0.05em', zIndex: 2,
      }}>
        <span>{corporate_copyright}</span>
        <span>{direct_contact_strings}</span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GENERATED SCENE — Full 5-Chapter Composition
   ═══════════════════════════════════════════════════════════════ */
function GeneratedScene() {
  useEffect(() => {
    // Initialize Three.js scenes
    const cleanupHero = initHeroScene('hero-canvas');
    const cleanupClosing = initClosingScene('closing-canvas');

    // Initialize GSAP scroll animations
    initScrollAnimations();

    // Hide loader
    const loaderTimer = setTimeout(() => {
      document.getElementById('loader')?.classList.add('done');
    }, 600);

    return () => {
      cleanupHero?.();
      cleanupClosing?.();
      clearTimeout(loaderTimer);
    };
  }, []);

  return createElement(Fragment, null,
    createElement(HeroSection, null),
    createElement(CollageIntroduction, null),
    createElement(StaticOfferingsGrid, null),
    createElement(TwoColumnValuePause, null),
    createElement(ClosingCallToAction, null)
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOUNT
   ═══════════════════════════════════════════════════════════════ */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(createElement(GeneratedScene, null));
