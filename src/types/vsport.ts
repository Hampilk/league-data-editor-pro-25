
import { Match } from "./index";

export interface VSportMatch extends Match {
  league?: string;
  homeOdds?: number;
  drawOdds?: number;
  awayOdds?: number;
  valueRating?: number; // 1-5 scale
  expectedValue?: number; // Expected value percentage
  roundTime?: number; // Round duration in minutes
  roundStatus: 'betting' | 'in_play' | 'complete';
}

export interface VSportLeagueMetadata {
  roundDuration: number; // in minutes
  roundInterval: number; // time between rounds in minutes
  currentRound: number;
  totalRounds: number;
  updateFrequency: number; // in seconds
  lastUpdated: string; // ISO datetime
}

export interface VSportBet {
  matchId: string;
  type: 'home' | 'draw' | 'away' | 'btts' | 'over_2.5' | 'under_2.5' | 'ht_ft';
  odds: number;
  stake: number;
  potentialReturn: number;
  isSettled: boolean;
  result?: 'win' | 'loss' | 'void';
  returnAmount?: number;
}

export interface VSportStats {
  totalMatches: number;
  homeWins: number;
  draws: number;
  awayWins: number;
  averageGoals: number;
  bothTeamsScoredPercentage: number;
  over2_5Percentage: number;
  fastestGoalMinute: number;
  winningAtHalfWonPercentage: number;
}
