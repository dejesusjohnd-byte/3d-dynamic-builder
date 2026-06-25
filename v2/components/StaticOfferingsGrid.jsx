import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION_PROFILES } from './motion_registry';

gsap.registerPlugin(ScrollTrigger);

export default function StaticOfferingsGrid({ offering_units = [], motion_tempo = 'slow_luxury' }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);

  const displayedItems = offering_units.slice(0, 3);

  useEffect(() => {
    const { duration, ease, stagger } = MOTION_PROFILES[motion_tempo] || MOTION_PROFILES.slow_luxury;

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30, filter: 'blur(5px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: duration, ease: ease,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
        }
      );

      if (cardRefs.current.length > 0) {
        gsap.fromTo(cardRefs.current,
          { opacity: 0, y: 60, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: duration, stagger: stagger, ease: ease,
            scrollTrigger: { trigger: gridRef.current, start: 'top 75%', toggleActions: 'play none none reverse' }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [offering_units, motion_tempo]);

  const isVideoAsset = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)/i) || url.includes('video');
  };

  return React.createElement('section', {
    ref: sectionRef,
    style: {
      position: 'relative', width: '100vw', backgroundColor: '#09090b',
      padding: '14rem 6rem', display: 'flex', flexDirection: 'column',
      alignItems: 'center', borderTop: '1px solid #1c1c1e'
    }
  },
    React.createElement('div', {
      ref: headerRef,
      style: { textAlign: 'center', marginBottom: '6rem', width: '100%' }
    },
      React.createElement('span', {
        className: 'chapter-label',
        style: { color: '#71717a', marginBottom: '1.5rem', display: 'block', letterSpacing: '0.25em', fontSize: '0.75rem' }
      }, "03 / CAPABILITY INDEX"),
      React.createElement('h2', {
        style: {
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'calc(1.8rem + 1vw)', color: '#f4f4f5',
          fontWeight: 400, letterSpacing: '-0.01em', margin: 0
        }
      }, "Core Specialized Solutions")
    ),

    React.createElement('div', {
      ref: gridRef,
      style: {
        display: 'grid',
        gridTemplateColumns: displayedItems.length > 0 ? `repeat(${displayedItems.length}, 1fr)` : '1fr',
        gap: '2.5rem', width: '100%', maxWidth: '1200px', zIndex: 2
      }
    },
      displayedItems.map((item, index) => 
        React.createElement('div', {
          key: index,
          ref: el => (cardRefs.current[index] = el),
          onMouseEnter: (e) => {
            gsap.to(e.currentTarget, { y: -10, borderColor: '#c8a97e', duration: 0.4, ease: 'power2.out' });
            gsap.to(e.currentTarget.querySelector('.card-media'), { scale: 1.06, filter: 'grayscale(0%) contrast(1.05) brightness(0.8)', duration: 0.6 });
          },
          onMouseLeave: (e) => {
            gsap.to(e.currentTarget, { y: 0, borderColor: '#27272a', duration: 0.4, ease: 'power2.out' });
            gsap.to(e.currentTarget.querySelector('.card-media'), { scale: 1, filter: 'grayscale(100%) contrast(1.1) brightness(0.6)', duration: 0.6 });
          },
          style: {
            backgroundColor: '#141416', border: '1px solid #27272a',
            borderRadius: '2px', padding: '3.5rem 2.5rem', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', transition: 'border-color 0.4s ease'
          }
        },
          React.createElement('div', {
            style: { width: '100%', height: '200px', overflow: 'hidden', marginBottom: '2.5rem', backgroundColor: '#09090b', borderRadius: '1px' }
          },
            isVideoAsset(item.item_cover_url) ? (
              React.createElement('video', {
                className: 'card-media',
                src: item.item_cover_url, autoPlay: true, loop: true, muted: true, playsInline: true,
                style: {
                  width: '100%', height: '100%', objectFit: 'cover',
                  filter: 'grayscale(100%) contrast(1.1) brightness(0.6)', transition: 'filter 0.6s ease, transform 0.6s ease'
                }
              })
            ) : (
              React.createElement('img', {
                className: 'card-media',
                src: item.item_cover_url || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
                alt: item.item_title,
                style: {
                  width: '100%', height: '100%', objectFit: 'cover',
                  filter: 'grayscale(100%) contrast(1.1) brightness(0.6)', transition: 'filter 0.6s ease, transform 0.6s ease'
                }
              })
            )
          ),

          React.createElement('h3', {
            style: {
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.35rem', color: '#f4f4f5',
              fontWeight: 400, marginBottom: '1.25rem', letterSpacing: '-0.01em'
            }
          }, item.item_title),

          React.createElement('p', {
            style: {
              fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#a1a1aa',
              lineHeight: 1.6, fontWeight: 300, margin: 0
            }
          }, item.item_summary)
        )
      )
    )
  );
}