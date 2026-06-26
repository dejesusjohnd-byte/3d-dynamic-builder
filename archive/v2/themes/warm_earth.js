/**
 * THEME: warm_earth
 * Personality: Authoritative, grounded, professional warmth.
 * Best for: Law firms, finance, consulting, real estate, legacy brands.
 * Accent: Gold (#c8a97e) — inherited from original Quinn Tax reference.
 */
export const warm_earth = {
  // --- Backgrounds ---
  bg_primary:        '#09090b',   // Page / section base
  bg_card:           '#141416',   // Card surfaces (StaticOfferingsGrid)
  bg_nav:            'rgba(9, 9, 11, 0.75)', // Nav blur layer

  // --- Borders ---
  border_subtle:     '#1c1c1e',   // Section dividers
  border_card:       '#27272a',   // Card borders

  // --- Text ---
  text_primary:      '#f4f4f5',   // Headlines
  text_muted:        '#a1a1aa',   // Body / supporting text
  text_label:        '#71717a',   // Chapter labels (small caps)

  // --- Accent ---
  accent:            '#c8a97e',   // CTAs, hover states, particle color
  accent_hover:      '#f4f4f5',   // Button hover text/border shift

  // --- Typography ---
  font_heading:      "'Playfair Display', Georgia, serif",
  font_body:         "'Inter', sans-serif",
  font_label:        "'Inter', sans-serif",

  // --- Button Style ---
  btn_style:         'outline',   // 'outline' | 'filled' | 'ghost'
  btn_radius:        '1px',       // Sharp = premium feel

  // --- Specific overrides ---
  hero_bg_filter:    'grayscale(100%) opacity(0.2) contrast(1.15)',
  card_media_filter: 'grayscale(100%) contrast(1.1) brightness(0.6)',
};
