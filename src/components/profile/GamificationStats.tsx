
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Award, TrendingUp, Compass, ChevronUp, Star } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { getUserSettings, getProgressToNextLevel, levels } from '@/data/userSettings';

const GamificationStats = () => {
  const userSettings = getUserSettings();
  const pointsEarned = userSettings.stats.pointsEarned;
  
  // Get the level progress
  const progress = getProgressToNextLevel(pointsEarned);
  
  // Get current level details
  const currentLevelData = levels.find(l => l.level === progress.currentLevel);
  const nextLevelData = levels.find(l => l.level === progress.nextLevel);
  
  return (
    <Card className="bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-500" />
            Dein Level
          </h2>
          <div className="flex items-center gap-1 text-slate-500 text-sm">
            <Star className="h-4 w-4 text-amber-400" />
            <span>{pointsEarned} Punkte</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 text-blue-600 font-bold rounded-full h-10 w-10 flex items-center justify-center">
              {progress.currentLevel}
            </div>
            <div>
              <p className="font-medium">Level {progress.currentLevel}</p>
              <p className="text-xs text-slate-500">
                {currentLevelData?.pointsRequired} Punkte erreicht
              </p>
            </div>
          </div>
          
          {progress.currentLevel < 10 && (
            <div className="flex items-center gap-2">
              <ChevronUp className="h-4 w-4 text-green-500" />
              <div className="text-right">
                <p className="font-medium">Level {progress.nextLevel}</p>
                <p className="text-xs text-slate-500">
                  noch {progress.pointsToNextLevel} Punkte
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <Progress value={progress.progress} className="h-2" />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Level {progress.currentLevel}</span>
            {progress.currentLevel < 10 ? (
              <span>Level {progress.nextLevel}</span>
            ) : (
              <span>Max Level</span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-blue-500" />
                <p className="text-sm font-medium">Aktivitäten</p>
              </div>
              <span className="text-lg font-semibold">{userSettings.stats.activitiesCompleted}</span>
            </div>
          </div>
          
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <p className="text-sm font-medium">Vorschläge</p>
              </div>
              <span className="text-lg font-semibold">{userSettings.submittedActivities || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-4 mt-2">
          <h3 className="text-sm font-medium mb-2">Punktebelohnungen</h3>
          <ul className="text-xs text-slate-500 space-y-1">
            <li className="flex justify-between">
              <span>Aktivität abschließen</span>
              <span>+{userSettings.points.completeActivity} Punkte</span>
            </li>
            <li className="flex justify-between">
              <span>Aktivität vorschlagen</span>
              <span>+{userSettings.points.submitActivity} Punkte</span>
            </li>
            <li className="flex justify-between">
              <span>In sozialen Medien teilen</span>
              <span>+{userSettings.points.shareSocial} Punkte</span>
            </li>
            <li className="flex justify-between">
              <span>Täglicher Login</span>
              <span>+{userSettings.points.dailyLogin} Punkt</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationStats;
