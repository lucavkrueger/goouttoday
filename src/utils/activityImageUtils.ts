
// Specialized image collections for different categories and themes
// Each activity will receive a unique, thematically appropriate image
import { SPECIFIC_ACTIVITY_IMAGES, CATEGORY_IMAGES, FALLBACK_IMAGES } from './imageConstants';

// Function to check if a title/location matches any key in the given dictionary
const findMatchInDictionary = (text: string, dictionary: Record<string, string>): string | null => {
  if (!text) return null;
  const lowercaseText = text.toLowerCase();
  
  for (const [key, url] of Object.entries(dictionary)) {
    if (lowercaseText.includes(key.toLowerCase())) {
      return url;
    }
  }
  
  return null;
};

// Get a specific image for an activity based on its unique ID - ensures consistency
const getActivityImageById = (id: number | undefined): string | null => {
  if (!id) return null;
  
  // Use a deterministic approach based on ID to assign images
  // This way the same activity always gets the same image
  const idBasedImageSets = [
    [
      "https://images.unsplash.com/photo-1585001644052-fbb466de340f?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566932769119-7a280b44857b?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1628694647734-bf4aedeede1e?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600713198455-d7e3bc5fedce?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599989850406-3c8de3eaac65?q=80&w=2000&auto=format&fit=crop"
    ],
    [
      "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608060349380-9fa7bee1aa72?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510265119258-db115b0e8172?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583002083769-0bdb6149e5b5?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516737347189-49ba81f8305c?q=80&w=2000&auto=format&fit=crop"
    ],
    [
      "https://images.unsplash.com/photo-1573158026303-df15dd6b3a54?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600190184058-4c1df469bbf7?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1638784886772-dae3c76d6c6f?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518944117945-e7f172e874f4?q=80&w=2000&auto=format&fit=crop"
    ]
  ];
  
  // Use the ID to select an image set and then an image within that set
  const setIndex = id % idBasedImageSets.length;
  const imageIndex = Math.floor(id / idBasedImageSets.length) % idBasedImageSets[setIndex].length;
  
  return idBasedImageSets[setIndex][imageIndex];
};

// Enhanced image selection with multiple criteria and fallbacks, including ID-based uniqueness
export const getActivityImage = (
  title: string,
  category: string,
  address: string = "",
  description: string = "",
  location: string = "",
  activityHash: string = "",
  id?: number,
  isFallback: boolean = false
): string => {
  // When using as fallback, we prioritize category to ensure we get a good image
  if (isFallback) {
    return CATEGORY_IMAGES[category as keyof typeof CATEGORY_IMAGES] || CATEGORY_IMAGES.default || FALLBACK_IMAGES[0];
  }
  
  // 1. Check for exact activity name match
  const normalizedTitle = title.toLowerCase().trim();
  
  // Direct lookup for custom uploaded images in SPECIFIC_ACTIVITY_IMAGES
  if (SPECIFIC_ACTIVITY_IMAGES[normalizedTitle]) {
    return SPECIFIC_ACTIVITY_IMAGES[normalizedTitle];
  }
  
  // 2. Check for specific context clues in title + description that might indicate special environments
  const combinedText = `${title} ${description}`.toLowerCase();
  
  // 3. Check for specific matches in our special collections using combined or partial text
  for (const [key, url] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
    if (normalizedTitle.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTitle)) {
      return url;
    }
  }
  
  // 4. Check for partial title matches in SPECIFIC_ACTIVITY_IMAGES
  for (const [key, url] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
    if (combinedText.includes(key.toLowerCase())) {
      return url;
    }
  }
  
  // 5. If an image is explicitly provided in the activity data, use it
  if (address) {
    const addressMatch = findMatchInDictionary(address, SPECIFIC_ACTIVITY_IMAGES);
    if (addressMatch) return addressMatch;
  }
  
  // 6. Try to find a category-based image
  if (category && CATEGORY_IMAGES[category.toLowerCase()]) {
    return CATEGORY_IMAGES[category.toLowerCase()];
  }
  
  // 7. Get a unique image based on the activity ID
  const idBasedImage = getActivityImageById(id);
  if (idBasedImage) return idBasedImage;

  // 8. Last resort: get a fallback image
  const hashValue = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fallbackIndex = Math.abs(hashValue % FALLBACK_IMAGES.length);
  
  return FALLBACK_IMAGES[fallbackIndex];
};
