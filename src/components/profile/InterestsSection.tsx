
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Interests from "../Interests";
import { updateSettings } from "@/data/userSettings";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/data/categories";

// Remove "Alle" from the categories for interests selection
const availableInterests = categories.filter(cat => cat !== "Alle");

interface InterestsSectionProps {
  selectedInterests: string[];
  setSelectedInterests: (interests: string[]) => void;
  hideButton?: boolean;
  noCard?: boolean;
}

const InterestsSection: React.FC<InterestsSectionProps> = ({ 
  selectedInterests = [], 
  setSelectedInterests,
  noCard = false
}) => {
  const { toast } = useToast();

  const handleInterestsChange = (newInterests: string[]) => {
    // Debug output
    console.log("InterestsSection - New interests selected:", newInterests);
    
    // Update the state in parent component
    setSelectedInterests(newInterests);
    
    // Save to user settings
    updateSettings({ interests: newInterests });
    
    // Dispatch event to notify other components
    const event = new CustomEvent('interestsChanged', { 
      detail: { interests: newInterests } 
    });
    window.dispatchEvent(event);
    
    console.log('Interests updated and event dispatched:', newInterests);
    
    // Only show a toast notification if interests actually changed
    // and not at every render
    const hasChanged = newInterests.length !== selectedInterests.length || 
                       !newInterests.every(i => selectedInterests.includes(i));
    
    if (hasChanged) {
      toast({
        title: "Interessen aktualisiert",
        description: newInterests.length > 0 
          ? "Deine Interessenauswahl wurde gespeichert." 
          : "Alle Interessen wurden zurückgesetzt.",
        duration: 3000,
      });
    }
  };

  const content = (
    <div className="w-full space-y-2">
      <p className="text-sm text-slate-600">
        Deine ausgewählten Interessen beeinflussen direkt die personalisierten Vorschläge auf der Startseite. 
        Je mehr Interessen du auswählst, desto besser können wir passende Aktivitäten für dich finden.
      </p>
      <Interests
        interests={availableInterests}
        selectedInterests={selectedInterests}
        onChange={handleInterestsChange}
      />
      {selectedInterests.length > 0 && (
        <div className="text-sm text-slate-600 mt-4">
          <p>Ausgewählte Interessen: {selectedInterests.join(', ')}</p>
        </div>
      )}
    </div>
  );

  if (noCard) {
    return content;
  }

  return (
    <Card className="bg-white" id="interests">
      <CardHeader>
        <h2 className="text-xl font-semibold text-slate-900">Deine Interessen</h2>
        <p className="text-sm text-slate-500">
          Wähle die Kategorien aus, die dich interessieren
        </p>
      </CardHeader>
      
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};

export default InterestsSection;
