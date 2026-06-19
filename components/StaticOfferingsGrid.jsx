import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   STATIC OFFERINGS GRID — Strict Symmetric Service Matrix
   GSAP staggered reveals + 3D card hover depth
   ═══════════════════════════════════════════════════════════════ */
export default function StaticOfferingsGrid({ offering_units = [] }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const cardRefs = useRef([]);

  const displayedItems = offering_units.slice(0, 4);
  const itemCount = displayedItems.length;

  const getGridTemplateColumns = () => {
    if (itemCount >= 4) return 'repeat(4, 1fr)';
    if (itemCount === 3) return 'repeat(3, 1fr)';
    if (itemCount === 2) return 'repeat(2, 1fr)';
    return '1fr';
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveals
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 15 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );

      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );

      // Card staggered entrance
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
            delay: i * 0.12,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="offerings"
      style={{
        width: '100vw', padding: '10rem 4rem', background: '#09090b',
        color: '#f4f4f5', display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}
    >
      {/* Header */}
      <div ref={headerRef} style={{
        width: '100%', maxWidth: '1400px', marginBottom: '5rem', opacity: 0,
      }}>
        <span style={{
          fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase',
          color: '#71717a', display: 'block', marginBottom: '1rem',
        }}>
          03 / Capabilities Matrix
        </span>
        <h2 ref={titleRef} style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 500,
          color: '#f4f4f5', opacity: 0,
        }}>
          What We Build
        </h2>
        <div style={{ width: '40px', height: '1px', background: '#27272a', marginTop: '1.5rem' }} />
      </div>

      {/* Grid */}
      <div style={{
        width: '100%', maxWidth: '1400px', display: 'grid',
        gridTemplateColumns: getGridTemplateColumns(),
        gap: '2px', background: '#27272a',
      }}>
        {displayedItems.map((item, index) => (
          <div
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            style={{
              background: '#09090b', padding: '3.5rem 2.5rem',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              minHeight: '420px', transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              opacity: 0, cursor: 'default',
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, { y: -6, duration: 0.3, ease: 'power2.out' });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { y: 0, duration: 0.3, ease: 'power2.out' });
            }}
          >
            <div>
              {/* Cover image */}
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
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', color: '#f4f4f5',
              }}>
                {item.item_title}
              </h3>

              <p style={{ fontSize: '0.9rem', color: '#a1a1aa', lineHeight: 1.7, fontWeight: 300 }}>
                {item.item_summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}