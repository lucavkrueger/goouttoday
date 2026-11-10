
/**
 * Helper function to check if an image URL is a user-uploaded image
 */
export const isUploadedImage = (imageUrl: string | undefined): boolean => {
  if (!imageUrl) return false;
  return imageUrl.includes('images/c_');
};

/**
 * Optimize image URL with width and quality parameters
 * Using even lower quality (5% instead of 10%) for discover page
 * and smaller default width (200px instead of 300px) for faster loading
 */
export const optimizeImageUrl = (imageUrl: string, width: number = 200, quality: number = 5): string => {
  if (!imageUrl) return '';
  
  // Don't modify uploaded images
  if (isUploadedImage(imageUrl)) {
    return imageUrl;
  }
  
  // Unsplash optimization for even better performance
  if (imageUrl.includes('unsplash.com') && !imageUrl.includes('&q=')) {
    if (imageUrl.includes('?')) {
      return `${imageUrl}&w=${width}&q=${quality}&auto=format,compress`;
    } else {
      return `${imageUrl}?w=${width}&q=${quality}&auto=format,compress`;
    }
  }
  
  // Force quality and width parameters for faster loading
  // Remove any existing quality parameters if present
  let url = imageUrl;
  if (url.includes('?')) {
    // URL already has parameters
    if (url.includes('w=')) {
      // Replace existing width parameter with our smaller width
      url = url.replace(/w=\d+/g, `w=${width}`);
    } else {
      url += `&w=${width}`;
    }
    
    if (url.includes('q=')) {
      // Replace existing quality parameter with our lower quality
      url = url.replace(/q=\d+/g, `q=${quality}`);
    } else {
      url += `&q=${quality}`;
    }
    
    // Add format and compress parameters if not already present
    if (!url.includes('auto=')) {
      url += `&auto=format,compress`;
    }
    
    // Add WebP format if not already present - WebP is much faster
    if (!url.includes('fm=')) {
      url += `&fm=webp`;
    }
    
    return url;
  }
  
  // Add parameters to URL
  return `${imageUrl}?w=${width}&q=${quality}&fm=webp&auto=format,compress`;
};

/**
 * Prefetch images to improve loading performance
 * @param imageUrls - Array of image URLs to prefetch
 * @param highPriority - Optional boolean to indicate high priority prefetching
 * @param tinyPreview - If true, fetch tiny low-quality versions for quick display
 */
export const prefetchImages = (imageUrls: string[], highPriority?: boolean, tinyPreview?: boolean) => {
  // Create a tiny version load queue to avoid too many simultaneous requests
  const tinyQueue = [...imageUrls];
  const mainQueue = [...imageUrls];
  
  // Process more images at a time (increased from 8 to 10)
  const processBatch = (queue: string[], isTiny: boolean, batchSize: number = 10) => {
    const batch = queue.splice(0, batchSize);
    if (batch.length === 0) return;
    
    batch.forEach(url => {
      if (!url) return;
      
      const img = new Image();
      if (isTiny && !isUploadedImage(url)) {
        // Create a super low-quality version for instant preview
        img.src = optimizeImageUrl(url, 20, 1); // Even smaller and lower quality for initial display
      } else {
        img.src = isUploadedImage(url) ? url : optimizeImageUrl(url, 200, 5);
      }
      
      // Set fetch priority if supported and requested
      if (highPriority) {
        img.fetchPriority = 'high';
      }
      
      // When this batch is done, process the next batch
      img.onload = img.onerror = () => {
        if (queue.length > 0) {
          // Process next batch immediately without timeout
          processBatch(queue, isTiny, batchSize);
        }
      };
    });
  };
  
  // Start processing both queues with larger batch sizes
  if (tinyPreview) {
    processBatch(tinyQueue, true, 15); // Increase tiny preview batch size for faster initial display
  }
  processBatch(mainQueue, false, 10);
};

/**
 * Get a very low quality version of an image for immediate display
 * while the better version loads
 */
export const getTinyPreview = (imageUrl: string): string => {
  if (!imageUrl || isUploadedImage(imageUrl)) return imageUrl;
  return optimizeImageUrl(imageUrl, 20, 1); // Even smaller and lower quality for faster initial rendering
};
