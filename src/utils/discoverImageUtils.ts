
import { SPECIFIC_ACTIVITY_IMAGES, CATEGORY_IMAGES, FALLBACK_IMAGES } from './imageConstants';

// Lokaler Cache, um konsistente Bilder für die gleiche Aktivität zu gewährleisten
const imageCache: Map<string, string> = new Map();

// Liste der bereits versuchten Bilder, die fehlgeschlagen sind
const failedImages: Set<string> = new Set();

// Logging-Funktion für die Bildauswahl
const logImageSelection = (message: string, important: boolean = false) => {
  if (typeof console !== 'undefined') {
    console.info(message);
  }
};

/**
 * Prüft, ob ein Bild geladen werden kann
 * (Hilft, 404-Fehler zu vermeiden)
 */
const isImageAvailable = (url: string): Promise<boolean> => {
  // Für lokale Bilder (lovable-uploads) immer true zurückgeben
  if (url.includes('images/c_')) {
    return Promise.resolve(true);
  }

  // Für bereits fehlgeschlagene Bilder sofort false zurückgeben
  if (failedImages.has(url)) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    const img = new Image();
    let timeout: ReturnType<typeof setTimeout>;
    
    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      failedImages.add(url); // Zur Liste der fehlgeschlagenen Bilder hinzufügen
      resolve(false);
    };
    
    // Timeout nach 3 Sekunden, falls das Bild nicht lädt
    timeout = setTimeout(() => {
      failedImages.add(url);
      resolve(false);
    }, 3000);
    
    img.src = url;
  });
};

/**
 * Verbesserte Bildauswahllogik für die Discover-Seite, um aktivitätsspezifische Bilder zu finden
 */
export function getDiscoverImage(
  title: string = '',
  category: string = '',
  description: string = ''
): string {
  // Erstelle einen eindeutigen Schlüssel für das Caching
  const cacheKey = `${title}-${category}`.toLowerCase();
  
  // Wenn das Bild bereits im Cache ist, verwende es für konsistente Anzeige
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }
  
  // Normalisiere den Text für besseren Vergleich
  const normalizedTitle = title.toLowerCase();
  const normalizedDesc = description ? description.toLowerCase() : '';
  const normalizedCategory = category ? category.toLowerCase() : '';
  const combinedSearchText = `${normalizedTitle} ${normalizedDesc}`;
  
  let imageUrl: string = ''; // Initialize with empty string instead of null
  
  // 1. Exakte Titel-Übereinstimmung (höchste Priorität)
  for (const [key, url] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
    if (normalizedTitle === key.toLowerCase()) {
      imageUrl = url;
      break;
    }
  }
  
  // 2. Falls kein exakter Treffer, prüfe ob der komplette Titeltext in einem der Schlüssel enthalten ist
  if (!imageUrl) {
    for (const [key, url] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
      if (key.toLowerCase().includes(normalizedTitle) || normalizedTitle.includes(key.toLowerCase())) {
        imageUrl = url;
        break;
      }
    }
  }
  
  // 3. Falls immer noch kein Treffer, suche nach Wörtern im Titel die mindestens 4 Zeichen lang sind
  if (!imageUrl) {
    const titleWords = normalizedTitle.split(/\s+/);
    for (const word of titleWords) {
      if (word.length > 3) { // Nur längere Wörter prüfen
        for (const [key, url] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
          if (key.toLowerCase().includes(word) || word.includes(key.toLowerCase())) {
            imageUrl = url;
            break;
          }
        }
        if (imageUrl) break;
      }
    }
  }
  
  // 4. Erweiterte Suche im kombinierten Text aus Titel und Beschreibung
  if (!imageUrl) {
    const boatKeywords = ["boot", "kanu", "kajak", "ruder", "wasser", "paddel", "segeln", "tretboot", "schiff", "fluss", "bootsverleih"];
    const museumKeywords = ["museum", "ausstellung", "galerie", "sammlung", "kunst"];
    const natureKeywords = ["park", "garten", "see", "wald", "natur", "grün", "spaziergang"];
    const culturalKeywords = ["theater", "oper", "konzert", "bühne", "vorstellung", "philharmonie"];
    const tourismKeywords = ["besichtigung", "sightseeing", "stadtführung", "rundgang", "tour"];
    const foodKeywords = ["essen", "restaurant", "café", "biergarten", "street food", "markt"];
    
    // Prüfe verschiedene Kategorien von Schlüsselwörtern im Text
    let matchedKeywords: string[] = [];
    
    if (boatKeywords.some(keyword => combinedSearchText.includes(keyword))) {
      matchedKeywords = boatKeywords;
    } else if (museumKeywords.some(keyword => combinedSearchText.includes(keyword))) {
      matchedKeywords = museumKeywords;
    } else if (natureKeywords.some(keyword => combinedSearchText.includes(keyword))) {
      matchedKeywords = natureKeywords;
    } else if (culturalKeywords.some(keyword => combinedSearchText.includes(keyword))) {
      matchedKeywords = culturalKeywords;
    } else if (tourismKeywords.some(keyword => combinedSearchText.includes(keyword))) {
      matchedKeywords = tourismKeywords;
    } else if (foodKeywords.some(keyword => combinedSearchText.includes(keyword))) {
      matchedKeywords = foodKeywords;
    }
    
    // Suche passende Bilder für die gefundene Kategorie
    if (matchedKeywords.length > 0) {
      for (const keyword of matchedKeywords) {
        if (combinedSearchText.includes(keyword)) {
          for (const [key, url] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
            if (key.toLowerCase().includes(keyword)) {
              imageUrl = url;
              break;
            }
          }
          if (imageUrl) break;
        }
      }
    }
  }
  
  // 5. Suche nach Schlüsselwörtern im Titel und der Beschreibung
  if (!imageUrl) {
    for (const [key, url] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
      if (combinedSearchText.includes(key.toLowerCase())) {
        imageUrl = url;
        break;
      }
    }
  }
  
  // 6. Suche nach Ortsnamen in Titel oder Beschreibung
  if (!imageUrl) {
    const cityKeywords = ["berlin", "hamburg", "köln", "frankfurt", "dresden", "münchen"];
    const landmarkKeywords = ["brandenburger", "dom", "frauenkirche", "fernsehturm", "elbphilharmonie"];
    
    for (const city of cityKeywords) {
      if (combinedSearchText.includes(city)) {
        for (const [key, url] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
          if (key.toLowerCase().includes(city)) {
            imageUrl = url;
            break;
          }
        }
      }
      if (imageUrl) break;
    }
    
    if (!imageUrl) {
      for (const landmark of landmarkKeywords) {
        if (combinedSearchText.includes(landmark)) {
          for (const [key, url] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
            if (key.toLowerCase().includes(landmark)) {
              imageUrl = url;
              break;
            }
          }
        }
        if (imageUrl) break;
      }
    }
  }
  
  // 7. Wenn noch immer keine Übereinstimmung, versuche es mit der Kategorie
  if (!imageUrl && normalizedCategory) {
    // Direkte Kategorieübereinstimmung
    if (CATEGORY_IMAGES[normalizedCategory]) {
      logImageSelection(`Trying category image for "${title}": ${CATEGORY_IMAGES[normalizedCategory]}`);
      imageUrl = CATEGORY_IMAGES[normalizedCategory];
    } 
    // Kategoriebestandteile
    else {
      for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
        if (normalizedCategory.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedCategory)) {
          logImageSelection(`Found category match for "${title}" with "${key}": ${url}`);
          imageUrl = url;
          break;
        }
      }
    }
  }
  
  // 8. Fallback: Verwende ein deterministisches Bild basierend auf dem Titel
  if (!imageUrl) {
    const hashCode = getStringHashCode(title + category);
    const index = Math.abs(hashCode) % FALLBACK_IMAGES.length;
    imageUrl = FALLBACK_IMAGES[index];
    logImageSelection(`Using fallback image for "${title}": ${imageUrl}`);
  }
  
  // 9. Prüfe, ob das Bild tatsächlich geladen werden kann
  // Für die sofortige Rückgabe wird das Ergebnis zunächst im Cache gespeichert
  imageCache.set(cacheKey, imageUrl);
  
  // Starte eine asynchrone Prüfung, ob das Bild geladen werden kann
  isImageAvailable(imageUrl).then(available => {
    if (!available) {
      logImageSelection(`Image error for "${title}" - attempt 1`, true);
      
      // Wenn nicht, versuche es mit einer Kategorie
      let fallbackImage = '';
      
      if (normalizedCategory && CATEGORY_IMAGES[normalizedCategory]) {
        fallbackImage = CATEGORY_IMAGES[normalizedCategory];
        logImageSelection(`Trying category image for "${title}": ${fallbackImage}`);
      }
      
      // Wenn keine Kategorie passt, verwende ein Fallback-Bild
      if (!fallbackImage || !available) {
        const hashCode = getStringHashCode(title + category);
        const index = Math.abs(hashCode) % FALLBACK_IMAGES.length;
        fallbackImage = FALLBACK_IMAGES[index];
        logImageSelection(`Using fallback image for "${title}": ${fallbackImage}`);
      }
      
      // Ersetze den Eintrag im Cache
      imageCache.set(cacheKey, fallbackImage);
    }
  });
  
  return imageCache.get(cacheKey)!;
}

/**
 * Erzeugt einen deterministischen Hashcode für einen String
 * (Wird für konsistente Bildauswahl verwendet)
 */
function getStringHashCode(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Konvertiere zu 32bit Integer
  }
  
  return hash;
}

/**
 * Löscht den Bild-Cache
 * (Nützlich beim Umschalten zwischen verschiedenen Ansichten)
 */
export function clearImageCache(): void {
  imageCache.clear();
  failedImages.clear();
  logImageSelection("Image cache cleared");
}

/**
 * Fügt einen Cache-Busting-Parameter zur URL hinzu
 */
export function addCacheBuster(url: string): string {
  if (!url) return url;
  const timestamp = new Date().getTime();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${timestamp}`;
}
