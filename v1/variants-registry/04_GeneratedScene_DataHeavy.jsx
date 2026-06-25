import React from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import StaticOfferingsGrid from '../components/StaticOfferingsGrid';
import TextEditorial from '../components/TextEditorial';
import ClosingCallToAction from '../components/ClosingCallToAction';

const dataHeavyData = {
  nav: {
    brand_identity_string: "DATA.PRECISION",
    navigation_menu_array: [
      { link_label: "Capabilities", scroll_anchor_id: "caps" },
      { link_label: "Methodology", scroll_anchor_id: "method" }
    ],
    action_button_label: "View Report"
  },
  hero: {
    hook_headline: "Engineered for Scale",
    hook_context: "High-density information architecture designed for clarity.",
    primary_action_label: "Explore",
    motion_tempo: "precision_utility",
    depth_layer_one_url: "/assets/abstract-data-loop.mp4"
  },
  gridOne: {
    offering_units: [
      { item_title: "Systems", item_summary: "Robust infrastructure.", item_cover_url: "/img/sys.jpg" },
      { item_title: "Logic", item_summary: "Validated precision.", item_cover_url: "/img/log.jpg" },
      { item_title: "Flow", item_summary: "Optimized delivery.", item_cover_url: "/img/flw.jpg" }
    ]
  },
  gridTwo: {
    offering_units: [
      { item_title: "Strategy", item_summary: "Long-term vision.", item_cover_url: "/img/strat.jpg" },
      { item_title: "Audit", item_summary: "Total visibility.", item_cover_url: "/img/aud.jpg" },
      { item_title: "Growth", item_summary: "Scalable results.", item_cover_url: "/img/grw.jpg" }
    ]
  },
  editorial: {
    editorial_header: "Information Density",
    editorial_body_paragraphs: [
      "We believe that complexity is only a problem if it lacks structure.",
      "By utilizing precise grid architectures, we transform massive datasets into digestible, authoritative experiences."
    ]
  },
  cta: {
    closing_invitation: "Scale your potential.",
    target_conversion_label: "Get Started"
  }
};

export default function GeneratedScene_DataHeavyV4() {
  return (
    <div style={{ backgroundColor: '#09090b', minHeight: '100vh' }}>
      <Navigation {...dataHeavyData.nav} motion_tempo={dataHeavyData.hero.motion_tempo} />
      <HeroSection {...dataHeavyData.hero} />
      <StaticOfferingsGrid {...dataHeavyData.gridOne} motion_tempo={dataHeavyData.hero.motion_tempo} />
      <StaticOfferingsGrid {...dataHeavyData.gridTwo} motion_tempo={dataHeavyData.hero.motion_tempo} />
      <TextEditorial {...dataHeavyData.editorial} motion_tempo={dataHeavyData.hero.motion_tempo} />
      <ClosingCallToAction {...dataHeavyData.cta} motion_tempo={dataHeavyData.hero.motion_tempo} />
    </div>
  );
}