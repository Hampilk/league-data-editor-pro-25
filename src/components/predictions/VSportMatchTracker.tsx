
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Timer, Clock, TrendingUp, ToggleRight, ToggleLeft } from "lucide-react";
import { toast } from "sonner";
import { useVSportMatches } from "@/hooks/useVSportMatches";
import { VSportMatchCard } from "./VSportMatchCard";
import { format } from "date-fns";

interface VSportMatchTrackerProps {
  onRefresh?: () => void;
}

export function VSportMatchTracker({ onRefresh }: VSportMatchTrackerProps) {
  const { 
    matches, 
    refreshing, 
    handleRefresh, 
    lastUpdated,
    autoRefresh,
    toggleAutoRefresh
  } = useVSportMatches(onRefresh);

  // Show matches grouped by status
  const upcomingMatches = matches.filter(m => m.status === "upcoming" || m.status === "betting_open");
  const liveMatches = matches.filter(m => m.status === "in_progress");
  const completedMatches = matches.filter(m => m.status === "completed");

  const renderMatchGroup = (title: string, matchList: any[], empty: string) => {
    if (matchList.length === 0) return null;
    
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium text-white/80 mb-2">{title}</h3>
        <div className="space-y-4">
          {matchList.length > 0 ? 
            matchList.map((match) => (
              <VSportMatchCard key={match.id} match={match} />
            ))
            : 
            <p className="text-gray-500 text-sm">{empty}</p>
          }
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-black/20 border-white/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Timer className="h-5 w-5 text-amber-500" />
          V-Sport Match Tracker
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="bg-transparent border-white/10 hover:bg-white/5"
            onClick={() => toggleAutoRefresh()}
            title={autoRefresh ? "Disable auto-refresh" : "Enable auto-refresh"}
          >
            {autoRefresh ? 
              <ToggleRight className="h-4 w-4 text-green-400" /> : 
              <ToggleLeft className="h-4 w-4" />
            }
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="bg-transparent border-white/10 hover:bg-white/5"
            onClick={() => handleRefresh()}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-400 flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4" />
          <span>
            {autoRefresh 
              ? "Updates automatically every minute" 
              : "Auto-update disabled"}
          </span>
        </div>
        
        {renderMatchGroup("Live Matches", liveMatches, "No matches currently in progress")}
        {renderMatchGroup("Upcoming Matches", upcomingMatches, "No upcoming matches")}
        {renderMatchGroup("Completed Matches", completedMatches, "No completed matches")}

        <div className="mt-4 text-center">
          <Button
            variant="outline"
            className="bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
            onClick={() => toast.info("V-sport betting features coming soon")}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Find Value Bets
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-500 pt-0">
        Last updated: {format(lastUpdated, "HH:mm:ss")}
      </CardFooter>
    </Card>
  );
}
