/**
 * THEME: light_minimal
 * Personality: Clean, confident, Scandinavian restraint. Content-first.
 * Best for: Architecture studios, product design, portfolios, editorial brands.
 * Accent: Near-black (#111111) — no color accent, just pure contrast.
 * NOTE: This is the only light-background theme. Components need to handle
 * inverted text colors. SceneRenderer applies a data-theme="light" attribute
 * so components can conditionally adjust.
 */
export const light_minimal = {
  // --- Backgrounds ---
  bg_primary:        '#fafafa',   // Off-white — warmer than pure #ffffff
  bg_card:           '#f0f0ee',   // Slightly warm card surface
  bg_nav:            'rgba(250, 250, 250, 0.85)',

  // --- Borders ---
  border_subtle:     '#e4e4e2',   // Soft warm grey dividers
  border_card:       '#d4d4d0',   // Card borders

  // --- Text ---
  text_primary:      '#111111',   // Near-black headlines
  text_muted:        '#666662',   // Warm grey body
  text_label:        '#999994',   // Light chapter labels

  // --- Accent ---
  accent:            '#111111',   // Black CTA — maximum contrast
  accent_hover:      '#444440',   // Softens on hover

  // --- Typography ---
  font_heading:      "'DM Serif Display', Georgia, serif",
  font_body:         "'Inter', sans-serif",
  font_label:        "'Inter', sans-serif",

  // --- Button Style ---
  btn_style:         'outline',
  btn_radius:        '2px',

  // --- Specific overrides ---
  // Inverted from dark themes — images stay natural, less filtering
  hero_bg_filter:    'opacity(0.12) contrast(1.05)',
  card_media_filter: 'contrast(1.05) brightness(0.9)',

  // Flag for SceneRenderer to apply inverted color logic
  is_light_theme:    true,
};
