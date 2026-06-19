import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   MASTERCLASS VALUE PAUSE — Asymmetric Trust Core & 3D Detector
   Inspired by Quin Global Tax Law & Refokus: Micro-White Space
   ═══════════════════════════════════════════════════════════════ */
export default function TwoColumnValuePause({
  philosophy_anchor,
  philosophy_deep_dive,
  singular_master_visual,
  sketchfab_embed_uid
}) {
  const sectionRef = useRef(null);
  const textColumnRef = useRef(null);
  const visualFrameRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // CINEMATIC CHARACTER/LINE STAGGER: Headline reveals itself elegantly as user scroll triggers it
      gsap.fromTo('.value-reveal-node',
        { opacity: 0, y: 40, filter: 'blur(10px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 1.4,
          stagger: 0.15, // Rigid cadence sequence matching Module 4 Episode 3
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // VISUAL FRAME PARALLAX: The right column asset scales down slightly and slips on scroll travel
      gsap.fromTo(visualFrameRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1, scale: 1, duration: 1.6, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, [philosophy_anchor]);

  return React.createElement('section', {
    ref: sectionRef,
    style: {
      position: 'relative',
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#09090b',
      padding: '12rem 6rem', // Premium generous margins to enforce breathing room
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderTop: '1px solid #1c1c1e',
      overflow: 'hidden'
    }
  },
    // Split Screen Layout Grid Container
    React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: '6rem',
        width: '100%',
        maxWidth: '1200px',
        alignItems: 'center'
      }
    },
      
      // LEFT COLUMN: High-Contrast Editorial Messaging
      React.createElement('div', {
        ref: textColumnRef,
        style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }
      },
        React.createElement('span', {
          className: 'value-reveal-node chapter-label',
          style: { color: '#71717a', marginBottom: '2.5rem' }
        }, "04 / GUIDING PARADIGM"),
        
        philosophy_anchor && React.createElement('h2', {
          className: 'value-reveal-node',
          style: {
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'calc(2rem + 1vw)', color: '#f4f4f5',
            lineHeight: 1.35, fontWeight: 400, letterSpacing: '-0.01em', margin: '0 0 2.5rem'
          }
        }, `"${philosophy_anchor}"`),

        philosophy_deep_dive && React.createElement('p', {
          className: 'value-reveal-node',
          style: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '1.05rem', color: '#a1a1aa',
            lineHeight: 1.8, fontWeight: 300, maxWidth: '520px', margin: 0
          }
        }, philosophy_deep_dive)
      ),

      // RIGHT COLUMN: Dynamic 3D Spatial Gateway Node
      React.createElement('div', {
        ref: visualFrameRef,
        style: {
          width: '100%',
          height: '550px',
          backgroundColor: '#141416',
          border: '1px solid #27272a',
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 40px 90px rgba(0,0,0,0.7)'
        }
      },
        // DYNAMIC EMULATION GATEWAY: Check for Sketchfab input tokens
        sketchfab_embed_uid ? (
          // If 3D link exists, instantly spawn responsive, un-cluttered iframe framework
          React.createElement('iframe', {
            title: "Spatial Asset Environment View",
            src: `https://sketchfab.com/models/${sketchfab_embed_uid}/embed?autostart=1&internal=1&tracking=0&ui_controls=0&ui_infos=0&ui_watermark=0&preload=1`,
            style: { width: '100%', height: '100%', border: '0' },
            allow: "autoplay; fullscreen; vr; xr-spatial-tracking"
          })
        ) : (
          // Default Fallback: Static Luxury Monochrome Structural Frame
          React.createElement('img', {
            src: singular_master_visual || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            alt: "System Architecture Visual",
            style: {
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'grayscale(100%) contrast(1.1) brightness(0.7)'
            }
          })
        )
      )
    )
  );
}