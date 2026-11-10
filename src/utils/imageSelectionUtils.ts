
import { SPECIFIC_ACTIVITY_IMAGES, CATEGORY_IMAGES, FALLBACK_IMAGES } from './imageConstants';

// Map of previously selected images to prevent duplication across the entire application
const usedImageMap = new Map<string, Set<string>>();

// Global cache to track which images are used by which activities
const activityImageMap = new Map<string, string>();

// Track assigned images per activity ID
const activityImageCache = new Map<string|number, string>();

// Keywords map for precise image matching
const keywordToCategory: Record<string, string> = {
  // Food & Drinks
  "kaffee": "cafe",
  "café": "cafe",
  "restaurant": "restaurant",
  "essen": "restaurant",
  "trinken": "restaurant",
  "bar": "bar",
  "brunch": "cafe",
  "frühstück": "cafe",
  
  // Nature & Outdoors
  "spaziergang": "walk",
  "wald": "forest",
  "park": "park",
  "garten": "garden",
  "see": "lake",
  "natur": "nature",
  "wandern": "hiking",
  
  // Markets & Shopping
  "trödelmarkt": "fleamarket",
  "flohmarkt": "fleamarket",
  "markt": "market",
  "einkaufen": "shopping",
  "shopping": "shopping",
  
  // Culture & Arts
  "museum": "museum",
  "galerie": "gallery",
  "ausstellung": "exhibition",
  "kunst": "art",
  "theater": "theater",
  "konzert": "concert",
  "philharmonie": "concert",
  
  // Wellness & Recreation
  "wellness": "wellness",
  "spa": "wellness",
  "massage": "wellness",
  "therme": "wellness",
  "entspannung": "wellness",
  "sauna": "wellness",
  "vabali": "wellness", 
  "liquidrom": "wellness",
  
  // Architecture & Sights
  "kirche": "church",
  "schloss": "castle",
  "palast": "palace",
  "denkmal": "monument",
  "turm": "tower"
};

export const selectImageUrl = (
  title: string,
  category: string,
  id?: number,
  uniqueId?: string
): string => {
  // Check if we already have a cached image for this activity
  const cacheKey = id || uniqueId;
  if (cacheKey && activityImageCache.has(cacheKey)) {
    return activityImageCache.get(cacheKey)!;
  }

  const normalizedTitle = title?.toLowerCase().trim() || "";
  const normalizedCategory = category?.toLowerCase().trim() || "";
  let selectedImage: string | null = null;

  // 1. First try exact activity title match
  if (SPECIFIC_ACTIVITY_IMAGES[normalizedTitle]) {
    selectedImage = SPECIFIC_ACTIVITY_IMAGES[normalizedTitle];
  }

  // 2. Special cases for important activities
  if (!selectedImage) {
    // Special handling for Wellness activities
    if (normalizedTitle.includes("spa") || 
        normalizedTitle.includes("sauna") || 
        normalizedTitle.includes("wellness") ||
        normalizedTitle.includes("massage") || 
        normalizedTitle.includes("therme") || 
        normalizedTitle.includes("vabali") || 
        normalizedTitle.includes("liquidrom") || 
        normalizedCategory.includes("wellness")) {
      selectedImage = CATEGORY_IMAGES["wellness"] || FALLBACK_IMAGES[2];
    }
    
    // Special handling for Philharmonie
    if (normalizedTitle.includes("philharmonie") || 
        normalizedTitle.includes("konzerthaus") || 
        normalizedTitle.includes("elbphilharmonie")) {
      selectedImage = SPECIFIC_ACTIVITY_IMAGES["philharmonie"] || CATEGORY_IMAGES["concert"];
    }
  }

  // 3. If no exact match, check for keywords in title
  if (!selectedImage) {
    const words = normalizedTitle.split(/\s+/);
    for (const word of words) {
      const normalizedWord = word.toLowerCase();
      if (keywordToCategory[normalizedWord]) {
        const categoryKey = keywordToCategory[normalizedWord];
        if (CATEGORY_IMAGES[categoryKey]) {
          selectedImage = CATEGORY_IMAGES[categoryKey];
          break;
        }
      }
    }
  }

  // 4. If still no match, use category image
  if (!selectedImage && CATEGORY_IMAGES[normalizedCategory]) {
    selectedImage = CATEGORY_IMAGES[normalizedCategory];
  }
  
  // 5. Try matching by category words
  if (!selectedImage && normalizedCategory) {
    const categoryWords = normalizedCategory.split(/\s+/);
    for (const word of categoryWords) {
      if (keywordToCategory[word]) {
        const categoryKey = keywordToCategory[word];
        if (CATEGORY_IMAGES[categoryKey]) {
          selectedImage = CATEGORY_IMAGES[categoryKey];
          break;
        }
      }
    }
  }

  // 6. If all else fails, use a deterministic fallback
  if (!selectedImage) {
    const fallbackIndex = Math.abs(
      (cacheKey?.toString() || normalizedTitle)
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0) % FALLBACK_IMAGES.length
    );
    selectedImage = FALLBACK_IMAGES[fallbackIndex];
  }

  // Add cache busting parameter and cache the result
  const finalImage = addCacheBusterParam(selectedImage, uniqueId);
  if (cacheKey) {
    activityImageCache.set(cacheKey, finalImage);
  }

  return finalImage;
};

// Check if an image has been used already
const isImageUsed = (type: string, url: string, uniqueId?: string): boolean => {
  const usedImages = usedImageMap.get(type);
  if (!usedImages) return false;
  
  return usedImages.has(url);
};

// Mark an image as used 
const markImageAsUsed = (type: string, url: string, uniqueId?: string): void => {
  const usedImages = usedImageMap.get(type);
  if (!usedImages) return;
  
  usedImages.add(url);
};

// Extend resetImageSelection to optionally preserve cache
export const resetImageSelection = (preserveCache: boolean = true) => {
  usedImageMap.clear();
  if (!preserveCache) {
    activityImageCache.clear();
  }
};

// Add a cache busting parameter to the URL to prevent browser caching issues
const addCacheBusterParam = (url: string, uniqueId?: string): string => {
  if (!uniqueId) return url;
  
  // Add cache busting to prevent browser cache issues
  const separator = url.includes('?') ? '&' : '?';
  const timestamp = Date.now();
  return `${url}${separator}uid=${encodeURIComponent(uniqueId)}&t=${timestamp}`;
};

// Helper function to get a deterministic fallback image
const getFallbackImage = (id?: number, uniqueId?: string): string => {
  // Make sure we have a consistent but unique value
  const idValue = uniqueId ? 
    uniqueId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 
    (id || 0);
  
  // Use a hash function to ensure consistent distribution
  const hash = Math.abs(idValue % FALLBACK_IMAGES.length);
  
  let selectedImage = FALLBACK_IMAGES[hash];
  
  // Find an unused fallback image
  let attemptsLeft = FALLBACK_IMAGES.length;
  let index = hash;
  
  while (attemptsLeft > 0) {
    selectedImage = FALLBACK_IMAGES[index];
    if (!isImageUsed('fallback', selectedImage, uniqueId)) {
      break;
    }
    index = (index + 1) % FALLBACK_IMAGES.length;
    attemptsLeft--;
  }
  
  // Mark the selected image as used
  markImageAsUsed('fallback', selectedImage, uniqueId);
  
  const finalImage = addCacheBusterParam(selectedImage, uniqueId);
  
  if (uniqueId) {
    activityImageMap.set(uniqueId, finalImage);
  }
  
  return finalImage;
};
