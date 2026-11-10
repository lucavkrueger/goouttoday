
import React from 'react';
import { Info } from 'lucide-react';
import ActivityMetadata from './ActivityMetadata';
import ActivityActions from './ActivityActions';

interface InfoSectionProps {
  title: string;
  description: string;
  location: string;
  category: string;
  isPrimary?: boolean;
  address?: string;
  date?: string;
  price?: string;
  duration?: string;
  distance?: number;
  link?: string;
  ticketLink?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  refreshDisabled?: boolean;
  refreshLabel?: string;
}

const categoryInfo = {
  "Märkte": "Lokale Produkte und einzigartige Funde entdecken",
  "Gastronomie": "Kulinarische Vielfalt und authentische Geschmäcker",
  "Natur": "Grüne Oasen und Erholung im Stadtgebiet",
  "Museen": "Kulturelle Schätze und faszinierende Ausstellungen",
  "Sport": "Aktive Erlebnisse für Körper und Geist",
  "Kunst": "Kreative Werke und künstlerische Inspiration",
  "Shopping": "Von Vintage bis Luxus - besondere Einkaufserlebnisse",
  "Geschichte": "Historische Orte und bedeutsame Ereignisse",
  "Erlebnis": "Unvergessliche Momente und neue Perspektiven",
  "Musik": "Klänge und Rhythmen aus aller Welt",
  "Kurse": "Neue Fähigkeiten erlernen und Talente entdecken",
  "Theater": "Darstellende Kunst und emotionale Geschichten",
  "Fotografie": "Bildkompositionen und visuelle Entdeckungen",
  "Tanzen": "Rhythmische Bewegungen und soziale Interaktion",
  "Lostplaces": "Verlassene Orte mit geheimnisvoller Geschichte erkunden",
  "Sehenswürdigkeiten": "Berühmte und geschichtsträchtige Orte der Stadt entdecken",
  "See": "Entspannung am Wasser und Freizeitspaß",
  "Museum": "Kulturelle Schätze und faszinierende Ausstellungen",
  "Architektur": "Beeindruckende Bauwerke und besondere Konstruktionen",
  "Nachhaltigkeit": "Umweltbewusstes Handeln und nachhaltige Erlebnisse",
  "Kultur": "Entdecke kulturelle Vielfalt und künstlerisches Schaffen",
  "Familie": "Gemeinsame Erlebnisse für Groß und Klein",
  "Wellness": "Entspannung und Erholung für Körper und Geist",
  "default": "Entdecke die Stadt von ihrer schönsten Seite"
};

const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  description,
  location,
  category,
  isPrimary,
  address,
  date,
  price,
  duration,
  distance,
  link,
  ticketLink,
  onRefresh,
  isRefreshing,
  refreshDisabled,
  refreshLabel
}) => {
  const getCategoryInfo = () => {
    return categoryInfo[category as keyof typeof categoryInfo] || categoryInfo.default;
  };

  return (
    <div className={`p-5 ${isPrimary ? 'bg-blue-50/30' : ''} flex-grow flex flex-col`}>
      <div className="space-y-3 flex-grow">
        <div>
          <h3 className="font-display text-xl font-medium text-slate-900 leading-tight">
            {title}
          </h3>
        </div>
        
        <p className="text-sm text-slate-600">
          {description}
        </p>
        
        <div className="pt-2 flex flex-col space-y-2 flex-grow">
          <ActivityMetadata
            location={location}
            address={address}
            date={date}
            price={price}
            duration={duration}
            distance={distance}
          />
          
          <div className="flex items-start text-slate-500 mt-1 pt-1 border-t border-slate-100">
            <Info size={16} className="mr-1.5 flex-shrink-0 text-primary/70 mt-0.5" />
            <span className="text-xs italic">{getCategoryInfo()}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-100">
        <ActivityActions
          address={address}
          location={location}
          ticketLink={ticketLink}
          link={link}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
          refreshDisabled={refreshDisabled}
          refreshLabel={refreshLabel}
        />
      </div>
    </div>
  );
};

export default InfoSection;
