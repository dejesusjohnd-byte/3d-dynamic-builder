import React from 'react';

export default function CollageIntroduction({ introStatement, collageImages = [] }) {
  // Enforce media count range: Min 3, Max 4 images via curation gates
  const displayedImages = collageImages.slice(0, 4);

  return (
    <section style={{ width: '100vw', minHeight: '100vh', padding: '12rem 4rem', background: '#09090b', color: '#f4f4f5', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
        
        {/* Structural Isolation: Chapter Marker (Digital Silence Element) */}
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#71717a', textTransform: 'uppercase', marginBottom: '3rem', display: 'block' }}>
          02 / ORIGIN DNA
        </span>

        {/* Central Narrative Core: Exactly one powerful statement */}
        <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.75rem)', fontWeight: 300, lineHeight: 1.5, textAlign: 'center', maxWidth: '850px', color: '#f4f4f5', position: 'relative', zIndex: 10, margin: 0 }}>
          {introStatement || "Defining systemic spatial efficiency through unyielding execution structures."}
        </h2>

        {/* Spatial Collage Frame Container */}
        <div style={{ position: 'absolute', top: '-10%', left: 0, width: '100%', height: '120%', pointerEvents: 'none', zIndex: 1 }}>
          
          {/* Image 1: Top Left Depth Layer */}
          {displayedImages[0] && (
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: '220px', height: '280px', opacity: 0.25, transform: 'rotate(-4deg)', zIndex: -1 }}>
              <img src={displayedImages[0]} alt="Context Detail A" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
            </div>
          )}

          {/* Image 2: Bottom Right Layer (Overlapping Intentional Depth Shift) */}
          {displayedImages[1] && (
            <div style={{ position: 'absolute', bottom: '5%', right: '2%', width: '260px', height: '340px', opacity: 0.3, transform: 'rotate(3deg)', zIndex: 5 }}>
              <img src={displayedImages[1]} alt="Context Detail B" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.1)' }} />
            </div>
          )}

          {/* Image 3: Top Right Subtle Floating Layer */}
          {displayedImages[2] && (
            <div style={{ position: 'absolute', top: '5%', right: '8%', width: '200px', height: '240px', opacity: 0.15, transform: 'rotate(-2deg)', zIndex: -2 }}>
              <img src={displayedImages[2]} alt="Context Detail C" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
            </div>
          )}

          {/* Image 4: Bottom Left Anchor Layer */}
          {displayedImages[3] && (
            <div style={{ position: 'absolute', bottom: '8%', left: '8%', width: '240px', height: '300px', opacity: 0.2, transform: 'rotate(6deg)', zIndex: -1 }}>
              <img src={displayedImages[3]} alt="Context Detail D" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
            </div>
          )}

        </div>
      </div>
    </section>
  );
}