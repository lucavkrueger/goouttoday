
import React, { memo } from "react";
import ImageSection from "./activity/ImageSection";
import InfoSection from "./activity/InfoSection";

interface ActivityCardProps {
  title: string;
  description: string;
  location: string;
  image: string;
  link?: string;
  category: string;
  distance?: number;
  date?: string;
  isPrimary?: boolean;
  price?: string;
  duration?: string;
  address?: string;
  ticketLink?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  refreshDisabled?: boolean;
  refreshLabel?: string;
  favoriteButton?: React.ReactNode;
  id?: number;
}

const ActivityCard = memo(({
  title,
  description,
  location,
  image,
  link,
  category,
  distance,
  date,
  isPrimary = false,
  price,
  duration,
  address,
  ticketLink,
  onRefresh,
  isRefreshing = false,
  refreshDisabled = false,
  refreshLabel,
  favoriteButton,
  id
}: ActivityCardProps) => {
  // Ensure we have valid values for all required fields
  const safeTitle = title || "";
  const safeDescription = description || "";
  const safeLocation = location || "";
  const safeImage = image || ""; // ImageSection will handle empty strings
  const safeCategory = category || "default";
  
  return (
    <div 
      className={`activity-card relative overflow-hidden rounded-xl border ${
        isPrimary 
          ? 'shadow-lg border-blue-100 bg-gradient-to-br from-white to-blue-50' 
          : 'shadow-md border-slate-100 bg-white'
      } transition-all duration-300 hover:shadow-xl h-full flex flex-col`}
      data-activity-id={id}
    >
      <ImageSection
        id={id}
        title={safeTitle}
        description={safeDescription}
        location={safeLocation}
        image={safeImage}
        category={safeCategory}
        address={address}
        favoriteButton={favoriteButton}
      />
      
      <InfoSection
        title={safeTitle}
        description={safeDescription}
        location={safeLocation}
        category={safeCategory}
        isPrimary={isPrimary}
        address={address}
        date={date}
        price={price}
        duration={duration}
        distance={distance}
        link={link}
        ticketLink={ticketLink}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        refreshDisabled={refreshDisabled}
        refreshLabel={refreshLabel}
      />
    </div>
  );
});

// Add display name for debugging
ActivityCard.displayName = 'ActivityCard';

export default ActivityCard;
