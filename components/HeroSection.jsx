import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   MASTERCLASS HERO ENGINE — The Neverland Depth Physics Matrix
   Translates luxury movement tokens into a zero-hallucination script
   ═══════════════════════════════════════════════════════════════ */
export default function HeroSection({ 
  hook_headline, 
  hook_context, 
  primary_action_label,
  // Brand Configuration Tokens — Injected by AI based on Client Type
  motion_tempo = "slow_luxury", // "slow_luxury" | "kinetic_modern"
  depth_layer_one_url = "",      // Deep Background asset
  depth_layer_two_url = "",      // Midground structural asset
  depth_layer_three_url = ""     // Foreground overlay asset
}) {
  const containerRef = useRef(null);
  const textGroupRef = useRef(null);
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Dynamically assign luxury easing curves based on Brand Tempo token
    const luxuryEase = "cubic-bezier(0.16, 1, 0.3, 1)"; // Premium Masterclass curve
    const durationToken = motion_tempo === "slow_luxury" ? 2.2 : 1.4;

    const ctx = gsap.context(() => {
      // INTENTIONAL SEQUENCING: Elements enter the viewport step-by-step
      const tl = gsap.timeline();
      
      // Phase 1: Subtle reveal of the spatial depth canvas layers
      tl.fromTo([layer1Ref.current, layer2Ref.current, layer3Ref.current],
        { opacity: 0, scale: 1.15, filter: 'blur(15px)' },
        { opacity: 0.4, scale: 1, filter: 'blur(0px)', duration: durationToken, ease: 'power4.out' }
      );

      // Phase 2: Headline Line-by-Line Split Reveal (Controls User Attention)
      tl.fromTo('.masterclass-reveal-text',
        { opacity: 0, y: 60, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, ease: 'power4.out', stagger: 0.15 },
        "-=1.4"
      );

      // Phase 3: Delayed fade-in of the Core Call To Action Node
      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        "-=0.8"
      );

      // THE SCROLL-LINKED PHYSICS MATRIX: Implements the Neverland Depth Zoom
      // As the user travels downward, the background layers pass the camera at varying rates
      gsap.to(layer1Ref.current, {
        scale: 1.4,
        y: -100,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(layer2Ref.current, {
        scale: 1.25,
        y: -50,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(layer3Ref.current, {
        scale: 1.1,
        y: 20,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // Subtle parallax fade on the text group to prevent legibility conflict
      gsap.to(textGroupRef.current, {
        opacity: 0,
        y: -60,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "40% top",
          scrub: true
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [motion_tempo]);

  // Pure React Component Structural Render
  return React.createElement('section', {
    ref: containerRef,
    style: {
      position: 'relative',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#09090b',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 6rem' // Generous white space margin
    }
  },
    // LAYER 1: Deep Spatial Background
    React.createElement('div', {
      ref: layer1Ref,
      style: {
        position: 'absolute', inset: 0, zIndex: 1,
        backgroundImage: `url(${depth_layer_one_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80'})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'grayscale(100%) opacity(0.15) contrast(1.1)', pointerEvents: 'none'
      }
    }),

    // LAYER 2: Midground Spatial Architecture
    React.createElement('div', {
      ref: layer2Ref,
      style: {
        position: 'absolute', inset: 0, zIndex: 2,
        backgroundImage: `url(${depth_layer_two_url})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'grayscale(100%) opacity(0.25)', pointerEvents: 'none',
        display: depth_layer_two_url ? 'block' : 'none'
      }
    }),

    // LAYER 3: Foreground Atmospheric Overlay
    React.createElement('div', {
      ref: layer3Ref,
      style: {
        position: 'absolute', inset: 0, zIndex: 3,
        backgroundImage: `url(${depth_layer_three_url})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'grayscale(100%) opacity(0.3)', pointerEvents: 'none',
        display: depth_layer_three_url ? 'block' : 'none'
      }
    }),

    // CENTRAL TYPOGRAPHY BLOCK (Locked at high z-index layout layer for maximum readability)
    React.createElement('div', {
      ref: textGroupRef,
      style: {
        position: 'relative', zIndex: 10, textAlign: 'center',
        maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center'
      }
    },
      React.createElement('span', {
        className: 'masterclass-reveal-text chapter-label',
        style: { marginBottom: '2rem', color: '#71717a' }
      }, "01 / PRINCIPAL ARRIVAL"),

      hook_headline && React.createElement('h1', {
        className: 'masterclass-reveal-text',
        style: {
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'calc(2.5rem + 2vw)', color: '#f4f4f5',
          lineHeight: 1.15, fontWeight: 400, letterSpacing: '-0.02em', margin: '0 0 2rem'
        }
      }, hook_headline),

      hook_context && React.createElement('p', {
        className: 'masterclass-reveal-text',
        style: {
          fontFamily: "'Inter', sans-serif",
          fontSize: '1.05rem', color: '#a1a1aa',
          lineHeight: 1.7, fontWeight: 300, maxWidth: '600px', margin: '0 0 3.5rem'
        }
      }, hook_context),

      // MICRO-INTERACTION CONTROL GATE: The Button acknowledges cursor presence seamlessly
      React.createElement('button', {
        ref: ctaRef,
        onMouseEnter: (e) => {
          gsap.to(e.currentTarget, { scale: 1.05, borderColor: '#f4f4f5', color: '#f4f4f5', duration: 0.35, ease: 'power2.out' });
        },
        onMouseLeave: (e) => {
          gsap.to(e.currentTarget, { scale: 1, borderColor: '#c8a97e', color: '#c8a97e', duration: 0.35, ease: 'power2.out' });
        },
        style: {
          padding: '1.1rem 3rem', fontSize: '0.8rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', background: 'transparent', color: '#c8a97e',
          border: '1px solid #c8a97e', cursor: 'pointer', fontWeight: 500,
          transition: 'background 0.3s ease', outline: 'none'
        }
      }, primary_action_label || "Initiate")
    )
  );
}