
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { getUserSettings } from "@/data/userSettings";

interface MapComponentProps {
  displayLocation: string;
  height?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  displayLocation,
  height = "400px"
}) => {
  const settings = getUserSettings();
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-slate-200 relative" style={{ height }}>
          {/* This would be replaced with an actual map component */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6 bg-white/80 rounded-lg backdrop-blur-sm">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">Karte wird angezeigt</h3>
              <p className="text-slate-600">
                Hier würde in einer echten App eine interaktive Karte
                mit Aktivitäten rund um {displayLocation} angezeigt werden.
              </p>
            </div>
          </div>
          
          {/* Mock map markers */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">Du</span>
            </div>
          </div>
          
          <div className="absolute left-[60%] top-[40%]">
            <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
          </div>
          
          <div className="absolute left-[30%] top-[45%]">
            <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">B</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapComponent;
