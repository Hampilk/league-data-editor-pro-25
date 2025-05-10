
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  getMatchStatusConfig, 
  getTimeDifference,
  formatTime,
  getOddsColorClass,
  getMatchTimeElapsed
} from "@/utils/vsport/matchUtils";
import { VSportTrackerMatch } from "@/types/vsport";
import { Clock, Timer } from "lucide-react";

interface VSportMatchCardProps {
  match: VSportTrackerMatch;
}

export function VSportMatchCard({ match }: VSportMatchCardProps) {
  const { 
    homeTeam, 
    awayTeam, 
    kickoff, 
    status, 
    homeOdds, 
    drawOdds, 
    awayOdds,
    homeScore,
    awayScore
  } = match;
  
  const statusConfig = getMatchStatusConfig(status);
  const isLive = status === "in_progress";
  const isCompleted = status === "completed";
  const isBettingOpen = status === "betting_open";
  
  // Get time display based on status
  const timeDisplay = isLive 
    ? getMatchTimeElapsed(kickoff)
    : isCompleted 
      ? "FT" 
      : getTimeDifference(kickoff);
      
  // Score display
  const scoreDisplay = (isLive || isCompleted) && homeScore !== undefined && awayScore !== undefined
    ? `${homeScore} - ${awayScore}`
    : "vs";
    
  // Determine winner
  let homeTeamClass = "text-white";
  let awayTeamClass = "text-white";
  
  if (isCompleted && homeScore !== undefined && awayScore !== undefined) {
    if (homeScore > awayScore) {
      homeTeamClass += " font-bold text-green-400";
      awayTeamClass += " text-gray-400";
    } else if (homeScore < awayScore) {
      homeTeamClass += " text-gray-400";
      awayTeamClass += " font-bold text-green-400";
    } else {
      homeTeamClass += " text-amber-400";
      awayTeamClass += " text-amber-400";
    }
  }

  return (
    <Card className="bg-black/30 border border-white/5 overflow-hidden">
      <CardContent className="p-3">
        <div className="flex justify-between items-center">
          <Badge 
            variant="outline" 
            className={`${statusConfig.classes} text-xs`}
          >
            {statusConfig.label}
          </Badge>
          
          <div className="text-xs text-gray-400 flex items-center gap-1">
            {isLive ? (
              <>
                <Timer className="h-3 w-3 text-amber-500 animate-pulse" />
                <span className="text-amber-400 font-medium">{timeDisplay}</span>
              </>
            ) : (
              <>
                <Clock className="h-3 w-3" />
                <span>{formatTime(kickoff)}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className={`w-[40%] truncate ${homeTeamClass}`}>
            {homeTeam}
          </div>
          
          <div className={`px-3 py-1 min-w-[60px] text-center ${isLive ? 'bg-amber-500/20' : 'bg-black/20'} rounded-lg ${isLive ? 'text-white font-bold' : 'text-gray-400'}`}>
            {scoreDisplay}
          </div>
          
          <div className={`w-[40%] truncate text-right ${awayTeamClass}`}>
            {awayTeam}
          </div>
        </div>
        
        {/* Odds display */}
        {isBettingOpen && (
          <div className="mt-3 grid grid-cols-3 gap-1 text-center text-xs">
            <div className="bg-black/30 rounded p-1">
              <div className="text-gray-400">Home</div>
              <div className={getOddsColorClass(homeOdds || 0)}>
                {homeOdds?.toFixed(2)}
              </div>
            </div>
            <div className="bg-black/30 rounded p-1">
              <div className="text-gray-400">Draw</div>
              <div className={getOddsColorClass(drawOdds || 0)}>
                {drawOdds?.toFixed(2)}
              </div>
            </div>
            <div className="bg-black/30 rounded p-1">
              <div className="text-gray-400">Away</div>
              <div className={getOddsColorClass(awayOdds || 0)}>
                {awayOdds?.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
