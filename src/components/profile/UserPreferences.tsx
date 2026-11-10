
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { SaveIcon, BellIcon } from "lucide-react";
import FreeActivitiesToggle from "./FreeActivitiesToggle";
import { updateSettings } from "@/data/userSettings";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface UserPreferencesProps {
  freeActivitiesOnly: boolean;
  setFreeActivitiesOnly: (value: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  hideButton?: boolean;
}

const UserPreferences: React.FC<UserPreferencesProps> = ({ 
  freeActivitiesOnly, 
  setFreeActivitiesOnly,
  notificationsEnabled,
  setNotificationsEnabled,
  hideButton = false
}) => {
  const { toast } = useToast();

  const savePreferences = () => {
    // Update the settings using the proper function
    updateSettings({ freeActivitiesOnly, notificationsEnabled });
    
    toast({
      title: "Einstellungen gespeichert",
      description: "Deine Präferenzen wurden erfolgreich aktualisiert.",
    });
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setNotificationsEnabled(checked);
    if (!hideButton) {
      toast({
        title: checked ? "Benachrichtigungen aktiviert" : "Benachrichtigungen deaktiviert",
        description: checked 
          ? "Du erhältst Benachrichtigungen zu neuen Aktivitäten." 
          : "Du erhältst keine Benachrichtigungen mehr.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="space-y-4">
          {/* Notifications toggle */}
          <div className="flex items-center justify-between py-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-medium text-slate-900">Benachrichtigungen</h3>
              <p className="text-sm text-slate-500">
                Erhalte Benachrichtigungen zu neuen Aktivitäten und Events
              </p>
            </div>
            <div className="flex items-center">
              <BellIcon className="mr-2 h-5 w-5 text-slate-400" />
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={handleNotificationsToggle}
                aria-label="Benachrichtigungen aktivieren"
              />
            </div>
          </div>
          
          <FreeActivitiesToggle
            value={freeActivitiesOnly}
            onChange={setFreeActivitiesOnly}
            showIcon={true}
          />
          
          {/* Additional preferences would go here */}
        </div>
        
        {!hideButton && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end mt-6">
            <Button onClick={savePreferences}>
              <SaveIcon className="mr-2 h-4 w-4" />
              Einstellungen speichern
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPreferences;
