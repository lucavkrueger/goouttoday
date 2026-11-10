// Global registry for tracking which images are used across the app, prevents duplication
const globalImageRegistry = new Map<string, Set<string>>();
// Keep track of activity-image associations to ensure consistency
const activityImageAssociations = new Map<string, string>();

export const isImageUsedBySimilarActivity = (category: string, imageUrl: string): boolean => {
  if (!globalImageRegistry.has(category)) return false;
  return globalImageRegistry.get(category)?.has(imageUrl) || false;
};

export const registerImageUse = (category: string, imageUrl: string): void => {
  if (globalImageRegistry.has(category)) {
    globalImageRegistry.get(category)?.add(imageUrl);
  }
};

export const getActivityImageAssociation = (activityKey: string): string | undefined => {
  return activityImageAssociations.get(activityKey);
};

export const setActivityImageAssociation = (activityKey: string, imageUrl: string): void => {
  activityImageAssociations.set(activityKey, imageUrl);
};

// Reset image selection registry
export const resetImageRegistry = (preserveCache: boolean = true): void => {
  globalImageRegistry.clear();
  if (!preserveCache) {
    activityImageAssociations.clear();
  }
};
