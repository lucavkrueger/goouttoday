import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Search, Info } from "lucide-react";
import ActivityCardWithFavorite from "@/components/ActivityCardWithFavorite";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getUserSettings } from "@/data/userSettings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SubmitActivityDialog from "@/components/SubmitActivityDialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

const Map = () => {
  const { favorites } = useFavorites();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFavorites, setFilteredFavorites] = useState(favorites);
  const settings = getUserSettings();
  const [displayLocation] = useState(
    typeof settings.location === 'object' ? settings.location.city : settings.location
  );
  const isMobile = useIsMobile();
  
  // Filter favorites when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFavorites(favorites);
      return;
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = favorites.filter(favorite => 
      favorite.title.toLowerCase().includes(lowerQuery) ||
      favorite.description.toLowerCase().includes(lowerQuery) ||
      favorite.location.toLowerCase().includes(lowerQuery) ||
      favorite.category.toLowerCase().includes(lowerQuery)
    );
    
    setFilteredFavorites(filtered);
  }, [searchQuery, favorites]);
  
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <div className="container max-w-5xl mx-auto px-4 pt-8 md:pt-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Deine Favoriten
          </h1>
          <p className="text-slate-600 mb-6">
            Hier findest du alle Aktivitäten, die du zu deinen Favoriten hinzugefügt hast.
          </p>
        </div>
        
        {/* Search bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input
            type="text"
            placeholder="In deinen Favoriten suchen..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="favorites" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="favorites" className="flex items-center gap-1">
              <Heart size={16} className="text-pink-500" />
              <span>Favoriten</span>
              {favorites.length > 0 && (
                <span className="ml-1 text-xs bg-pink-100 text-pink-800 rounded-full px-2 py-0.5">
                  {favorites.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="favorites">
            {filteredFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.map(activity => {
                  // Ensure all properties have default values
                  const safeActivity = {
                    id: activity.id,
                    title: activity.title,
                    description: activity.description,
                    location: activity.location,
                    image: activity.image,
                    category: activity.category,
                    distance: activity.distance,
                    link: activity.link || "",
                    price: activity.price || "",
                    duration: activity.duration || "",
                    address: activity.address || "",
                    date: activity.date || "",
                    ticketLink: activity.ticketLink || ""
                  };
                  
                  return (
                    <ActivityCardWithFavorite
                      key={`favorite-${safeActivity.id}`}
                      id={safeActivity.id}
                      title={safeActivity.title}
                      description={safeActivity.description}
                      location={safeActivity.location}
                      image={safeActivity.image}
                      category={safeActivity.category}
                      distance={safeActivity.distance}
                      link={safeActivity.link}
                      price={safeActivity.price}
                      duration={safeActivity.duration}
                      address={safeActivity.address}
                      date={safeActivity.date}
                      ticketLink={safeActivity.ticketLink}
                    />
                  );
                })}
              </div>
            ) : searchQuery ? (
              <Alert className="bg-amber-50 border-amber-200">
                <Info className="h-5 w-5 text-amber-600" />
                <AlertTitle>Keine Ergebnisse</AlertTitle>
                <AlertDescription>
                  Deine Suche nach "{searchQuery}" hat keine Favoriten gefunden.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-slate-900 mb-2">Keine Favoriten</h3>
                <p className="text-slate-600 mb-4">
                  Du hast noch keine Aktivitäten zu deinen Favoriten hinzugefügt.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <SubmitActivityDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      
      <Footer />
    </div>
  );
};

export default Map;
