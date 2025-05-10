
import { useState } from "react";
import { VSportTrackerMatch } from "@/types/vsport";
import { updateMatchStatuses } from "@/utils/vsport/matchUtils";
import { toast } from "sonner";

export function useVSportMatches(onRefresh?: () => void) {
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
      const updatedMatches = updateMatchStatuses(matches);
      
      setMatches(updatedMatches);
      setRefreshing(false);
      toast.success("V-sport matches updated");
      if (onRefresh) onRefresh();
    }, 1500);
  };

  return {
    matches,
    refreshing,
    handleRefresh
  };
}
