import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Timer, RefreshCw, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";
import { VSportTrackerMatch } from "@/types/vsport";

interface VSportMatchTrackerProps {
  onRefresh?: () => void;
}

export function VSportMatchTracker({ onRefresh }: VSportMatchTrackerProps) {
  const [matches, setMatches] = useState<VSportTrackerMatch[]>([
    {
      id: "vs-1",
      homeTeam: "Virtual Arsenal",
      awayTeam: "Virtual Chelsea",
      kickoff: new Date(Date.now() + 180000), // 3 minutes from now
      status: "betting_open",
      homeOdds: 2.4,
      drawOdds: 3.1,
      awayOdds: 2.9,
      round: 1
    },
    {
      id: "vs-2",
      homeTeam: "Virtual Man City",
      awayTeam: "Virtual Liverpool",
      kickoff: new Date(Date.now() + 420000), // 7 minutes from now
      status: "upcoming",
      homeOdds: 1.9,
      drawOdds: 3.5,
      awayOdds: 3.8,
      round: 1
    },
    {
      id: "vs-3",
      homeTeam: "Virtual Tottenham",
      awayTeam: "Virtual Man United",
      kickoff: new Date(Date.now() - 120000), // 2 minutes ago
      status: "in_progress",
      homeOdds: 2.2,
      drawOdds: 3.3,
      awayOdds: 3.1,
      homeScore: 1,
      awayScore: 0,
      round: 1
    },
    {
      id: "vs-4",
      homeTeam: "Virtual Newcastle",
      awayTeam: "Virtual Aston Villa",
      kickoff: new Date(Date.now() - 480000), // 8 minutes ago
      status: "completed",
      homeOdds: 2.0,
      drawOdds: 3.4,
      awayOdds: 3.7,
      homeScore: 2,
      awayScore: 1,
      round: 1
    }
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate fetching new match data
    setTimeout(() => {
      // Update match statuses based on time
      const updatedMatches = matches.map(match => {
        const now = new Date();
        const matchTime = new Date(match.kickoff);
        
        // Logic to update match status based on time
        if (match.status === 'betting_open' && matchTime <= now) {
          return {...match, status: 'in_progress'};
        } else if (match.status === 'in_progress' && (now.getTime() - matchTime.getTime()) > 240000) {
          // 4 minutes after kickoff, match is completed
          return {
            ...match, 
            status: 'completed',
            homeScore: Math.floor(Math.random() * 4),
            awayScore: Math.floor(Math.random() * 3)
          };
        }
        return match;
      });
      
      setMatches(updatedMatches);
      setRefreshing(false);
      toast.success("V-sport matches updated");
      if (onRefresh) onRefresh();
    }, 1500);
  };

  const getMatchStatusBadge = (status: VSportTrackerMatch['status']) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Upcoming</Badge>;
      case 'betting_open':
        return <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">Betting Open</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/20">Completed</Badge>;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeDifference = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((date.getTime() - now.getTime()) / 1000);
    
    if (diff < 0) return 'Started';
    
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

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
          <div key={match.id} className="bg-black/30 rounded-lg p-4 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Round {match.round}</span>
              {getMatchStatusBadge(match.status)}
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
