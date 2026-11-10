
import React, { useEffect, useState } from "react";
import ActivityCardWithFavorite from "../ActivityCardWithFavorite";
import { Activity } from "../../data/allActivities";
import { useActivityImage } from "@/hooks/useActivityImage";

interface DailyActivitiesSectionProps {
  activities: Activity[];
  refreshActivities: () => void;
  isRefreshing?: boolean;
  clickCount?: number;
  maxClicks?: number;
  showRefreshButton?: boolean;
  excludedActivityIds?: number[]; // Array of activity IDs to exclude
}

const DailyActivitiesSection: React.FC<DailyActivitiesSectionProps> = ({ 
  activities, 
  refreshActivities,
  isRefreshing = false,
  clickCount = 0,
  maxClicks = 3,
  showRefreshButton = true,
  excludedActivityIds = []
}) => {
  const [hasUploadedImages, setHasUploadedImages] = useState(false);
  const { hasCustomImage, getActivitiesWithCustomImages, getBestImageForActivity } = useActivityImage();
  
  // Check if any activities have uploaded images and log detailed info
  useEffect(() => {
    // Make sure we have an array to work with
    const safeActivities = Array.isArray(activities) ? activities : [];
    
    // Check for activities with custom images
    const customImageActivities = getActivitiesWithCustomImages(safeActivities);
    const hasUploaded = customImageActivities.length > 0;
    setHasUploadedImages(hasUploaded);
    
    console.log("DailyActivitiesSection - Activities received:", safeActivities.length);
    console.log("DailyActivitiesSection - Activities with custom images:", customImageActivities.length);
    console.log("DailyActivitiesSection - Excluded activity IDs:", excludedActivityIds);
    
    if (safeActivities.length > 0) {
      // Log more detailed information about activities
      safeActivities.forEach(activity => {
        if (activity && activity.title) {
          console.log(`Activity: ${activity.title}, Category: ${activity.category}, Has custom image: ${hasCustomImage(activity)}`);
        } else {
          console.log("WARNING: Found invalid activity in DailyActivitiesSection", activity);
        }
      });
    } else {
      console.log("DailyActivitiesSection - No activities received");
    }
  }, [activities, hasCustomImage, getActivitiesWithCustomImages, excludedActivityIds]);
  
  // Make sure we always have an array
  const safeActivities = Array.isArray(activities) ? activities : [];
  
  // Filter out activities with missing essential data and excluded activities
  const validActivities = safeActivities.filter(activity => {
    if (!activity) return false;
    
    const isValid = Boolean(activity.title && 
                          activity.id !== undefined && 
                          !excludedActivityIds.includes(activity.id));
    
    // Additional debug for excluded activities
    if (!isValid && activity.id !== undefined && excludedActivityIds.includes(activity.id)) {
      console.log(`Activity "${activity.title}" (ID: ${activity.id}) excluded from display`);
    }
    
    return isValid;
  });
  
  // If we have no valid activities, check why and log detailed information
  if (validActivities.length === 0 && safeActivities.length > 0) {
    console.log("WARNING: No valid activities after filtering in DailyActivitiesSection");
    console.log("Original activities:", safeActivities);
    console.log("Excluded IDs:", excludedActivityIds);
  }
  
  // Check for missing images and fix them
  const activitiesWithImages = validActivities.map(activity => {
    if (!activity.image || activity.image === "") {
      console.log(`Fixing missing image for activity: ${activity.title}`);
      const bestImage = getBestImageForActivity(activity);
      return { ...activity, image: bestImage || "/placeholder.svg" };
    }
    return activity;
  });

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-center pt-6">
        <h2 className="text-xl font-display font-medium text-slate-800 text-center">
          Zufälliger Vorschlag
        </h2>
      </div>

      <div className="max-w-2xl mx-auto">
        {activitiesWithImages.length > 0 ? (
          activitiesWithImages.map((activity) => {
            if (!activity) return null;
            
            // Create a safe activity object with default values for all optional properties
            const safeActivity = {
              id: activity.id || Math.floor(Math.random() * 10000),
              title: activity.title || "Aktivitätsvorschlag",
              description: activity.description || "Keine Beschreibung verfügbar",
              location: activity.location || "Berlin",
              image: activity.image || "/placeholder.svg",
              category: activity.category || "",
              distance: activity.distance,
              price: activity.price || "",
              duration: activity.duration || "",
              address: activity.address || "",
              date: activity.date || "",
              link: activity.link || "",
              ticketLink: activity.ticketLink || ""
            };
            
            return (
              <div key={`daily-${safeActivity.id}`} className="flex flex-col h-full mb-6">
                <ActivityCardWithFavorite
                  id={safeActivity.id}
                  title={safeActivity.title}
                  description={safeActivity.description}
                  location={safeActivity.location}
                  image={safeActivity.image}
                  category={safeActivity.category}
                  distance={safeActivity.distance}
                  isPrimary={true}
                  price={safeActivity.price}
                  duration={safeActivity.duration}
                  address={safeActivity.address}
                  date={safeActivity.date}
                  link={safeActivity.link}
                  ticketLink={safeActivity.ticketLink}
                  onRefresh={showRefreshButton ? refreshActivities : undefined}
                  isRefreshing={isRefreshing}
                  refreshDisabled={clickCount >= maxClicks}
                  refreshLabel={clickCount >= maxClicks 
                    ? "Limit erreicht" 
                    : `Neuen Vorschlag generieren (${maxClicks - clickCount} übrig)`}
                />
              </div>
            );
          })
        ) : (
          <div className="text-center text-slate-500 py-8">
            Keine Aktivitäten verfügbar
          </div>
        )}
      </div>
    </section>
  );
};

export default DailyActivitiesSection;
