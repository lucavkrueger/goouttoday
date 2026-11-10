
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DollarSign } from "lucide-react";

interface FreeActivitiesToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  showIcon?: boolean;
}

const FreeActivitiesToggle: React.FC<FreeActivitiesToggleProps> = ({ 
  value, 
  onChange,
  showIcon = true
}) => {
  const { toast } = useToast();
  
  const handleToggle = (checked: boolean) => {
    onChange(checked);
    toast({
      title: checked ? "Nur kostenlose Aktivitäten" : "Alle Aktivitäten",
      description: checked 
        ? "Du siehst jetzt nur kostenlose Aktivitäten." 
        : "Du siehst jetzt alle Aktivitäten.",
      duration: 3000,
    });
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-200">
      <div>
        <h3 className="text-base font-medium text-slate-900">Nur kostenlose Aktivitäten</h3>
        <p className="text-sm text-slate-500">
          Zeige nur kostenlose Aktivitäten und Erlebnisse an
        </p>
      </div>
      <div className="flex items-center">
        {showIcon && <DollarSign className="mr-2 h-5 w-5 text-slate-400" />}
        <Switch 
          checked={value} 
          onCheckedChange={handleToggle}
          aria-label="Nur kostenlose Aktivitäten anzeigen"
        />
      </div>
    </div>
  );
};

export default FreeActivitiesToggle;
