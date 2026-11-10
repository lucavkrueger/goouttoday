
import React from "react";
import logo from "@/assets/logo.png";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const isMobile = useIsMobile();
  
  return (
    <header className={`space-y-6 md:space-y-8 text-center ${className}`}>
      <div className="flex items-center justify-center">
        <img 
          src={logo} 
          alt="GoOutToday Logo" 
          className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} mr-3`} 
        />
        <h1 className={`${isMobile ? 'text-3xl' : 'text-3xl'} font-display font-bold text-slate-900`}>
          GoOutToday
        </h1>
      </div>
      <p className="text-slate-600 mx-auto max-w-md text-sm md:text-base px-4 md:px-0 leading-relaxed">
        Entdecke jeden Tag neue, zufällige Aktivitäten und Geheimtipps in deiner Umgebung.<br />
        Wir bieten dir sowohl komplett zufällige als auch personalisierte Vorschläge, die auf deinen Interessen basieren.
      </p>
    </header>
  );
};

export default Header;
