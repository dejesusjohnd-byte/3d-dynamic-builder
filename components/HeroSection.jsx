import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

// Subtle, controlled WebGL Ambient Mesh / Particle Field (Law 3 / Restricted viewing angles)
function AmbientParticles({ scrollY }) {
  const ref = useRef();
  // Pre-generated optimized spatial coordinate array
  const sphere = random.inSphere(new Float32Array(3000), { radius: 1.5 });

  useFrame((state) => {
    // Parallax rule: React to scroll positioning smoothly, moving slower than typography
    const targetY = -(scrollY.current * 0.0005);
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.1;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#a1a1aa"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function HeroSection({ 
  brand_identity_logo, 
  hook_headline, 
  hook_context, 
  primary_action_label 
}) {
  const scrollY = useRef(0);

  // Sync scroll positioning natively for micro-interaction/parallax
  React.useEffect(() => {
    const handleScroll = () => { scrollY.current = window.scrollY; };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#09090b' }}>
      
      {/* 3D Spatial Layer (Z-Axis: -10) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -10 }}>
        <Canvas camera={{ position: [0, 0, 1] }}>
          <AmbientParticles scrollY={scrollY} />
        </Canvas>
      </div>

      {/* Minimal Top Navigation */}
      <header style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        {brand_identity_logo ? (
          <img src={brand_identity_logo} alt="Brand Mark" style={{ height: '24px', width: 'auto' }} />
        ) : (
          <div style={{ width: '24px', height: '24px', background: '#ffffff', opacity: 0.2 }} />
        )}
        <nav style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a1a1aa' }}>
          <span>Index</span>
          <span>Manifesto</span>
        </nav>
      </header>

      {/* Center Typography Stack & Primary Action (Z-Axis: 0) */}
      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 10%', textAlign: 'center', zIndex: 1 }}>
        
        {/* Sequential Gaze Architecture: Huge Bold Primary Element */}
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.03em', lineHeight: 1.1, maxWidth: '900px', margin: '0 0 1.5rem 0' }}>
          {hook_headline}
        </h1>

        {/* Medium Text (Secondary) */}
        {hook_context && (
          <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', color: '#a1a1aa', maxWidth: '600px', lineHeight: 1.6, fontWeight: 300, margin: '0 0 3rem 0' }}>
            {hook_context}
          </p>
        )}

        {/* Singular Conversion Focus Button with Subtle Micro-Interaction Handler */}
        <button 
          style={{
            padding: '1rem 2.5rem',
            fontSize: '0.85rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            background: '#ffffff',
            color: '#09090b',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {primary_action_label || 'Explore'}
        </button>
      </div>

    </section>
  );
}