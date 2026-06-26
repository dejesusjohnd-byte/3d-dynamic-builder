import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION_PROFILES } from './motion_registry';

gsap.registerPlugin(ScrollTrigger);

export default function TextEditorial({ editorial_header, editorial_body_paragraphs = [], motion_tempo = 'slow_luxury' }) {
  const textRef = useRef(null);

  useEffect(() => {
    const { duration, ease, stagger } = MOTION_PROFILES[motion_tempo] || MOTION_PROFILES.slow_luxury;

    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: duration, stagger: stagger, ease: ease,
          scrollTrigger: { trigger: textRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
        }
      );
    }, textRef);
    return () => ctx.revert();
  }, [editorial_header, motion_tempo]);

  return React.createElement('section', {
    style: {
      width: '100vw', backgroundColor: '#09090b', padding: '14rem 6rem',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      borderTop: '1px solid #1c1c1e'
    }
  },
    React.createElement('div', {
      ref: textRef,
      style: { width: '100%', maxWidth: '750px', textAlign: 'left' }
    },
      editorial_header && React.createElement('h2', {
        style: {
          fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'calc(1.6rem + 1vw)',
          color: '#f4f4f5', fontWeight: 400, lineHeight: 1.3, marginBottom: '4rem', letterSpacing: '-0.01em'
        }
      }, editorial_header),

      editorial_body_paragraphs.map((para, idx) => 
        React.createElement('p', {
          key: idx,
          style: {
            fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', color: '#a1a1aa',
            lineHeight: 1.85, fontWeight: 300, marginBottom: '2rem'
          }
        }, para)
      )
    )
  );
}