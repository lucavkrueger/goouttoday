
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Coffee, Euro, Info, ThumbsUp } from 'lucide-react';
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from './ui/badge';

export interface TipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  content?: string;
}

const TipDialog = ({ 
  open, 
  onOpenChange, 
  title = "Trinkgeld geben", 
  content = "Unterstütze uns mit einem kleinen Trinkgeld, damit wir dir weiterhin tolle Aktivitäten empfehlen können."
}: TipDialogProps) => {
  const [amount, setAmount] = useState<number>(5);
  const [message, setMessage] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<string>("5");
  const [success, setSuccess] = useState<boolean>(false);
  const isMobile = useIsMobile();

  // Predefined tip amounts
  const tipOptions = [3, 5, 10, 20, 50];
  const minTip = 0.10;
  const maxTip = 1000;

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSuccess(false);
      setAmount(5);
      setCustomAmount("5");
      setMessage("");
    }
  }, [open]);

  // Update custom amount when slider changes
  useEffect(() => {
    setCustomAmount(amount.toFixed(2));
  }, [amount]);

  // Handle custom amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(',', '.');
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setCustomAmount(value);
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= minTip && numValue <= maxTip) {
        setAmount(numValue);
      }
    }
  };

  const handleTipSubmit = () => {
    // This would typically be connected to a payment processor
    console.log(`Tip amount: ${amount.toFixed(2)}€, Message: ${message}`);
    // Show success state
    setSuccess(true);
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="p-6 flex flex-col items-center justify-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <ThumbsUp className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Vielen Dank!</h3>
            <p className="text-slate-600 mb-6 text-center">
              Deine Unterstützung hilft uns, weiterhin tolle Aktivitäten für dich zu finden.
            </p>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Schließen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <div className="p-4 lg:p-6 flex flex-col items-center justify-center">
          <div className="bg-amber-100 p-4 rounded-full mb-4">
            <Euro className="h-12 w-12 text-amber-600" />
          </div>
          <div className="text-center mb-4 w-full">
            <p className="text-slate-600 mb-6">{content}</p>
            
            {/* Quick select buttons */}
            <div className="flex justify-center flex-wrap gap-2 my-4">
              {tipOptions.map((val) => (
                <Button 
                  key={val}
                  variant={Math.abs(amount - val) < 0.01 ? "default" : "outline"}
                  onClick={() => {
                    setAmount(val);
                    setCustomAmount(val.toString());
                  }}
                  className="px-4"
                >
                  {val}€
                </Button>
              ))}
              
              {/* Custom amount input */}
              <div className="flex items-center mt-3 w-full sm:w-auto bg-slate-100 rounded-md">
                <span className="pl-2 text-slate-600">€</span>
                <input 
                  type="text"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="w-24 text-center p-2 bg-transparent border-none focus:outline-none text-slate-900"
                  min={minTip}
                  max={maxTip}
                  aria-label="Custom amount"
                />
              </div>
            </div>
            
            {/* Slider with clear min/max labels */}
            <div className="w-full px-1 mt-6 mb-3">
              <div className="flex justify-between text-sm text-slate-500 mb-1">
                <span className="font-medium">Wähle einen Betrag:</span>
                <Badge variant="outline" className="font-normal">
                  {amount.toFixed(2)}€
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">{minTip}€</span>
                <Slider 
                  value={[amount]}
                  min={minTip} 
                  max={maxTip}
                  step={0.1}
                  onValueChange={([val]) => {
                    setAmount(val);
                    setCustomAmount(val.toFixed(2));
                  }}
                  className="flex-1"
                />
                <span className="text-xs text-slate-500">{maxTip}€</span>
              </div>
              <p className="text-xs text-slate-500 text-center mt-1">
                Bewege den Schieberegler zwischen {minTip}€ und {maxTip}€
              </p>
            </div>
            
            {/* Help text */}
            <div className="bg-blue-50 rounded-md p-3 flex space-x-2 mt-4 mb-6 text-left">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                Du kannst einen beliebigen Betrag zwischen {minTip}€ und {maxTip}€ wählen.
                Nutze die Schnellauswahl-Buttons oder den Schieberegler.
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                Hinterlasse eine Nachricht (optional):
              </label>
              <Textarea
                placeholder="Deine Nachricht an uns..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[80px] text-base"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            className="w-full" 
            onClick={handleTipSubmit}
            size="lg"
          >
            {parseFloat(customAmount).toFixed(2)}€ spenden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TipDialog;
