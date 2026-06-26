import React from 'react';
import SceneRenderer from './renderer/SceneRenderer';

/**
 * APP.JSX — Local Preview Sandbox
 * ─────────────────────────────────────────────────────────────────
 * To preview a site: import its config below and pass it to SceneRenderer.
 * Switch configs to preview different client builds.
 * Never hardcode site data here — all data lives in /configs/.
 * ─────────────────────────────────────────────────────────────────
 */

// ── SWAP THIS IMPORT TO PREVIEW DIFFERENT SITES ──────────────────
import activeConfig from './configs/config_quinn_tax.json';
// import activeConfig from './configs/config_nexus_city.json';
// import activeConfig from './configs/config_your_next_client.json';
// ─────────────────────────────────────────────────────────────────

export default function App() {
  return <SceneRenderer config={activeConfig} />;
}
