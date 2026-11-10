
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DiscoverHeaderProps {
  totalActivities: number;
}

const DiscoverHeader = ({ totalActivities }: DiscoverHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-6 text-center">
      <h1 className="text-3xl font-display font-bold text-slate-900">
        Entdecke deine Umgebung
      </h1>
      <p className="text-slate-600 mt-2 max-w-md mx-auto text-sm md:text-base">
        Durchsuche mehr als {totalActivities} Aktivitäten und finde spannende Erlebnisse in deiner Nähe.
      </p>
    </div>
  );
};

export default DiscoverHeader;
