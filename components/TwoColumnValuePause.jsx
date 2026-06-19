import React from 'react';

export default function TwoColumnValuePause({ philosophy_anchor, philosophy_deep_dive, singular_master_visual }) {
  return (
    <section style={{ width: '100vw', minHeight: '90vh', padding: '12rem 6rem', background: '#09090b', color: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '1400px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8rem', alignItems: 'center' }}>
        
        {/* Left Column: Asymmetric Authoritative Trust Core */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#71717a', textTransform: 'uppercase', marginBottom: '2rem', display: 'block' }}>
            04 / VALUE PARADIGM
          </span>
          
          {/* Commanding Trust Anchor Text */}
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, color: '#f4f4f5', margin: '0 0 2.5rem 0' }}>
            "{philosophy_anchor || "Execution architecture dictates product longevity."}"
          </h2>

          {/* Secondary Context Deep Dive */}
          {philosophy_deep_dive && (
            <p style={{ fontSize: '1.05rem', color: '#a1a1aa', lineHeight: 1.7, fontWeight: 300, maxWidth: '550px', margin: 0 }}>
              {philosophy_deep_dive}
            </p>
          )}
        </div>

        {/* Right Column: Singular Master Visual Frame */}
        <div style={{ width: '100%', height: '550px', background: '#18181b', overflow: 'hidden', position: 'relative' }}>
          {singular_master_visual ? (
            <img 
              src={singular_master_visual} 
              alt="System Blueprint Focus" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.05)' }} 
            />
          ) : (
            /* Media Failure Protocol: Ambient glassmorphic replacement block */
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #18181b 0%, #27272a 100%)', opacity: 0.5 }} />
          )}
        </div>

      </div>
    </section>
  );
}