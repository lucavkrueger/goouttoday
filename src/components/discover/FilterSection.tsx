
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { getUserSettings } from "@/data/userSettings";
import { Badge } from "@/components/ui/badge";

interface FilterSectionProps {
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  categories: string[];
  districts: string[];
  sortOptions: { value: string; label: string }[];
  clearFilters: () => void;
}

// Group categories into themed sections
const groupedCategories = {
  popular: ["Alle", "Kunst", "Musik", "Sport", "Natur", "Erlebnis", "Gastronomie", "Kultur", "See"],
  rest: [] // Will be filled dynamically
};

const FilterSection = ({
  selectedCategories,
  toggleCategory,
  selectedDistrict,
  setSelectedDistrict,
  maxDistance,
  setMaxDistance,
  sortBy,
  setSortBy,
  categories,
  districts,
  sortOptions,
  clearFilters,
}: FilterSectionProps) => {
  // Fill 'rest' group with remaining categories not in 'popular'
  const restCategories = categories.filter(cat => !groupedCategories.popular.includes(cat));
  
  const [userSettings, setUserSettings] = useState(getUserSettings());
  
  // Initialize distance from user settings
  useEffect(() => {
    const settings = getUserSettings();
    if (settings.maxDistance && settings.maxDistance !== maxDistance) {
      setMaxDistance(settings.maxDistance);
    }
  }, []);

  // Function to check if a category is selected
  const isCategorySelected = (category: string) => {
    return selectedCategories.includes(category);
  };

  // Function to handle selecting "Alle" category
  const handleCategoryClick = (category: string) => {
    toggleCategory(category);
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 animate-fade-in">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-slate-800 mb-2">
              Kategorien (Mehrfachauswahl möglich)
            </h3>
            <div className="flex flex-wrap gap-2">
              {groupedCategories.popular.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isCategorySelected(category)
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-800 mb-2">
                Ausgewählte Kategorien
              </h3>
              <div className="flex flex-wrap gap-2 min-h-10 p-2 bg-slate-50 rounded-md">
                {selectedCategories.length === 0 ? (
                  <span className="text-sm text-slate-400">Keine Kategorien ausgewählt</span>
                ) : (
                  selectedCategories.map(category => (
                    <Badge 
                      key={`selected-${category}`} 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {category}
                      <X 
                        size={14} 
                        className="cursor-pointer" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(category);
                        }}
                      />
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-800 mb-2">
              Beliebte Standorte
            </h3>
            <div className="flex flex-wrap gap-2">
              {districts.slice(0, 8).map(district => (
                <button
                  key={district}
                  onClick={() => setSelectedDistrict(district)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedDistrict === district
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {district}
                </button>
              ))}
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-800 mb-2">
                Alle Standorte
              </h3>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Wähle einen Ort" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map(district => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-slate-800 mb-3">
                Maximale Entfernung: {maxDistance} km
              </h3>
              <div className="px-1 pt-6 pb-10 relative">
                <Slider
                  defaultValue={[maxDistance]}
                  max={50}
                  min={1}
                  step={1}
                  onValueChange={(values) => setMaxDistance(values[0])}
                  className="mb-8"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>1 km</span>
                  <span>25 km</span>
                  <span>50 km</span>
                </div>
                <div 
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded-md shadow-sm"
                  style={{ left: `${((maxDistance - 1) / 49) * 100}%` }}
                >
                  {maxDistance} km
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-800 mb-3">
                Sortieren nach
              </h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Wähle eine Sortierung" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      {(selectedCategories.length > 0 || selectedDistrict !== "Alle" || sortBy !== "relevance" || maxDistance !== 15) && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={clearFilters}
            className="flex items-center text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X size={16} className="mr-1" />
            <span>Filter zurücksetzen</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
