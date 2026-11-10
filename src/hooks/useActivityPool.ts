import { useCallback } from 'react';
import { Activity } from '../data/allActivities';
import { useActivitySelection } from './useActivitySelection';
import { filterByInterestsStrict } from '@/utils/interestMatching';

export const useActivityPool = (
  combinedActivities: Activity[],
  userLocation: string,
  settings: { freeActivitiesOnly?: boolean; interests?: string[] }
) => {
  const {
    filterByLocation,
    filterFreeActivities,
    prioritizeUploadedImages
  } = useActivitySelection();

  // Verbesserte Activity Pool Generierung für maximale Abwechslung
  const getFilteredActivityPool = useCallback((excludeActivityIds: number[] = []): Activity[] => {
    if (combinedActivities.length === 0) {
      console.log("WARNING: No activities available in combinedActivities!");
      return [];
    }
    
    console.log(`Generating activity pool. Total pool: ${combinedActivities.length}, Excluded IDs: ${excludeActivityIds.length}`);
    
    // Deduplicate activities based on title
    const uniqueTitleActivities = removeDuplicatesByTitle(combinedActivities);
    console.log(`After deduplication: ${uniqueTitleActivities.length} unique activities`);
    
    let filteredPool = [...uniqueTitleActivities];
    
    // Filter by location - less strict to ensure more activities are available
    const locationFilteredPool = filterByLocation(filteredPool, userLocation);
    console.log(`After location filtering: ${locationFilteredPool.length} activities`);
    
    // If no activities found for the location, use original pool
    filteredPool = locationFilteredPool.length > 0 ? locationFilteredPool : filteredPool;
    console.log(`Location filtering applied: ${filteredPool.length} activities available`);
    
    // Filter free activities if required
    if (settings.freeActivitiesOnly) {
      const freeActivitiesPool = filterFreeActivities(filteredPool);
      console.log(`After free filtering: ${freeActivitiesPool.length} activities`);
      
      // Only apply if enough free activities were found
      filteredPool = freeActivitiesPool.length > 0 ? freeActivitiesPool : filteredPool;
      console.log(`Free filter applied: ${filteredPool.length} activities available`);
    }
    
    // Identify known landmark activities - expanded list
    const landmarkKeywords = [
      'teufelsberg', 'east side gallery', 'fernsehturm', 'tv tower',
      'alexanderplatz', 'brandenburger tor', 'brandenburg gate', 'reichstag',
      'tiergarten', 'kurfürstendamm', 'kudamm', 'potsdamer platz', 
      'museumsinsel', 'museum island', 'berliner dom', 'berlin cathedral',
      'checkpoint charlie', 'mauerpark', 'viktoriapark', 'viktoria park',
      'grunewald', 'spreepark', 'tempelhofer feld', 'tempelhof'
    ];
    
    // Find landmark activities
    const landmarkActivities = filteredPool.filter(activity => {
      if (!activity.title) return false;
      const title = activity.title.toLowerCase();
      return landmarkKeywords.some(landmark => title.includes(landmark));
    });
    
    console.log(`Found ${landmarkActivities.length} landmark activities in filtered pool`);
    
    // Prioritize activities with uploaded images
    const withUploadedImages = filteredPool.filter(activity => 
      activity.image?.includes('Special:FilePath')
    );
    const withoutUploadedImages = filteredPool.filter(activity => 
      !activity.image?.includes('Special:FilePath')
    );
    
    console.log(`Found ${withUploadedImages.length} activities with uploaded images`);
    
    let resultPool: Activity[] = [];
    
    // Make sure landmark activities are always included
    resultPool = [...landmarkActivities];
    
    // Then add activities with uploaded images
    withUploadedImages.forEach(activity => {
      if (!resultPool.some(a => a.id === activity.id)) {
        resultPool.push(activity);
      }
    });
    
    // Add remaining activities
    withoutUploadedImages.forEach(activity => {
      if (!resultPool.some(a => a.id === activity.id)) {
        resultPool.push(activity);
      }
    });
    
    // Filter out excluded activities
    if (excludeActivityIds.length > 0) {
      resultPool = resultPool.filter(activity => !excludeActivityIds.includes(activity.id));
      console.log(`After excluding ${excludeActivityIds.length} IDs: ${resultPool.length} activities`);
    }
    
    // EMERGENCY FALLBACK: If the pool is empty, use the original pool
    if (resultPool.length === 0) {
      console.log("WARNING: Activity pool is empty! Using the original pool.");
      resultPool = combinedActivities.filter(activity => 
        !excludeActivityIds.includes(activity.id)
      );
      console.log(`Emergency fallback activated, pool now contains ${resultPool.length} elements`);
    }
    
    console.log(`Final activity pool contains ${resultPool.length} elements`);
    
    // Log a few activities to help with debugging
    if (resultPool.length > 0) {
      console.log("Sample activities in pool:");
      resultPool.slice(0, 5).forEach(activity => {
        console.log(`- ${activity.title} (Category: ${activity.category}, ID: ${activity.id})`);
      });
    }
    
    return resultPool;
  }, [combinedActivities, userLocation, settings.freeActivitiesOnly, filterByLocation, filterFreeActivities]);

  // Deduplicate activities based on title
  const removeDuplicatesByTitle = (activities: Activity[]): Activity[] => {
    const uniqueTitles = new Set<string>();
    return activities.filter(activity => {
      if (!activity.title) return false;
      const normalizedTitle = activity.title.toLowerCase().trim();
      if (uniqueTitles.has(normalizedTitle)) return false;
      uniqueTitles.add(normalizedTitle);
      return true;
    });
  };

  // Personalisierter Pool: enthält ausschließlich Aktivitäten, die zu den gewählten Interessen passen.
  // Ohne gewählte Interessen wird der allgemeine Pool verwendet.
  const getPersonalizedActivityPool = useCallback((excludeActivityIds: number[] = []): Activity[] => {
    const interests = settings.interests || [];
    const basePool = getFilteredActivityPool(excludeActivityIds);
    if (interests.length === 0) return basePool;

    // Auf dem bereits gefilterten Pool (Ort, kostenlos) arbeiten – aber ohne Notfall-Rückfall
    // auf beliebige Aktivitäten: lieber leer als unpassend.
    let pool = filterByInterestsStrict(basePool, interests);

    // Falls der Orts-/Kostenlos-Filter alles Passende entfernt hat, im Gesamtbestand suchen
    if (pool.length === 0) {
      pool = filterByInterestsStrict(
        removeDuplicatesByTitle(combinedActivities).filter(a => !excludeActivityIds.includes(a.id)),
        interests
      );
      if (settings.freeActivitiesOnly) {
        const free = filterFreeActivities(pool);
        if (free.length > 0) pool = free;
      }
    }

    const withUploads = pool.filter(a => a.image?.includes('Special:FilePath'));
    const withoutUploads = pool.filter(a => !a.image?.includes('Special:FilePath'));
    return [...withUploads, ...withoutUploads];
  }, [getFilteredActivityPool, settings.interests, settings.freeActivitiesOnly, combinedActivities, filterFreeActivities]);

  return {
    getFilteredActivityPool,
    getPersonalizedActivityPool
  };
};
