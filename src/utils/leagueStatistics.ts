import { Match } from "@/types"
import { calculateStandings } from "./calculations"
import type { StandingsEntry } from "./calculations"

export interface LeagueStatistics {
  totalMatches: number
  completedMatches: number
  totalGoals: number
  averageGoalsPerMatch: number
  homeWins: number
  awayWins: number
  draws: number
  mostGoalsScoredInMatch: number
  cleanSheets: number
  topScorer: string
  mostCleanSheets: string
}

export function calculateLeagueStatistics(matches: Match[]): LeagueStatistics {
  if (!matches || matches.length === 0) {
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
    }
  }
  
  const completedMatches = matches.filter(match => 
    typeof match.home_score === 'number' && typeof match.away_score === 'number'
  )
  
  const totalGoals = completedMatches.reduce(
    (sum, match) => sum + match.home_score + match.away_score, 
    0
  )
  
  const homeWins = completedMatches.filter(
    match => match.home_score > match.away_score
  ).length
  
  const awayWins = completedMatches.filter(
    match => match.home_score < match.away_score
  ).length
  
  const draws = completedMatches.filter(
    match => match.home_score === match.away_score
  ).length
  
  const mostGoalsScoredInMatch = completedMatches.reduce(
    (max, match) => Math.max(max, match.home_score + match.away_score),
    0
  )
  
  const cleanSheets = completedMatches.filter(
    match => match.home_score === 0 || match.away_score === 0
  ).length
  
  // We'll simulate team statistics since we don't have actual player data
  const standings = calculateStandings(matches)
  const topScorer = getTopScoringTeam(standings)
  const mostCleanSheets = getMostCleanSheetsTeam(standings)
  
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
  }
}

function getTopScoringTeam(standings: StandingsEntry[]): string {
  if (standings.length === 0) return "-"
  
  const topScorer = standings.reduce((best, current) => 
    current.goalsFor > best.goalsFor ? current : best
  , standings[0])
  
  return topScorer.team
}

function getMostCleanSheetsTeam(standings: StandingsEntry[]): string {
  if (standings.length === 0) return "-"
  
  // Simulate clean sheets calculation based on goals against
  const bestDefense = standings.reduce((best, current) => 
    current.goalsAgainst < best.goalsAgainst ? current : best
  , standings[0])
  
  return bestDefense.team
}

export function predictMatchOutcome(homeTeam: string, awayTeam: string, matches: Match[]) {
  const homeTeamMatches = matches.filter(
    m => m.home_team === homeTeam || m.away_team === homeTeam
  )
  
  const awayTeamMatches = matches.filter(
    m => m.home_team === awayTeam || m.away_team === awayTeam
  )
  
  const headToHeadMatches = matches.filter(
    m => (m.home_team === homeTeam && m.away_team === awayTeam) || 
         (m.home_team === awayTeam && m.away_team === homeTeam)
  )
  
  // Calculate average goals for each team
  let homeTeamAvgScored = 0
  let homeTeamAvgConceded = 0
  let awayTeamAvgScored = 0
  let awayTeamAvgConceded = 0
  
  if (homeTeamMatches.length > 0) {
    homeTeamAvgScored = homeTeamMatches.reduce((total, match) => {
      if (match.home_team === homeTeam) return total + match.home_score
      return total + match.away_score
    }, 0) / homeTeamMatches.length
    
    homeTeamAvgConceded = homeTeamMatches.reduce((total, match) => {
      if (match.home_team === homeTeam) return total + match.away_score
      return total + match.home_score
    }, 0) / homeTeamMatches.length
  }
  
  if (awayTeamMatches.length > 0) {
    awayTeamAvgScored = awayTeamMatches.reduce((total, match) => {
      if (match.home_team === awayTeam) return total + match.home_score
      return total + match.away_score
    }, 0) / awayTeamMatches.length
    
    awayTeamAvgConceded = awayTeamMatches.reduce((total, match) => {
      if (match.home_team === awayTeam) return total + match.away_score
      return total + match.home_score
    }, 0) / awayTeamMatches.length
  }
  
  // Apply home advantage factor
  const homeAdvantage = 1.2
  
  // Predict scores
  const predictedHomeScore = Math.round((homeTeamAvgScored * homeAdvantage + awayTeamAvgConceded) / 2)
  const predictedAwayScore = Math.round((awayTeamAvgScored + homeTeamAvgConceded) / 2)
  
  // Calculate confidence level
  const totalMatches = homeTeamMatches.length + awayTeamMatches.length
  const headToHeadFactor = headToHeadMatches.length > 0 ? 1.2 : 1
  const confidence = Math.min(Math.round(
    (totalMatches / 10) * headToHeadFactor * 100
  ), 90)
  
  return {
    homeScore: predictedHomeScore || 1,
    awayScore: predictedAwayScore || 0,
    confidence: confidence || 30
  }
}
