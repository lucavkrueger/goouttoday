
import React from 'react';
import { Navigation, Ticket, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

interface ActivityActionsProps {
  address?: string;
  location: string;
  ticketLink?: string;
  link?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  refreshDisabled?: boolean;
  refreshLabel?: string;
}

const ActivityActions: React.FC<ActivityActionsProps> = ({
  address,
  location,
  ticketLink,
  link,
  onRefresh,
  isRefreshing,
  refreshDisabled,
  refreshLabel
}) => {
  const hasTicketLink = ticketLink && ticketLink.trim() !== "";
  const hasLink = link && link.trim() !== "";

  const handleRouteClick = () => {
    const navigationAddress = address || location;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(navigationAddress)}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleTicketClick = () => {
    if (ticketLink) {
      window.open(ticketLink, '_blank');
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleRouteClick}
        className="w-full bg-white hover:bg-slate-50"
      >
        <Navigation size={16} className="mr-1.5" />
        <span>Route planen</span>
      </Button>
      
      {hasTicketLink && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleTicketClick}
          className="w-full bg-white hover:bg-blue-50 border-blue-100 text-blue-600"
        >
          <Ticket size={16} className="mr-1.5" />
          <span>Tickets kaufen</span>
        </Button>
      )}
      
      {hasLink && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-2.5 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 text-sm font-medium text-primary transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-200 hover:text-blue-600 hover:translate-y-[-2px] shadow-sm"
        >
          <span>Mehr erfahren</span>
          <ExternalLink size={14} className="ml-1.5" />
        </a>
      )}
      
      {onRefresh && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={refreshDisabled || isRefreshing}
          className="w-full bg-white hover:bg-slate-50"
        >
          <RefreshCw size={16} className={`mr-1.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{refreshLabel || "Neuen Vorschlag generieren"}</span>
        </Button>
      )}
    </div>
  );
};

export default ActivityActions;
