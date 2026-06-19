import React from 'react';

export default function StaticOfferingsGrid({ offering_units = [] }) {
  // Graceful Handling Rule: Max 4 high-priority items allowed by curation gates
  const displayedItems = offering_units.slice(0, 4);
  const itemCount = displayedItems.length;

  // Exception Protocol: Fallback array layout configuration to balance geometric grid scale
  const getGridTemplateColumns = () => {
    if (itemCount === 4) return 'repeat(4, 1fr)';
    if (itemCount === 3) return 'repeat(3, 1fr)';
    if (itemCount === 2) return 'repeat(2, 1fr)';
    return '1fr';
  };

  return (
    <section style={{ width: '100vw', padding: '10rem 4rem', background: '#09090b', color: '#f4f4f5', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Digital Silence Section Buffer/Header Area */}
      <div style={{ width: '100%', maxWidth: '1400px', marginBottom: '5rem' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#71717a', display: 'block', marginBottom: '1rem' }}>
          03 / CAPABILITIES MATRIX
        </span>
        <div style={{ width: '40px', height: '1px', background: '#27272a' }} />
      </div>

      {/* Rigid Symmetric Service Matrix */}
      <div 
        style={{
          width: '100%',
          maxWidth: '1400px',
          display: 'grid',
          gridTemplateColumns: getGridTemplateColumns(),
          gap: '2px', // Clean structural razor-thin grid borders
          background: '#27272a', // Acts as border color between cards
        }}
      >
        {displayedItems.map((item, index) => (
          <div 
            key={index} 
            style={{ 
              background: '#09090b', 
              padding: '3.5rem 2.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'between',
              minHeight: '400px',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#141416'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#09090b'; }}
          >
            <div>
              {/* Cover Asset Frame with Uniform Aspect Ratio */}
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', marginBottom: '2.5rem', background: '#18181b', position: 'relative' }}>
                {item.item_cover_url ? (
                  <img 
                    src={item.item_cover_url} 
                    alt={item.item_title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.1)' }} 
                  />
                ) : (
                  /* Media Failure Protocol: Fallback glassmorphic architectural container block */
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)', opacity: 0.6 }} />
                )}
              </div>

              {/* Sequential Typography Chain */}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 500, letterSpacing: '-0.01em', marginBottom: '1rem', color: '#f4f4f5' }}>
                {item.item_title}
              </h3>
              
              <p style={{ fontSize: '0.9rem', color: '#a1a1aa', lineHeight: 1.6, fontWeight: 300 }}>
                {item.item_summary}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}