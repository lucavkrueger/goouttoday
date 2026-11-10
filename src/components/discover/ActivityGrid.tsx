
import React, { useEffect } from 'react';
import { Activity } from '@/data/allActivities';
import ActivityCardWithFavorite from '../ActivityCardWithFavorite';
import { optimizeImageUrl, isUploadedImage, prefetchImages } from '@/utils/imageOptimizationUtils';
import { selectImageUrl } from '@/utils/imageSelectionUtils';
import { useToast } from '@/hooks/use-toast';

interface ActivityGridProps {
  activities: Activity[];
  getUniqueId: (activity: Activity) => number;
  getBestImage: (activity: Activity) => string;
}

const ActivityGrid: React.FC<ActivityGridProps> = ({
  activities,
  getUniqueId,
  getBestImage
}) => {
  const { toast } = useToast();

  // Use a simplified approach for loading state
  useEffect(() => {
    if (activities.length === 0) {
      // Show a loading toast when no activities are loaded yet
      toast({
        title: "Aktivitäten werden geladen",
        description: "Einen Moment bitte...",
        duration: 2000,
      });
    } else {
      // When activities are loaded, prefetch images
      const imagesToPrefetch = activities.slice(0, 12).map(activity => {
        return getBestImage(activity) || activity.image || '';
      }).filter(Boolean);
      
      // Prefetch tiny versions first for all visible items
      prefetchImages(imagesToPrefetch, true, true);
      
      // Then prefetch slightly better versions after a small delay just for the first few
      setTimeout(() => {
        prefetchImages(imagesToPrefetch.slice(0, 6), true, false);
      }, 100); // Reduced from 300ms to 100ms for faster loading
    }
  }, [activities, getBestImage]);

  if (activities.length === 0) {
    // Return loading skeleton if no activities yet
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={`skeleton-${index}`} className="flex flex-col h-full">
            <div className="bg-slate-200 rounded-t-xl h-36 md:h-48 animate-pulse"></div>
            <div className="bg-white p-4 rounded-b-xl">
              <div className="h-6 bg-slate-200 rounded w-3/4 animate-pulse mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Only show the toast with activity count once activities are loaded
  useEffect(() => {
    if (activities.length > 0) {
      toast({
        title: `${activities.length} Aktivitäten gefunden`,
        description: "Die Bilder werden jetzt geladen",
        duration: 2000,
      });
    }
  }, [activities.length]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity, index) => {
        const stableId = getUniqueId(activity) || (800000 + index);
        // Get best image using both methods to maximize chances of success
        const bestImage = getBestImage(activity) || activity.image || '';
        // Use our dedicated selectImageUrl function as a final fallback
        const imageSource = bestImage || selectImageUrl(
          activity.title || '',
          activity.category || 'default',
          stableId,
          `activity-${stableId}`
        );
        
        // Ensure we only optimize non-uploaded images but with lower quality for display
        const finalImage = isUploadedImage(imageSource)
          ? imageSource  // Use uploaded images directly without any modification
          : optimizeImageUrl(imageSource, 200, 5); // Use much lower quality for faster loading
        
        return (
          <div key={`activity-${stableId}-${index}`} className="flex flex-col h-full">
            <ActivityCardWithFavorite
              id={stableId}
              title={activity.title || ""}
              description={activity.description || ""}
              location={activity.location || ""}
              image={finalImage}
              category={activity.category || "default"}
              distance={activity.distance}
              link={activity.link || ""}
              price={activity.price || "Preis nicht angegeben"}
              duration={activity.duration || "Keine Angabe"}
              address={activity.address || activity.location || ""}
              date={activity.date || "Jederzeit"}
              ticketLink={activity.ticketLink || ""}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ActivityGrid;
