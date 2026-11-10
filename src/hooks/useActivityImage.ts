
import { useMemo } from 'react';
import { Activity } from '../data/allActivities';
import { SPECIFIC_ACTIVITY_IMAGES, CATEGORY_IMAGES } from '@/utils/imageConstants';
import { isUploadedImage } from '@/utils/imageOptimizationUtils';

/**
 * Hook to handle activity image selection and checks
 */
export const useActivityImage = () => {
  /**
   * Checks if an activity has a custom uploaded image
   * Enhanced to detect more cases of custom images and special landmarks
   */
  const hasCustomImage = (activity: Activity): boolean => {
    if (!activity || !activity.title) return false;
    
    // Check if the activity directly has an uploaded image
    if (activity.image && isUploadedImage(activity.image)) {
      console.log(`Activity "${activity.title}" has direct uploaded image`);
      return true;
    }
    
    const normalizedTitle = activity.title.toLowerCase().trim();
    
    // Define special landmarks to look for - expanded list with more specificity
    const specialLandmarks = [
      'teufelsberg', 'east side gallery', 'fernsehturm', 'tv tower',
      'alexanderplatz', 'brandenburger tor', 'brandenburg gate', 'reichstag',
      'tiergarten', 'kurfürstendamm', 'kudamm', 'potsdamer platz', 'museumsinsel',
      'museum island', 'berliner dom', 'berlin cathedral', 'checkpoint charlie',
      'mauerpark', 'treptower park', 'tempelhof', 'victoriapark', 'viktoriapark',
      'grunewald', 'lostplaces', 'lost places', 'abandoned', 'verlassen',
      'wannsee', 'schwimmen', 'badestelle', 'waldbühne', 'waldbuehne', 'philharmonie',
      'konzerthaus', 'botanischer garten', 'schloss', 'palace', 'charlottenburg',
      'spreepark', 'abhörstation', 'garten', 'garden', 'tangoloft', 'tango', 'tanzen',
      'tanzkurs', 'tanzschule', 'dance', 'berghain', 'clubbing', 'nightlife', 'club',
      'berlinische galerie'
    ];
    
    // Direkte Überprüfung für die neu hochgeladenen Bilder
    if (normalizedTitle === "berlinische galerie" || 
        normalizedTitle.includes("berlinische galerie")) {
      return true;
    }
    
    if (normalizedTitle === "philharmonie" || 
        normalizedTitle === "berliner philharmonie" ||
        normalizedTitle.includes("philharmonie")) {
      return true;
    }
    
    if (normalizedTitle === "tangoloft" || 
        normalizedTitle === "tangoloft berlin" ||
        normalizedTitle.includes("tangoloft")) {
      return true;
    }
    
    // Check if the activity is one of our special landmarks
    for (const landmark of specialLandmarks) {
      if (normalizedTitle.includes(landmark)) {
        // Look for matching landmark images
        for (const [key, imgUrl] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
          if ((key.toLowerCase().includes(landmark) || landmark.includes(key.toLowerCase())) && 
              isUploadedImage(imgUrl)) {
            console.log(`Activity "${activity.title}" matches landmark "${landmark}" with uploaded image`);
            return true;
          }
        }
      }
    }
    
    // First check for exact title matches with uploaded images
    if (SPECIFIC_ACTIVITY_IMAGES[normalizedTitle] && 
        isUploadedImage(SPECIFIC_ACTIVITY_IMAGES[normalizedTitle])) {
      console.log(`Activity "${activity.title}" has exact title match with uploaded image`);
      return true;
    }
    
    // Now check for partial matches, being more liberal
    for (const [key, imgUrl] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
      if ((normalizedTitle.includes(key.toLowerCase()) || 
          key.toLowerCase().includes(normalizedTitle)) && 
          isUploadedImage(imgUrl)) {
        console.log(`Activity "${activity.title}" has partial title match with uploaded image via "${key}"`);
        return true;
      }
    }
    
    // Special cases for various activities
    if (checkSpecialCase(normalizedTitle, 'tango', 'tanzen', 'tanzschule', 'tanzkurs', 'dance', 'tangoloft')) {
      console.log(`Activity "${activity.title}" matched as dance/tango activity with special image`);
      return true;
    }
    
    if (checkSpecialCase(normalizedTitle, 'philharmonie', 'konzert', 'konzerthaus', 'oper')) {
      console.log(`Activity "${activity.title}" matched as concert/philharmonie activity with special image`);
      return true;
    }
    
    if (checkSpecialCase(normalizedTitle, 'schloss charlottenburg', 'charlottenburger schloss')) {
      console.log(`Activity "${activity.title}" matched as Schloss Charlottenburg with special image`);
      return true;
    }
    
    if (checkSpecialCase(normalizedTitle, 'berliner dom', 'berlin cathedral')) {
      console.log(`Activity "${activity.title}" matched as Berliner Dom with special image`);
      return true;
    }
    
    if (checkSpecialCase(normalizedTitle, 'berghain') || 
        (normalizedTitle.includes('club') && normalizedTitle.includes('techno'))) {
      console.log(`Activity "${activity.title}" matched as Berghain with special image`);
      return true;
    }
    
    if (checkSpecialCase(normalizedTitle, 'berlinische galerie', 'ausstellung', 'galerie berlin')) {
      console.log(`Activity "${activity.title}" matched as Berlinische Galerie with special image`);
      return true;
    }
    
    // Check for category-based custom images
    if (activity.category && CATEGORY_IMAGES[activity.category.toLowerCase()] && 
        isUploadedImage(CATEGORY_IMAGES[activity.category.toLowerCase()])) {
      console.log(`Activity "${activity.title}" has category match with uploaded image`);
      return true;
    }
    
    return false;
  };

  // Helper function to check if the title includes any of the provided keywords
  const checkSpecialCase = (title: string, ...keywords: string[]): boolean => {
    return keywords.some(keyword => title.includes(keyword));
  };

  /**
   * Get the best image for an activity, prioritizing uploaded images
   * Improved to better match special landmarks
   */
  const getBestImageForActivity = (activity: Activity): string => {
    if (!activity || !activity.title) return '';
    
    const normalizedTitle = activity.title.toLowerCase().trim();
    
    // Direkter Abgleich für die neu hochgeladenen Bilder
    if (normalizedTitle === "berlinische galerie" || normalizedTitle.includes("berlinische galerie")) {
      return "images/c_f6b732dd05.webp";
    }
    
    if (normalizedTitle === "philharmonie" || 
        normalizedTitle === "berliner philharmonie" || 
        normalizedTitle.includes("konzert") && normalizedTitle.includes("philharmonie")) {
      return "images/c_3bd428543a.webp";
    }
    
    if (normalizedTitle === "tangoloft" || normalizedTitle.includes("tangoloft")) {
      return "images/c_6da4c02467.webp";
    }
    
    // Define special landmarks to look for - expanded list
    const specialLandmarks = [
      'teufelsberg', 'east side gallery', 'fernsehturm', 'tv tower',
      'alexanderplatz', 'brandenburger tor', 'brandenburg gate', 'reichstag',
      'tiergarten', 'kurfürstendamm', 'potsdamer platz', 'museumsinsel',
      'museum island', 'berliner dom', 'berlin cathedral', 'schloss charlottenburg',
      'charlottenburg palace', 'olympiastadion', 'olympia stadium', 'zoologischer garten',
      'zoo', 'funkturm', 'radio tower', 'tempelhof', 'spree', 'wannsee', 'kadewe',
      'checkpoint charlie', 'waldbühne', 'waldbuehne', 'philharmonie', 'konzerthaus',
      'botanischer garten', 'spreepark', 'abhörstation', 'lostplaces', 'berghain',
      'berlinische galerie', 'tangoloft'
    ];
    
    // Special cases with direct image mappings
    if (checkSpecialCase(normalizedTitle, 'berlinische galerie')) {
      console.log(`Using Berlinische Galerie image for "${activity.title}"`);
      return "images/c_f6b732dd05.webp";
    }

    if (checkSpecialCase(normalizedTitle, 'tangoloft', 'tangoloft berlin')) {
      console.log(`Using Tangoloft image for "${activity.title}"`);
      return "images/c_6da4c02467.webp";
    }
    
    if (checkSpecialCase(normalizedTitle, 'philharmonie', 'berliner philharmonie', 'konzert philharmonie')) {
      console.log(`Using Philharmonie image for "${activity.title}"`);
      return "images/c_3bd428543a.webp";
    }
    
    if (checkSpecialCase(normalizedTitle, 'tango', 'tanzen', 'tanzschule', 'tanzkurs', 'dance') && 
        !normalizedTitle.includes('tangoloft')) {
      console.log(`Using Tango image for "${activity.title}"`);
      return "images/c_0214a81b3a.webp";
    }
    
    if (checkSpecialCase(normalizedTitle, 'schloss charlottenburg', 'charlottenburger schloss')) {
      console.log(`Using Schloss Charlottenburg image for "${activity.title}"`);
      return "images/c_c116a3e03d.webp";
    }
    
    if (checkSpecialCase(normalizedTitle, 'berliner dom', 'berlin cathedral')) {
      console.log(`Using Berliner Dom image for "${activity.title}"`);
      return "images/c_8afebb7e24.webp";
    }
    
    if (checkSpecialCase(normalizedTitle, 'berghain') || 
        (normalizedTitle.includes('club') && normalizedTitle.includes('techno'))) {
      console.log(`Using Berghain image for "${activity.title}"`);
      return "images/c_c568ca5d85.webp";
    }
    
    // Check if the activity is one of our special landmarks
    for (const landmark of specialLandmarks) {
      if (normalizedTitle.includes(landmark)) {
        // Look for matching landmark images
        for (const [key, imgUrl] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
          if (key.toLowerCase().includes(landmark) || landmark.includes(key.toLowerCase())) {
            console.log(`Found special landmark match for "${activity.title}" using "${landmark}" keyword`);
            return imgUrl;
          }
        }
      }
    }
    
    // First check exact title match (highest priority)
    if (SPECIFIC_ACTIVITY_IMAGES[normalizedTitle]) {
      return SPECIFIC_ACTIVITY_IMAGES[normalizedTitle];
    }
    
    // Check partial matches with SPECIFIC_ACTIVITY_IMAGES (more liberal matching)
    for (const [key, imgUrl] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
      if (normalizedTitle.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTitle)) {
        return imgUrl;
      }
    }
    
    // Use the existing image if it exists
    if (activity.image) return activity.image;
    
    // Use category image as fallback
    if (activity.category && CATEGORY_IMAGES[activity.category.toLowerCase()]) {
      return CATEGORY_IMAGES[activity.category.toLowerCase()];
    }
    
    return '';
  };

  /**
   * Get comprehensive list of activities with custom images
   */
  const getActivitiesWithCustomImages = (activities: Activity[]): Activity[] => {
    return activities.filter(hasCustomImage);
  };

  return {
    hasCustomImage,
    getBestImageForActivity,
    getActivitiesWithCustomImages
  };
};
