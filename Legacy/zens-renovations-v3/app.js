/* ═══════════════════════════════════════════════════════════════
   app.js — Zens Renovations v3
   React bootstrap: mounts GeneratedScene + Three.js + GSAP
   Pure React.createElement — no JSX, no Babel, no build step
   ═══════════════════════════════════════════════════════════════ */

(function() {
'use strict';

var React = window.React;
var ReactDOM = window.ReactDOM;
var THREE = window.THREE;
var gsap = window.gsap;
var ScrollTrigger = window.ScrollTrigger;

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   THREE.JS — Hero Particle Field
   Matches HeroSection.jsx → AmbientParticles pattern
   ═══════════════════════════════════════════════════════════════ */
function initHeroScene() {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x09090b);

  var camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000);
  camera.position.z = 1;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  var pCount = 2000;
  var positions = new Float32Array(pCount * 3);
  for (var i = 0; i < pCount; i++) {
    var r = Math.cbrt(Math.random()) * 1.5;
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var pMat = new THREE.PointsMaterial({
    color: 0xa1a1aa, size: 0.004, transparent: true,
    opacity: 0.6, sizeAttenuation: true, depthWrite: false,
  });
  var particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  var wMat = new THREE.MeshBasicMaterial({ color: 0xc8a97e, wireframe: true, transparent: true, opacity: 0.06 });
  var wCube1 = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), wMat);
  wCube1.position.set(16, -7, -12);
  scene.add(wCube1);
  var wCube2 = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.5, 3.5), wMat.clone());
  wCube2.material.opacity = 0.04;
  wCube2.position.set(-20, 9, -16);
  scene.add(wCube2);

  var orb = new THREE.Mesh(
    new THREE.SphereGeometry(12, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xc8a97e, transparent: true, opacity: 0.015 })
  );
  orb.position.set(0, 0, -25);
  scene.add(orb);

  var scrollY = 0;
  var onScroll = function() { scrollY = window.scrollY; };
  window.addEventListener('scroll', onScroll, { passive: true });

  function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.0004;
    particles.rotation.x = Math.sin(Date.now() * 0.0002) * 0.1;
    wCube1.rotation.x += 0.001;
    wCube1.rotation.y += 0.002;
    wCube2.rotation.x -= 0.0008;
    wCube2.rotation.y -= 0.0015;
    var targetY = -(scrollY * 0.0005);
    particles.position.y += (targetY - particles.position.y) * 0.05;
    renderer.render(scene, camera);
  }
  animate();

  gsap.to(particles.rotation, {
    z: 0.3,
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });
  gsap.to(wCube1.position, {
    y: -16,
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  var onResize = function() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  };
  window.addEventListener('resize', onResize);
}

/* ═══════════════════════════════════════════════════════════════
   THREE.JS — Closing Particle Field
   ═══════════════════════════════════════════════════════════════ */
function initClosingScene() {
  var canvas = document.getElementById('closing-canvas');
  if (!canvas) return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
  camera.position.z = 30;
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  var cpCount = 350;
  var cpPos = new Float32Array(cpCount * 3);
  for (var i = 0; i < cpCount; i++) {
    cpPos[i * 3]     = (Math.random() - 0.5) * 60;
    cpPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
    cpPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;
  }
  var cpGeo = new THREE.BufferGeometry();
  cpGeo.setAttribute('position', new THREE.BufferAttribute(cpPos, 3));
  var cpMat = new THREE.PointsMaterial({
    color: 0xc8a97e, size: 0.05, transparent: true,
    opacity: 0.25, sizeAttenuation: true,
  });
  var cParticles = new THREE.Points(cpGeo, cpMat);
  scene.add(cParticles);

  function animate() {
    requestAnimationFrame(animate);
    cParticles.rotation.y += 0.0002;
    cParticles.rotation.x += 0.0001;
    renderer.render(scene, camera);
  }
  animate();

  var onResize = function() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  };
  window.addEventListener('resize', onResize);
}

/* ═══════════════════════════════════════════════════════════════
   GSAP — Cinematic Animation System
   Slow, choreographed, hierarchy-driven reveals
   ═══════════════════════════════════════════════════════════════ */
function initScrollAnimations() {

  /* ─── HERO ENTRANCE ───
     Master timeline: eyebrow → headline → sub → CTA
     Each element waits for the previous to mostly finish
     Slow durations: 1.4s–2.0s per element */
  var heroTl = gsap.timeline({ delay: 0.4 });

  heroTl
    .fromTo('.hero-eyebrow',
      { opacity: 0, y: 30, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, ease: 'power3.out' }
    )
    .fromTo('.hero-title-v3',
      { opacity: 0, y: 60, filter: 'blur(12px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 2.0, ease: 'power3.out' },
      '-=0.8'   /* starts 0.8s before eyebrow finishes */
    )
    .fromTo('.hero-sub-v3',
      { opacity: 0, y: 40, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.8, ease: 'power3.out' },
      '-=1.0'   /* starts 1s before title finishes */
    )
    .fromTo('.hero-cta-v3',
      { opacity: 0, y: 35, scale: 0.9, filter: 'blur(6px)' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.6, ease: 'power3.out' },
      '-=0.8'
    );

  /* ─── COLLAGE ───
     Chapter label → statement → floating images
     Each with blur+opacity, slow stagger on images */
  gsap.fromTo('.collage-chapter-v3',
    { opacity: 0, y: 25, filter: 'blur(6px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out',
      scrollTrigger: { trigger: '#collage', start: 'top 72%' } }
  );

  gsap.fromTo('.collage-statement-v3',
    { opacity: 0, y: 50, filter: 'blur(10px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.8, ease: 'power3.out',
      scrollTrigger: { trigger: '#collage', start: 'top 65%', toggleActions: 'play none none reverse' } }
  );

  // Floating images: slow entrance + scroll parallax
  var floats = document.querySelectorAll('.collage-float-img');
  floats.forEach(function(el, i) {
    // Entrance — slow scale+opacity with blur
    gsap.fromTo(el,
      { opacity: 0, scale: 0.8, filter: 'blur(12px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 2.2, ease: 'power3.out',
        scrollTrigger: { trigger: '#collage', start: 'top 55%', toggleActions: 'play none none reverse' },
        delay: i * 0.25  /* each image waits 0.25s after the previous */
      }
    );
    // Parallax — different scrub speed per image
    gsap.to(el, {
      y: -(60 + i * 25),
      scrollTrigger: { trigger: '#collage', start: 'top bottom', end: 'bottom top', scrub: 1.5 + i * 0.4 }
    });
  });

  /* ─── OFFERINGS ───
     Label → title → cards in sequence
     Cards stagger with 0.3s gap, slow durations */
  gsap.fromTo('.offerings-chapter-v3',
    { opacity: 0, y: 25, filter: 'blur(6px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out',
      scrollTrigger: { trigger: '#offerings', start: 'top 78%' } }
  );

  gsap.fromTo('.offerings-title-v3',
    { opacity: 0, y: 40, filter: 'blur(8px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, ease: 'power3.out',
      scrollTrigger: { trigger: '#offerings', start: 'top 72%' } }
  );

  // Cards: sequential stagger, each slides up with blur fade
  gsap.fromTo('.offering-card-v3',
    { opacity: 0, y: 55, filter: 'blur(10px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, stagger: 0.3, ease: 'power3.out',
      scrollTrigger: { trigger: '.offerings-grid-v3', start: 'top 70%' } }
  );

  /* ─── VALUE PAUSE ───
     Label → headline → body text → image reveal
     Asymmetric split with slow image scale */
  gsap.fromTo('.value-chapter-v3',
    { opacity: 0, y: 25, filter: 'blur(6px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out',
      scrollTrigger: { trigger: '#value-pause', start: 'top 75%' } }
  );

  gsap.fromTo('.value-headline-v3',
    { opacity: 0, y: 50, filter: 'blur(10px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.8, ease: 'power3.out',
      scrollTrigger: { trigger: '#value-pause', start: 'top 68%' } }
  );

  gsap.fromTo('.value-body-v3',
    { opacity: 0, y: 35, filter: 'blur(6px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, ease: 'power3.out',
      scrollTrigger: { trigger: '#value-pause', start: 'top 62%' } }
  );

  // Right column image: slow scale reveal
  ScrollTrigger.create({
    trigger: '#value-pause', start: 'top 58%', toggleActions: 'play none none reverse',
    onEnter: function() {
      var img = document.getElementById('value-img');
      if (img) {
        gsap.to(img, { opacity: 1, scale: 1, duration: 2.2, ease: 'power3.out' });
      }
    }
  });

  /* ─── CLOSING ───
     Headline → CTA button, slow scale+fade */
  gsap.fromTo('.closing-title-v3',
    { opacity: 0, y: 50, scale: 0.92, filter: 'blur(10px)' },
    { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 2.0, ease: 'power3.out',
      scrollTrigger: { trigger: '#closing', start: 'top 68%' } }
  );

  gsap.fromTo('.closing-cta-v3',
    { opacity: 0, y: 35, scale: 0.9, filter: 'blur(6px)' },
    { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.6, ease: 'power3.out',
      scrollTrigger: { trigger: '#closing', start: 'top 58%' } }
  );
}

/* ═══════════════════════════════════════════════════════════════
   DATA — Extracted from zensrenovation.com
   ═══════════════════════════════════════════════════════════════ */
var DATA = {
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
      item_summary: "Extend your living space outdoors with custom-built decks and privacy fences. We use premium materials to create durable, stylish structures that enhance your home's curb appeal.",
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
   h() — JSX-like helper: h(tag, props, ...children)
   ═══════════════════════════════════════════════════════════════ */
function h(tag, props) {
  var children = [];
  for (var i = 2; i < arguments.length; i++) {
    var c = arguments[i];
    if (c !== null && c !== undefined && c !== false) {
      if (Array.prototype.push.apply(children, Array.isArray(c) ? c : [c]));
    }
  }
  if (typeof tag === 'function') {
    return tag(Object.assign({}, props || {}, { children: children.length === 1 ? children[0] : children }));
  }
  return React.createElement.apply(React, [tag, props].concat(children));
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 1 — HERO
   ═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  return h('section', { id: 'hero', style: { position:'relative', width:'100vw', height:'100vh', overflow:'hidden', background:'#09090b' } },
    h('canvas', { id: 'hero-canvas', style: { position:'absolute', inset:0, zIndex:0, width:'100%', height:'100%' } }),
    h('header', { style: { position:'absolute', top:0, left:0, width:'100%', padding:'1.5rem 3.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:10 } },
      h('img', { src: DATA.brand_identity_logo, alt: 'Zens Renovations', style: { height:'24px', width:'auto' } }),
      h('nav', { style: { display:'flex', gap:'2.5rem' }, className: 'nav-links' },
        h('a', { href:'#offerings', style:{ fontSize:'.75rem', letterSpacing:'.15em', textTransform:'uppercase', color:'#a1a1aa', textDecoration:'none', fontWeight:400, opacity:.8 } }, 'Services'),
        h('a', { href:'#value-pause', style:{ fontSize:'.75rem', letterSpacing:'.15em', textTransform:'uppercase', color:'#a1a1aa', textDecoration:'none', fontWeight:400, opacity:.8 } }, 'Process'),
        h('a', { href:'#closing', style:{ fontSize:'.75rem', letterSpacing:'.15em', textTransform:'uppercase', color:'#a1a1aa', textDecoration:'none', fontWeight:400, opacity:.8 } }, 'Contact')
      ),
      h('a', { href:'#closing', style:{ fontSize:'.75rem', letterSpacing:'.15em', textTransform:'uppercase', color:'#f4f4f5', textDecoration:'none', padding:'.6rem 1.4rem', border:'1px solid rgba(255,255,255,.15)' } }, 'Get Quote')
    ),
    h('div', { style: { position:'relative', width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'0 10%', textAlign:'center', zIndex:2 } },
      h('p', { className:'hero-eyebrow', style:{ fontSize:'.75rem', letterSpacing:'.3em', textTransform:'uppercase', color:'#c8a97e', marginBottom:'1.5rem', fontWeight:400, opacity:0, transform:'translateY(20px)' } }, 'Decks \u00b7 Fences \u00b7 Roofing'),
      h('h1', { className:'hero-title-v3', style:{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(2.5rem,6vw,5rem)', fontWeight:600, color:'#f4f4f5', letterSpacing:'-.03em', lineHeight:1.1, maxWidth:'900px', margin:'0 0 1.5rem', opacity:0, transform:'translateY(30px)' } }, DATA.hook_headline),
      h('p', { className:'hero-sub-v3', style:{ fontSize:'clamp(.9rem,1.2vw,1.1rem)', color:'#a1a1aa', maxWidth:'560px', lineHeight:1.7, fontWeight:300, margin:'0 0 3rem', opacity:0, transform:'translateY(20px)' } }, DATA.hook_context),
      h('button', {
        className:'hero-cta-v3',
        onClick: function() { document.getElementById('closing').scrollIntoView({ behavior:'smooth' }); },
        style:{ padding:'1rem 2.5rem', fontSize:'.85rem', letterSpacing:'.15em', textTransform:'uppercase', background:'transparent', color:'#c8a97e', border:'1px solid #c8a97e', cursor:'pointer', fontWeight:500, transition:'all .4s cubic-bezier(.16,1,.3,1)', opacity:0, transform:'translateY(20px)' }
      }, DATA.primary_action_label)
    )
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 2 — COLLAGE
   ═══════════════════════════════════════════════════════════════ */
function CollageIntroduction() {
  var imgs = DATA.collageImages.slice(0, 4);
  var positions = [
    { top:'10%', left:'3%', w:220, h:280, rot:'-4deg', z:-1 },
    { bottom:'5%', right:'2%', w:260, h:340, rot:'3deg', z:5 },
    { top:'5%', right:'5%', w:200, h:240, rot:'-2deg', z:-2 },
    { bottom:'8%', left:'8%', w:240, h:300, rot:'6deg', z:-1 },
  ];

  return h('section', { id:'collage', style:{ width:'100vw', minHeight:'100vh', padding:'12rem 4rem', background:'#09090b', color:'#f4f4f5', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' } },
    h('div', { style:{ position:'relative', width:'100%', maxWidth:'1200px', display:'flex', flexDirection:'column', alignItems:'center', zIndex:2 } },
      h('span', { className:'collage-chapter-v3', style:{ fontSize:'.75rem', letterSpacing:'.2em', color:'#71717a', textTransform:'uppercase', marginBottom:'3rem', display:'block', opacity:0, transform:'translateY(15px)' } }, '02 / Origin DNA'),
      h('h2', { className:'collage-statement-v3', style:{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(1.5rem,3.5vw,2.75rem)', fontWeight:400, lineHeight:1.4, textAlign:'center', maxWidth:'850px', color:'#f4f4f5', position:'relative', zIndex:10, margin:0, opacity:0, transform:'translateY(40px)' } }, DATA.introStatement),
      h('div', { style:{ position:'absolute', top:'-10%', left:0, width:'100%', height:'120%', pointerEvents:'none', zIndex:1 } },
        imgs.map(function(src, i) {
          var p = positions[i];
          return h('div', { key:i, className:'collage-float-img', style:{ position:'absolute', top:p.top, left:p.left, right:p.right, bottom:p.bottom, width:p.w, height:p.h, opacity:0, transform:'rotate(' + p.rot + ') scale(.95)', zIndex:p.z, borderRadius:'4px', overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,.5)' } },
            h('img', { src:src, alt:'Context ' + i, style:{ width:'100%', height:'100%', objectFit:'cover', filter:'grayscale(100%) contrast(1.05)' } })
          );
        })
      )
    )
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 3 — OFFERINGS
   ═══════════════════════════════════════════════════════════════ */
function StaticOfferingsGrid() {
  var items = DATA.offering_units.slice(0, 4);

  return h('section', { id:'offerings', style:{ width:'100vw', padding:'10rem 4rem', background:'#09090b', color:'#f4f4f5', display:'flex', flexDirection:'column', alignItems:'center' } },
    h('div', { style:{ width:'100%', maxWidth:'1400px', marginBottom:'5rem' } },
      h('span', { className:'offerings-chapter-v3', style:{ fontSize:'.75rem', letterSpacing:'.2em', textTransform:'uppercase', color:'#71717a', display:'block', marginBottom:'1rem', opacity:0, transform:'translateY(15px)' } }, '03 / Capabilities Matrix'),
      h('h2', { className:'offerings-title-v3', style:{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(1.8rem,3vw,2.5rem)', fontWeight:500, color:'#f4f4f5', opacity:0, transform:'translateY(20px)' } }, 'What We Build'),
      h('div', { style:{ width:'40px', height:'1px', background:'#27272a', marginTop:'1.5rem' } })
    ),
    h('div', { className:'offerings-grid-v3', style:{ width:'100%', maxWidth:'1400px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'2px', background:'#27272a' } },
      items.map(function(item, i) {
        return h('div', { key:i, className:'offering-card-v3', style:{ background:'#09090b', padding:'3.5rem 2.5rem', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:'420px', transition:'background .3s ease', opacity:0, transform:'translateY(30px)' } },
          h('div', null,
            h('div', { style:{ width:'100%', height:'180px', overflow:'hidden', marginBottom:'2.5rem', background:'#18181b', position:'relative' } },
              item.item_cover_url
                ? h('img', { src:item.item_cover_url, alt:item.item_title, style:{ width:'100%', height:'100%', objectFit:'cover', filter:'grayscale(100%) contrast(1.1)', transition:'filter .5s ease' } })
                : h('div', { style:{ width:'100%', height:'100%', background:'linear-gradient(135deg,#18181b,#27272a)', opacity:.6 } })
            ),
            h('h3', { style:{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'1.25rem', fontWeight:500, marginBottom:'1rem', color:'#f4f4f5' } }, item.item_title),
            h('p', { style:{ fontSize:'.9rem', color:'#a1a1aa', lineHeight:1.7, fontWeight:300 } }, item.item_summary)
          )
        );
      })
    )
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 4 — VALUE PAUSE
   ═══════════════════════════════════════════════════════════════ */
function TwoColumnValuePause() {
  return h('section', { id:'value-pause', style:{ width:'100vw', minHeight:'90vh', padding:'6rem 4rem', background:'#09090b', color:'#f4f4f5', display:'flex', alignItems:'center', justifyContent:'center' } },
    h('div', { style:{ width:'100%', maxWidth:'1400px', display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:'6rem', alignItems:'center' } },
      h('div', { style:{ display:'flex', flexDirection:'column', alignItems:'flex-start' } },
        h('span', { className:'value-chapter-v3', style:{ fontSize:'.75rem', letterSpacing:'.2em', color:'#71717a', textTransform:'uppercase', marginBottom:'2rem', display:'block', opacity:0, transform:'translateY(15px)' } }, '04 / Value Paradigm'),
        h('h2', { className:'value-headline-v3', style:{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:500, lineHeight:1.3, color:'#f4f4f5', margin:'0 0 2.5rem', opacity:0, transform:'translateY(30px)' } }, DATA.philosophy_anchor),
        h('p', { className:'value-body-v3', style:{ fontSize:'1.05rem', color:'#a1a1aa', lineHeight:1.7, fontWeight:300, maxWidth:'550px', margin:0, opacity:0, transform:'translateY(20px)' } }, DATA.philosophy_deep_dive)
      ),
      h('div', { style:{ width:'100%', height:'500px', background:'#18181b', overflow:'hidden', position:'relative' } },
        h('img', { id:'value-img', src:DATA.singular_master_visual, alt:'Craftsmanship', style:{ width:'100%', height:'100%', objectFit:'cover', filter:'grayscale(100%) contrast(1.05)', opacity:0, transform:'scale(1.1)', transition:'opacity 1.5s cubic-bezier(.16,1,.3,1), transform 1.5s cubic-bezier(.16,1,.3,1)' } })
      )
    )
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 5 — CLOSING
   ═══════════════════════════════════════════════════════════════ */
function ClosingCallToAction() {
  var ess = DATA.baseline_essentials;

  return h('section', { id:'closing', style:{ position:'relative', width:'100vw', height:'100vh', background:'#09090b', color:'#f4f4f5', display:'flex', flexDirection:'column', justifyContent:'space-between', overflow:'hidden' } },
    h('canvas', { id:'closing-canvas', style:{ position:'absolute', inset:0, zIndex:0, width:'100%', height:'100%' } }),
    h('div', { style:{ width:'100%', padding:'3rem 4rem 0', display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:2 } },
      h('span', { style:{ fontSize:'.75rem', letterSpacing:'.2em', color:'#71717a' } }, '05 / Terminal Conversion'),
      h('div', { style:{ width:'100px', height:'1px', background:'#27272a' } })
    ),
    h('div', { style:{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'0 10%', zIndex:2 } },
      h('h2', { className:'closing-title-v3', style:{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(2rem,5vw,4rem)', fontWeight:600, letterSpacing:'-.02em', color:'#f4f4f5', marginBottom:'2rem', maxWidth:'800px', opacity:0, transform:'translateY(30px)' } }, DATA.closing_invitation),
      h('button', {
        className:'closing-cta-v3',
        onClick: function() { window.location.href = 'tel:4374105329'; },
        style:{ padding:'1.2rem 3.5rem', fontSize:'.9rem', letterSpacing:'.2em', textTransform:'uppercase', background:'#c8a97e', color:'#09090b', border:'none', cursor:'pointer', fontWeight:600, transition:'transform .2s cubic-bezier(.16,1,.3,1), box-shadow .3s ease', opacity:0, transform:'translateY(20px)' }
      }, DATA.target_conversion_label)
    ),
    h('div', { style:{ width:'100%', padding:'0 4rem 3rem', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'.8rem', color:'#71717a', letterSpacing:'.05em', zIndex:2 } },
      h('span', null, ess.corporate_copyright),
      h('span', null, ess.direct_contact_strings)
    )
  );
}

/* ═══════════════════════════════════════════════════════════════
   GENERATED SCENE — 5-chapter composition
   ═══════════════════════════════════════════════════════════════ */
function GeneratedScene() {
  React.useEffect(function() {
    initHeroScene();
    initClosingScene();
    initScrollAnimations();
    setTimeout(function() {
      var loader = document.getElementById('loader');
      if (loader) loader.classList.add('done');
    }, 600);
  }, []);

  return React.createElement(React.Fragment, null,
    React.createElement(HeroSection),
    React.createElement(CollageIntroduction),
    React.createElement(StaticOfferingsGrid),
    React.createElement(TwoColumnValuePause),
    React.createElement(ClosingCallToAction)
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOUNT
   ═══════════════════════════════════════════════════════════════ */
ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(GeneratedScene)
);

})();
