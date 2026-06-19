import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   MASTERCLASS SERVICE GRID — Symmetry & Micro-Interaction Node
   Inspired by Refokus / Zera Studio: Controlled Card Matrix
   ═══════════════════════════════════════════════════════════════ */
export default function StaticOfferingsGrid({ offering_units = [] }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);

  // Constrain layout display to exactly 3 core pillars to enforce maximum visual authority
  const displayedItems = offering_units.slice(0, 3);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // INTENTIONAL SEQUENCING: Title sequence drops down line-by-line with a subtle ease
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30, filter: 'blur(5px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 1.2, ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // STAGGERED REVEAL TIMELINE: Cards cascade onto the screen sequentially to control attention
      if (cardRefs.current.length > 0) {
        gsap.fromTo(cardRefs.current,
          { opacity: 0, y: 60, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 1.4,
            stagger: 0.15, // The exact delay cadence taught in Module 3 Episode 2
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, [offering_units]);

  return React.createElement('section', {
    ref: sectionRef,
    style: {
      position: 'relative',
      width: '100vw',
      backgroundColor: '#09090b',
      padding: '14rem 6rem', // Generous breathing room padding
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderTop: '1px solid #1c1c1e'
    }
  },
    // Section Chapter Tracking Label
    React.createElement('div', {
      ref: headerRef,
      style: { textAlign: 'center', marginBottom: '6rem', width: '100%' }
    },
      React.createElement('span', {
        className: 'chapter-label',
        style: { color: '#71717a', marginBottom: '1.5rem' }
      }, "03 / CAPABILITY INDEX"),
      React.createElement('h2', {
        style: {
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'calc(1.8rem + 1vw)', color: '#f4f4f5',
          fontWeight: 400, letterSpacing: '-0.01em', margin: 0
        }
      }, "Core Specialized Solutions")
    ),

    // Symmetric 3-Column Luxury Matrix Grid
    React.createElement('div', {
      ref: gridRef,
      style: {
        display: 'grid',
        gridTemplateColumns: displayedItems.length > 0 ? `repeat(${displayedItems.length}, 1fr)` : '1fr',
        gap: '2.5rem',
        width: '100%',
        maxWidth: '1200px',
        zIndex: 2
      }
    },
      displayedItems.map((item, index) => 
        React.createElement('div', {
          key: index,
          ref: el => (cardRefs.current[index] = el),
          // MICRO-INTERACTION CONTROL MATRIX: Directing elegant card lift mechanics
          onMouseEnter: (e) => {
            gsap.to(e.currentTarget, { y: -10, borderColor: '#c8a97e', duration: 0.4, ease: 'power2.out' });
            gsap.to(e.currentTarget.querySelector('.card-image'), { scale: 1.06, filter: 'grayscale(0%) contrast(1.05) brightness(0.8)', duration: 0.6 });
          },
          onMouseLeave: (e) => {
            gsap.to(e.currentTarget, { y: 0, borderColor: '#27272a', duration: 0.4, ease: 'power2.out' });
            gsap.to(e.currentTarget.querySelector('.card-image'), { scale: 1, filter: 'grayscale(100%) contrast(1.1) brightness(0.6)', duration: 0.6 });
          },
          style: {
            backgroundColor: '#141416',
            border: '1px solid #27272a',
            borderRadius: '2px',
            padding: '3.5rem 2.5rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            transition: 'border-color 0.4s ease'
          }
        },
          // Card Spatial Graphic Window
          React.createElement('div', {
            style: { width: '100%', height: '200px', overflow: 'hidden', marginBottom: '2.5rem', backgroundColor: '#09090b', borderRadius: '1px' }
          },
            React.createElement('img', {
              className: 'card-image',
              src: item.item_cover_url || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
              alt: item.item_title,
              style: {
                width: '100%', height: '100%', objectFit: 'cover',
                filter: 'grayscale(100%) contrast(1.1) brightness(0.6)', // Rigid studio monochrome signature
                transition: 'filter 0.6s ease, transform 0.6s ease'
              }
            })
          ),

          // Card Text Elements
          React.createElement('h3', {
            style: {
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.35rem', color: '#f4f4f5',
              fontWeight: 400, marginBottom: '1.25rem', letterSpacing: '-0.01em'
            }
          }, item.item_title),

          React.createElement('p', {
            style: {
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.95rem', color: '#a1a1aa',
              lineHeight: 1.6, fontWeight: 300, margin: 0
            }
          }, item.item_summary)
        )
      )
    )
  );
}