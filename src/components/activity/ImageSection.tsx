
import React, { useState, useEffect } from 'react';
import { ImageSectionProps } from '@/types/activityTypes';
import { resetImageSelection } from '@/utils/imageSelectionUtils';
import ActivityImage from './ActivityImage';

declare global {
  interface Window {
    imageResetDone?: boolean;
  }
}

const ImageSection: React.FC<ImageSectionProps> = React.memo(({
  title,
  description,
  location,
  image,
  category,
  address,
  favoriteButton,
  id
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [uniqueId, setUniqueId] = useState<string>('');
  
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.imageResetDone) {
      resetImageSelection(true);
      window.imageResetDone = true;
    }
    
    return () => {
      if (typeof window !== 'undefined' && document.querySelectorAll('[data-activity-id]').length <= 1) {
        window.imageResetDone = false;
      }
    };
  }, []);
  
  useEffect(() => {
    const uniqueIdString = `${title}-${category}-${id || Math.random().toString(36).substring(2, 9)}`.replace(/[^\w-]/g, '-').toLowerCase();
    setUniqueId(uniqueIdString);
  }, [title, category, id]);

  return (
    <div 
      className="relative h-52 md:h-64 w-full overflow-hidden rounded-t-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-category={category}
      data-title={title}
      data-unique-id={uniqueId}
    >
      <ActivityImage
        title={title}
        description={description}
        location={location}
        image={image}
        category={category}
        id={id}
        uniqueId={uniqueId}
        onLoad={() => setIsLoaded(true)}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
        <div className="glass py-1.5 px-3 rounded-full text-xs font-medium text-slate-700 shadow-sm">
          {category}
        </div>
      </div>
      
      {favoriteButton && (
        <div className="absolute top-14 right-4 z-10">
          {favoriteButton}
        </div>
      )}
    </div>
  );
});

ImageSection.displayName = 'ImageSection';

export default ImageSection;
