
import React, { useState } from "react";
import { Coffee, Plus, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TipDialog from "./TipDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SubmitActivityDialog from "./SubmitActivityDialog";

const Footer: React.FC = () => {
  const [tipDialogOpen, setTipDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <footer className="bg-white py-3 border-t border-slate-200 w-full mt-auto">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="font-display text-lg font-medium text-slate-900">
              © {new Date().getFullYear()}
            </span>
            <Link to="/bildnachweise" className="text-sm text-slate-500 hover:text-slate-800 underline">Bildnachweise</Link>
          </div>
          
          <div className="flex items-center space-x-6 mb-2 md:mb-0">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
              <Instagram size={24} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
              <Facebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
              <Twitter size={24} />
            </a>
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col w-full' : 'flex-row'} items-center gap-2 ${isMobile ? 'mb-24' : 'mb-0'}`}>
            <Button 
              variant="outline" 
              onClick={() => setTipDialogOpen(true)}
              className={`flex items-center ${isMobile ? 'w-full py-2.5 text-base' : ''}`}
            >
              <Coffee size={isMobile ? 20 : 18} className="mr-2" />
              <span>Trinkgeld geben</span>
            </Button>
            
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`flex items-center ${isMobile ? 'w-full py-2.5 text-base' : ''}`}
                    onClick={() => setSubmitDialogOpen(true)}
                  >
                    <Plus size={isMobile ? 20 : 18} className="mr-2" />
                    <span>Aktivität vorschlagen</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="bg-blue-50 text-blue-900 p-4 rounded-lg max-w-xs border border-blue-200 shadow-sm"
                >
                  <div className="text-sm">
                    <p className="font-bold mb-2 text-blue-700">Werde Teil unserer Community!</p>
                    <p className="text-xs mb-2 text-blue-600">Deine Vorschläge helfen anderen, Berlin zu entdecken.</p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-blue-800">
                      <li>Verdiene 50 Punkte pro akzeptierter Aktivität</li>
                      <li>Teile deine Lieblingsplätze</li>
                      <li>Verbessere Empfehlungen für alle</li>
                      <li>Steige in deinem Level auf</li>
                    </ul>
                    <p className="text-xs mt-2 text-blue-500 font-medium">Je mehr Vorschläge, desto besser die App!</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {isMobile && <div className="h-20"></div>}

      <TipDialog 
        open={tipDialogOpen} 
        onOpenChange={setTipDialogOpen}
        title="Trinkgeld geben"
        content="Unterstütze uns mit einem kleinen Trinkgeld, damit wir dir weiterhin tolle Aktivitäten empfehlen können."
      />
      
      <SubmitActivityDialog
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
      />
    </footer>
  );
};

export default Footer;
