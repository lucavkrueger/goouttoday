
import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ActionSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className={`space-y-4 text-center p-6 ${isMobile ? 'mb-2' : 'mb-6'} rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100`}>
      <div>
        <h2 className="text-xl md:text-2xl font-display font-medium text-slate-800 mb-4">
          Entdecke noch mehr Aktivitäten
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto mb-6">
          Finde weitere Aktivitäten basierend auf deinen Interessen, Standort und Vorlieben.
        </p>
        <Link
          to="/discover"
          className={`inline-flex items-center justify-center space-x-2 bg-primary text-white ${isMobile ? 'py-3 px-6 text-base' : 'py-2.5 px-6'} rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors`}
        >
          <Compass size={isMobile ? 20 : 18} />
          <span>Mehr entdecken</span>
        </Link>
      </div>
    </section>
  );
};

export default ActionSection;
