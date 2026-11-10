
import { useCallback } from 'react';
import { filterByInterestsStrict } from '@/utils/interestMatching';
import { Activity } from '../data/allActivities';
import { useActivityImage } from './useActivityImage';

export const useActivitySelection = () => {
  const { hasCustomImage, getBestImageForActivity } = useActivityImage();

  const filterByLocation = useCallback((activities: Activity[], location: string) => {
    if (!location || location.trim() === '') return activities;
    
    return activities.filter(activity => {
      const activityLocation = activity.location?.toLowerCase() || '';
      const userLocationLower = location.toLowerCase();
      return activityLocation.includes(userLocationLower);
    });
  }, []);

  // Streng: gibt nur passende Aktivitäten zurück (ggf. leer)
  const filterByInterests = useCallback((activities: Activity[], interests: string[]): Activity[] => {
    return filterByInterestsStrict(activities, interests);
  }, []);

  const filterFreeActivities = useCallback((activities: Activity[]): Activity[] => {
    return activities.filter(activity => 
      activity.price === "Kostenlos" || 
      activity.price === "Frei" || 
      activity.price === "Gratis" ||
      activity.price === "Eintritt frei" ||
      activity.price === "Kostenloser Eintritt" ||
      activity.price?.toLowerCase().includes("kostenlos") ||
      activity.price?.toLowerCase().includes("frei") ||
      activity.price?.toLowerCase().includes("gratis") ||
      activity.price === "0€" ||
      activity.price === "0 €"
    );
  }, []);

  const prioritizeUploadedImages = useCallback((activities: Activity[]): Activity[] => {
    // First, get all activities with uploaded images
    const withUploaded = activities.filter(hasCustomImage);
    const withoutUploaded = activities.filter(a => !hasCustomImage(a));
    
    console.log(`Found ${withUploaded.length} activities with uploaded images`);
    
    // Always return uploaded image activities first, then others
    return [...withUploaded, ...withoutUploaded];
  }, [hasCustomImage]);

  /**
   * Enhanced random selection that ensures better variety over time
   */
  const getRandomActivity = useCallback((
    pool: Activity[], 
    excludeIds: Set<number> = new Set(), 
    allTimeSeenIds: Set<number> = new Set()
  ): Activity | null => {
    if (!pool || pool.length === 0) {
      console.log("WARNING: Activity pool is empty!");
      return null;
    }

    console.log(`Selecting random activity from ${pool.length} activities`);
    console.log(`Already seen activities (this session): ${excludeIds.size}`);
    console.log(`All-time seen activities: ${allTimeSeenIds.size}`);
    
    // First, identify activities with uploaded images
    const customImageActivities = pool.filter(a => hasCustomImage(a));
    console.log(`Found: ${customImageActivities.length} activities with uploaded images in pool`);
    
    // Separate available activities into three groups:
    // 1. Custom image activities never seen before (highest priority)
    // 2. Custom image activities seen before
    // 3. Other activities never seen before
    // 4. Any remaining activities
    
    // Group 1: Custom image activities never seen before (highest priority)
    const unseenCustomImageActivities = customImageActivities.filter(a => 
      a.id && !allTimeSeenIds.has(a.id) && !excludeIds.has(a.id)
    );
    
    // Group 2: Other activities never seen before
    const unseenRegularActivities = pool.filter(a => 
      !hasCustomImage(a) && a.id && !allTimeSeenIds.has(a.id) && !excludeIds.has(a.id)
    );
    
    // Group 3: Custom image activities seen before but not in current session
    const seenBeforeCustomImageActivities = customImageActivities.filter(a => 
      a.id && allTimeSeenIds.has(a.id) && !excludeIds.has(a.id)
    );
    
    console.log(`Group 1 (Unseen with custom images): ${unseenCustomImageActivities.length}`);
    console.log(`Group 2 (Unseen regular): ${unseenRegularActivities.length}`);
    console.log(`Group 3 (Seen before with custom images): ${seenBeforeCustomImageActivities.length}`);
    
    // Prepare the prioritized pool - first try completely unseen custom image activities
    let targetPool: Activity[] = [];
    let poolDescription = "";
    
    if (unseenCustomImageActivities.length > 0) {
      targetPool = unseenCustomImageActivities;
      poolDescription = "unseen activities with custom images (highest priority)";
    } 
    // If none available, try unseen regular activities
    else if (unseenRegularActivities.length > 0) {
      targetPool = unseenRegularActivities;
      poolDescription = "unseen regular activities (second priority)";
    }
    // If none available, try custom image activities that were seen before
    else if (seenBeforeCustomImageActivities.length > 0) {
      targetPool = seenBeforeCustomImageActivities;
      poolDescription = "previously seen activities with custom images (third priority)";
    }
    // If still none available, use custom image activities including those in current session
    else if (customImageActivities.length > 0) {
      targetPool = customImageActivities;
      poolDescription = "all custom image activities (fourth priority)";
    }
    // Last resort: any available activities
    else {
      targetPool = pool.filter(a => a.id && !excludeIds.has(a.id));
      
      if (targetPool.length === 0) {
        // Absolute fallback - use all activities
        targetPool = pool;
        poolDescription = "all activities (fallback)";
      } else {
        poolDescription = "all available unseen activities (fourth priority)";
      }
    }
    
    console.log(`Using ${poolDescription} for random selection with ${targetPool.length} activities`);
    
    if (targetPool.length > 0) {
      // Log the first 5 activities to help with debugging
      console.log("Available activities in selected pool (first 5 or less):", 
        targetPool.slice(0, 5).map(a => `${a.title} (ID: ${a.id})`));
    }
    
    // True random selection from the prioritized pool
    const randomIndex = Math.floor(Math.random() * targetPool.length);
    const selected = targetPool[randomIndex];
    
    if (selected) {
      console.log(`Selected activity: ${selected.title} (ID: ${selected.id}), Category: ${selected.category}`);
      const bestImage = getBestImageForActivity(selected);
      if (bestImage && bestImage !== selected.image) {
        return { ...selected, image: bestImage };
      }
    }
    
    return selected;
  }, [hasCustomImage, getBestImageForActivity]);

  return {
    filterByLocation,
    filterByInterests,
    filterFreeActivities,
    prioritizeUploadedImages,
    getRandomActivity
  };
};
