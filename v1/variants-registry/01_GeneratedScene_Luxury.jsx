import React from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import CollageIntroduction from '../components/CollageIntroduction';
import StaticOfferingsGrid from '../components/StaticOfferingsGrid';
import TwoColumnValuePause from '../components/TwoColumnValuePause';
import ClosingCallToAction from '../components/ClosingCallToAction';

// This is the data object Member 3 fills out based on Member 2's AI Videos
const variantData = {
  nav: { 
    brand_identity_string: "PREMIUM.STUDIO", 
    navigation_menu_array: [
        { link_label: "Approach", scroll_anchor_id: "approach" },
        { link_label: "Work", scroll_anchor_id: "work" }
    ], 
    action_button_label: "Consult" 
  },
  hero: {
    hook_headline: "Crafting Digital Sovereignty",
    hook_context: "High-end spatial experiences engineered for the modern brand.",
    primary_action_label: "Explore",
    motion_tempo: "slow_luxury",
    depth_layer_one_url: "LINK_FROM_MEMBER_2" // Member 3 pastes AI Video URL here
  },
  collage: {
    introStatement: "Deliberate aesthetics meet precise structural execution.",
    collageImages: ["IMG_1", "IMG_2", "IMG_3", "IMG_4"]
  },
  offerings: {
    offering_units: [
      { item_title: "Spatial Optimization", item_summary: "Tailored volume balancing.", item_cover_url: "IMG_URL" },
      { item_title: "Kinetic Motion", item_summary: "High-fidelity motion loops.", item_cover_url: "IMG_URL" },
      { item_title: "Brand Strategy", item_summary: "Identity blueprinting.", item_cover_url: "IMG_URL" }
    ]
  },
  cta: {
    closing_invitation: "Ready to elevate your presence?",
    target_conversion_label: "Initiate Briefing"
  }
};

export default function GeneratedScene() {
  return (
    <div style={{ backgroundColor: '#09090b' }}>
      <Navigation {...variantData.nav} />
      <HeroSection {...variantData.hero} />
      <CollageIntroduction {...variantData.collage} />
      <StaticOfferingsGrid {...variantData.offerings} />
      <ClosingCallToAction {...variantData.cta} />
    </div>
  );
}