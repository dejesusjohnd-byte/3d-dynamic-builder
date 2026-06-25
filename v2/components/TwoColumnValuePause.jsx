import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION_PROFILES } from './motion_registry';

gsap.registerPlugin(ScrollTrigger);

export default function TwoColumnValuePause({
  philosophy_anchor,
  philosophy_deep_dive,
  singular_master_visual,
  sketchfab_embed_uid,
  motion_tempo = 'slow_luxury'
}) {
  const sectionRef = useRef(null);
  const visualFrameRef = useRef(null);

  useEffect(() => {
    const { duration, ease, stagger } = MOTION_PROFILES[motion_tempo] || MOTION_PROFILES.slow_luxury;

    const ctx = gsap.context(() => {
      gsap.fromTo('.value-reveal-node',
        { opacity: 0, y: 40, filter: 'blur(10px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: duration, stagger: stagger, ease: ease,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' }
        }
      );

      gsap.fromTo(visualFrameRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1, scale: 1, duration: duration, ease: ease,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [philosophy_anchor, motion_tempo]);

  const isVideoAsset = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)/i) || url.includes('video');
  };

  return React.createElement('section', {
    ref: sectionRef,
    style: {
      position: 'relative', width: '100vw', minHeight: '100vh',
      backgroundColor: '#09090b', padding: '12rem 6rem', display: 'flex',
      justifyContent: 'center', alignItems: 'center', borderTop: '1px solid #1c1c1e',
      overflow: 'hidden'
    }
  },
    React.createElement('div', {
      style: {
        display: 'grid', gridTemplateColumns: '1.1fr 0.9fr',
        gap: '6rem', width: '100%', maxWidth: '1200px', alignItems: 'center'
      }
    },
      React.createElement('div', {
        style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }
      },
        React.createElement('span', {
          className: 'value-reveal-node chapter-label',
          style: { color: '#71717a', marginBottom: '2.5rem', display: 'block', letterSpacing: '0.25em', fontSize: '0.75rem' }
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
            fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', color: '#a1a1aa',
            lineHeight: 1.8, fontWeight: 300, maxWidth: '520px', margin: 0
          }
        }, philosophy_deep_dive)
      ),

      React.createElement('div', {
        ref: visualFrameRef,
        style: {
          width: '100%', height: '550px', backgroundColor: '#141416',
          border: '1px solid #27272a', borderRadius: '2px', overflow: 'hidden',
          position: 'relative', boxShadow: '0 40px 90px rgba(0,0,0,0.7)'
        }
      },
        sketchfab_embed_uid ? (
          React.createElement('iframe', {
            title: "Spatial Asset Environment View",
            src: `https://sketchfab.com/models/${sketchfab_embed_uid}/embed?autostart=1&internal=1&tracking=0&ui_controls=0&ui_infos=0&ui_watermark=0&preload=1`,
            style: { width: '100%', height: '100%', border: '0' },
            allow: "autoplay; fullscreen; vr; xr-spatial-tracking"
          })
        ) : isVideoAsset(singular_master_visual) ? (
          React.createElement('video', {
            src: singular_master_visual, autoPlay: true, loop: true, muted: true, playsInline: true,
            style: { width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.1) brightness(0.7)' }
          })
        ) : (
          React.createElement('img', {
            src: singular_master_visual || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            alt: "System Architecture Visual",
            style: { width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.1) brightness(0.7)' }
          })
        )
      )
    )
  );
}