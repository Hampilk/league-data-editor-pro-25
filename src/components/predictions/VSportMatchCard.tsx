
import React from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { VSportTrackerMatch } from "@/types/vsport";
import { getMatchStatusConfig, getTimeDifference } from "@/utils/vsport/matchUtils";

interface VSportMatchCardProps {
  match: VSportTrackerMatch;
}

export function VSportMatchCard({ match }: VSportMatchCardProps) {
  const statusConfig = getMatchStatusConfig(match.status);
  
  return (
    <div className="bg-black/30 rounded-lg p-4 border border-white/5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">Round {match.round}</span>
        <Badge variant="outline" className={statusConfig.classes}>{statusConfig.label}</Badge>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-white">{match.homeTeam}</div>
        {match.status === 'completed' ? (
          <div className="text-lg font-bold text-white">{match.homeScore} - {match.awayScore}</div>
        ) : (
          <div className="text-xs font-mono bg-black/50 px-2 py-1 rounded text-amber-400">
            {getTimeDifference(match.kickoff)}
          </div>
        )}
        <div className="text-sm text-white">{match.awayTeam}</div>
      </div>
      
      {(match.status === 'betting_open' || match.status === 'upcoming') && (
        <div className="grid grid-cols-3 gap-2 mt-3 border-t border-white/5 pt-3">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Home</div>
            <div className="bg-blue-900/30 rounded py-1 text-blue-400 font-medium">{match.homeOdds?.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Draw</div>
            <div className="bg-gray-800/50 rounded py-1 text-gray-300 font-medium">{match.drawOdds?.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Away</div>
            <div className="bg-amber-900/30 rounded py-1 text-amber-400 font-medium">{match.awayOdds?.toFixed(2)}</div>
          </div>
        </div>
      )}
      
      {match.status === 'in_progress' && (
        <div className="text-center mt-3 border-t border-white/5 pt-3">
          <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-1 rounded text-sm">
            <span className="animate-pulse h-2 w-2 rounded-full bg-red-500"></span>
            LIVE
          </div>
        </div>
      )}
      
      {match.status === 'completed' && (
        <div className="flex justify-between items-center mt-3 border-t border-white/5 pt-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-xs text-gray-400">Value Rating:</span>
          </div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                className={star <= 3 ? "text-amber-500" : "text-gray-600"}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
