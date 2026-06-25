/**
 * THEME: dark_gold
 * Personality: Ultra-premium, cinematic, opulent. Maximum luxury signal.
 * Best for: Luxury goods, private banking, high-end hospitality, watches, fashion.
 * Accent: Deep gold (#e8c47a) — richer, warmer than warm_earth's #c8a97e.
 */
export const dark_gold = {
  // --- Backgrounds ---
  bg_primary:        '#050404',   // Almost pure black with warm undertone
  bg_card:           '#0f0d0b',   // Warm dark card surface
  bg_nav:            'rgba(5, 4, 4, 0.85)',

  // --- Borders ---
  border_subtle:     '#1a1613',   // Barely-there warm dividers
  border_card:       '#2a2218',   // Warm-toned card border

  // --- Text ---
  text_primary:      '#f5f0e8',   // Warm cream white — not cold
  text_muted:        '#9a8f7e',   // Warm grey body
  text_label:        '#6b5f4e',   // Muted warm gold chapter labels

  // --- Accent ---
  accent:            '#e8c47a',   // Deeper, richer gold
  accent_hover:      '#f5f0e8',   // Cream on hover

  // --- Typography ---
  font_heading:      "'Cormorant Garamond', 'Playfair Display', Georgia, serif", // More opulent than Playfair
  font_body:         "'Inter', sans-serif",
  font_label:        "'Inter', sans-serif",

  // --- Button Style ---
  btn_style:         'ghost',     // Barely-there border — understated luxury
  btn_radius:        '0px',       // Zero radius = architectural sharpness

  // --- Specific overrides ---
  hero_bg_filter:    'sepia(20%) opacity(0.18) contrast(1.2)',
  card_media_filter: 'sepia(15%) grayscale(80%) contrast(1.1) brightness(0.55)',
};
