
import React, { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  User, 
  Search,
  Heart,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  
  // Function to determine if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Only show the navbar after component has mounted to prevent flash
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <div className={`fixed ${isMobile ? 'bottom-0 pb-safe' : 'top-0'} inset-x-0 z-50 bg-white border-t md:border-b md:border-t-0 border-slate-200 ${isMobile ? '' : 'py-1.5 shadow-sm'}`}>
      <div className="px-4 mx-auto max-w-5xl">
        <div className="flex items-center justify-center md:justify-between h-16 md:h-12">
          {/* Logo and title - Only shown on desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="GoOutToday Logo" className="w-8 h-8" />
              <span className="font-display text-base font-medium text-slate-900">
                GoOutToday
              </span>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center justify-around md:justify-end w-full md:w-auto space-x-1 md:space-x-1">
            <Link 
              to="/" 
              className={`flex flex-col md:flex-row items-center justify-center px-3 md:px-4 py-1 md:py-1 rounded-md transition-colors w-1/4 md:w-auto ${
                isActive('/') 
                  ? 'text-primary' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Home size={isMobile ? 20 : 16} className="mb-1 md:mb-0 md:mr-1.5" />
              <span className="text-xs md:text-sm text-center w-full md:w-auto">Home</span>
            </Link>
            
            <Link 
              to="/discover" 
              className={`flex flex-col md:flex-row items-center justify-center px-3 md:px-4 py-1 md:py-1 rounded-md transition-colors w-1/4 md:w-auto ${
                isActive('/discover') 
                  ? 'text-primary' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search size={isMobile ? 20 : 16} className="mb-1 md:mb-0 md:mr-1.5" />
              <span className="text-xs md:text-sm text-center w-full md:w-auto">Entdecken</span>
            </Link>
            
            <Link 
              to="/map" 
              className={`flex flex-col md:flex-row items-center justify-center px-3 md:px-4 py-1 md:py-1 rounded-md transition-colors w-1/4 md:w-auto ${
                isActive('/map') 
                  ? 'text-primary' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Heart size={isMobile ? 20 : 16} className="mb-1 md:mb-0 md:mr-1.5" />
              <span className="text-xs md:text-sm text-center w-full md:w-auto">Favoriten</span>
            </Link>
            
            <Link 
              to="/profile" 
              className={`flex flex-col md:flex-row items-center justify-center px-3 md:px-4 py-1 md:py-1 rounded-md transition-colors w-1/4 md:w-auto ${
                isActive('/profile') 
                  ? 'text-primary' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User size={isMobile ? 20 : 16} className="mb-1 md:mb-0 md:mr-1.5" />
              <span className="text-xs md:text-sm text-center w-full md:w-auto">Profil</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
