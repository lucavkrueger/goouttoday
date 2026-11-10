
import { useState, useEffect } from 'react';
import { Activity } from '../data/allActivities';
import { getUserSettings } from '@/data/userSettings';
import { useActivityImage } from './useActivityImage';

export const useActivitiesState = () => {
  const [settings, setSettings] = useState({...getUserSettings()});
  const [userLocation, setUserLocation] = useState(
    typeof settings.location === 'object' ? settings.location.city : settings.location
  );
  // Kleinere Menge für Reset, um häufiger neue Aktivitäten zu sehen
  const [seenActivityIds, setSeenActivityIds] = useState<Set<number>>(new Set());
  const [currentlyDisplayedActivityIds, setCurrentlyDisplayedActivityIds] = useState<Set<number>>(new Set());
  const [randomClickCount, setRandomClickCount] = useState(0);
  const [personalizedClickCount, setPersonizedClickCount] = useState(0);
  const [displayedRandomActivity, setDisplayedRandomActivity] = useState<Activity[]>([]);
  const [displayedPersonalizedActivity, setDisplayedPersonalizedActivity] = useState<Activity[]>([]);
  const [isRefreshingRandom, setIsRefreshingRandom] = useState(false);
  const [isRefreshingPersonalized, setIsRefreshingPersonalized] = useState(false);
  
  // Verbesserte Nachverfolgung aller angezeigten Aktivitäten
  const [shownCustomImageActivities, setShownCustomImageActivities] = useState<Set<number>>(new Set());
  // Speichert alle jemals gesehenen Aktivitäten für bessere Abwechslung
  const [allTimeSeenActivities, setAllTimeSeenActivities] = useState<Set<number>>(new Set());
  
  // Reset nach 5 Aktivitäten, um mehr Abwechslung zu gewährleisten
  useEffect(() => {
    if (seenActivityIds.size > 5) {
      console.log("Zurücksetzen der gesehenen Aktivitäten-IDs, um Vielfalt zu gewährleisten");
      setSeenActivityIds(new Set());
      // Behalte nur die aktuell angezeigten IDs
      const keepIds = new Set<number>();
      displayedRandomActivity.forEach(activity => {
        if (activity.id) keepIds.add(activity.id);
      });
      displayedPersonalizedActivity.forEach(activity => {
        if (activity.id) keepIds.add(activity.id);
      });
      setCurrentlyDisplayedActivityIds(keepIds);
    }
  }, [seenActivityIds, displayedRandomActivity, displayedPersonalizedActivity]);
  
  const { hasCustomImage, getBestImageForActivity } = useActivityImage();
  const maxClicks = 3;

  return {
    settings,
    setSettings,
    userLocation,
    setUserLocation,
    seenActivityIds,
    setSeenActivityIds,
    currentlyDisplayedActivityIds,
    setCurrentlyDisplayedActivityIds,
    randomClickCount,
    setRandomClickCount,
    personalizedClickCount,
    setPersonizedClickCount,
    displayedRandomActivity,
    setDisplayedRandomActivity,
    displayedPersonalizedActivity,
    setDisplayedPersonalizedActivity,
    isRefreshingRandom,
    setIsRefreshingRandom,
    isRefreshingPersonalized,
    setIsRefreshingPersonalized,
    shownCustomImageActivities,
    setShownCustomImageActivities,
    allTimeSeenActivities,
    setAllTimeSeenActivities,
    maxClicks,
    hasCustomImage,
    getBestImageForActivity
  };
};
