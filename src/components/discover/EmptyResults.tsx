
import React from "react";
import { Button } from "@/components/ui/button";
import { PenLine, Award } from "lucide-react";

interface EmptyResultsProps {
  clearFilters: () => void;
  message?: string;
  buttonLabel?: string;
}

const EmptyResults = ({ 
  clearFilters, 
  message = "Keine Ergebnisse gefunden", 
  buttonLabel = "Filter zurücksetzen" 
}: EmptyResultsProps) => {
  return (
    <div className="py-16 text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-md mx-auto">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-xl font-medium text-slate-800 mb-2">
          {message}
        </h3>
        <p className="text-slate-500 mb-6">
          Für deine aktuelle Suche konnten wir leider keine passenden Aktivitäten finden. 
          Hilf uns, die Auswahl zu verbessern!
        </p>
        
        <div className="flex flex-col gap-4">
          <Button
            onClick={clearFilters}
            variant="outline"
            className="w-full"
          >
            {buttonLabel}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-lg" />
            <Button
              onClick={() => window.location.href = '/submit-activity'}
              className="relative w-full group hover:shadow-lg transition-all duration-300"
            >
              <PenLine className="w-4 h-4 mr-2" />
              Neue Aktivität vorschlagen
              <Award className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-sm text-slate-600 mt-3">
              Teile deine Lieblingsorte mit der Community und erhalte 50 Punkte für jede akzeptierte Aktivität!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyResults;
