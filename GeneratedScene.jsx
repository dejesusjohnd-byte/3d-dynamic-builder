import React from 'react';
import HeroSection from './components/HeroSection';
import CollageIntroduction from './components/CollageIntroduction';
import StaticOfferingsGrid from './components/StaticOfferingsGrid';
import TwoColumnValuePause from './components/TwoColumnValuePause';
import ClosingCallToAction from './components/ClosingCallToAction';

// ═══════════════════════════════════════════════════════════════
// BUCKET 1 — Identity & the Hook → HeroSection
// ═══════════════════════════════════════════════════════════════
const brand_identity_logo = 'https://zensrenovation.com/_next/image?url=%2Fimages%2Flogo-v3.png&w=3840&q=75';
const hook_headline = 'Built to Last, Crafted to Impress';
const hook_context = 'Zens Renovations specializes in custom decks, privacy fences, and roofing across Hamilton, Niagara, and surrounding areas. Quality outdoor builds and interior renovations, done right.';
const primary_action_label = 'Start Your Project';
const hero_3d_asset_url = ''; // Set to '/assets/model.glb' or Sketchfab UID to load a 3D model. Empty = particle fallback.

// ═══════════════════════════════════════════════════════════════
// BUCKET 2 — Corporate DNA & the Collage → CollageIntroduction
// ═══════════════════════════════════════════════════════════════
const introStatement = 'Transforming Homes with Precision & Care';
const collageImages = [
  'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-4.png&w=3840&q=75',
  'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-5.png&w=3840&q=75',
  'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-1.png&w=3840&q=75',
  'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-2.png&w=3840&q=75',
];

// ═══════════════════════════════════════════════════════════════
// BUCKET 3 — The Symmetric Matrix → StaticOfferingsGrid
// ═══════════════════════════════════════════════════════════════
const offering_units = [
  {
    item_title: 'Decks & Fences',
    item_summary: "Extend your living space outdoors with custom-built decks and privacy fences. We use premium materials to create durable, stylish structures that enhance your home's curb appeal.",
    item_cover_url: 'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-1.png&w=3840&q=75',
  },
  {
    item_title: 'Roofing Services',
    item_summary: 'Protect your home with our professional roofing services. Whether you need repairs or a full replacement, we deliver weather-resistant solutions using top-tier materials.',
    item_cover_url: 'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-2.png&w=3840&q=75',
  },
  {
    item_title: 'General Contracting',
    item_summary: 'We handle every aspect of your construction project with precision. From permits and planning to the final coat of paint, our general contracting services ensure a seamless, stress-free experience.',
    item_cover_url: 'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-4.png&w=3840&q=75',
  },
  {
    item_title: 'Interior Renovations',
    item_summary: 'Transform your living spaces into modern masterpieces. We specialize in custom kitchens, spa-like bathrooms, and finished basements that maximize both comfort and property value.',
    item_cover_url: 'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-5.png&w=3840&q=75',
  },
];

// ═══════════════════════════════════════════════════════════════
// BUCKET 4 — The Deep Trust Philosophy → TwoColumnValuePause
// ═══════════════════════════════════════════════════════════════
const philosophy_anchor = 'A streamlined, transparent process that makes your renovation journey smooth and stress-free.';
const philosophy_deep_dive = 'We start with a conversation about your vision, needs, and budget. Together we plan your project in detail, selecting materials, layouts, and finishes that bring your vision to life. You receive a transparent, itemized quote with no hidden surprises. Once approved, our expert team transforms your space with precision and care, followed by a complete final walkthrough.';
const singular_master_visual = 'https://zensrenovation.com/_next/image?url=%2Fimages%2Fhero%2Fhero-4.png&w=3840&q=75';
const sketchfab_embed_uid = ''; // Set to a Sketchfab model UID to embed 3D. Empty = static image.

// ═══════════════════════════════════════════════════════════════
// BUCKET 5 — The Final Gateway → ClosingCallToAction
// ═══════════════════════════════════════════════════════════════
const closing_invitation = 'Ready to Transform Your Home?';
const target_conversion_label = 'Start Your Project';
const baseline_essentials = {
  corporate_copyright: '\u00a9 2025 Zens Renovations. Hamilton & Niagara.',
  direct_contact_strings: '(437) 410-5329',
};

// ═══════════════════════════════════════════════════════════════
// REACT COMPOSITION — 5 sequential chapters
// ═══════════════════════════════════════════════════════════════
export default function GeneratedScene() {
  return (
    <>
      <HeroSection
        brand_identity_logo={brand_identity_logo}
        hook_headline={hook_headline}
        hook_context={hook_context}
        primary_action_label={primary_action_label}
        hero_3d_asset_url={hero_3d_asset_url}
      />
      <CollageIntroduction
        introStatement={introStatement}
        collageImages={collageImages}
      />
      <StaticOfferingsGrid
        offering_units={offering_units}
      />
      <TwoColumnValuePause
        philosophy_anchor={philosophy_anchor}
        philosophy_deep_dive={philosophy_deep_dive}
        singular_master_visual={singular_master_visual}
        sketchfab_embed_uid={sketchfab_embed_uid}
      />
      <ClosingCallToAction
        closing_invitation={closing_invitation}
        target_conversion_label={target_conversion_label}
        baseline_essentials={baseline_essentials}
      />
    </>
  );
}
