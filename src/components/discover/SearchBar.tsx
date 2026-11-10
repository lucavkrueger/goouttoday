
import { Search } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { getUserSettings } from "@/data/userSettings";
import { useToast } from "@/hooks/use-toast";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery, showFilters, setShowFilters }: SearchBarProps) => {
  const [userLocation, setUserLocation] = useState("");
  const [prevSearches, setPrevSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadUserLocation = () => {
      const settings = getUserSettings();
      const location = typeof settings.location === 'object' ? 
        settings.location.city : settings.location;
      setUserLocation(location);
    };
    
    loadUserLocation();
    
    // Load previous searches from localStorage
    const savedSearches = localStorage.getItem('prevSearches');
    if (savedSearches) {
      try {
        setPrevSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error('Failed to parse saved searches', e);
      }
    }
    
    // Listen for location changes
    window.addEventListener('locationChanged', loadUserLocation);
    window.addEventListener('userSettingsChanged', loadUserLocation);
    
    // Handle clicks outside the suggestions box to close it
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('locationChanged', loadUserLocation);
      window.removeEventListener('userSettingsChanged', loadUserLocation);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Save search query to history when user submits a search
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    // Only save non-empty queries that are at least 3 characters
    if (query.trim().length >= 3 && !prevSearches.includes(query.trim())) {
      const newSearches = [query.trim(), ...prevSearches.slice(0, 4)];
      setPrevSearches(newSearches);
      try {
        localStorage.setItem('prevSearches', JSON.stringify(newSearches));
        
        // Notify user that search is saved
        toast({
          title: "Suche gespeichert",
          description: "Diese Suche wurde für späteren Zugriff gespeichert",
          duration: 2000
        });
      } catch (e) {
        console.error('Failed to save searches', e);
      }
    }
    
    if (query.trim().length === 0) {
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    
    // Focus the search input after selecting a suggestion
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  const getPlaceholderText = () => {
    if (!userLocation || userLocation.trim() === "") {
      return "Nach Aktivitäten suchen...";
    }
    return `Nach Aktivitäten in ${userLocation} suchen...`;
  };
  
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle keyboard navigation in suggestion list
    if (e.key === 'ArrowDown' && showSuggestions && prevSearches.length > 0) {
      const suggestions = document.querySelectorAll('.search-suggestion');
      if (suggestions.length > 0) {
        (suggestions[0] as HTMLElement).focus();
        e.preventDefault();
      }
    }
  };
  
  const handleSuggestionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const suggestions = document.querySelectorAll('.search-suggestion');
    
    if (e.key === 'ArrowDown') {
      if (index < suggestions.length - 1) {
        (suggestions[index + 1] as HTMLElement).focus();
      }
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      if (index > 0) {
        (suggestions[index - 1] as HTMLElement).focus();
      } else {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
      e.preventDefault();
    }
  };
  
  const clearSearchField = () => {
    handleSearchChange('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder={getPlaceholderText()}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setShowSuggestions(prevSearches.length > 0)}
          onKeyDown={handleSearchKeyDown}
          aria-label="Suchfeld für Aktivitäten"
          role="searchbox"
          autoComplete="off"
        />
        
        {searchQuery.length > 0 && (
          <button
            onClick={clearSearchField}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
            aria-label="Suchfeld löschen"
          >
            ×
          </button>
        )}
        
        {/* Search Suggestions */}
        {showSuggestions && prevSearches.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg"
            role="listbox"
            aria-label="Letzte Suchen"
          >
            <div className="p-2 text-xs text-slate-500 border-b border-slate-100">Letzte Suchen</div>
            <ul>
              {prevSearches.map((search, index) => (
                <li key={`search-${index}`}>
                  <button
                    onClick={() => handleSuggestionClick(search)}
                    onKeyDown={(e) => handleSuggestionKeyDown(e, index)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-slate-700 search-suggestion"
                    role="option"
                    tabIndex={0}
                  >
                    {search}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="md:w-auto px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 flex items-center justify-center transition-all hover:bg-slate-50"
        aria-label={showFilters ? "Filter ausblenden" : "Filter einblenden"}
        aria-expanded={showFilters}
      >
        <span>{showFilters ? "Filter ausblenden" : "Filter einblenden"}</span>
      </button>
    </div>
  );
};

export default SearchBar;
