import React from 'react';
import { MOTION_PROFILES } from './motion_registry';

export default function Navigation({ 
  brand_identity_string = "STUDIO.ARCH", 
  navigation_menu_array = [], 
  action_button_label = "Connect",
  motion_tempo = "slow_luxury" // Prop added for architectural consistency
}) {
  return React.createElement('header', {
    style: {
      position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 100,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '2rem 6rem', background: 'rgba(9, 9, 11, 0.75)',
      backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid rgba(39, 39, 42, 0.4)'
    }
  },
    React.createElement('div', {
      style: {
        fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem',
        color: '#f4f4f5', letterSpacing: '0.05em', fontWeight: 400
      }
    }, brand_identity_string),

    React.createElement('nav', {
      style: { display: 'flex', gap: '3.5rem', alignItems: 'center' }
    },
      navigation_menu_array.map((item, index) => 
        React.createElement('a', {
          key: index, href: `#${item.scroll_anchor_id}`,
          style: {
            fontFamily: "'Inter', sans-serif", fontSize: '0.8rem',
            color: '#a1a1aa', textDecoration: 'none', letterSpacing: '0.15em',
            textTransform: 'uppercase', transition: 'color 0.3s ease'
          },
          onMouseEnter: (e) => e.currentTarget.style.color = '#f4f4f5',
          onMouseLeave: (e) => e.currentTarget.style.color = '#a1a1aa'
        }, item.link_label)
      )
    ),

    React.createElement('button', {
      style: {
        padding: '0.6rem 1.8rem', fontSize: '0.75rem', letterSpacing: '0.15em',
        textTransform: 'uppercase', background: '#f4f4f5', color: '#09090b',
        border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'opacity 0.3s ease'
      },
      onMouseEnter: (e) => e.currentTarget.style.opacity = '0.85',
      onMouseLeave: (e) => e.currentTarget.style.opacity = '1'
    }, action_button_label)
  );
}