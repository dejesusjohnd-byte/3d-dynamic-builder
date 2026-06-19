/* ═══════════════════════════════════════════════════════════════
   main.jsx — Vite entry point
   Mounts GeneratedScene into #root
   ═══════════════════════════════════════════════════════════════ */
import React from 'react';
import ReactDOM from 'react-dom/client';
import GeneratedScene from './GeneratedScene';

// Hide loader when React mounts
function AppWrapper() {
  React.useEffect(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      // Small delay for smooth transition
      setTimeout(() => loader.classList.add('done'), 400);
    }
  }, []);

  return <GeneratedScene />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
