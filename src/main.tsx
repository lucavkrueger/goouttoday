import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { fallbackImageFor } from './utils/imageFallback'

// Bilder, die nicht laden (z. B. in der Claude-Vorschau, die externe Bilder blockiert),
// werden durch eine Kachel mit Kategorie-Symbol und Titel ersetzt.
window.addEventListener('error', (e) => {
  const img = e.target as HTMLImageElement;
  if (!(img instanceof HTMLImageElement) || img.dataset.fallback) return;
  img.dataset.fallback = '1';
  img.src = fallbackImageFor(img.alt || 'GoOutToday');
}, true);

createRoot(document.getElementById("root")!).render(<App />);
