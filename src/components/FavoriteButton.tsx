
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/hooks/use-toast';

interface FavoriteButtonProps {
  activity: {
    id: number;
    title: string;
    description: string;
    location: string;
    image: string;
    category: string;
    distance?: number;
    link?: string;
    price?: string;
    duration?: string;
    address?: string;
    date?: string;
    ticketLink?: string;
  };
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  activity, 
  variant = 'outline',
  size = 'icon'
}) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { toast } = useToast();
  
  const isActivityFavorite = isFavorite(activity.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isActivityFavorite) {
      removeFavorite(activity.id);
      toast({
        title: "Aus Favoriten entfernt",
        description: `"${activity.title}" wurde aus deinen Favoriten entfernt.`
      });
    } else {
      addFavorite(activity);
      toast({
        title: "Zu Favoriten hinzugefügt",
        description: `"${activity.title}" wurde zu deinen Favoriten hinzugefügt.`
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      className={`group ${isActivityFavorite ? 'bg-pink-50 border-pink-200 hover:bg-pink-100' : ''}`}
      aria-label={isActivityFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
    >
      <Heart 
        className={`h-4 w-4 ${isActivityFavorite 
          ? 'text-pink-500 fill-pink-500' 
          : 'text-slate-400 group-hover:text-pink-500'}`} 
      />
    </Button>
  );
};

export default FavoriteButton;
