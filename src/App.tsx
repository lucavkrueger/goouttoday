
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, useLocation } from "react-router-dom";

// Hash routing for static hosts without SPA rewrites (e.g. Claude artifact); set VITE_ROUTER=browser for own domain hosting
const Router = import.meta.env.VITE_ROUTER === "browser" ? BrowserRouter : HashRouter;
import { useEffect, useRef } from "react";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import Map from "./pages/Map";
import SubmitActivity from "./pages/SubmitActivity";
import NotFound from "./pages/NotFound";
import Credits from "./pages/Credits";
import { FavoritesProvider } from "./contexts/FavoritesContext";

// Improved ScrollToTop component that guarantees scroll reset on navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTopWithTimeout = () => {
      // Immediate scroll attempt
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });

      // Backup attempts with timeouts to ensure it works
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'instant'
        });
      }, 0);

      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'instant'
        });
        
        // Force scroll to top by setting focus to a top element
        document.body.focus();
        
        // Another approach - scroll the document element
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0; // For Safari
      }, 10);
      
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    };

    scrollToTopWithTimeout();
    console.log("ScrollToTop executed for path:", pathname);
    
    // Event listener for when the page is fully loaded
    const handleLoad = () => {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    };
    
    window.addEventListener('load', handleLoad);
    
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, [pathname]);

  return null;
}

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FavoritesProvider>
        <Toaster />
        <Sonner position="top-center" />
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/map" element={<Map />} />
            <Route path="/submit" element={<SubmitActivity />} />
            <Route path="/bildnachweise" element={<Credits />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </FavoritesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
