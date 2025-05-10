
import { Match, PredictionPattern } from "@/types";

/**
 * Calculate betting value for V-sport matches based on odds and predicted outcome
 */
export function calculateBettingValue(
  homeOdds: number, 
  drawOdds: number, 
  awayOdds: number,
  homeTeam: string,
  awayTeam: string,
  matches: Match[]
): {
  bestBet: 'home' | 'draw' | 'away' | null;
  confidence: number;
  expectedValue: number;
  valueRating: number;
} {
  if (!matches || matches.length === 0) {
    return {
      bestBet: null,
      confidence: 0,
      expectedValue: 0,
      valueRating: 0
    };
  }

  // Calculate probability based on historical data
  const stats = calculateVSportTeamStats(homeTeam, awayTeam, matches);
  
  // Calculate implied probabilities from odds
  const homeImpliedProb = 1 / homeOdds;
  const drawImpliedProb = 1 / drawOdds;
  const awayImpliedProb = 1 / awayOdds;
  
  // Calculate our estimated probabilities based on historical data
  const totalProb = stats.homeWinProb + stats.drawProb + stats.awayWinProb;
  const adjustedHomeProb = stats.homeWinProb / totalProb;
  const adjustedDrawProb = stats.drawProb / totalProb;
  const adjustedAwayProb = stats.awayWinProb / totalProb;
  
  // Calculate expected value
  const homeEV = (homeOdds * adjustedHomeProb) - 1;
  const drawEV = (drawOdds * adjustedDrawProb) - 1;
  const awayEV = (awayOdds * adjustedAwayProb) - 1;
  
  // Find best bet
  const evOptions = [
    { type: 'home' as const, ev: homeEV },
    { type: 'draw' as const, ev: drawEV },
    { type: 'away' as const, ev: awayEV }
  ];
  
  const bestBetOption = evOptions.reduce((best, current) => 
    current.ev > best.ev ? current : best
  , evOptions[0]);
  
  const bestBet = bestBetOption.ev > 0 ? bestBetOption.type : null;
  const expectedValue = bestBetOption.ev;
  
  // Calculate confidence and value rating
  const confidence = bestBet === 'home' ? adjustedHomeProb :
                    bestBet === 'draw' ? adjustedDrawProb :
                    bestBet === 'away' ? adjustedAwayProb : 0;
  
  // Value rating from 1-5
  const valueRating = expectedValue <= 0 ? 0 :
                      expectedValue < 0.1 ? 1 :
                      expectedValue < 0.2 ? 2 :
                      expectedValue < 0.3 ? 3 :
                      expectedValue < 0.4 ? 4 : 5;
  
  return {
    bestBet,
    confidence,
    expectedValue,
    valueRating
  };
}

/**
 * Calculate team statistics based on historical V-sport match data
 */
function calculateVSportTeamStats(homeTeam: string, awayTeam: string, matches: Match[]): {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  expectedGoals: {
    home: number;
    away: number;
  }
} {
  // Filter matches for the home team
  const homeTeamMatches = matches.filter(m => 
    m.home_team === homeTeam || m.away_team === homeTeam
  );
  
  // Filter matches for the away team
  const awayTeamMatches = matches.filter(m => 
    m.home_team === awayTeam || m.away_team === awayTeam
  );
  
  // Head-to-head matches
  const h2hMatches = matches.filter(m => 
    (m.home_team === homeTeam && m.away_team === awayTeam) || 
    (m.home_team === awayTeam && m.away_team === homeTeam)
  );
  
  // If we have head-to-head data, use it with higher weight
  if (h2hMatches.length > 0) {
    const homeWins = h2hMatches.filter(m => 
      (m.home_team === homeTeam && m.home_score > m.away_score) || 
      (m.away_team === homeTeam && m.away_score > m.home_score)
    ).length;
    
    const draws = h2hMatches.filter(m => m.home_score === m.away_score).length;
    
    const awayWins = h2hMatches.length - homeWins - draws;
    
    // Calculate expected goals
    const homeGoals = h2hMatches.reduce((sum, m) => 
      sum + (m.home_team === homeTeam ? m.home_score : m.away_score), 0
    ) / h2hMatches.length;
    
    const awayGoals = h2hMatches.reduce((sum, m) => 
      sum + (m.home_team === awayTeam ? m.home_score : m.away_score), 0
    ) / h2hMatches.length;
    
    return {
      homeWinProb: homeWins / h2hMatches.length,
      drawProb: draws / h2hMatches.length,
      awayWinProb: awayWins / h2hMatches.length,
      expectedGoals: {
        home: homeGoals,
        away: awayGoals
      }
    };
  }
  
  // If we don't have head-to-head data, use individual team performance
  const homeTeamHomeWins = homeTeamMatches.filter(m => 
    m.home_team === homeTeam && m.home_score > m.away_score
  ).length / Math.max(1, homeTeamMatches.filter(m => m.home_team === homeTeam).length);
  
  const awayTeamAwayWins = awayTeamMatches.filter(m => 
    m.away_team === awayTeam && m.away_score > m.home_score
  ).length / Math.max(1, awayTeamMatches.filter(m => m.away_team === awayTeam).length);
  
  const homeTeamDraws = homeTeamMatches.filter(m => m.home_score === m.away_score).length / 
    Math.max(1, homeTeamMatches.length);
  
  const awayTeamDraws = awayTeamMatches.filter(m => m.home_score === m.away_score).length / 
    Math.max(1, awayTeamMatches.length);
  
  // Calculate average goals
  const homeTeamHomeGoals = homeTeamMatches.reduce((sum, m) => 
    sum + (m.home_team === homeTeam ? m.home_score : 0), 0
  ) / Math.max(1, homeTeamMatches.filter(m => m.home_team === homeTeam).length);
  
  const awayTeamAwayGoals = awayTeamMatches.reduce((sum, m) => 
    sum + (m.away_team === awayTeam ? m.away_score : 0), 0
  ) / Math.max(1, awayTeamMatches.filter(m => m.away_team === awayTeam).length);
  
  // Apply home advantage factor (typically 1.2-1.4)
  const homeAdvantage = 1.3;
  
  return {
    homeWinProb: (homeTeamHomeWins * homeAdvantage + (1 - awayTeamAwayWins)) / 2,
    drawProb: (homeTeamDraws + awayTeamDraws) / 2,
    awayWinProb: ((1 - homeTeamHomeWins) + awayTeamAwayWins * 0.8) / 2, // 0.8 to account for away disadvantage
    expectedGoals: {
      home: homeTeamHomeGoals * homeAdvantage,
      away: awayTeamAwayGoals
    }
  };
}

/**
 * Find value betting patterns in V-sport matches
 */
export function findVSportBettingPatterns(
  homeTeam: string, 
  awayTeam: string,
  matches: Match[],
  homeOdds: number,
  drawOdds: number,
  awayOdds: number
): PredictionPattern[] {
  const patterns: PredictionPattern[] = [];
  
  // Calculate basic betting value
  const bettingValue = calculateBettingValue(
    homeOdds, 
    drawOdds, 
    awayOdds, 
    homeTeam, 
    awayTeam, 
    matches
  );
  
  // Only add value bets with positive EV
  if (bettingValue.bestBet && bettingValue.expectedValue > 0) {
    patterns.push({
      type: bettingValue.bestBet === 'draw' ? 'draw' : 'specific_score', // Map to existing pattern types
      confidence: bettingValue.confidence,
      description: `Value bet detected on ${bettingValue.bestBet} outcome with expected value ${(bettingValue.expectedValue * 100).toFixed(2)}%`,
      historicalSuccess: Math.round(bettingValue.confidence * 100),
      oddsValue: bettingValue.bestBet === 'home' ? homeOdds :
                 bettingValue.bestBet === 'draw' ? drawOdds : awayOdds
    });
  }
  
  // Calculate both teams to score pattern 
  const teamStats = calculateVSportTeamStats(homeTeam, awayTeam, matches);
  const bothTeamsScoreProb = Math.min(0.9, 
    (teamStats.expectedGoals.home > 0.8 && teamStats.expectedGoals.away > 0.8) ? 0.75 : 0.45
  );
  
  if (bothTeamsScoreProb > 0.6) {
    patterns.push({
      type: 'both_teams_score',
      confidence: bothTeamsScoreProb,
      description: `Both teams have a good scoring record, ${(bothTeamsScoreProb * 100).toFixed(0)}% probability of both scoring`,
      historicalSuccess: Math.round(bothTeamsScoreProb * 100),
      oddsValue: 1.8  // Typical odds for BTTS
    });
  }
  
  return patterns;
}
