
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, ChevronUp, ChevronDown, Minus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { leaderboardData } from '@/data/leaderboardData';

// Define the interface for leaderboard user data
interface LeaderboardUser {
  rank: number;
  id: string | number;
  name: string;
  username?: string;
  avatar?: string;
  points: number;
  level?: string;
  acceptedActivities?: number;
  previousRank?: number;
  isCurrentUser?: boolean;
}

const Leaderboard = () => {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');
  
  // Cast the leaderboard data to the LeaderboardUser type
  const users = leaderboardData as unknown as LeaderboardUser[];
  
  // Find the current user (assuming id is a string)
  const currentUserIndex = users.findIndex(user => user.isCurrentUser === true);
  
  // Function to render rank change indicator
  const renderRankChange = (user: LeaderboardUser) => {
    if (!user.previousRank) return null;
    
    const diff = user.previousRank - user.rank;
    
    if (diff > 0) {
      return (
        <div className="flex items-center text-green-500">
          <ChevronUp className="h-4 w-4" />
          <span className="text-xs">{diff}</span>
        </div>
      );
    } else if (diff < 0) {
      return (
        <div className="flex items-center text-red-500">
          <ChevronDown className="h-4 w-4" />
          <span className="text-xs">{Math.abs(diff)}</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-gray-500">
        <Minus className="h-4 w-4" />
      </div>
    );
  };
  
  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Rangliste</h2>
            <p className="text-sm text-slate-500">
              Vergleiche deine Punkte mit anderen Nutzern
            </p>
          </div>
          
          <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as 'weekly' | 'monthly' | 'all-time')} className="mt-2 sm:mt-0">
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="weekly" className="text-xs">Wöchentlich</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs">Monatlich</TabsTrigger>
              <TabsTrigger value="all-time" className="text-xs">Gesamt</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Top 3 Users */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {/* 2nd Place */}
            <div className="flex flex-col items-center col-start-1">
              <Badge variant="secondary" className="mb-2 bg-gray-100">2</Badge>
              <Avatar className="h-12 w-12 border-2 border-gray-200">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>{users[1]?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-sm mt-2 text-center">{users[1]?.name}</h3>
              <p className="text-xs text-gray-500">{users[1]?.points} Punkte</p>
              {renderRankChange(users[1])}
            </div>
            
            {/* 1st Place */}
            <div className="flex flex-col items-center col-start-2">
              <Badge className="mb-2 bg-amber-500">1</Badge>
              <Avatar className="h-16 w-16 border-2 border-amber-300">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>{users[0]?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-sm mt-2 text-center">{users[0]?.name}</h3>
              <p className="text-xs text-gray-500">{users[0]?.points} Punkte</p>
              {renderRankChange(users[0])}
            </div>
            
            {/* 3rd Place */}
            <div className="flex flex-col items-center col-start-3">
              <Badge variant="outline" className="mb-2 bg-amber-700 text-white">3</Badge>
              <Avatar className="h-12 w-12 border-2 border-amber-700">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>{users[2]?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-sm mt-2 text-center">{users[2]?.name}</h3>
              <p className="text-xs text-gray-500">{users[2]?.points} Punkte</p>
              {renderRankChange(users[2])}
            </div>
          </div>
          
          {/* User's Position (if not in top 3) */}
          {currentUserIndex > 2 && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 my-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-sm w-6">{users[currentUserIndex]?.rank}</span>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>{users[currentUserIndex]?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-sm">{users[currentUserIndex]?.name}</h3>
                    <p className="text-xs text-gray-500">{users[currentUserIndex]?.points} Punkte</p>
                  </div>
                </div>
                {renderRankChange(users[currentUserIndex])}
              </div>
            </div>
          )}
          
          {/* List of other users */}
          <div className="space-y-3 mt-4">
            {users.slice(3).map((user, index) => (
              <div 
                key={user.id}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  user.isCurrentUser ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-sm w-6">{user.rank}</span>
                  <div className="flex-shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{user.name}</h3>
                    <p className="text-xs text-gray-500">{user.points} Punkte</p>
                  </div>
                </div>
                {renderRankChange(user)}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
