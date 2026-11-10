import { renderToStaticMarkup } from "react-dom/server";
import {
  Palette, Music, Utensils, Dumbbell, Trees, Landmark, Drama, Library, Footprints, Ghost, Waves,
  Scroll, ShoppingBag, Users, Building2, Flower2, Store, Sparkles, Camera, Coffee, Leaf, MapPin,
} from "lucide-react";
import { randomActivities, personalizedActivitiesList } from "@/data/allActivities";
import { allCitiesActivities } from "@/data/citiesActivities";
import { discoverActivities } from "@/data/discoverData";
import { moreBerlinActivities } from "@/data/moreBerlinActivities";
import { nationalActivities } from "@/data/nationalActivities";

// Kategorie -> Symbol und Farbton für Bilder, die nicht geladen werden können
const STYLE: Record<string, [typeof MapPin, number]> = {
  Kunst: [Palette, 330], Galerien: [Palette, 330], Ausstellungen: [Palette, 330],
  Musik: [Music, 265], Konzerte: [Music, 265],
  Gastronomie: [Utensils, 25], "Essen & Trinken": [Utensils, 25], Restaurants: [Utensils, 25], Cafés: [Coffee, 30],
  Sport: [Dumbbell, 145],
  Natur: [Trees, 125], Parks: [Trees, 125], Gärten: [Flower2, 110],
  Museum: [Landmark, 215], Museen: [Landmark, 215],
  Theater: [Drama, 350], Kultur: [Library, 280], Tanzen: [Footprints, 300],
  Lostplaces: [Ghost, 200], See: [Waves, 195], "Am Wasser": [Waves, 195],
  Geschichte: [Scroll, 40], "Historische Stätten": [Scroll, 40],
  Shopping: [ShoppingBag, 345], Märkte: [Store, 15], Flohmärkte: [Store, 15],
  Familie: [Users, 50], Architektur: [Building2, 225],
  Wellness: [Flower2, 175], Erlebnis: [Sparkles, 250],
  Sehenswürdigkeiten: [Camera, 205], Sightseeing: [Camera, 205], Fotografie: [Camera, 205],
  Nachhaltigkeit: [Leaf, 100],
};

const categoryByTitle = new Map<string, string>();
[randomActivities, personalizedActivitiesList, allCitiesActivities, discoverActivities, moreBerlinActivities, nationalActivities]
  .flat()
  .forEach((a: any) => a?.title && a?.category && categoryByTitle.set(String(a.title).toLowerCase(), a.category));

const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

const cache = new Map<string, string>();

export const fallbackImageFor = (label: string): string => {
  const key = label || "GoOutToday";
  if (cache.has(key)) return cache.get(key)!;
  const category = categoryByTitle.get(key.toLowerCase()) || "";
  const [Icon, hue] = STYLE[category] || [MapPin, 210];
  const icon = renderToStaticMarkup(<Icon size={120} color="#ffffff" strokeWidth={1.5} />)
    .replace("<svg", '<svg x="340" y="110"');
  const title = esc(key.slice(0, 42));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},60%,58%)"/><stop offset="1" stop-color="hsl(${hue + 20},55%,38%)"/></linearGradient></defs><rect width="800" height="500" fill="url(#g)"/><circle cx="400" cy="170" r="105" fill="#ffffff" fill-opacity=".14"/>${icon}<text x="400" y="345" font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="36" font-weight="600" fill="#fff" text-anchor="middle">${title}</text>${category ? `<text x="400" y="392" font-family="system-ui,sans-serif" font-size="22" fill="#fff" fill-opacity=".8" text-anchor="middle" letter-spacing="2">${esc(category.toUpperCase())}</text>` : ""}</svg>`;
  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  cache.set(key, url);
  return url;
};
