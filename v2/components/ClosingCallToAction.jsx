import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION_PROFILES } from './motion_registry';

gsap.registerPlugin(ScrollTrigger);

function GoldAmbientParticles() {
  const pointsRef = useRef();
  const particlePositions = React.useMemo(() => {
    const arr = new Float32Array(350 * 3);
    for (let i = 0; i < 350; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 45;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 45;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return arr;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.015;
      pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.01;
    }
  });

  return React.createElement('points', { ref: pointsRef },
    React.createElement('bufferGeometry', null,
      React.createElement('bufferAttribute', { attach: 'attributes-position', args: [particlePositions, 3] })
    ),
    React.createElement('pointsMaterial', {
      color: '#c8a97e', size: 0.045, sizeAttenuation: true,
      transparent: true, opacity: 0.35, blending: 2
    })
  );
}

export default function ClosingCallToAction({
  closing_invitation,
  target_conversion_label,
  corporate_copyright,
  direct_contact_strings,
  motion_tempo = 'slow_luxury'
}) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const actionButtonRef = useRef(null);

  useEffect(() => {
    const { duration, ease } = MOTION_PROFILES[motion_tempo] || MOTION_PROFILES.slow_luxury;

    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, scale: 0.95, y: 30, filter: 'blur(8px)' },
        {
          opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
          duration: duration, ease: ease,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
        }
      );

      gsap.fromTo(actionButtonRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: duration, ease: ease, delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [closing_invitation, motion_tempo]);

  return React.createElement('section', {
    ref: sectionRef,
    style: {
      position: 'relative', width: '100vw', height: '100vh',
      backgroundColor: '#09090b', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'
    }
  },
    React.createElement('div', {
      style: { position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }
    },
      React.createElement(Canvas, {
        camera: { fov: 60, position: [0, 0, 10] },
        gl: { antialias: true, alpha: true }
      },
        React.createElement(GoldAmbientParticles, null)
      )
    ),

    React.createElement('div', {
      style: { width: '100%', padding: '4rem 6rem 0', zIndex: 5, textAlign: 'center' }
    },
      React.createElement('div', { style: { width: '100%', height: '1px', backgroundColor: '#1c1c1e', marginBottom: '2.5rem' } }),
      React.createElement('span', { className: 'chapter-label', style: { color: '#71717a', letterSpacing: '0.25em', fontSize: '0.75rem' } }, "05 / FINAL TERMINAL")
    ),

    React.createElement('div', {
      style: { position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 2rem' }
    },
      React.createElement('h2', {
        ref: titleRef,
        style: {
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'calc(2.2rem + 1.8vw)', color: '#f4f4f5',
          fontWeight: 400, lineHeight: 1.25, letterSpacing: '-0.02em', maxWidth: '850px', margin: '0 0 3.5rem'
        }
      }, closing_invitation || "Let's Shape the Evolution Together."),

      React.createElement('button', {
        ref: actionButtonRef,
        onMouseEnter: (e) => {
          gsap.to(e.currentTarget, { scale: 1.05, duration: 0.35, ease: 'power2.out', boxShadow: '0 0 50px rgba(200, 169, 126, 0.25)' });
        },
        onMouseLeave: (e) => {
          gsap.to(e.currentTarget, { scale: 1, duration: 0.35, ease: 'power2.out', boxShadow: 'none' });
        },
        style: {
          padding: '1.2rem 4rem', fontSize: '0.85rem', letterSpacing: '0.25em',
          textTransform: 'uppercase', background: '#c8a97e', color: '#09090b',
          border: 'none', cursor: 'pointer', fontWeight: 700, borderRadius: '1px',
          outline: 'none', transition: 'background 0.3s ease'
        }
      }, target_conversion_label || "Initiate Call")
    ),

    React.createElement('footer', {
      style: {
        width: '100%', padding: '0 6rem 4rem', zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: '#52525b', letterSpacing: '0.05em'
      }
    },
      React.createElement('div', null, corporate_copyright || `© ${new Date().getFullYear()} ARCHITECTS OF COMPOSITION. ALL RIGHTS RESERVED.`),
      React.createElement('div', { style: { display: 'flex', gap: '3rem' } },
        React.createElement('span', null, direct_contact_strings || "STUDIO@PIPELINE.PREMIUM"),
        React.createElement('a', { href: '#', style: { color: '#52525b', textDecoration: 'none' } }, "PRIVACY MATRIX")
      )
    )
  );
}