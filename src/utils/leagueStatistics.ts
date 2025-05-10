
import { Match } from "@/types";

// Re-export functionality from the modular files
export { 
  calculateLeagueStatistics,
  LeagueStatistics
} from "./stats/leagueOverview";

export {
  predictMatchOutcome,
  getHeadToHeadStats
} from "./stats/matchPredictions";

export {
  calculateValueBets,
  BettingPattern
} from "./stats/valueBetting";
