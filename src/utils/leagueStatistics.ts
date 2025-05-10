
import { Match } from "@/types";

// Re-export functionality from the modular files
export { 
  calculateLeagueStatistics
} from "./stats/leagueOverview";

export type { LeagueStatistics } from "./stats/leagueOverview";

export {
  predictMatchOutcome,
  getHeadToHeadStats
} from "./stats/matchPredictions";

export {
  calculateValueBets
} from "./stats/valueBetting";

export type { BettingPattern } from "./stats/valueBetting";
