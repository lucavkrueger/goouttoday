
import React from 'react';

const ImageLoading: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
      <div className="text-slate-400 text-sm">Lädt...</div>
    </div>
  );
};

export default ImageLoading;
