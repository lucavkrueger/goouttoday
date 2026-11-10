
import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import DiscoverResults from "@/components/discover/DiscoverResults";
import SearchBar from "@/components/discover/SearchBar";
import FilterSection from "@/components/discover/FilterSection";
import MapComponent from "@/components/map/MapComponent";
import { getUserSettings } from "@/data/userSettings";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { resetImageSelection } from "@/utils/imageSelectionUtils";

// Import all activities for the database view
import { randomActivities, personalizedActivitiesList, Activity } from "@/data/allActivities";
// Import nationalActivities
import { nationalActivities } from "@/data/nationalActivities";
// Import activities from different cities
import { allCitiesActivities } from "@/data/citiesActivities";
// Import additional Berlin activities
import { moreBerlinActivities } from "@/data/moreBerlinActivities";
import { newBerlinActivities } from "@/data/newBerlinActivities";
// Import categories
import { categories } from "@/data/categories";
// Import districts
import { districts } from "@/data/districts";
// Import sort options
import { sortOptions } from "@/data/sortOptions";

const Discover = () => {
  const isMobile = useIsMobile();
  const [settings, setSettings] = useState(getUserSettings());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); 
  const [selectedDistrict, setSelectedDistrict] = useState("Alle");
  const [maxDistance, setMaxDistance] = useState(15);
  const [sortBy, setSortBy] = useState("relevance");
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(
    typeof settings.location === 'object' ? settings.location.city : settings.location
  );
  const [resetCounter, setResetCounter] = useState(0); // Track resets for forcing re-render
  
  // Forced reset of image selection on page load
  useEffect(() => {
    resetImageSelection();
    
    if (typeof window !== 'undefined') {
      window.imageResetDone = true;
    }
    
    // Clear the reset flag when component unmounts
    return () => {
      if (typeof window !== 'undefined') {
        window.imageResetDone = false;
      }
    };
  }, []);
  
  // Create a deduplicated list of activities
  const uniqueActivities = useMemo(() => {
    // Combine all activities 
    const allActivities = [
      ...randomActivities, 
      ...personalizedActivitiesList, 
      ...nationalActivities,
      ...allCitiesActivities,
      ...moreBerlinActivities,
      ...newBerlinActivities
    ];
    
    // Remove duplicates based on title and location
    const uniqueMap = new Map<string, Activity>();
    
    allActivities.forEach(activity => {
      const key = `${activity.title?.toLowerCase()}-${activity.location?.toLowerCase()}`;
      if (!uniqueMap.has(key) && activity.title && activity.location) {
        uniqueMap.set(key, activity);
      }
    });
    
    return Array.from(uniqueMap.values());
  }, []);
  
  // Reset images when search/filters change to prevent duplicates
  useEffect(() => {
    resetImageSelection();
    
    // Force re-render of activities to trigger new image selection
    const timeout = setTimeout(() => {
      setActivities([]);
      setTimeout(() => {
        setActivities(uniqueActivities);
        setResetCounter(prev => prev + 1); // Force re-render
      }, 50);
    }, 50);
    
    return () => clearTimeout(timeout);
  }, [selectedCategories, searchQuery, selectedDistrict]);
  
  // Listen for location changes
  useEffect(() => {
    const handleLocationChange = () => {
      const updatedSettings = getUserSettings();
      const newLocation = typeof updatedSettings.location === 'object' ? 
        updatedSettings.location.city : updatedSettings.location;
      setDisplayLocation(newLocation);
      setSettings(updatedSettings);
    };
    
    window.addEventListener('locationChanged', handleLocationChange);
    window.addEventListener('userSettingsChanged', handleLocationChange);
    
    return () => {
      window.removeEventListener('locationChanged', handleLocationChange);
      window.removeEventListener('userSettingsChanged', handleLocationChange);
    };
  }, []);
  
  // Load all activities
  useEffect(() => {
    if (activities.length === 0) {
      setActivities(uniqueActivities);
      setFilteredActivities(uniqueActivities);
    }
  }, [activities.length, uniqueActivities]);
  
  // Toggle category function for multi-select
  const toggleCategory = (category: string) => {
    // Special handling for "Alle" category
    if (category === "Alle") {
      setSelectedCategories(selectedCategories.includes("Alle") ? [] : ["Alle"]);
      return;
    }
    
    // Remove "Alle" if it's selected and we're adding another category
    const updatedCategories = selectedCategories.includes("Alle") && !selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== "Alle")
      : [...selectedCategories];
      
    // Toggle the selected category
    if (updatedCategories.includes(category)) {
      setSelectedCategories(updatedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...updatedCategories, category]);
    }
  };
  
  // Filter activities based on search and categories
  useEffect(() => {
    let result = activities;
    
    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(activity => 
        activity.title?.toLowerCase().includes(lowerQuery) ||
        activity.description?.toLowerCase().includes(lowerQuery) ||
        activity.location?.toLowerCase().includes(lowerQuery) ||
        activity.category?.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Filter by categories (multiple)
    if (selectedCategories.length > 0 && !selectedCategories.includes("Alle")) {
      result = result.filter(activity => 
        selectedCategories.includes(activity.category || "")
      );
    }
    
    // Filter by district
    if (selectedDistrict !== "Alle") {
      result = result.filter(activity => activity.location?.includes(selectedDistrict));
    }
    
    // Sort activities
    if (sortBy === "newest") {
      result = [...result].sort((a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime());
    } else if (sortBy === "popular") {
      result = [...result].sort((a, b) => (b.id || 0) - (a.id || 0));
    }
    
    setFilteredActivities(result);
  }, [searchQuery, selectedCategories, selectedDistrict, maxDistance, sortBy, activities, resetCounter]);
  
  const clearFilters = () => {
    // Reset filters and force image reset
    resetImageSelection();
    setSelectedCategories([]);
    setSelectedDistrict("Alle");
    setMaxDistance(15);
    setSortBy("relevance");
    setSearchQuery("");
    setResetCounter(prev => prev + 1); // Force re-render
  };
  
  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pb-8 flex-grow pt-8 md:pt-24">
        <h1 className="text-3xl font-bold text-center mb-2 md:mb-4">
          Entdecke alle Aktivitäten
        </h1>
        <p className="text-center text-slate-600 mb-8">
          Durchsuche unsere Datenbank mit allen verfügbaren Aktivitäten
        </p>
        
        {/* Search bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            showFilters={showFilters} 
            setShowFilters={setShowFilters} 
          />
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="max-w-3xl mx-auto mb-8">
            <FilterSection 
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              maxDistance={maxDistance}
              setMaxDistance={setMaxDistance}
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={categories}
              districts={districts}
              sortOptions={sortOptions}
              clearFilters={clearFilters}
            />
          </div>
        )}
        
        {/* Map Toggle */}
        <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center flex-wrap">
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-map" 
              checked={showMap} 
              onCheckedChange={setShowMap}
            />
            <Label htmlFor="show-map" className="flex items-center cursor-pointer">
              <MapPin className="h-4 w-4 mr-2 text-slate-500" />
              Karte anzeigen
            </Label>
          </div>
          
          <Button 
            variant="outline" 
            onClick={toggleCategories}
            className="flex items-center gap-2 mt-2 sm:mt-0"
          >
            {showCategories ? (
              <>
                <span>Kategorien ausblenden</span>
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                <span>Kategorien einblenden</span>
                <ChevronDown size={16} />
              </>
            )}
          </Button>
        </div>
        
        {/* Map */}
        {showMap && (
          <div className="max-w-3xl mx-auto mb-8">
            <MapComponent displayLocation={displayLocation} height="300px" />
          </div>
        )}
        
        {/* Selected Categories */}
        {selectedCategories.length > 0 && (
          <div className="max-w-3xl mx-auto mb-4 flex flex-wrap gap-2">
            {selectedCategories.map(category => (
              <Badge 
                key={`top-selected-${category}`}
                variant="secondary"
                className="px-3 py-1 rounded-full flex items-center gap-1"
              >
                {category}
                <button
                  onClick={() => toggleCategory(category)}
                  className="ml-1 hover:text-gray-700"
                >
                  <ChevronDown size={14} />
                </button>
              </Badge>
            ))}
            {selectedCategories.length > 0 && (
              <Badge 
                variant="outline"
                className="px-3 py-1 rounded-full cursor-pointer"
                onClick={clearFilters}
              >
                Zurücksetzen
              </Badge>
            )}
          </div>
        )}
        
        {/* Categories */}
        {showCategories && (
          <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-3xl mx-auto">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className={`rounded-full ${selectedCategories.includes(category) ? "bg-primary" : "bg-white"} mb-2`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        )}
        
        {/* Results */}
        <DiscoverResults 
          activities={filteredActivities} 
          totalCount={filteredActivities.length} 
          key={`results-${resetCounter}`} // Force complete re-render when filter changes
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Discover;
