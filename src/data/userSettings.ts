export interface UserSettings {
  freeActivitiesOnly: boolean;
  notificationsEnabled?: boolean;
  interests: string[];
  location: {
    city: string;
    radius: number;
  };
  maxDistance?: number;
  locationEnabled?: boolean;
  username?: string;
  submittedActivities?: number;
  level?: number;
  stats: {
    activitiesCompleted: number;
    pointsEarned: number;
    badges: string[];
  };
  points: {
    completeActivity: number;
    submitActivity: number;
    shareSocial: number;
    firstLogin: number;
    dailyLogin: number;
    weeklyStreak: number;
    rateActivity: number;
  };
}

// Define levels for gamification
export const levels = [
  { level: 1, pointsRequired: 0 },
  { level: 2, pointsRequired: 50 },
  { level: 3, pointsRequired: 150 },
  { level: 4, pointsRequired: 300 },
  { level: 5, pointsRequired: 500 },
  { level: 6, pointsRequired: 750 },
  { level: 7, pointsRequired: 1000 },
  { level: 8, pointsRequired: 1500 },
  { level: 9, pointsRequired: 2000 },
  { level: 10, pointsRequired: 3000 }
];

// Calculate progress to next level
export function getProgressToNextLevel(currentPoints: number): { currentLevel: number, nextLevel: number, progress: number, pointsToNextLevel: number } {
  let currentLevel = 1;
  let nextLevelPoints = 50;
  
  for (let i = 0; i < levels.length; i++) {
    if (currentPoints >= levels[i].pointsRequired) {
      currentLevel = levels[i].level;
      nextLevelPoints = i < levels.length - 1 ? levels[i + 1].pointsRequired : Infinity;
    } else {
      break;
    }
  }
  
  const nextLevel = currentLevel < 10 ? currentLevel + 1 : 10;
  const currentLevelPoints = levels[currentLevel - 1].pointsRequired;
  const pointsToNextLevel = nextLevelPoints - currentPoints;
  const progress = currentLevel === 10 ? 100 : Math.min(100, ((currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100);
  
  return {
    currentLevel,
    nextLevel,
    progress,
    pointsToNextLevel: currentLevel === 10 ? 0 : pointsToNextLevel
  };
}

// Updated function to get the user settings
export function getUserSettings(): UserSettings {
  // Get the stored settings from local storage
  const storedSettings = localStorage.getItem('userSettings');
  console.log("Getting user settings from localStorage:", storedSettings);
  
  // If there are stored settings, parse and return them
  if (storedSettings) {
    try {
      const parsedSettings = JSON.parse(storedSettings);
      
      // Ensure location is properly structured
      if (typeof parsedSettings.location === 'string') {
        parsedSettings.location = {
          city: parsedSettings.location,
          radius: parsedSettings.maxDistance || 10
        };
      } else if (!parsedSettings.location) {
        parsedSettings.location = {
          city: 'Berlin',
          radius: 10
        };
      }
      
      // Ensure interests is always an array
      if (!parsedSettings.interests || !Array.isArray(parsedSettings.interests)) {
        parsedSettings.interests = [];
      }
      
      console.log("Parsed user settings:", parsedSettings);
      return parsedSettings;
    } catch (error) {
      console.error("Error parsing user settings:", error);
      // If there's an error, return default settings
    }
  }
  
  // If there are no stored settings or there was an error, return the default settings
  const defaultSettings = {
    freeActivitiesOnly: false,
    notificationsEnabled: true,
    interests: [],
    location: {
      city: 'Berlin',
      radius: 10,
    },
    maxDistance: 10,
    locationEnabled: true,
    username: '',
    submittedActivities: 0,
    level: 1,
    stats: {
      activitiesCompleted: 0,
      pointsEarned: 0,
      badges: [],
    },
    points: {
      completeActivity: 5,
      submitActivity: 15,
      shareSocial: 10,
      firstLogin: 2,
      dailyLogin: 1,
      weeklyStreak: 5,
      rateActivity: 2,
    }
  };
  
  console.log("Returning default settings:", defaultSettings);
  return defaultSettings;
}

// Function to save user settings to local storage
export function saveUserSettings(settings: UserSettings): void {
  // Ensure location is properly structured before saving
  if (typeof settings.location === 'string') {
    settings.location = {
      city: settings.location,
      radius: settings.maxDistance || 10
    };
  } else if (!settings.location) {
    settings.location = {
      city: 'Berlin',
      radius: settings.maxDistance || 10
    };
  }
  
  // Ensure interests is always an array
  if (!settings.interests || !Array.isArray(settings.interests)) {
    settings.interests = [];
  }
  
  console.log("Saving user settings to localStorage:", settings);
  localStorage.setItem('userSettings', JSON.stringify(settings));
  
  // Dispatch a custom event to notify all components
  window.dispatchEvent(new Event('userSettingsChanged'));
}

// Function to update specific settings
export function updateSettings(newSettings: Partial<UserSettings>): void {
  const currentSettings = getUserSettings();
  
  console.log("Updating settings:", newSettings);
  console.log("Current settings:", currentSettings);
  
  // Special handling for location to ensure it maintains the correct structure
  if (newSettings.location) {
    if (typeof newSettings.location === 'string') {
      newSettings.location = {
        city: newSettings.location,
        radius: currentSettings.location.radius
      };
    } else if (typeof newSettings.location === 'object') {
      // Make sure we have a complete location object
      if (!newSettings.location.city && currentSettings.location) {
        newSettings.location.city = currentSettings.location.city;
      }
      if (!newSettings.location.radius && currentSettings.location) {
        newSettings.location.radius = currentSettings.location.radius;
      }
    }
  }
  
  // If interests are being updated, ensure it's an array
  if ('interests' in newSettings) {
    if (!Array.isArray(newSettings.interests)) {
      newSettings.interests = [];
      console.warn("Interests were not an array, reset to empty array");
    }
    console.log("Updating interests to:", newSettings.interests);
  }
  
  const updatedSettings = { ...currentSettings, ...newSettings };
  saveUserSettings(updatedSettings);
  
  // Log the updated settings for debugging
  console.log("Settings updated:", updatedSettings);
  
  // Dispatch a location-specific event when the location is updated
  if (newSettings.location) {
    console.log("Location changed, dispatching event");
    window.dispatchEvent(new Event('locationChanged'));
  }
  
  // Dispatch an interests-specific event when interests are updated
  if ('interests' in newSettings) {
    console.log("Interests changed, dispatching specific event");
    const event = new CustomEvent('interestsChanged', { 
      detail: { interests: newSettings.interests || [] } 
    });
    window.dispatchEvent(event);
  }
}

// Function to increment submitted activities
export function incrementSubmittedActivities(): void {
  const settings = getUserSettings();
  if (!settings.submittedActivities) {
    settings.submittedActivities = 0;
  }
  settings.submittedActivities += 1;
  saveUserSettings(settings);
}
