import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { categories } from '@/data/categories';
import { districts } from '@/data/districts';
import { MapPin, Upload, Award } from 'lucide-react';
import { getUserSettings, incrementSubmittedActivities, getProgressToNextLevel } from '@/data/userSettings';
import { useToast } from '@/hooks/use-toast';
import TipDialog from '@/components/TipDialog';

const SubmitActivity = () => {
  const { toast } = useToast();
  const userSettings = getUserSettings();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [cost, setCost] = useState('');
  const [duration, setDuration] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [tipMessage, setTipMessage] = useState('');

  const levelProgress = getProgressToNextLevel(userSettings.stats.pointsEarned);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category || !location || !district) {
      toast({
        title: 'Unvollständige Eingaben',
        description: 'Bitte fülle alle Pflichtfelder aus.',
        variant: 'destructive',
      });
      return;
    }
    
    console.log('Activity submitted', {
      title,
      description,
      category,
      location: `${location}, ${district}`,
      cost,
      duration,
      imageUrl,
    });
    
    incrementSubmittedActivities();
    
    toast({
      title: 'Aktivität eingereicht',
      description: 'Vielen Dank! Deine Aktivität wurde erfolgreich eingereicht.',
    });
    
    setTipMessage(`Du hast erfolgreich eine Aktivität eingereicht!`);
    setShowDialog(true);
    
    setTitle('');
    setDescription('');
    setCategory('');
    setLocation('');
    setDistrict('');
    setCost('');
    setDuration('');
    setImageUrl('');
  };

  const handleImageUpload = () => {
    setUploading(true);
    
    setTimeout(() => {
      const placeholderImages = [
        'https://images.unsplash.com/photo-1533658280853-e4a10c25a30d',
        'https://images.unsplash.com/photo-1617854818583-09e7f077a156',
        'https://images.unsplash.com/photo-1554629947-334ff61d85dc',
        'https://images.unsplash.com/photo-1551632811-561732d1e306'
      ];
      
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      
      setImageUrl(randomImage);
      setUploading(false);
      
      toast({
        title: 'Bild hochgeladen',
        description: 'Dein Bild wurde erfolgreich hochgeladen.',
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Neue Aktivität einreichen</h1>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Level {levelProgress.currentLevel}</h2>
                  <p className="text-sm text-slate-500">
                    {levelProgress.pointsToNextLevel > 0 
                      ? `${levelProgress.pointsToNextLevel} Punkte bis Level ${levelProgress.nextLevel}`
                      : 'Du hast das maximale Level erreicht!'}
                  </p>
                </div>
                <div className="bg-amber-100 p-2 rounded-full">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-2">
                <Progress value={levelProgress.progress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p>Punkte für das Einreichen einer Aktivität: <span className="font-semibold">{userSettings.points.submitActivity}</span></p>
                <p>Eingereichte Aktivitäten: <span className="font-semibold">{userSettings.submittedActivities || 0}</span></p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titel*</Label>
                  <Input
                    id="title"
                    placeholder="z.B. Besuch des Botanischen Gartens"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Beschreibung*</Label>
                  <Textarea
                    id="description"
                    placeholder="Beschreibe die Aktivität..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-32"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategorie*</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wähle eine Kategorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="district">Stadt/Bezirk*</Label>
                    <Select value={district} onValueChange={setDistrict}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wähle einen Bezirk" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Genauer Standort*</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400 h-4 w-4" />
                    <Input
                      id="location"
                      className="pl-10"
                      placeholder="z.B. Straße, Hausnummer"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cost">Kosten</Label>
                    <Input
                      id="cost"
                      placeholder="z.B. Kostenlos, 5€, 10-20€"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Dauer</Label>
                    <Input
                      id="duration"
                      placeholder="z.B. 2 Stunden, halber Tag"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Bild</Label>
                  {imageUrl ? (
                    <div className="relative aspect-video w-full rounded-md overflow-hidden">
                      <img src={imageUrl} alt="Activity preview" className="object-cover w-full h-full" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-white bg-opacity-80"
                        onClick={() => setImageUrl('')}
                      >
                        Ändern
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full py-8 border-dashed"
                      onClick={handleImageUpload}
                      disabled={uploading}
                    >
                      {uploading ? (
                        'Wird hochgeladen...'
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" /> Bild hochladen
                        </>
                      )}
                    </Button>
                  )}
                </div>
                
                <div className="pt-2">
                  <Button type="submit" className="w-full">
                    Aktivität einreichen
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <TipDialog 
        open={showDialog} 
        onOpenChange={setShowDialog}
        title="Aktivität eingereicht"
        content={tipMessage}
      />
      
      <Footer />
    </div>
  );
};

export default SubmitActivity;
