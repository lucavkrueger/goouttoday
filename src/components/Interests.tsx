
import { useState } from "react";

interface InterestProps {
  interests: string[];
  selectedInterests: string[];
  onChange: (selected: string[]) => void;
}

const Interests = ({ interests, selectedInterests = [], onChange }: InterestProps) => {
  // Reorganized interest categories with better naming
  const groupedInterests = {
    kultur: [
      "Kunst", "Museum", "Theater", "Ausstellungen", "Geschichte", "Galerien",
      "Bibliotheken", "Historische Stätten", "Stadtführung", "Kultur", "Nachhaltigkeit", "Technologie"
    ],
    draussen: [
      "Natur", "Parks", "Gärten", "Am Wasser", "See", "Ufer", "Fahrradtouren", 
      "Wandern", "Aussichtspunkte"
    ],
    freizeit: [
      "Sport", "Skateparks", "Spielplätze", "Festivals", "Tanzen", "Fotografie", 
      "Wellness", "Handwerk"
    ],
    kulinarisch: [
      "Gastronomie", "Cafés", "Restaurants", "Kneipe", "Bars", "Märkte", "Flohmärkte"
    ],
    unterhaltung: [
      "Musik", "Konzerte", "Kino", "Comedy", "Kurse"
    ],
    sozial: [
      "Familie", "Leute treffen", "Gutes tun"
    ],
    urban: [
      "Architektur", "Street Art", "Hinterhöfe", "Lostplaces", "Shopping", "Buchläden"
    ]
  };

  // Ensure selectedInterests is never undefined
  const safeSelectedInterests = selectedInterests || [];

  const getInterestsInGroup = (group: string[]) => {
    return interests.filter(interest => group.includes(interest));
  };

  const toggleInterest = (interest: string) => {
    console.log("Toggling interest:", interest);
    console.log("Current selected interests:", safeSelectedInterests);
    
    let updated: string[];
    if (safeSelectedInterests.includes(interest)) {
      updated = safeSelectedInterests.filter(i => i !== interest);
      console.log("Removing interest, new state:", updated);
    } else {
      updated = [...safeSelectedInterests, interest];
      console.log("Adding interest, new state:", updated);
    }
    
    // Direkt an übergeordnete Komponente weitergeben
    onChange(updated);
  };
  
  const clearAllInterests = () => {
    console.log("Clearing all interests");
    onChange([]);
  };

  // Map category names to display labels in German
  const categoryLabels = {
    kultur: "Kultur & Geschichte",
    draussen: "Natur & Draußen",
    freizeit: "Freizeit & Sport",
    kulinarisch: "Kulinarisches",
    unterhaltung: "Unterhaltung",
    sozial: "Soziales",
    urban: "Urbanes Berlin"
  };

  return (
    <div className="space-y-6">
      {safeSelectedInterests.length > 0 && (
        <div className="flex justify-end mb-2">
          <button
            onClick={clearAllInterests}
            className="text-xs text-slate-500 hover:text-slate-700 underline"
          >
            Alle zurücksetzen
          </button>
        </div>
      )}
    
      {/* Render each category if it has matching interests */}
      {Object.entries(groupedInterests).map(([category, categoryInterests]) => {
        const matchingInterests = getInterestsInGroup(categoryInterests);
        
        if (matchingInterests.length === 0) return null;
        
        return (
          <div key={category} className="space-y-2">
            <h3 className="text-sm font-medium text-slate-700">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h3>
            <div className="flex flex-wrap gap-2">
              {matchingInterests.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    safeSelectedInterests.includes(interest)
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  aria-pressed={safeSelectedInterests.includes(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Handle any interests that don't fit in the defined categories */}
      {interests.filter(interest => 
        !Object.values(groupedInterests).flat().includes(interest) && 
        interest !== "Alle"
      ).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-700">Sonstiges</h3>
          <div className="flex flex-wrap gap-2">
            {interests.filter(interest => 
              !Object.values(groupedInterests).flat().includes(interest) && 
              interest !== "Alle"
            ).map(interest => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  safeSelectedInterests.includes(interest)
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                aria-pressed={safeSelectedInterests.includes(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Interests;
