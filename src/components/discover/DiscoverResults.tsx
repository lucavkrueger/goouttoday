
import React, { useState, useEffect } from "react";
import { Activity } from "../../data/allActivities";
import { getUserSettings } from "@/data/userSettings";
import EmptyResults from "./EmptyResults";
import { useToast } from "@/hooks/use-toast";
import { useActivityProcessing } from "@/hooks/useActivityProcessing";
import ActivityGrid from "./ActivityGrid";
import { SPECIFIC_ACTIVITY_IMAGES } from "@/utils/imageConstants";
import { optimizeImageUrl, prefetchImages } from "@/utils/imageOptimizationUtils";

interface DiscoverResultsProps {
  activities: Activity[];
  totalCount: number;
}

const DiscoverResults: React.FC<DiscoverResultsProps> = React.memo(({ activities }) => {
  const [settings, setSettings] = useState(getUserSettings());
  const [userLocation, setUserLocation] = useState("");
  const { toast } = useToast();

  const { validActivities, uniqueActivityIds } = useActivityProcessing(activities, userLocation);
  
  // Prefetch uploaded images first since they're highest priority
  useEffect(() => {
    const uploadedImages: string[] = [];
    
    // Only get the first 20 uploaded images to prefetch
    Object.values(SPECIFIC_ACTIVITY_IMAGES).slice(0, 20).forEach(imgUrl => {
      if (imgUrl.includes('images/c_') && !uploadedImages.includes(imgUrl)) {
        uploadedImages.push(imgUrl);
      }
    });
    
    if (uploadedImages.length > 0) {
      console.log(`Prefetching ${uploadedImages.length} uploaded images...`);
      prefetchImages(uploadedImages, true, false); // High priority, no tiny previews needed
    }
  }, []);
  
  // Prefetch specifically matched images for visible activities
  useEffect(() => {
    if (validActivities.length === 0) return;
    
    // Only prefetch the first 10 images to avoid overwhelming the browser
    const specificActivityMatches = validActivities
      .slice(0, 10)
      .map(activity => {
        const normalizedTitle = activity.title?.toLowerCase().trim() || '';
        
        if (SPECIFIC_ACTIVITY_IMAGES[normalizedTitle] && 
            SPECIFIC_ACTIVITY_IMAGES[normalizedTitle].includes('images/c_')) {
          return SPECIFIC_ACTIVITY_IMAGES[normalizedTitle];
        }
        
        for (const [key, imgUrl] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
          if (!imgUrl.includes('images/c_')) continue;
          
          if ((normalizedTitle.includes(key.toLowerCase()) && key.length > 4) || 
              (key.toLowerCase().includes(normalizedTitle) && normalizedTitle.length > 4)) {
            return imgUrl;
          }
        }
        return null;
      })
      .filter(Boolean) as string[];
    
    if (specificActivityMatches.length > 0) {
      prefetchImages(specificActivityMatches, true, true); // High priority with tiny previews
    }
  }, [validActivities]);

  useEffect(() => {
    const currentSettings = getUserSettings();
    setSettings(currentSettings);
    const location = typeof currentSettings.location === 'object' ? 
      currentSettings.location.city : currentSettings.location;
    setUserLocation(location);
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      const updatedSettings = getUserSettings();
      const updatedLocation = typeof updatedSettings.location === 'object' ? 
        updatedSettings.location.city : updatedSettings.location;
      setUserLocation(updatedLocation);
      setSettings(updatedSettings);
    };

    window.addEventListener('locationChanged', handleLocationChange);
    window.addEventListener('userSettingsChanged', handleLocationChange);
    
    return () => {
      window.removeEventListener('locationChanged', handleLocationChange);
      window.removeEventListener('userSettingsChanged', handleLocationChange);
    };
  }, []);

  if (validActivities.length === 0) {
    return <EmptyResults clearFilters={() => {
      toast({
        title: "Standortfilter zurückgesetzt",
        description: "Es wurden keine Aktivitäten für deinen Standort gefunden."
      });
    }} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-slate-800">
          {validActivities.length} {validActivities.length === 1 ? "Ergebnis" : "Ergebnisse"} gefunden
          {userLocation ? ` in ${userLocation}` : ""}
        </h3>
      </div>

      <ActivityGrid 
        activities={validActivities}
        getUniqueId={(activity) => uniqueActivityIds.get(activity) || 0}
        getBestImage={(activity) => {
          const normalizedTitle = activity.title?.toLowerCase().trim() || '';
          
          if (SPECIFIC_ACTIVITY_IMAGES[normalizedTitle] && 
              SPECIFIC_ACTIVITY_IMAGES[normalizedTitle].includes('images/c_')) {
            return SPECIFIC_ACTIVITY_IMAGES[normalizedTitle];
          }

          // Ein eigens zugeordnetes Foto der Aktivität hat Vorrang vor Stichwort-Treffern
          if (activity.image?.includes('images/c_')) {
            return activity.image;
          }
          
          for (const [key, imgUrl] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
            if (imgUrl.includes('images/c_')) {
              if ((normalizedTitle.includes(key.toLowerCase()) && key.length > 4) || 
                  (key.toLowerCase().includes(normalizedTitle) && normalizedTitle.length > 4)) {
                return imgUrl;
              }
            }
          }
          
          const normalizedLocation = activity.location?.toLowerCase().trim() || '';
          if (normalizedLocation) {
            for (const [key, imgUrl] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
              if (imgUrl.includes('images/c_') && 
                  normalizedLocation.includes(key.toLowerCase()) && 
                  key.length > 4) {
                return imgUrl;
              }
            }
          }
          
          return activity.image || '';
        }}
      />
    </div>
  );
});

DiscoverResults.displayName = 'DiscoverResults';

export default DiscoverResults;
