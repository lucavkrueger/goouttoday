
import React from 'react';

interface ImageLoadingOverlayProps {
  isLoaded: boolean;
}

const ImageLoadingOverlay: React.FC<ImageLoadingOverlayProps> = ({ isLoaded }) => {
  if (isLoaded) return null;

  return (
    <div className="absolute inset-0 bg-slate-100/60 flex items-center justify-center z-10">
      <div className="w-full h-full bg-gradient-to-br from-slate-100/80 to-slate-200/80 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default ImageLoadingOverlay;
