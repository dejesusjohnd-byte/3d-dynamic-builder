/**
 * THEME REGISTRY — Master Token Map
 * Each theme defines the full visual identity of a site.
 * SceneRenderer reads the active theme and passes it to every component.
 * Member 1: Add new themes here. Never modify existing keys without versioning.
 */

import { warm_earth } from './warm_earth';
import { cold_tech } from './cold_tech';
import { dark_gold } from './dark_gold';
import { light_minimal } from './light_minimal';
import { editorial_serif } from './editorial_serif';

export const THEME_REGISTRY = {
  warm_earth,
  cold_tech,
  dark_gold,
  light_minimal,
  editorial_serif,
};

/**
 * Helper used by SceneRenderer to resolve the active theme.
 * Falls back to warm_earth if an unknown token is passed.
 */
export function resolveTheme(token) {
  return THEME_REGISTRY[token] || THEME_REGISTRY.warm_earth;
}
