import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   CLOSING PARTICLE FIELD — Gold ambient particles
   ═══════════════════════════════════════════════════════════════ */
function ClosingParticles() {
  const ref = useRef();
  const positions = React.useMemo(() => {
    const arr = new Float32Array(350 * 3);
    for (let i = 0; i < 350; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;
    }
    return arr;
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.015) * 0.05;
  });

  return (
    <group ref={ref}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#c8a97e"
          size={0.05}
          sizeAttenuation
          depthWrite={false}
          opacity={0.35}
        />
      </Points>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CLOSING CALL TO ACTION — Immersive Conversion Terminal
   GSAP CTA transitions + gold particle field canvas
   ═══════════════════════════════════════════════════════════════ */
export default function ClosingCallToAction({
  closing_invitation,
  target_conversion_label,
  baseline_essentials = {},
}) {
  const { corporate_copyright, direct_contact_strings } = baseline_essentials;

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal — scale + fade
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );

      // CTA button reveal
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
          delay: 0.2,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="closing"
      style={{
        position: 'relative', width: '100vw', height: '100vh',
        background: '#09090b', color: '#f4f4f5',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', overflow: 'hidden',
      }}
    >
      {/* Three.js Canvas — Z:0 */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, width: '100%', height: '100%',
      }}>
        <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
          <Suspense fallback={null}>
            <ClosingParticles />
          </Suspense>
        </Canvas>
      </div>

      {/* Top bar — Z:2 */}
      <div style={{
        width: '100%', padding: '3rem 4rem 0', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', zIndex: 2,
      }}>
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', color: '#71717a' }}>
          05 / Terminal Conversion
        </span>
        <div style={{ width: '100px', height: '1px', background: '#27272a' }} />
      </div>

      {/* Center content — Z:2 */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '0 10%', zIndex: 2,
      }}>
        <h2 ref={titleRef} style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 600,
          letterSpacing: '-0.02em', color: '#f4f4f5',
          marginBottom: '2rem', maxWidth: '800px',
          opacity: 0,
        }}>
          {closing_invitation || 'Initiate Scalable Integration.'}
        </h2>

        <button
          ref={ctaRef}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1.05, duration: 0.3, ease: 'power2.out',
              boxShadow: '0 0 40px rgba(200,169,126,0.3)',
            });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1, duration: 0.3, ease: 'power2.out',
              boxShadow: 'none',
            });
          }}
          style={{
            padding: '1.2rem 3.5rem', fontSize: '0.9rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', background: '#c8a97e', color: '#09090b',
            border: 'none', cursor: 'pointer', fontWeight: 700,
            transition: 'background 0.3s ease',
            opacity: 0,
          }}
        >
          {target_conversion_label || 'Commence'}
        </button>
      </div>

      {/* Footer — Z:2 */}
      <footer style={{
        width: '100%', padding: '0 4rem 3rem', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        fontSize: '0.8rem', color: '#71717a', letterSpacing: '0.05em', zIndex: 2,
      }}>
        <div>{corporate_copyright || `© ${new Date().getFullYear()} Architectural Engine.`}</div>
        {direct_contact_strings && (
          <div style={{ display: 'flex', gap: '2rem', color: '#a1a1aa' }}>
            <span>{direct_contact_strings}</span>
          </div>
        )}
      </footer>
    </section>
  );
}