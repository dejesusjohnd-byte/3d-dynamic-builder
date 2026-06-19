import React, { useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage, Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   3D MODEL LOADER — GLTF/GLB from /public/assets/
   Falls back to ambient particle field if no asset provided.
   ═══════════════════════════════════════════════════════════════ */
function HeroModel({ url }) {
  const groupRef = useRef();

  // If a GLTF/GLB URL is provided, load it. Otherwise show fallback.
  if (url && url.endsWith('.glb') || url && url.endsWith('.gltf')) {
    return <GLTFModel url={url} ref={groupRef} />;
  }

  return <AmbientParticleField ref={groupRef} />;
}

function GLTFModel({ url }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();

  useEffect(() => {
    if (scene) {
      // Center and scale the model
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      scene.scale.setScalar(scale);
      scene.position.sub(center.multiplyScalar(scale));
    }
  }, [scene]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AMBIENT PARTICLE FIELD — Fallback when no 3D asset
   2000 particles, inSphere distribution, scroll-linked parallax
   ═══════════════════════════════════════════════════════════════ */
function AmbientParticleField() {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const r = Math.cbrt(Math.random()) * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.02) * 0.1;
  });

  return (
    <group ref={ref} rotation={[0, 0, Math.PI / 4]}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          transparent
          color="#a1a1aa"
          size={0.004}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO SECTION — Cinematic 3D Mood Setter
   GLTF model OR particle field + GSAP master timeline entrance
   ═══════════════════════════════════════════════════════════════ */
export default function HeroSection({
  brand_identity_logo,
  hook_headline,
  hook_context,
  primary_action_label,
  hero_3d_asset_url,
}) {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollRef = useRef(null);

  // GSAP master timeline entrance
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
    .fromTo(titleRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo(subRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      '-=0.8'
    )
    .fromTo(ctaRef.current,
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo(scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power3.out' },
      '-=0.4'
    );

    // Scroll-linked parallax on canvas container
    gsap.to(sectionRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      opacity: 0.3,
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative', width: '100vw', height: '100vh',
        overflow: 'hidden', background: '#09090b',
      }}
    >
      {/* Three.js Canvas — Z:0 layer */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        width: '100%', height: '100%',
      }}>
        <Canvas camera={{ position: [0, 0, 1], fov: 50 }}>
          <Suspense fallback={null}>
            {hero_3d_asset_url ? (
              <Stage environment="city" intensity={0.6}>
                <HeroModel url={hero_3d_asset_url} />
              </Stage>
            ) : (
              <AmbientParticleField />
            )}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 4}
              autoRotate
              autoRotateSpeed={0.3}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Navigation — Z:10 */}
      <header style={{
        position: 'absolute', top: 0, left: 0, width: '100%',
        padding: '1.5rem 3.5rem', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10, mixBlendMode: 'difference',
      }}>
        {brand_identity_logo ? (
          <img src={brand_identity_logo} alt="Brand" style={{ height: '24px', width: 'auto' }} />
        ) : (
          <div style={{ width: '24px', height: '24px', background: '#fff', opacity: 0.2 }} />
        )}
        <nav style={{ display: 'flex', gap: '2.5rem' }}>
          {['Services', 'Process', 'Contact'].map((label, i) => (
            <a key={i} href={['#offerings', '#value-pause', '#closing'][i]} style={{
              fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#f4f4f5', textDecoration: 'none', fontWeight: 400, opacity: 0.7,
            }}>
              {label}
            </a>
          ))}
        </nav>
        <a href="#closing" style={{
          fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#f4f4f5', textDecoration: 'none', padding: '0.6rem 1.4rem',
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
          Get Quote
        </a>
      </header>

      {/* Center Typography — Z:10 */}
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: '0 10%', textAlign: 'center', zIndex: 10,
      }}>
        {/* Backdrop for legibility */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(9,9,11,0.5) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <p ref={eyebrowRef} style={{
          fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: '#c8a97e', marginBottom: '1.5rem', fontWeight: 400,
          opacity: 0, position: 'relative',
        }}>
          Decks · Fences · Roofing
        </p>

        <h1 ref={titleRef} style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 600,
          color: '#f4f4f5', letterSpacing: '-0.03em', lineHeight: 1.1,
          maxWidth: '900px', margin: '0 0 1.5rem',
          opacity: 0, position: 'relative',
        }}>
          {hook_headline}
        </h1>

        {hook_context && (
          <p ref={subRef} style={{
            fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', color: '#a1a1aa',
            maxWidth: '560px', lineHeight: 1.7, fontWeight: 300,
            margin: '0 0 3rem', opacity: 0, position: 'relative',
          }}>
            {hook_context}
          </p>
        )}

        <button
          ref={ctaRef}
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, ease: 'power2.out' })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: 'power2.out' })}
          style={{
            padding: '1rem 2.5rem', fontSize: '0.85rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', background: 'transparent', color: '#c8a97e',
            border: '1px solid #c8a97e', cursor: 'pointer', fontWeight: 500,
            opacity: 0, position: 'relative',
          }}
        >
          {primary_action_label || 'Explore'}
        </button>
      </div>

      {/* Scroll Indicator */}
      <div ref={scrollRef} style={{
        position: 'absolute', bottom: '2.5rem', left: '50%',
        transform: 'translateX(-50%)', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '0.5rem', opacity: 0,
      }}>
        <span style={{
          fontSize: '0.6rem', letterSpacing: '0.25em',
          textTransform: 'uppercase', color: '#71717a',
        }}>Scroll</span>
        <div style={{
          width: '1px', height: '50px',
          background: 'linear-gradient(to bottom, #c8a97e, transparent)',
        }} />
      </div>
    </section>
  );
}