import React from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import StaticOfferingsGrid from '../components/StaticOfferingsGrid';
import TextEditorial from '../components/TextEditorial';
import ClosingCallToAction from '../components/ClosingCallToAction';

const kineticData = {
  // ... (Fill with Kinetic-themed text)
  hero: { 
    motion_tempo: "kinetic_modern", // Faster GSAP timing
    hook_headline: "Accelerated Digital Infrastructure" 
  }
};

export default function GeneratedScene() {
  return (
    <div style={{ backgroundColor: '#09090b' }}>
      <Navigation {...kineticData.nav} />
      <HeroSection {...kineticData.hero} />
      <StaticOfferingsGrid {...kineticData.offerings} />
      <TextEditorial {...kineticData.editorial} />
      <ClosingCallToAction {...kineticData.cta} />
    </div>
  );
}