
export interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  level: string;
  acceptedActivities: number;
  rank: number;
}

// Mock data for the leaderboard
export const leaderboardData: LeaderboardUser[] = [
  {
    id: "user1",
    name: "Berlin_Explorer",
    points: 1250,
    level: "City Legend",
    acceptedActivities: 25,
    rank: 1
  },
  {
    id: "user2",
    name: "HamburgHeld",
    points: 820,
    level: "Local Hero",
    acceptedActivities: 16,
    rank: 2
  },
  {
    id: "user3",
    name: "MünchenEntdecker",
    points: 720,
    level: "Local Hero",
    acceptedActivities: 14,
    rank: 3
  },
  {
    id: "user4",
    name: "KölnFan",
    points: 510,
    level: "Local Hero",
    acceptedActivities: 10,
    rank: 4
  },
  {
    id: "user5",
    name: "FrankfurtFreund",
    points: 350,
    level: "Expert",
    acceptedActivities: 7,
    rank: 5
  },
  {
    id: "user6",
    name: "DresdenScout",
    points: 280,
    level: "Scout",
    acceptedActivities: 5,
    rank: 6
  },
  {
    id: "user7",
    name: "LeipzigLover",
    points: 160,
    level: "Scout",
    acceptedActivities: 3,
    rank: 7
  },
  {
    id: "user8",
    name: "DüsseldorfEntdecker",
    points: 100,
    level: "Entdecker",
    acceptedActivities: 2,
    rank: 8
  },
  {
    id: "user9",
    name: "StuttgartStarter",
    points: 50,
    level: "Entdecker",
    acceptedActivities: 1,
    rank: 9
  },
  {
    id: "user10",
    name: "NürnbergNeuling",
    points: 25,
    level: "Neuling",
    acceptedActivities: 0,
    rank: 10
  }
];

// Function to get user's position in the leaderboard
export const getUserRankInLeaderboard = (userPoints: number): number => {
  // Count how many users have more points
  const usersWithMorePoints = leaderboardData.filter(user => user.points > userPoints).length;
  // Return rank (adding 1 because rank is 1-based, not 0-based)
  return usersWithMorePoints + 1;
};

// Function to get a combination of top users and users around the current user
export const getLeaderboardForUser = (userPoints: number, username: string = "Du"): LeaderboardUser[] => {
  // Always show top 5 users
  const topUsers = leaderboardData.slice(0, 5);
  
  // Find position of user
  const userRank = getUserRankInLeaderboard(userPoints);
  
  // Create a "current user" entry
  const currentUser = {
    id: "currentUser",
    name: username,
    points: userPoints,
    level: "Dein Level",
    acceptedActivities: 0, // This would be replaced with actual data
    rank: userRank
  };
  
  // If user is in top 5, just return top users
  if (userRank <= 5) {
    return topUsers;
  }
  
  // Otherwise, return top 5 users, a separator, and the current user
  return [
    ...topUsers,
    {
      id: "separator",
      name: "...",
      points: -1,
      level: "",
      acceptedActivities: -1,
      rank: -1
    },
    currentUser
  ];
};
