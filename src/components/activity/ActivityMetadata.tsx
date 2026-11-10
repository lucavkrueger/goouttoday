
import React from 'react';
import { Calendar, Euro, Clock, MapPin } from 'lucide-react';

interface ActivityMetadataProps {
  location: string;
  address?: string;
  date?: string;
  price?: string;
  duration?: string;
  distance?: number;
}

const ActivityMetadata: React.FC<ActivityMetadataProps> = ({
  location,
  address,
  date,
  price,
  duration,
  distance
}) => {
  const hasAddress = address && address.trim() !== "";
  const hasDate = date && date.trim() !== "";
  const hasPrice = price && price.trim() !== "";
  const hasDuration = duration && duration.trim() !== "";

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center text-slate-500">
        <MapPin size={16} className="mr-1.5 flex-shrink-0 text-primary/70" />
        <span className="text-sm truncate flex-grow">{location}</span>
        
        {distance !== undefined && (
          <span className="ml-auto text-xs font-medium px-2 py-0.5 bg-slate-100 rounded-full text-slate-500 flex-shrink-0 min-w-[50px] text-center whitespace-nowrap">
            {distance} km
          </span>
        )}
      </div>
      
      {hasAddress && (
        <div className="flex items-center text-slate-500">
          <MapPin size={16} className="mr-1.5 flex-shrink-0 text-primary/70 opacity-0" />
          <span className="text-xs text-slate-500 italic">{address}</span>
        </div>
      )}
      
      {hasDate && (
        <div className="flex items-center text-slate-500">
          <Calendar size={16} className="mr-1.5 flex-shrink-0 text-primary/70" />
          <span className="text-sm">{date}</span>
        </div>
      )}
      
      {hasPrice && (
        <div className="flex items-center text-slate-500">
          <Euro size={16} className="mr-1.5 flex-shrink-0 text-primary/70" />
          <span className="text-sm">{price}</span>
        </div>
      )}
      
      {hasDuration && (
        <div className="flex items-center text-slate-500">
          <Clock size={16} className="mr-1.5 flex-shrink-0 text-primary/70" />
          <span className="text-sm">{duration}</span>
        </div>
      )}
    </div>
  );
};

export default ActivityMetadata;
