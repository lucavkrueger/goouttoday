
import { useMemo } from 'react';
import { Activity } from '../data/allActivities';
import { SPECIFIC_ACTIVITY_IMAGES, CATEGORY_IMAGES } from '@/utils/imageConstants';
import { prefetchImages } from '@/utils/imageOptimizationUtils';

// Helper function to check if an image URL is one of our uploaded images
const isUploadedImage = (imageUrl: string | undefined): boolean => {
  if (!imageUrl) return false;
  return imageUrl.includes('Special:FilePath');
};

// Simple string hash function
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

// Helper to check if an activity has a valid image available
const hasValidImage = (activity: Activity, bestImage: string): boolean => {
  return bestImage.trim() !== '';
};

// Function to get the best possible image for an activity
const getBestImageForActivity = (activity: Activity): string => {
  if (!activity.title) return '';
  
  const normalizedTitle = activity.title.toLowerCase().trim();
  
  // Check direct match with uploaded image first (highest priority)
  for (const [key, imgUrl] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
    if (key.toLowerCase() === normalizedTitle && isUploadedImage(imgUrl)) {
      console.log(`Found exact uploaded image match for "${activity.title}": ${imgUrl}`);
      return imgUrl;
    }
  }
  
  // Check for partial match with uploaded images (second priority)
  for (const [key, imgUrl] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
    if ((normalizedTitle.includes(key.toLowerCase()) || 
         key.toLowerCase().includes(normalizedTitle)) && 
         isUploadedImage(imgUrl)) {
      console.log(`Found partial uploaded image match for "${activity.title}" using key "${key}": ${imgUrl}`);
      return imgUrl;
    }
  }
  
  // If activity already has an image, return it (third priority)
  if (activity.image && activity.image.trim() !== '') {
    return activity.image;
  }
  
  // Check for exact title match in regular images (fourth priority)
  if (SPECIFIC_ACTIVITY_IMAGES[normalizedTitle]) {
    return SPECIFIC_ACTIVITY_IMAGES[normalizedTitle];
  }
  
  // Check for partial title matches in regular images (fifth priority)
  for (const [key, imgUrl] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
    if (normalizedTitle.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTitle)) {
      return imgUrl;
    }
  }
  
  // Use category image as fallback (last resort)
  if (activity.category && CATEGORY_IMAGES[activity.category.toLowerCase()]) {
    return CATEGORY_IMAGES[activity.category.toLowerCase()];
  }
  
  return '';
};

// Enhanced function to check if an activity has a custom uploaded image
const hasUploadedImage = (activity: Activity): boolean => {
  if (!activity.title) return false;
  const normalizedTitle = activity.title.toLowerCase().trim();
  
  // Check for exact match with uploaded images
  for (const [key, imgUrl] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
    if ((key.toLowerCase() === normalizedTitle || 
        normalizedTitle.includes(key.toLowerCase()) || 
        key.toLowerCase().includes(normalizedTitle)) && 
        isUploadedImage(imgUrl)) {
      return true;
    }
  }
  
  // Also check if the activity already has an uploaded image
  if (activity.image && isUploadedImage(activity.image)) {
    return true;
  }
  
  return false;
};

interface UseActivityProcessingResult {
  validActivities: Activity[];
  uniqueActivityIds: Map<Activity, number>;
  activitiesWithUploadedImages: Activity[]; // New property for activities with uploaded images
}

export const useActivityProcessing = (
  activities: Activity[], 
  userLocation: string
): UseActivityProcessingResult => {
  // Sort activities to prioritize ones with uploaded images
  const sortActivitiesByImageQuality = (acts: Activity[]): Activity[] => {
    return [...acts].sort((a, b) => {
      const imgA = getBestImageForActivity(a);
      const imgB = getBestImageForActivity(b);
      
      // Prioritize uploaded images
      const aIsUploaded = isUploadedImage(imgA);
      const bIsUploaded = isUploadedImage(imgB);
      
      if (aIsUploaded && !bIsUploaded) return -1;
      if (!aIsUploaded && bIsUploaded) return 1;
      
      return 0;
    });
  };

  // Process activities with deduplication and sorting
  const processedResult = useMemo(() => {
    console.log(`Processing ${activities.length} activities`);
    
    // Use Map with title+location key to ensure uniqueness
    const uniqueMap = new Map<string, Activity>();
    const duplicateTitles = new Set<string>();
    
    // First collect duplicates by title only
    const titlesCount: Record<string, number> = {};
    activities.forEach(activity => {
      if (!activity.title) return;
      const normTitle = activity.title.toLowerCase().trim();
      titlesCount[normTitle] = (titlesCount[normTitle] || 0) + 1;
      
      if (titlesCount[normTitle] > 1) {
        duplicateTitles.add(normTitle);
      }
    });
    
    // Process all activities
    const sortedActivities = sortActivitiesByImageQuality(activities);
    
    console.log(`After initial sort, processing ${sortedActivities.length} activities`);
    
    sortedActivities.forEach(activity => {
      if (!activity.title || !activity.location) return;
      
      const normTitle = activity.title.toLowerCase().trim();
      const exactKey = `${normTitle}-${activity.location.toLowerCase().trim()}`;
      
      if (!uniqueMap.has(exactKey)) {
        if (duplicateTitles.has(normTitle)) {
          let alreadyHasTitle = false;
          for (const [key, existingActivity] of uniqueMap.entries()) {
            if (key.startsWith(`${normTitle}-`)) {
              alreadyHasTitle = true;
              
              const existingImage = getBestImageForActivity(existingActivity);
              const newImage = getBestImageForActivity(activity);
              
              if (isUploadedImage(newImage) && !isUploadedImage(existingImage)) {
                console.log(`Replacing activity "${existingActivity.title}" with "${activity.title}" due to better image`);
                uniqueMap.delete(key);
                uniqueMap.set(exactKey, activity);
              }
              
              break;
            }
          }
          
          if (!alreadyHasTitle) {
            uniqueMap.set(exactKey, activity);
          }
        } else {
          uniqueMap.set(exactKey, activity);
        }
      }
    });
    
    // Get the final list of activities
    const finalActivities = sortActivitiesByImageQuality(Array.from(uniqueMap.values()));
    console.log(`After deduplication, have ${finalActivities.length} unique activities`);
    
    // Filter by location
    const locationFiltered = finalActivities.filter(activity => {
      if (!userLocation || userLocation.trim() === '') {
        return true;
      }
      
      const activityLocationFull = activity.location?.toLowerCase() || "";
      const userLocationLower = userLocation.toLowerCase();
      
      return activityLocationFull.startsWith(userLocationLower);
    });
    
    console.log(`After location filtering, have ${locationFiltered.length} activities`);
    
    // Filter valid activities - ensure they have all required fields
    const validActivitiesList = locationFiltered.filter(activity => {
      const bestImage = getBestImageForActivity(activity);
      return activity.title && 
             activity.description && 
             activity.location && 
             activity.category &&
             hasValidImage(activity, bestImage);
    });
    
    console.log(`After validation check, have ${validActivitiesList.length} valid activities`);

    // Create a separate list of activities with uploaded images
    const uploadedImageActivities = validActivitiesList.filter(activity => 
      hasUploadedImage(activity)
    );
    
    console.log(`Found ${uploadedImageActivities.length} activities with uploaded images`);

    // Generate unique IDs for activities
    const idMap = new Map<Activity, number>();
    const usedIds = new Set<number>();
    
    validActivitiesList.forEach(activity => {
      if (activity.id && validActivitiesList.filter(a => a.id === activity.id).length === 1) {
        idMap.set(activity, activity.id);
      } else {
        const hash = Math.abs(
          hashCode(`${activity.title}-${activity.description?.slice(0, 20)}`)
        );
        let uniqueId = 100000 + hash % 800000;
        while (usedIds.has(uniqueId)) {
          uniqueId += 1;
        }
        usedIds.add(uniqueId);
        idMap.set(activity, uniqueId);
      }
    });

    return {
      validActivities: validActivitiesList,
      uniqueActivityIds: idMap,
      activitiesWithUploadedImages: uploadedImageActivities
    };
  }, [activities, userLocation]);

  return processedResult;
};
