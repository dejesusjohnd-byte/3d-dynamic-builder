import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION_PROFILES } from './motion_registry';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   MASTERCLASS HERO ENGINE — Video & Spatial Depth Matrix
   Targeted for seamless human/Claude V1 assembly injection.
   ═══════════════════════════════════════════════════════════════ */
export default function HeroSection({ 
  hook_headline, 
  hook_context, 
  primary_action_label = "Initiate",
  motion_tempo = "slow_luxury", // "slow_luxury" | "kinetic_modern"
  depth_layer_one_url = "",      // Member 2's AI Video loop or primary background image
  depth_layer_two_url = "",      // Midground overlay asset
  depth_layer_three_url = ""     // Foreground atmospheric asset
}) {
  const containerRef = useRef(null);
  const textGroupRef = useRef(null);
  const mediaContainerRef = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Dynamic luxury adjustments sourced from motion_registry
    const { duration, ease, stagger } = MOTION_PROFILES[motion_tempo] || MOTION_PROFILES.slow_luxury;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      // Phase 1: Reveal canvas background elements
      tl.fromTo([mediaContainerRef.current, layer2Ref.current, layer3Ref.current],
        { opacity: 0, scale: 1.15, filter: 'blur(15px)' },
        { opacity: 0.4, scale: 1, filter: 'blur(0px)', duration: duration, ease: ease }
      );

      // Phase 2: Headline attention sequencing
      tl.fromTo('.masterclass-reveal-text',
        { opacity: 0, y: 60, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: duration, ease: ease, stagger: stagger },
        "-=1.4"
      );

      // Phase 3: Immediate action layout trigger
      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: duration, ease: ease },
        "-=0.8"
      );

      // SCROLL-LINKED PHYSICS MATRIX: The Neverland Parallax Zoom
      gsap.to(mediaContainerRef.current, {
        scale: 1.4,
        y: -100,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      if (depth_layer_two_url) {
        gsap.to(layer2Ref.current, {
          scale: 1.25,
          y: -50,
          scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: true }
        });
      }

      if (depth_layer_three_url) {
        gsap.to(layer3Ref.current, {
          scale: 1.1,
          y: 20,
          scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: true }
        });
      }

      // Prevent text readability clashes during travel velocity
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
  }, [motion_tempo, depth_layer_two_url, depth_layer_three_url]);

  // Helper logic to dynamically render background layers as Video or Image
  const isVideoAsset = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)/i) || url.includes('video');
  };

  return React.createElement('section', {
    ref: containerRef,
    style: {
      position: 'relative', width: '100vw', height: '100vh',
      backgroundColor: '#09090b', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', padding: '0 6rem'
    }
  },
    // LAYER 1: Multi-Modal Deep Spatial Background (Supports AI Video Loops)
    React.createElement('div', {
      ref: mediaContainerRef,
      style: {
        position: 'absolute', inset: 0, zIndex: 1,
        filter: 'grayscale(100%) opacity(0.2) contrast(1.15)', pointerEvents: 'none'
      }
    },
      isVideoAsset(depth_layer_one_url) ? (
        React.createElement('video', {
          src: depth_layer_one_url,
          autoPlay: true, loop: true, muted: true, playsInline: true,
          style: { width: '100%', height: '100%', objectFit: 'cover' }
        })
      ) : (
        React.createElement('div', {
          style: {
            width: '100%', height: '100%',
            backgroundImage: `url(${depth_layer_one_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80'})`,
            backgroundSize: 'cover', backgroundPosition: 'center'
          }
        })
      )
    ),

    // LAYER 2: Midground Structural Asset
    depth_layer_two_url && React.createElement('div', {
      ref: layer2Ref,
      style: {
        position: 'absolute', inset: 0, zIndex: 2,
        backgroundImage: `url(${depth_layer_two_url})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'grayscale(100%) opacity(0.25)', pointerEvents: 'none'
      }
    }),

    // LAYER 3: Foreground Atmospheric Asset
    depth_layer_three_url && React.createElement('div', {
      ref: layer3Ref,
      style: {
        position: 'absolute', inset: 0, zIndex: 3,
        backgroundImage: `url(${depth_layer_three_url})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'grayscale(100%) opacity(0.3)', pointerEvents: 'none'
      }
    }),

    // FRONT COMPOSITION LAYER
    React.createElement('div', {
      ref: textGroupRef,
      style: {
        position: 'relative', zIndex: 10, textAlign: 'center',
        maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center'
      }
    },
      React.createElement('span', {
        className: 'masterclass-reveal-text chapter-label',
        style: { marginBottom: '2rem', color: '#71717a', letterSpacing: '0.25em', fontSize: '0.75rem' }
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
      }, primary_action_label)
    )
  );
}