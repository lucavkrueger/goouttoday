
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle, Upload, Info, Award, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { incrementSubmittedActivities, getUserSettings } from "@/data/userSettings";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categoryOptions = [
  "Märkte", "Gastronomie", "Natur", "Museen", "Sport", 
  "Kunst", "Shopping", "Geschichte", "Erlebnis", "Musik", 
  "Kurse", "Theater", "Fotografie", "Tanzen", "Lostplaces", "See"
];

const cities = [
  "Berlin", "München", "Hamburg", "Köln", "Frankfurt", 
  "Dresden", "Leipzig", "Düsseldorf", "Stuttgart", "Nürnberg"
];

interface SubmitActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubmitActivityDialog: React.FC<SubmitActivityDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const userSettings = getUserSettings();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    address: "",
    category: "",
    price: "",
    duration: "",
    date: "",
    website: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Datei zu groß",
        description: "Bitte wähle ein Bild kleiner als 5MB.",
        variant: "destructive"
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Ungültiges Format",
        description: "Bitte wähle ein gültiges Bildformat (JPG, PNG, etc.).",
        variant: "destructive"
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.city || 
        !formData.category || !imageFile) {
      toast({
        title: "Formular unvollständig",
        description: "Bitte fülle alle Pflichtfelder aus und füge ein Bild hinzu.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you would send this data to a backend
    console.log("Submitting activity:", formData);
    console.log("Image file:", imageFile);
    
    // Increment submitted activities counter
    incrementSubmittedActivities();
    
    // Show success message
    toast({
      title: "Aktivität eingereicht!",
      description: "Vielen Dank für deinen Beitrag. Wir werden ihn prüfen und bald veröffentlichen.",
    });
    
    setFormSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      city: "",
      address: "",
      category: "",
      price: "",
      duration: "",
      date: "",
      website: ""
    });
    setImageFile(null);
    setPreviewUrl(null);
    setFormSubmitted(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        setFormSubmitted(false);
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aktivität vorschlagen</DialogTitle>
          <DialogDescription>
            Teile deine Lieblingsorte und -aktivitäten mit der Community
          </DialogDescription>
        </DialogHeader>

        {/* Points reward info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-blue-800">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Verdiene 50 Punkte</span>
            </div>
            <span className="text-sm text-blue-700 text-center sm:text-left">für jede akzeptierte Aktivität!</span>
          </div>
        </div>
        
        {formSubmitted ? (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="text-xl font-semibold text-green-700">Aktivität erfolgreich eingereicht!</h2>
              <p className="text-green-600">
                Vielen Dank für deinen Beitrag. Unser Team wird deine Aktivität prüfen und 
                nach erfolgreicher Überprüfung in die App aufnehmen.
              </p>
              
              {/* Gamification message */}
              <div className="mt-4 bg-white p-4 rounded-lg border border-green-200 w-full">
                <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
                  <Star className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Belohnungsstatus:</span>
                </div>
                <p className="text-slate-600 text-sm mb-3 text-center">
                  Du hast bereits <span className="font-semibold">{userSettings.submittedActivities}</span> Aktivitäten vorgeschlagen.
                </p>
                <div className="bg-slate-100 p-3 rounded text-slate-700 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Aktuelles Level:</span>
                    <Badge className="ml-2">{userSettings.level}</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Gesammelte Punkte:</span>
                    <span className="font-medium">{userSettings.stats?.pointsEarned || 0}</span>
                  </div>
                  <div className="mt-3 text-xs text-slate-500 text-center">
                    Nach der Überprüfung deines Vorschlags erhältst du 50 Punkte, wenn er akzeptiert wird.
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={resetForm}
                variant="outline" 
                className="mt-4"
              >
                Weitere Aktivität vorschlagen
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titel *</Label>
                <Input 
                  id="title"
                  name="title"
                  placeholder="z.B. Street Food Festival am Mauerpark"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung *</Label>
                <Textarea 
                  id="description"
                  name="description"
                  placeholder="Beschreibe die Aktivität in 2-3 Sätzen..."
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Stadt *</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => handleSelectChange("city", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Stadt auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Kategorie *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kategorie auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input 
                  id="address"
                  name="address"
                  placeholder="Straße, Hausnummer, PLZ"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preis</Label>
                  <Input 
                    id="price"
                    name="price"
                    placeholder="z.B. Eintritt frei, Ab 10€"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Öffnungszeiten/Dauer</Label>
                  <Input 
                    id="duration"
                    name="duration"
                    placeholder="z.B. 10:00 - 18:00 Uhr"
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Datum/Zeitraum</Label>
                  <Input 
                    id="date"
                    name="date"
                    placeholder="z.B. Jeden Sonntag, 01.06 - 15.06.2023"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website"
                    name="website"
                    placeholder="z.B. https://www.beispiel.de"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Bild hochladen *</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 transition-colors hover:border-primary/50">
                  <div className="flex flex-col items-center justify-center gap-2">
                    {previewUrl ? (
                      <div className="relative w-full">
                        <img 
                          src={previewUrl} 
                          alt="Vorschau" 
                          className="w-full h-48 object-cover rounded-md" 
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-slate-400" />
                        <p className="text-sm text-slate-500">
                          Ziehe ein Bild hierher oder klicke zum Auswählen
                        </p>
                        <p className="text-xs text-slate-400">
                          JPG, PNG oder GIF, max. 5MB
                        </p>
                      </>
                    )}
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={previewUrl ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-500">
                <p className="mb-1">
                  Dein Vorschlag wird von unserem Team geprüft, bevor er in der App erscheint.
                </p>
                <p className="font-medium text-blue-600">
                  Bei Akzeptanz erhältst du 50 Punkte und steigst im Level auf!
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Abbrechen
              </Button>
              <Button type="submit">
                Aktivität einreichen
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubmitActivityDialog;
