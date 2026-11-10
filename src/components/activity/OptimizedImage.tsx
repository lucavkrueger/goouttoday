
import React, { useRef, useState, useEffect } from 'react';
import { useImageLoading } from '@/hooks/useImageLoading';
import { getTinyPreview } from '@/utils/imageOptimizationUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  isUploadedImage: boolean;
  uniqueId: string;
  onLoad: () => void;
  className?: string;
  additionalProps?: Record<string, any>;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  isUploadedImage,
  uniqueId,
  onLoad,
  className,
  additionalProps = {}
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [tinyPreview, setTinyPreview] = useState<string>('');
  const { handleImageError, handleImageLoad, isLoaded } = useImageLoading({
    imageUrl: src,
    isUploadedImage,
    onLoad,
    title: alt
  });

  // Generate a tiny preview for non-uploaded images
  useEffect(() => {
    if (!isUploadedImage && src) {
      setTinyPreview(getTinyPreview(src));
    }
  }, [src, isUploadedImage]);

  // Register this image in the global loaded images registry
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.loadedImages) {
        window.loadedImages = new Set();
      }
      
      // If this image is already in the registry and loaded, trigger load immediately
      if (window.loadedImages.has(src) && imageRef.current) {
        handleImageLoad();
      }
    }
    
    return () => {
      // Keep the images in the registry to speed up return visits
    };
  }, [src]);

  if (!src) {
    console.warn(`Empty image source for ${alt}`);
    return null;
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Tiny preview image that loads immediately */}
      {tinyPreview && !isLoaded && !isUploadedImage && (
        <img
          src={tinyPreview}
          alt={`Low quality preview of ${alt}`}
          className={`absolute inset-0 w-full h-full object-cover filter blur-sm transition-opacity ${isLoaded ? 'opacity-0' : 'opacity-100'} ${className || ''}`}
          width="20"
          height="20"
          loading="eager"
          decoding="sync"
        />
      )}
      
      {/* Main image */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        onLoad={() => {
          // Add to global registry of loaded images
          if (typeof window !== 'undefined' && window.loadedImages) {
            window.loadedImages.add(src);
          }
          handleImageLoad();
        }}
        onError={handleImageError}
        className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${className || ''}`}
        loading={isUploadedImage ? "eager" : "lazy"}
        width={isUploadedImage ? "800" : "200"} 
        height="100%"
        decoding={isUploadedImage ? "sync" : "async"}
        fetchPriority={isUploadedImage ? "high" : "auto"}
        {...additionalProps}
      />
    </div>
  );
};

export default OptimizedImage;
