
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
      "images/r_15db536d24.webp",
      "images/r_dcc0b03cef.webp",
      "images/u_46c4f93a9b.webp",
      "images/r_fd7efb4862.webp",
      "images/c_0ae77e4588.webp"
    ],
    [
      "images/u_3716d7ca13.webp",
      "images/c_0214a81b3a.webp",
      "images/u_e4684477d2.webp",
      "images/r_23fae6d9c5.webp",
      "images/c_0cca45d2c1.webp"
    ],
    [
      "images/r_420f0d625d.webp",
      "images/r_e3a381a2d2.webp",
      "images/c_5223d34db1.webp",
      "images/u_7ce599ee3a.webp",
      "images/c_426a50cd0b.webp"
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
