
import { Match } from "@/types";
import { calculateStandings, StandingsEntry } from "../calculations";

export interface LeagueStatistics {
  totalMatches: number;
  completedMatches: number;
  totalGoals: number;
  averageGoalsPerMatch: number;
  homeWins: number;
  awayWins: number;
  draws: number;
  mostGoalsScoredInMatch: number;
  cleanSheets: number;
  topScorer: string;
  mostCleanSheets: string;
}

/**
 * Calculate comprehensive statistics for a league based on match data
 */
export function calculateLeagueStatistics(matches: Match[]): LeagueStatistics {
  if (!matches || matches.length === 0) {
    return createEmptyStatistics();
  }
  
  const completedMatches = matches.filter(match => 
    typeof match.home_score === 'number' && typeof match.away_score === 'number'
  );
  
  const totalGoals = completedMatches.reduce(
    (sum, match) => sum + match.home_score + match.away_score, 
    0
  );
  
  const homeWins = completedMatches.filter(
    match => match.home_score > match.away_score
  ).length;
  
  const awayWins = completedMatches.filter(
    match => match.home_score < match.away_score
  ).length;
  
  const draws = completedMatches.filter(
    match => match.home_score === match.away_score
  ).length;
  
  const mostGoalsScoredInMatch = completedMatches.reduce(
    (max, match) => Math.max(max, match.home_score + match.away_score),
    0
  );
  
  const cleanSheets = completedMatches.filter(
    match => match.home_score === 0 || match.away_score === 0
  ).length;
  
  // Calculate team statistics based on standings
  const standings = calculateStandings(matches);
  const topScorer = getTopScoringTeam(standings);
  const mostCleanSheets = getMostCleanSheetsTeam(standings);
  
  return {
    totalMatches: matches.length,
    completedMatches: completedMatches.length,
    totalGoals,
    averageGoalsPerMatch: completedMatches.length > 0 
      ? totalGoals / completedMatches.length 
      : 0,
    homeWins,
    awayWins,
    draws,
    mostGoalsScoredInMatch,
    cleanSheets,
    topScorer,
    mostCleanSheets
  };
}

/**
 * Get the team with the most goals scored
 */
export function getTopScoringTeam(standings: StandingsEntry[]): string {
  if (standings.length === 0) return "-";
  
  const topScorer = standings.reduce((best, current) => 
    current.goalsFor > best.goalsFor ? current : best
  , standings[0]);
  
  return topScorer.team;
}

/**
 * Get the team with the most clean sheets (estimated from goals against)
 */
export function getMostCleanSheetsTeam(standings: StandingsEntry[]): string {
  if (standings.length === 0) return "-";
  
  // Simulate clean sheets calculation based on goals against
  const bestDefense = standings.reduce((best, current) => 
    current.goalsAgainst < best.goalsAgainst ? current : best
  , standings[0]);
  
  return bestDefense.team;
}

/**
 * Create an empty statistics object with default values
 */
function createEmptyStatistics(): LeagueStatistics {
  return {
    totalMatches: 0,
    completedMatches: 0,
    totalGoals: 0,
    averageGoalsPerMatch: 0,
    homeWins: 0,
    awayWins: 0,
    draws: 0,
    mostGoalsScoredInMatch: 0,
    cleanSheets: 0,
    topScorer: "-",
    mostCleanSheets: "-"
  };
}
