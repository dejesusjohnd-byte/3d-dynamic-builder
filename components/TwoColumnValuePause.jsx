import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   TWO COLUMN VALUE PAUSE — Asymmetric Authoritative Trust Core
   GSAP split-text reveal on headline + Sketchfab embed or image
   ═══════════════════════════════════════════════════════════════ */
export default function TwoColumnValuePause({
  philosophy_anchor,
  philosophy_deep_dive,
  singular_master_visual,
  sketchfab_embed_uid,
}) {
  const sectionRef = useRef(null);
  const chapterRef = useRef(null);
  const headlineRef = useRef(null);
  const bodyRef = useRef(null);
  const visualRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Chapter label
      gsap.fromTo(chapterRef.current,
        { opacity: 0, y: 15 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );

      // Split-text reveal on headline
      if (headlineRef.current && philosophy_anchor) {
        const chars = philosophy_anchor.split('');
        headlineRef.current.innerHTML = chars
          .map(char => `<span style="display:inline-block;opacity:0">${char === ' ' ? '&nbsp;' : char}</span>`)
          .join('');

        gsap.to(headlineRef.current.querySelectorAll('span'), {
          opacity: 1, duration: 0.4, stagger: 0.02, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        });
      }

      // Body text
      gsap.fromTo(bodyRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
          delay: 0.3,
        }
      );

      // Right visual — scale reveal
      gsap.fromTo(visualRef.current,
        { opacity: 0, scale: 1.08 },
        {
          opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
          delay: 0.2,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [philosophy_anchor]);

  return (
    <section
      ref={sectionRef}
      id="value-pause"
      style={{
        width: '100vw', minHeight: '90vh', padding: '6rem 4rem',
        background: '#09090b', color: '#f4f4f5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{
        width: '100%', maxWidth: '1400px', display: 'grid',
        gridTemplateColumns: '1.2fr 1fr', gap: '6rem', alignItems: 'center',
      }}>
        {/* Left Column — Text */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span ref={chapterRef} style={{
            fontSize: '0.7rem', letterSpacing: '0.25em', color: '#71717a',
            textTransform: 'uppercase', marginBottom: '2rem', display: 'block', opacity: 0,
          }}>
            04 / Value Paradigm
          </span>

          <h2 ref={headlineRef} style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 500,
            lineHeight: 1.3, color: '#f4f4f5', margin: '0 0 2.5rem',
          }}>
            {philosophy_anchor || 'Execution architecture dictates product longevity.'}
          </h2>

          {philosophy_deep_dive && (
            <p ref={bodyRef} style={{
              fontSize: '1.05rem', color: '#a1a1aa', lineHeight: 1.7,
              fontWeight: 300, maxWidth: '550px', margin: 0, opacity: 0,
            }}>
              {philosophy_deep_dive}
            </p>
          )}
        </div>

        {/* Right Column — Visual */}
        <div ref={visualRef} style={{
          width: '100%', height: '500px', background: '#18181b',
          overflow: 'hidden', position: 'relative', opacity: 0,
        }}>
          {sketchfab_embed_uid ? (
            <iframe
              src={`https://sketchfab.com/models/${sketchfab_embed_uid}/embed?autospin=0.2&autostart=1&preload=1`}
              title="3D Model"
              style={{
                width: '100%', height: '100%', border: 'none',
              }}
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
            />
          ) : singular_master_visual ? (
            <img
              src={singular_master_visual}
              alt="System Blueprint Focus"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                filter: 'grayscale(100%) contrast(1.05)',
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(180deg, #18181b, #27272a)', opacity: 0.5,
            }} />
          )}
        </div>
      </div>
    </section>
  );
}