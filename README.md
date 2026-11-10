# GoOutToday

React + Vite + Tailwind + shadcn/ui. Ohne Lovable-Abhängigkeiten.

## Lokal starten
    npm install
    npm run dev        # http://localhost:8080

## Bauen
    npm run build      # Ergebnis liegt in dist/

## Auf eigener Domain veröffentlichen (z. B. Netlify, kostenlos)
1. Auf https://app.netlify.com/drop den Ordner `dist/` (oder goouttoday-website.zip entpackt) hineinziehen.
2. In Netlify: Domain management → Add a domain → deine Domain eintragen.
3. Beim Domain-Anbieter (bei dir aktuell über Lovable) die DNS-Einträge setzen, die Netlify anzeigt.

Das Routing nutzt Hash-URLs (z. B. /#/discover), damit braucht der Host keine Sonder-Konfiguration.

## Bilder
Die früheren Lovable-Bilder sind durch freie Fotos von Wikimedia Commons ersetzt.
Sie werden direkt von commons.wikimedia.org geladen. Quellen stehen unter /#/bildnachweise
(Liste: src/data/imageCredits.ts). Lädt ein Bild nicht, zeigt die App eine Farbfläche mit Titel.
