import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   COLLAGE INTRODUCTION — Artistic Overlapping Depth Narrative
   GSAP scroll-linked parallax on floating images at variable speeds
   ═══════════════════════════════════════════════════════════════ */
export default function CollageIntroduction({ introStatement, collageImages = [] }) {
  const sectionRef = useRef(null);
  const chapterRef = useRef(null);
  const statementRef = useRef(null);
  const imgRefs = useRef([]);

  const displayedImages = collageImages.slice(0, 4);

  const positions = [
    { top: '10%', left: '3%', w: 220, h: 280, rot: -4, z: -1, speed: 1.0 },
    { bottom: '5%', right: '2%', w: 260, h: 340, rot: 3, z: 5, speed: 1.4 },
    { top: '5%', right: '5%', w: 200, h: 240, rot: -2, z: -2, speed: 0.8 },
    { bottom: '8%', left: '8%', w: 240, h: 300, rot: 6, z: -1, speed: 1.7 },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Chapter label reveal
      gsap.fromTo(chapterRef.current,
        { opacity: 0, y: 15 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );

      // Statement split-word reveal
      if (statementRef.current && introStatement) {
        const words = introStatement.split(' ');
        statementRef.current.innerHTML = words
          .map(word => `<span style="display:inline-block;opacity:0;transform:translateY(20px)">${word}</span>`)
          .join(' ');

        gsap.to(statementRef.current.querySelectorAll('span'), {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        });
      }

      // Floating images entrance + parallax
      imgRefs.current.forEach((el, i) => {
        if (!el) return;

        // Entrance
        gsap.fromTo(el,
          { opacity: 0, scale: 0.92 },
          {
            opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none reverse' },
          }
        );

        // Scroll-linked parallax — different speed per image for depth
        const p = positions[i];
        gsap.to(el, {
          y: -(40 + i * 15),
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom', end: 'bottom top',
            scrub: p.speed,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [introStatement]);

  return (
    <section
      ref={sectionRef}
      id="collage"
      style={{
        width: '100vw', minHeight: '100vh', padding: '12rem 4rem',
        background: '#09090b', color: '#f4f4f5',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{
        position: 'relative', width: '100%', maxWidth: '1200px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2,
      }}>
        <span ref={chapterRef} className="chapter-label" style={{
          marginBottom: '3rem', opacity: 0,
        }}>
          02 / Origin DNA
        </span>

        <h2 ref={statementRef} style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(1.5rem, 3.5vw, 2.75rem)', fontWeight: 400,
          lineHeight: 1.4, textAlign: 'center', maxWidth: '850px',
          color: '#f4f4f5', position: 'relative', zIndex: 10, margin: 0,
        }}>
          {introStatement || 'Defining systemic spatial efficiency through unyielding execution structures.'}
        </h2>

        {/* Floating collage images */}
        <div style={{
          position: 'absolute', top: '-10%', left: 0, width: '100%', height: '120%',
          pointerEvents: 'none', zIndex: 1,
        }}>
          {displayedImages.map((src, i) => {
            const p = positions[i];
            return (
              <div
                key={i}
                ref={(el) => (imgRefs.current[i] = el)}
                style={{
                  position: 'absolute',
                  top: p.top, left: p.left, right: p.right, bottom: p.bottom,
                  width: p.w, height: p.h,
                  opacity: 0, transform: `rotate(${p.rot}deg) scale(0.92)`,
                  zIndex: p.z, borderRadius: '4px', overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}
              >
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