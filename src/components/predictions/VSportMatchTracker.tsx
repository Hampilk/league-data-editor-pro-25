
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, RefreshCw, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";
import { useVSportMatches } from "@/hooks/useVSportMatches";
import { VSportMatchCard } from "./VSportMatchCard";

interface VSportMatchTrackerProps {
  onRefresh?: () => void;
}

export function VSportMatchTracker({ onRefresh }: VSportMatchTrackerProps) {
  const { matches, refreshing, handleRefresh } = useVSportMatches(onRefresh);

  return (
    <Card className="bg-black/20 border-white/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Timer className="h-5 w-5 text-amber-500" />
          V-Sport Match Tracker
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          className="bg-transparent border-white/10 hover:bg-white/5"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-400 flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4" />
          <span>Matches update every 7-8 minutes</span>
        </div>
        
        {matches.map((match) => (
          <VSportMatchCard key={match.id} match={match} />
        ))}

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
    </Card>
  );
}
