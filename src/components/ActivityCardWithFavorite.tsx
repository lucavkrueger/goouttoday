
import React, { useMemo } from 'react';
import ActivityCard from './ActivityCard';
import FavoriteButton from './FavoriteButton';
import { Activity } from '../data/allActivities';
import { SPECIFIC_ACTIVITY_IMAGES, CATEGORY_IMAGES } from '@/utils/imageConstants';

interface ActivityCardWithFavoriteProps {
  id: number;
  title: string;
  description: string;
  location: string;
  image: string;
  category: string;
  distance?: number;
  link?: string;
  price?: string;
  duration?: string;
  address?: string;
  date?: string;
  ticketLink?: string;
  isPrimary?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  refreshDisabled?: boolean;
  refreshLabel?: string;
}

const ActivityCardWithFavorite = React.memo((props: ActivityCardWithFavoriteProps) => {
  const { 
    id, 
    title,
    description,
    location,
    image,
    category,
    distance,
    link = "",
    price = "",
    duration = "",
    address = "",
    date = "",
    ticketLink = "",
    isPrimary,
    onRefresh,
    isRefreshing,
    refreshDisabled,
    refreshLabel
  } = props;
  
  // Get the best image for this activity
  const bestImage = useMemo(() => {
    // If image is provided directly, use it
    if (image && image.trim() !== '') return image;
    
    // Check if this is a known activity with a custom uploaded image
    const normalizedTitle = title.toLowerCase().trim();
    
    // PRIORITY 1: Look for exact title match in the uploaded images first
    for (const [key, imgUrl] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
      if (key.toLowerCase() === normalizedTitle && imgUrl.includes('images/c_')) {
        return imgUrl;
      }
    }
    
    // PRIORITY 2: Look for partial title match in uploaded images
    for (const [key, imgUrl] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
      if ((normalizedTitle.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTitle)) && 
          imgUrl.includes('images/c_')) {
        return imgUrl;
      }
    }
    
    // PRIORITY 3: Check for exact title match in regular images
    if (SPECIFIC_ACTIVITY_IMAGES[normalizedTitle]) {
      return SPECIFIC_ACTIVITY_IMAGES[normalizedTitle];
    }
    
    // PRIORITY 4: Check for partial title matches
    for (const [key, imgUrl] of Object.entries(SPECIFIC_ACTIVITY_IMAGES)) {
      if (normalizedTitle.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTitle)) {
        return imgUrl;
      }
    }
    
    // PRIORITY 5: Check if category has an image
    if (category && CATEGORY_IMAGES[category.toLowerCase()]) {
      return CATEGORY_IMAGES[category.toLowerCase()];
    }
    
    // Default to empty string, ImageSection will handle
    return '';
  }, [title, category, image]);
  
  // Create the activity object with all properties for the favorite button
  // Use memo to prevent recreation on every render
  const activity: Activity = useMemo(() => ({
    id,
    title,
    description,
    location,
    image: bestImage,
    category,
    distance,
    link,
    price,
    duration,
    address,
    date,
    ticketLink
  }), [
    id, title, description, location, bestImage, category, 
    distance, link, price, duration, address, date, ticketLink
  ]);

  // Memoize the favorite button to prevent unnecessary re-renders
  const favoriteButtonElement = useMemo(() => (
    <FavoriteButton activity={activity} />
  ), [activity]);

  return (
    <div className="relative">
      <ActivityCard 
        id={id} // Ensure ID is passed
        title={title}
        description={description}
        location={location}
        image={bestImage}
        category={category}
        distance={distance}
        link={link}
        price={price}
        duration={duration}
        address={address}
        date={date}
        ticketLink={ticketLink}
        isPrimary={isPrimary}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        refreshDisabled={refreshDisabled}
        refreshLabel={refreshLabel}
        favoriteButton={favoriteButtonElement}
      />
    </div>
  );
});

ActivityCardWithFavorite.displayName = 'ActivityCardWithFavorite';

export default ActivityCardWithFavorite;
