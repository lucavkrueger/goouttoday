import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '@/components/Footer';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import GamificationStats from '@/components/profile/GamificationStats';
import Leaderboard from '@/components/profile/Leaderboard';
import SocialMediaLinks from '@/components/profile/SocialMediaLinks';
import InterestsSection from '@/components/profile/InterestsSection';
import LocationPreferences from '@/components/profile/LocationPreferences';
import FreeActivitiesToggle from '@/components/profile/FreeActivitiesToggle';
import { getUserSettings, updateSettings } from '@/data/userSettings';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Profile = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [freeActivitiesOnly, setFreeActivitiesOnly] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [location, setLocation] = useState('Berlin');
  const [maxDistance, setMaxDistance] = useState(10);
  const isMobile = useIsMobile();
  
  const { toast } = useToast();
  
  // Function to scroll to the section if hash is present in the URL
  const scrollToSection = () => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // Add smooth scrolling and offset for fixed header
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const loadUserSettings = () => {
    const userSettings = getUserSettings();
    console.log("Profile - Loading user settings:", userSettings);
    
    // Get interests from settings, ensure it's an array
    const interests = Array.isArray(userSettings.interests) ? userSettings.interests : [];
    console.log("Profile - Setting interests from settings:", interests);
    setSelectedInterests(interests);
    
    setFreeActivitiesOnly(userSettings.freeActivitiesOnly || false);
    setNotificationsEnabled(userSettings.notificationsEnabled || true);
    
    if (typeof userSettings.location === 'object' && userSettings.location) {
      setLocation(userSettings.location.city || 'Berlin');
      setMaxDistance(userSettings.location.radius || 10);
    } else if (typeof userSettings.location === 'string') {
      setLocation(userSettings.location || 'Berlin');
      setMaxDistance(userSettings.maxDistance || 10);
    } else {
      setLocation('Berlin');
      setMaxDistance(10);
    }
    
    console.log("Profile - Loaded settings:", {
      interests,
      freeActivitiesOnly: userSettings.freeActivitiesOnly,
      location: typeof userSettings.location === 'object' ? userSettings.location.city : userSettings.location
    });
  };
  
  // Callback für die Aktualisierung der Interessen
  const handleInterestsUpdate = (newInterests: string[]) => {
    console.log("Profile - Updating interests:", newInterests);
    setSelectedInterests(newInterests);

    // Speicher auch die Interessen in den Einstellungen
    updateSettings({ interests: newInterests });
  };
  
  useEffect(() => {
    loadUserSettings();
    
    // Handle hash navigation after settings are loaded
    setTimeout(scrollToSection, 300);

    const handleSettingsChange = () => {
      console.log("Profile detected settings change");
      loadUserSettings();
    };
    
    const handleLocationChange = () => {
      console.log("Profile detected location change");
      loadUserSettings();
    };
    
    const handleInterestsChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.interests) {
        console.log("Profile detected interests change:", customEvent.detail.interests);
        setSelectedInterests(customEvent.detail.interests);
      }
    };
    
    window.addEventListener('userSettingsChanged', handleSettingsChange);
    window.addEventListener('locationChanged', handleLocationChange);
    window.addEventListener('interestsChanged', handleInterestsChange as EventListener);
    
    return () => {
      window.removeEventListener('userSettingsChanged', handleSettingsChange);
      window.removeEventListener('locationChanged', handleLocationChange);
      window.removeEventListener('interestsChanged', handleInterestsChange as EventListener);
    };
  }, []);
  
  // Handle hash changes while already on the page
  useEffect(() => {
    window.addEventListener('hashchange', scrollToSection);
    return () => {
      window.removeEventListener('hashchange', scrollToSection);
    };
  }, []);
  
  const handleFreeActivitiesToggle = (checked: boolean) => {
    setFreeActivitiesOnly(checked);
    updateSettings({ freeActivitiesOnly: checked });
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setNotificationsEnabled(checked);
    updateSettings({ notificationsEnabled: checked });
  };
  
  const handleLogout = () => {
    toast({
      title: "Abgemeldet",
      description: "Du wurdest erfolgreich abgemeldet."
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="container max-w-5xl mx-auto px-4 pt-8 md:pt-24 pb-8 flex-grow">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-bold text-slate-900 text-center">
            Profil
          </h1>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>MM</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">Max Mustermann</h2>
                  <p className="text-sm text-slate-500 mb-4">@maxmustermann</p>
                  
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center">
                    <LogOut className="mr-1 h-4 w-4" />
                    Abmelden
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-medium text-slate-900">Benachrichtigungen</h3>
                      <p className="text-sm text-slate-500">
                        Erhalte Updates über neue Aktivitäten und Ereignisse
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex h-5 items-center">
                        <input
                          type="checkbox"
                          checked={notificationsEnabled}
                          onChange={(e) => handleNotificationsToggle(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <FreeActivitiesToggle 
                    value={freeActivitiesOnly}
                    onChange={handleFreeActivitiesToggle}
                  />
                </CardContent>
              </Card>
              
              <InterestsSection 
                selectedInterests={selectedInterests} 
                setSelectedInterests={handleInterestsUpdate}
              />
            </div>
          </div>
          
          <LocationPreferences 
            location={location}
            setLocation={setLocation}
            maxDistance={maxDistance}
            setMaxDistance={setMaxDistance}
          />
          
          <div className="grid grid-cols-1 gap-6 mt-6 pb-8">
            <SocialMediaLinks />
            
            <GamificationStats />
            
            <Leaderboard />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
