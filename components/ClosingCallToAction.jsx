import React from 'react';

export default function ClosingCallToAction({ closing_invitation, target_conversion_label, baseline_essentials = {} }) {
  const { corporate_copyright, direct_contact_strings } = baseline_essentials;

  return (
    <section style={{ position: 'relative', width: '100vw', height: '100vh', background: '#09090b', color: '#f4f4f5', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
      
      {/* Visual Buffer Top Line */}
      <div style={{ width: '100%', padding: '4rem 4rem 0 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#71717a' }}>05 / TERMINAL CONVERSIONS</span>
        <div style={{ width: '100px', height: '1px', background: '#27272a' }} />
      </div>

      {/* Center Focus Conversion UI Stacking Block */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 10%' }}>
        
        {/* Main Invitation Hook */}
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#f4f4f5', marginBottom: '3rem', maxWidth: '800px' }}>
          {closing_invitation || "Initiate Scalable Integration."}
        </h2>

        {/* Singular Large Action Button (No crowded input forms) */}
        <button 
          style={{
            padding: '1.2rem 3.5rem',
            fontSize: '0.9rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            background: '#ffffff',
            color: '#09090b',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {target_conversion_label || "Commence"}
        </button>
      </div>

      {/* Absolute Base Systemic Footer */}
      <footer style={{ width: '100%', padding: '0 4rem 4rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#71717a', letterSpacing: '0.05em' }}>
        <div>
          {corporate_copyright || `© ${new Date().getFullYear()} Architectural Engine.`}
        </div>
        {direct_contact_strings && (
          <div style={{ display: 'flex', gap: '2rem', color: '#a1a1aa' }}>
            <span>{direct_contact_strings}</span>
          </div>
        )}
      </footer>

    </section>
  );
}