// ./components/motion_registry.js

/**
 * GLOBAL MOTION TEMPO RULEBOOK
 * Used by Member 3/Claude to orchestrate component phasing.
 */
export const MOTION_PROFILES = {
  // V1 Luxury: Designed for high-end, slow-paced cinematic impact
  slow_luxury: {
    duration: 2.2,
    ease: "power4.out",
    stagger: 0.15
  },
  
  // V2 Kinetic: Designed for modern, fast-paced interaction
  kinetic_modern: {
    duration: 0.8,
    ease: "power2.inOut",
    stagger: 0.05
  },

  // V3 Minimal: Uses the slow_luxury profile to maximize breathing room
  minimalist_restraint: {
    duration: 2.5, // Slightly slower than standard luxury for deeper "silence"
    ease: "power1.inOut",
    stagger: 0.2
  },

  // V4 Data Heavy: Precision timing for grid-dense layouts
  precision_utility: {
    duration: 0.5,
    ease: "power2.out",
    stagger: 0.05
  }
};