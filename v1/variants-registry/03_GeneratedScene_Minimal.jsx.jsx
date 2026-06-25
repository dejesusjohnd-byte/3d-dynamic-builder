import React from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import TextEditorial from '../components/TextEditorial';
import ClosingCallToAction from '../components/ClosingCallToAction';

// Minimal variant: Content-stripped, high-whitespace focus
const minimalData = {
  nav: { 
    brand_identity_string: "STUDIO.MINIMAL", 
    navigation_menu_array: [
        { link_label: "Essence", scroll_anchor_id: "essence" }
    ], 
    action_button_label: "Engage" 
  },
  hero: {
    hook_headline: "The Art of Absence",
    hook_context: "Removing the noise to reveal the core structural truth.",
    primary_action_label: "Focus",
    motion_tempo: "slow_luxury", // Defaulting to the calmest tempo for minimal feel
    depth_layer_one_url: "" // Intentionally empty for clean background
  },
  editorial: {
    editorial_header: "Silence is a Design Element",
    editorial_body_paragraphs: [
        "In a digital environment cluttered with aggressive motion, the most premium choice is often to do less.",
        "We prioritize typography, negative space, and deliberate pacing to ensure the message remains the primary focus."
    ]
  },
  cta: {
    closing_invitation: "Refine your approach.",
    target_conversion_label: "Contact"
  }
};

export default function GeneratedScene_MinimalV3() {
  return (
    <div style={{ backgroundColor: '#09090b', minHeight: '100vh' }}>
      <Navigation {...minimalData.nav} motion_tempo={minimalData.hero.motion_tempo} />
      <HeroSection {...minimalData.hero} />
      <TextEditorial {...minimalData.editorial} motion_tempo={minimalData.hero.motion_tempo} />
      <ClosingCallToAction {...minimalData.cta} motion_tempo={minimalData.hero.motion_tempo} />
    </div>
  );
}