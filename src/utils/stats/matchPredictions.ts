
import { Match } from "@/types";

/**
 * Predict match outcome based on team history
 */
export function predictMatchOutcome(homeTeam: string, awayTeam: string, matches: Match[]) {
  if (!homeTeam || !awayTeam || !matches.length) {
    return { homeScore: 0, awayScore: 0, confidence: 0 };
  }

  const homeTeamMatches = matches.filter(
    m => m.home_team === homeTeam || m.away_team === homeTeam
  );
  
  const awayTeamMatches = matches.filter(
    m => m.home_team === awayTeam || m.away_team === awayTeam
  );
  
  const headToHeadMatches = matches.filter(
    m => (m.home_team === homeTeam && m.away_team === awayTeam) || 
         (m.home_team === awayTeam && m.away_team === homeTeam)
  );
  
  // Calculate average goals for each team
  const homeTeamStats = calculateTeamStats(homeTeam, homeTeamMatches);
  const awayTeamStats = calculateTeamStats(awayTeam, awayTeamMatches);
  
  // Apply home advantage factor
  const homeAdvantage = 1.2;
  
  // Predict scores
  const predictedHomeScore = Math.round((homeTeamStats.avgScored * homeAdvantage + awayTeamStats.avgConceded) / 2);
  const predictedAwayScore = Math.round((awayTeamStats.avgScored + homeTeamStats.avgConceded) / 2);
  
  // Calculate confidence level
  const totalMatches = homeTeamMatches.length + awayTeamMatches.length;
  const headToHeadFactor = headToHeadMatches.length > 0 ? 1.2 : 1;
  const confidence = Math.min(Math.round(
    (totalMatches / 10) * headToHeadFactor * 100
  ), 90);
  
  return {
    homeScore: predictedHomeScore || 1,
    awayScore: predictedAwayScore || 0,
    confidence: confidence || 30
  };
}

/**
 * Calculate team statistics from match history
 */
function calculateTeamStats(team: string, matches: Match[]) {
  if (!matches.length) {
    return { avgScored: 0, avgConceded: 0 };
  }
  
  const totalScored = matches.reduce((total, match) => {
    if (match.home_team === team) return total + match.home_score;
    return total + match.away_score;
  }, 0);
  
  const totalConceded = matches.reduce((total, match) => {
    if (match.home_team === team) return total + match.away_score;
    return total + match.home_score;
  }, 0);
  
  return {
    avgScored: totalScored / matches.length,
    avgConceded: totalConceded / matches.length
  };
}

/**
 * Calculate head-to-head statistics between two teams
 */
export function getHeadToHeadStats(homeTeam: string, awayTeam: string, matches: Match[]) {
  const h2hMatches = matches.filter(
    m => (m.home_team === homeTeam && m.away_team === awayTeam) || 
         (m.home_team === awayTeam && m.away_team === homeTeam)
  );
  
  if (!h2hMatches.length) {
    return {
      homeWins: 0,
      awayWins: 0, 
      draws: 0,
      homeGoals: 0,
      awayGoals: 0,
      bothTeamsScored: 0,
      totalMatches: 0
    };
  }
  
  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;
  let homeGoals = 0;
  let awayGoals = 0;
  let bothTeamsScored = 0;
  
  h2hMatches.forEach(match => {
    const isHomeTeamActuallyHome = match.home_team === homeTeam;
    
    const actualHomeScore = match.home_score;
    const actualAwayScore = match.away_score;
    
    // Count goals from perspective of the homeTeam param
    if (isHomeTeamActuallyHome) {
      homeGoals += actualHomeScore;
      awayGoals += actualAwayScore;
      
      if (actualHomeScore > actualAwayScore) homeWins++;
      else if (actualHomeScore < actualAwayScore) awayWins++;
      else draws++;
    } else {
      homeGoals += actualAwayScore;
      awayGoals += actualHomeScore;
      
      if (actualAwayScore > actualHomeScore) homeWins++;
      else if (actualAwayScore < actualHomeScore) awayWins++;
      else draws++;
    }
    
    if (actualHomeScore > 0 && actualAwayScore > 0) {
      bothTeamsScored++;
    }
  });
  
  return {
    homeWins,
    awayWins,
    draws,
    homeGoals,
    awayGoals,
    bothTeamsScored,
    totalMatches: h2hMatches.length
  };
}
