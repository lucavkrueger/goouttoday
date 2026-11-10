import type { Activity } from "@/data/allActivities";
import { getUserSettings } from "@/data/userSettings";

import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import Header from "../components/home/Header";
import DailyActivitiesSection from "../components/home/DailyActivitiesSection";
import PersonalizedActivitiesSection from "../components/home/PersonalizedActivitiesSection";
import ActionSection from "../components/home/ActionSection";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { randomActivities, personalizedActivitiesList } from "@/data/allActivities";
import { nationalActivities } from "@/data/nationalActivities";
import { allCitiesActivities } from "@/data/citiesActivities";
import { useActivitiesState } from "@/hooks/useActivitiesState";
import { useActivityPool } from "@/hooks/useActivityPool";
import { useActivitySelection } from "@/hooks/useActivitySelection";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const {
    settings,
    userLocation,
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
    allTimeSeenActivities,
    setAllTimeSeenActivities,
    maxClicks
  } = useActivitiesState();

  // Erstelle kombinierten Aktivitätenpool
  const combinedActivities = useMemo(() => {
    // Nehme alle verfügbaren Aktivitäten
    const combined = [
      ...randomActivities,
      ...nationalActivities,
      ...allCitiesActivities,
      ...personalizedActivitiesList
    ];
    console.log(`Kombinierter Aktivitätenpool erstellt mit ${combined.length} Aktivitäten`);
    return combined;
  }, []);

  const { getFilteredActivityPool, getPersonalizedActivityPool } = useActivityPool(
    combinedActivities,
    userLocation,
    settings
  );

  const { getRandomActivity } = useActivitySelection();

  // Aktualisiere die angezeigten Aktivitäts-IDs
  const updateDisplayedActivityIds = () => {
    const displayedIds = new Set<number>();
    displayedRandomActivity.forEach(activity => {
      if (activity.id) displayedIds.add(activity.id);
    });
    displayedPersonalizedActivity.forEach(activity => {
      if (activity.id) displayedIds.add(activity.id);
    });
    setCurrentlyDisplayedActivityIds(displayedIds);
    console.log("Aktualisierte angezeigte Aktivitäts-IDs:", Array.from(displayedIds));
  };

  // Initialisiere Aktivitäten beim ersten Laden
  useEffect(() => {
    console.log("Index Component mounted - Initialisiere Aktivitäten");
    
    // Immer sofort Aktivitäten initialisieren
    const firstRandom = updateRandomActivity();
    updatePersonalizedActivity(firstRandom?.id);
  }, []);

  // Aktualisiere die angezeigten Aktivitäts-IDs, wenn sich die Aktivitäten ändern
  useEffect(() => {
    updateDisplayedActivityIds();
  }, [displayedRandomActivity, displayedPersonalizedActivity]);

  // Verbesserte Funktion zum Aktualisieren der zufälligen Aktivität
  const updateRandomActivity = (): Activity | null => {
    let chosenRandom: Activity | null = null;
    console.log("Aktualisiere zufällige Aktivität");
    // Verwende die aktuell angezeigten IDs als Ausschluss
    const idsToExclude = Array.from(currentlyDisplayedActivityIds);
    // Hole den gefilterten Aktivitätspool
    const pool = getFilteredActivityPool(idsToExclude);
    
    if (pool.length === 0) {
      console.log("WARNUNG: Zufälliger Aktivitätenpool ist leer!");
      toast({
        title: "Keine Aktivitäten gefunden",
        description: "Es konnten keine passenden Aktivitäten gefunden werden.",
        variant: "destructive"
      });
      return null;
    }
    
    // Hole eine zufällige Aktivität, wobei bereits angezeigte und alle jemals gesehenen berücksichtigt werden
    const randomActivity = getRandomActivity(
      pool, 
      new Set(idsToExclude), 
      allTimeSeenActivities
    );
    
    if (randomActivity) {
      console.log(`Zufällige Aktivität gefunden: ${randomActivity.title} (ID: ${randomActivity.id})`);
      setDisplayedRandomActivity([randomActivity]);
      chosenRandom = randomActivity;
      
      // Aktualisiere gesehene und jemals gesehene Aktivitäten
      if (randomActivity.id) {
        setSeenActivityIds(prev => new Set([...prev, randomActivity.id]));
        setAllTimeSeenActivities(prev => new Set([...prev, randomActivity.id]));
      }
    } else {
      console.log("WARNUNG: Keine zufällige Aktivität gefunden!");
      // Versuche es erneut mit leerem Ausschlusssatz als Fallback
      const fallbackActivity = getRandomActivity(combinedActivities, new Set());
      
      if (fallbackActivity) {
        console.log(`Fallback: Zufällige Aktivität gefunden: ${fallbackActivity.title}`);
        setDisplayedRandomActivity([fallbackActivity]);
        chosenRandom = fallbackActivity;
        
        if (fallbackActivity.id) {
          setSeenActivityIds(prev => new Set([...prev, fallbackActivity.id]));
          setAllTimeSeenActivities(prev => new Set([...prev, fallbackActivity.id]));
        }
      } else {
        toast({
          title: "Fehler",
          description: "Es konnte keine passende Aktivität gefunden werden.",
          variant: "destructive"
        });
        setDisplayedRandomActivity([]);
      }
    }
    return chosenRandom;
  };

  const updatePersonalizedActivity = (extraExcludeId?: number) => {
    const idsToExclude = Array.from(currentlyDisplayedActivityIds);
    displayedRandomActivity.forEach(a => a?.id !== undefined && idsToExclude.push(a.id));
    if (extraExcludeId !== undefined) idsToExclude.push(extraExcludeId);

    const hasInterests = (getUserSettings().interests || []).length > 0;
    let pool = getPersonalizedActivityPool(idsToExclude);

    // Alle passenden schon angezeigt? Dann wieder von vorn, aber weiterhin nur passende.
    if (pool.length === 0 && hasInterests) {
      pool = getPersonalizedActivityPool(extraExcludeId !== undefined ? [extraExcludeId] : []);
    }

    if (pool.length === 0) {
      // Keine passenden Aktivitäten: nichts Unpassendes anzeigen
      setDisplayedPersonalizedActivity([]);
      return;
    }

    const personalizedActivity =
      getRandomActivity(pool, new Set(idsToExclude), allTimeSeenActivities) ||
      getRandomActivity(pool, new Set());

    if (personalizedActivity) {
      setDisplayedPersonalizedActivity([personalizedActivity]);
      if (personalizedActivity.id) {
        setSeenActivityIds(prev => new Set([...prev, personalizedActivity.id]));
        setAllTimeSeenActivities(prev => new Set([...prev, personalizedActivity.id]));
      }
    } else {
      setDisplayedPersonalizedActivity([]);
    }
  };

  // Handler für den Refresh-Button der zufälligen Aktivität
  const refreshRandomActivity = () => {
    if (randomClickCount >= maxClicks) return;
    
    setIsRefreshingRandom(true);
    setRandomClickCount(prev => prev + 1);
    
    setTimeout(() => {
      updateRandomActivity();
      setIsRefreshingRandom(false);
    }, 600);
  };

  // Handler für den Refresh-Button der personalisierten Aktivität
  const refreshPersonalizedActivity = () => {
    if (personalizedClickCount >= maxClicks) return;
    
    setIsRefreshingPersonalized(true);
    setPersonizedClickCount(prev => prev + 1);
    
    setTimeout(() => {
      updatePersonalizedActivity();
      setIsRefreshingPersonalized(false);
    }, 600);
  };

  // IDs der aktuell angezeigten Aktivitäten für die gegenseitige Ausschließung
  const randomActivityIds = displayedRandomActivity.map(activity => activity.id);
  const personalizedActivityIds = displayedPersonalizedActivity.map(activity => activity.id);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <div className={`container max-w-5xl mx-auto px-4 flex-grow ${isMobile ? 'pt-6 pb-6' : 'pt-20 pb-8'}`}>
        <Header />
        <div className="space-y-6 pb-2">
          <DailyActivitiesSection 
            activities={displayedRandomActivity} 
            refreshActivities={refreshRandomActivity}
            isRefreshing={isRefreshingRandom}
            clickCount={randomClickCount}
            maxClicks={maxClicks}
            excludedActivityIds={personalizedActivityIds}
          />
          <PersonalizedActivitiesSection 
            activities={displayedPersonalizedActivity} 
            refreshActivities={refreshPersonalizedActivity}
            isRefreshing={isRefreshingPersonalized}
            clickCount={personalizedClickCount}
            maxClicks={maxClicks}
          />
          <div className="flex justify-center mt-2 mb-4">
            <Link to="/profile#interests">
              <Button variant="outline" size={isMobile ? "default" : "sm"} className="flex items-center text-sm text-slate-600">
                <Settings className="mr-1 h-4 w-4" />
                <span>Interessen im Profil anpassen</span>
              </Button>
            </Link>
          </div>
          <ActionSection />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
