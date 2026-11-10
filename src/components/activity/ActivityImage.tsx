
import React, { useState, useEffect } from 'react';
import { SPECIFIC_ACTIVITY_IMAGES } from '@/utils/imageConstants';
import { optimizeImageUrl, isUploadedImage, getTinyPreview } from '@/utils/imageOptimizationUtils';
import OptimizedImage from './OptimizedImage';
import ImageLoadingOverlay from './ImageLoadingOverlay';

interface ActivityImageProps {
  title: string;
  description: string;
  location: string;
  image: string;
  category: string;
  id?: number;
  uniqueId: string;
  onLoad: () => void;
}

const ActivityImage: React.FC<ActivityImageProps> = ({
  title,
  description,
  location,
  image,
  category,
  id,
  uniqueId,
  onLoad,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploadedImg, setIsUploadedImg] = useState(false);
  const [tinyPreview, setTinyPreview] = useState<string>('');
  
  // First, check for uploaded images using exact match
  useEffect(() => {
    const normalizedTitle = title.toLowerCase().trim();
    
    // Only use uploaded images for exact matches to prevent misuse
    if (SPECIFIC_ACTIVITY_IMAGES[normalizedTitle] && 
        SPECIFIC_ACTIVITY_IMAGES[normalizedTitle].includes('Special:FilePath')) {
      setImageUrl(SPECIFIC_ACTIVITY_IMAGES[normalizedTitle]);
      setIsUploadedImg(true);
      
      // No need for tiny preview for uploaded images
      setTinyPreview('');
    } else {
      // Generate tiny preview immediately for super-fast initial display
      const tinyImage = optimizeImageUrl(image || '', 50, 5);
      setTinyPreview(tinyImage);
      
      // For non-uploaded images, use lower quality (10% not 20%)
      const optimizedImage = optimizeImageUrl(image || '', 300, 10);
      setImageUrl(optimizedImage);
      setIsUploadedImg(false);
    }
  }, [title, image]);
  
  // Handle the loading completion
  const handleFullImageLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  return (
    <>
      {/* Loading indicator */}
      {!isUploadedImg && !isLoaded && (
        <ImageLoadingOverlay isLoaded={isLoaded} />
      )}
      
      {/* Tiny preview for immediate display */}
      {tinyPreview && !isLoaded && (
        <div className="absolute inset-0 w-full h-full">
          <img
            src={tinyPreview}
            alt={`Low quality preview of ${title}`}
            className="w-full h-full object-cover filter blur-sm"
            loading="eager"
          />
        </div>
      )}
      
      <OptimizedImage
        src={imageUrl}
        alt={title}
        isUploadedImage={isUploadedImg}
        uniqueId={uniqueId}
        onLoad={handleFullImageLoad}
        className="transition-opacity duration-300"
        additionalProps={{
          'data-activity-id': id,
          'data-category': category,
          'data-location': location,
          'data-unique-id': uniqueId
        }}
      />
    </>
  );
};

export default ActivityImage;
