import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin } from "lucide-react";
import { updateSettings } from "@/data/userSettings";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { allCitiesActivities } from "@/data/citiesActivities";

interface LocationPreferencesProps {
  location: string;
  setLocation: (location: string) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
}

// List of featured German cities
const featuredCities = [
  { name: "Berlin", emoji: "🏙️" },
  { name: "München", emoji: "🏔️" },
  { name: "Hamburg", emoji: "⚓" },
  { name: "Köln", emoji: "🏛️" },
  { name: "Frankfurt", emoji: "🏦" },
  { name: "Dresden", emoji: "🏰" },
  { name: "Leipzig", emoji: "🎵" },
  { name: "Düsseldorf", emoji: "🎭" },
];

const LocationPreferences: React.FC<LocationPreferencesProps> = ({
  location,
  setLocation,
  maxDistance,
  setMaxDistance,
}) => {
  const { toast } = useToast();
  const [pendingLocation, setPendingLocation] = useState(location);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Get available cities from activities
  useEffect(() => {
    const cities = new Set<string>();
    allCitiesActivities.forEach(activity => {
      if (activity.location) {
        const cityPart = activity.location.split(',')[0].trim();
        cities.add(cityPart);
      }
    });
    setAvailableCities(Array.from(cities));
  }, []);

  // Keep pendingLocation in sync with location prop
  useEffect(() => {
    setPendingLocation(location);
  }, [location]);

  // Handle location change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingLocation(e.target.value);
  };

  // Handle city selection from featured cities
  const handleCitySelect = (city: string) => {
    setPendingLocation(city);
    setLocation(city);
    
    // Update the location in user settings
    updateSettings({ 
      location: { 
        city: city, 
        radius: maxDistance 
      }
    });
    
    toast({
      title: `${city} ausgewählt`,
      description: `Dein Standort wurde auf ${city} aktualisiert.`,
      duration: 1500,
    });
    
    // Force reload of user settings in all components
    window.dispatchEvent(new Event('locationChanged'));
  };

  const handleDistanceChange = (values: number[]) => {
    const value = values[0];
    setMaxDistance(value);
    
    // Update the distance in the user settings
    updateSettings({ 
      location: { 
        city: pendingLocation, 
        radius: value 
      },
      maxDistance: value 
    });
    
    toast({
      title: `Maximale Entfernung: ${value} km`,
      description: `Deine Ergebnisse werden auf ${value} km im Umkreis begrenzt.`,
      duration: 1500,
    });
    
    // Force reload of location settings in other components
    window.dispatchEvent(new Event('locationChanged'));
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <h2 className="text-xl font-semibold text-slate-900">Standort & Umkreis</h2>
        <p className="text-sm text-slate-500">
          Lege deine Stadt und den maximalen Umkreis für Aktivitäten fest
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Featured cities section */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Stadt auswählen</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {featuredCities.map((city) => (
              <Button
                key={city.name}
                variant={pendingLocation === city.name ? "default" : "outline"}
                className={`h-auto py-2 px-3 justify-start ${pendingLocation === city.name ? "border-primary" : ""}`}
                onClick={() => handleCitySelect(city.name)}
              >
                <span className="mr-2">{city.emoji}</span>
                <span>{city.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Manual city selection - simplified */}
        <div className="space-y-2 pt-2">
          <Label htmlFor="location" className="text-base font-medium">
            Andere Stadt
          </Label>
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                id="location"
                value={pendingLocation}
                onChange={handleLocationChange}
                className="pl-10"
                placeholder="z.B. Stuttgart"
                list="available-cities"
              />
              <datalist id="available-cities">
                {availableCities.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
            <Button 
              onClick={() => handleCitySelect(pendingLocation)}
              variant="outline"
            >
              Anwenden
            </Button>
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <Label htmlFor="distance" className="text-base font-medium">
            Maximale Entfernung: {maxDistance} km
          </Label>
          <div className="pt-6 pb-8 relative">
            <Slider
              id="distance"
              min={1}
              max={50}
              step={1}
              value={[maxDistance]}
              onValueChange={handleDistanceChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-4">
              <span>1 km</span>
              <span>25 km</span>
              <span>50 km</span>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Aktivitäten werden in diesem Umkreis angezeigt
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationPreferences;
