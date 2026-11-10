
import { useState, useEffect } from 'react';

interface UseImageLoadingProps {
  imageUrl: string;
  isUploadedImage: boolean;
  onLoad: () => void;
  title: string;
}

export const useImageLoading = ({ 
  imageUrl, 
  isUploadedImage, 
  onLoad,
  title
}: UseImageLoadingProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Reset state when image URL changes
    setIsLoaded(false);
    
    // For uploaded images, we immediately assume loaded state
    if (isUploadedImage) {
      setIsLoaded(true);
      onLoad();
      return;
    }
    
    // Pre-load the image for non-uploaded images with tiny preview
    if (imageUrl) {
      const img = new Image();
      
      // If image is already cached, mark as loaded immediately
      if (img.complete) {
        setIsLoaded(true);
        onLoad();
        return;
      }
      
      // Set src after adding event listeners to ensure they catch
      img.onload = () => {
        setIsLoaded(true);
        onLoad();
      };
      
      img.onerror = () => {
        console.error(`Image failed to load: ${imageUrl}`);
        setIsLoaded(true); // Show something rather than nothing
        onLoad();
      };
      
      img.src = imageUrl;
      
      // Force decode if browser supports it for smoother display
      if (img.decode) {
        img.decode().catch(() => {
          console.warn(`Image decode failed: ${imageUrl}`);
        });
      }
    }
    
    // Much shorter timeout (250ms instead of 500ms)
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        console.warn(`Image loading timed out: ${imageUrl}`);
        setIsLoaded(true);
        onLoad();
      }
    }, 250); // Reduced from 500ms to 250ms for faster display
    
    return () => clearTimeout(timeout);
  }, [imageUrl, isUploadedImage, onLoad]);

  const handleImageError = () => {
    console.error(`Image failed to load: ${imageUrl}`);
    if (!isLoaded) {
      onLoad();
      setIsLoaded(true);
    }
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  return {
    isLoaded,
    handleImageError,
    handleImageLoad
  };
};
