
import React, { useEffect, useState } from "react";
import ActivityCardWithFavorite from "../ActivityCardWithFavorite";
import { matchesInterests } from "@/utils/interestMatching";
import { Activity } from "../../data/allActivities";
import { getUserSettings } from "@/data/userSettings";
import { useToast } from "@/hooks/use-toast";
import { useActivityImage } from "@/hooks/useActivityImage";

interface PersonalizedActivitiesSectionProps {
  activities: Activity[];
  refreshActivities?: () => void;
  isRefreshing?: boolean;
  clickCount?: number;
  maxClicks?: number;
  showRefreshButton?: boolean;
  excludedActivityIds?: number[]; // Array of activity IDs to exclude
}

const PersonalizedActivitiesSection: React.FC<PersonalizedActivitiesSectionProps> = ({ 
  activities,
  refreshActivities,
  isRefreshing = false,
  clickCount = 0,
  maxClicks = 3,
  showRefreshButton = true,
  excludedActivityIds = []
}) => {
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const { toast } = useToast();
  const { hasCustomImage, getBestImageForActivity } = useActivityImage();
  
  const matchesUserInterests = (activity: Activity, interests: string[]) => matchesInterests(activity, interests);

  useEffect(() => {
    // Load user interests from settings
    const settings = getUserSettings();
    console.log("PersonalizedActivitiesSection - Loading interests from settings:", settings.interests);
    setUserInterests(settings.interests || []);

    // Listen for interest changes
    const handleInterestsChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.interests) {
        console.log("PersonalizedActivitiesSection - Received interests changed event:", customEvent.detail.interests);
        setUserInterests(customEvent.detail.interests);
      }
    };
    
    const handleSettingsChange = () => {
      const updatedSettings = getUserSettings();
      console.log("PersonalizedActivitiesSection - Settings changed, updating interests:", updatedSettings.interests);
      setUserInterests(updatedSettings.interests || []);
    };

    window.addEventListener('interestsChanged', handleInterestsChange as EventListener);
    window.addEventListener('userSettingsChanged', handleSettingsChange);
    
    return () => {
      window.removeEventListener('interestsChanged', handleInterestsChange as EventListener);
      window.removeEventListener('userSettingsChanged', handleSettingsChange);
    };
  }, []);

  console.log("Personalized Activities received:", activities.length);
  console.log("User interests:", userInterests);
  console.log("Excluded activity IDs:", excludedActivityIds);
  
  // Ensure we always have an array
  const safeActivities = Array.isArray(activities) ? activities : [];
  
  if (safeActivities.length > 0) {
    console.log("Received activities:");
    safeActivities.forEach(activity => {
      if (activity && activity.title) {
        console.log(`- ${activity.title} (Category: ${activity.category}, ID: ${activity.id})`);
      }
    });
  }
  
  // Filter out activities without essential data and excluded activities
  const validActivities = safeActivities.filter(activity => {
    // Check if all required fields are present
    const isValid = Boolean(activity && 
                           activity.title && 
                           activity.id !== undefined &&
                           !excludedActivityIds.includes(activity.id));

    // Special logging for interest-specific activities
    if (userInterests.length > 0 && activity && activity.title) {
      const isInterestMatch = matchesUserInterests(activity, userInterests);
      if (isInterestMatch) {
        console.log(`Checking interest-matched activity: ${activity.title}, isValid: ${isValid}`);
        if (!isValid) {
          console.log(`Interest-matched activity invalid reason:`, 
            !activity.title ? "No title" : 
            !activity.id ? "No ID" : 
            "ID in excluded list"
          );
        }
      }
    }

    return isValid;
  });
  
  console.log(`After validity filtering: ${validActivities.length} valid activities`);
  
  if (validActivities.length === 0) {
    console.log("WARNING: No valid activities for personalized section!");
  }

  // Split activities into categories based on interests and custom images
  const activitiesWithCustomImages = validActivities.filter(hasCustomImage);
  const activitiesWithoutCustomImages = validActivities.filter(activity => !hasCustomImage(activity));
  
  console.log("Activities with custom uploaded images:", activitiesWithCustomImages.length);
  if (activitiesWithCustomImages.length > 0) {
    console.log("Custom image activities:");
    activitiesWithCustomImages.forEach(activity => {
      console.log(`- ${activity.title} (ID: ${activity.id})`);
    });
  }

  // Filter all activities by interests - with improved interest matching
  const matchingInterestsActivities = userInterests.length > 0
    ? validActivities.filter(activity => matchesUserInterests(activity, userInterests))
    : [];
    
  // Separate matching activities by custom image availability
  const matchingWithCustomImages = matchingInterestsActivities.filter(hasCustomImage);
  const matchingWithoutCustomImages = matchingInterestsActivities.filter(activity => !hasCustomImage(activity));
  
  console.log("Activities matching interests with custom images:", matchingWithCustomImages.length);
  console.log("Activities matching interests without custom images:", matchingWithoutCustomImages.length);

  // Streng: Mit Interessen werden NUR passende Aktivitäten angezeigt – kein Rückfall auf andere.
  let displayActivities: Activity[] = [];
  let noMatchingActivities = false;

  if (userInterests.length > 0) {
    displayActivities = [...matchingWithCustomImages, ...matchingWithoutCustomImages];
    noMatchingActivities = displayActivities.length === 0;
  } else {
    displayActivities = validActivities.length > 0 ? validActivities : safeActivities;
  }

  // Check for empty images and fix
  displayActivities = displayActivities.map(activity => {
    if ((!activity.image || activity.image === "") && activity.title) {
      console.log(`Fixing missing image for activity: ${activity.title}`);
      const bestImage = getBestImageForActivity(activity);
      return {...activity, image: bestImage || "/placeholder.svg"};
    }
    return activity;
  });

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-center pt-6">
        <h2 className="text-xl font-display font-medium text-slate-800 text-center">
          Personalisierter Vorschlag
          {userInterests.length > 0 && (
            <span className="block text-sm font-normal text-slate-600 mt-1">
              Basierend auf deinen Interessen: {userInterests.join(", ")}
            </span>
          )}
        </h2>
      </div>

      <div className="max-w-2xl mx-auto relative">
        {displayActivities.length > 0 ? (
          displayActivities.map((activity) => {
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
              <div key={`personalized-${safeActivity.id}`} className="flex flex-col h-full mb-6 relative">
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
                  onRefresh={showRefreshButton && refreshActivities ? refreshActivities : undefined}
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
          noMatchingActivities ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm text-center">
              Für deine Interessen ({userInterests.join(", ")}) gibt es gerade keine Vorschläge.
              Wähle im Profil weitere Interessen aus, um mehr Vorschläge zu bekommen.
            </div>
          ) : (
            <div className="text-center text-slate-500 py-8">Keine Aktivitäten verfügbar</div>
          )
        )}
      </div>
    </section>
  );
};

export default PersonalizedActivitiesSection;
