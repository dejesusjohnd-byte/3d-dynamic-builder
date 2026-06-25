/**
 * THEME: editorial_serif
 * Personality: Magazine energy. Bold, typographic, cultural authority.
 * Best for: Media brands, publishing, cultural institutions, agencies, studios.
 * Accent: Deep red (#c0392b) — editorial urgency, magazine cover energy.
 */
export const editorial_serif = {
  // --- Backgrounds ---
  bg_primary:        '#0e0b08',   // Warm dark brown-black
  bg_card:           '#181410',   // Slightly lighter warm card
  bg_nav:            'rgba(14, 11, 8, 0.9)',

  // --- Borders ---
  border_subtle:     '#2a2218',   // Warm dark divider
  border_card:       '#3a2e22',   // Warm card border

  // --- Text ---
  text_primary:      '#f2ede4',   // Cream white — distinct from cold #f4f4f5
  text_muted:        '#a09080',   // Warm brown-grey
  text_label:        '#70604e',   // Muted warm label

  // --- Accent ---
  accent:            '#c0392b',   // Editorial red — bold, decisive
  accent_hover:      '#f2ede4',   // Cream on hover

  // --- Typography ---
  font_heading:      "'Libre Baskerville', Georgia, serif", // Classic editorial weight
  font_body:         "'Source Serif 4', Georgia, serif",    // Body also serif — full editorial commitment
  font_label:        "'Inter', sans-serif",                 // Labels stay clean for contrast

  // --- Button Style ---
  btn_style:         'filled',    // Filled red — confident editorial CTA
  btn_radius:        '0px',       // Sharp corners = print-inspired

  // --- Specific overrides ---
  hero_bg_filter:    'sepia(30%) opacity(0.2) contrast(1.1)',
  card_media_filter: 'sepia(20%) grayscale(60%) contrast(1.15) brightness(0.6)',
};
