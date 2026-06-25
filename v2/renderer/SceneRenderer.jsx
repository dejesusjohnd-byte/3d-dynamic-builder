import React from 'react';
import { resolveTheme } from '../themes/theme_registry';

// Component imports — all bricks available to the renderer
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import CollageIntroduction from '../components/CollageIntroduction';
import StaticOfferingsGrid from '../components/StaticOfferingsGrid';
import TextEditorial from '../components/TextEditorial';
import TwoColumnValuePause from '../components/TwoColumnValuePause';
import ClosingCallToAction from '../components/ClosingCallToAction';

/**
 * SCENE RENDERER — V2 Pipeline Engine
 * ─────────────────────────────────────────────────────────────────
 * Reads a site_config.json and a resolved theme object.
 * Assembles the scene dynamically — no hardcoded section order.
 * Claude writes the config. This file renders it. Never the reverse.
 *
 * Member 1: You may extend COMPONENT_MAP with new brick variants.
 * Member 3 / Claude: Never modify this file. Only modify configs/.
 * ─────────────────────────────────────────────────────────────────
 */

// Registry of all available components by name.
// To add a new brick variant (Path 2), register it here.
// Example: HeroSection_SplitScreen: lazy(() => import('../components/HeroSection_SplitScreen'))
const COMPONENT_MAP = {
  Navigation,
  HeroSection,
  CollageIntroduction,
  StaticOfferingsGrid,
  TextEditorial,
  TwoColumnValuePause,
  ClosingCallToAction,
};

/**
 * Builds the button style object from theme tokens.
 * Components receive this as a prop so they don't need to know the theme.
 */
function resolveButtonStyle(theme) {
  const base = {
    padding: '1.1rem 3rem',
    fontSize: '0.8rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontWeight: 500,
    outline: 'none',
    borderRadius: theme.btn_radius || '1px',
    transition: 'all 0.35s ease',
    fontFamily: theme.font_body,
  };

  if (theme.btn_style === 'filled') {
    return { ...base, background: theme.accent, color: theme.bg_primary, border: 'none' };
  }
  if (theme.btn_style === 'ghost') {
    return { ...base, background: 'transparent', color: theme.text_muted, border: `1px solid ${theme.border_card}` };
  }
  // Default: outline
  return { ...base, background: 'transparent', color: theme.accent, border: `1px solid ${theme.accent}` };
}

/**
 * SceneRenderer — the main export.
 * Props:
 *   config  {Object} — parsed site_config.json
 */
export default function SceneRenderer({ config }) {
  if (!config) {
    return (
      <div style={{ color: '#ff4444', padding: '4rem', fontFamily: 'monospace' }}>
        SceneRenderer: No config provided. Check that App.jsx is importing a valid config file.
      </div>
    );
  }

  const theme = resolveTheme(config.theme_token);
  const motion_tempo = config.motion_tempo || 'slow_luxury';
  const sectionOrder = config.section_order || [];
  const omitSections = config.omit_sections || [];
  const buttonStyle = resolveButtonStyle(theme);

  // Filter out omitted sections
  const activeSections = sectionOrder.filter(name => !omitSections.includes(name));

  // Track how many times each component appears (for duplicate support e.g. DataHeavy)
  const sectionInstanceCount = {};

  return (
    <div
      data-theme={theme.is_light_theme ? 'light' : 'dark'}
      style={{
        backgroundColor: theme.bg_primary,
        minHeight: '100vh',
        fontFamily: theme.font_body,
      }}
    >
      {activeSections.map((sectionName, index) => {
        const Component = COMPONENT_MAP[sectionName];

        if (!Component) {
          console.warn(`[SceneRenderer] Unknown component: "${sectionName}". Check COMPONENT_MAP.`);
          return null;
        }

        // Handle duplicate component instances (e.g. two StaticOfferingsGrids)
        sectionInstanceCount[sectionName] = (sectionInstanceCount[sectionName] || 0) + 1;
        const instanceIndex = sectionInstanceCount[sectionName];

        // Resolve config data for this section
        // If a component appears twice, second instance looks for sectionName_2 key
        const dataKey = instanceIndex > 1 ? `${sectionName}_${instanceIndex}` : sectionName;
        const sectionData = config[dataKey] || config[sectionName] || {};

        // Resolve chapter label override
        const chapterLabel = config.chapter_label_overrides?.[sectionName] || undefined;

        return (
          <Component
            key={`${sectionName}-${instanceIndex}-${index}`}
            {...sectionData}
            motion_tempo={motion_tempo}
            theme={theme}
            button_style={buttonStyle}
            chapter_label_override={chapterLabel}
          />
        );
      })}
    </div>
  );
}
