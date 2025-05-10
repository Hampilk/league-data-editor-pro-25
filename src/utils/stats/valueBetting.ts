
import { Match } from "@/types";

/**
 * Interface for a betting pattern
 */
export interface BettingPattern {
  type: 'both_teams_score' | 'draw' | 'ht_ft_reversal' | 'specific_score';
  confidence: number;
  description: string;
  historicalSuccess: number;
  oddsValue: number;
}

/**
 * Calculate value betting opportunities based on historical match data
 */
export function calculateValueBets(homeTeam: string, awayTeam: string, matches: Match[]) {
  if (!matches || matches.length === 0) {
    return getDefaultBettingPatterns();
  }

  const headToHeadMatches = matches.filter(
    m => (m.home_team === homeTeam && m.away_team === awayTeam) || 
         (m.home_team === awayTeam && m.away_team === homeTeam)
  );
  
  // Calculate pattern frequencies based on historical data
  const totalMatches = matches.length;
  const completedMatches = matches.filter(m => 
    typeof m.home_score === 'number' && 
    typeof m.away_score === 'number' && 
    typeof m.ht_home_score === 'number' && 
    typeof m.ht_away_score === 'number'
  );
  
  if (completedMatches.length === 0) {
    return getDefaultBettingPatterns();
  }
  
  // Calculate frequencies of various patterns
  const patternFrequencies = calculatePatternFrequencies(completedMatches);
  
  // Create betting patterns based on calculated frequencies
  return [
    {
      type: 'both_teams_score' as const,
      confidence: patternFrequencies.bothTeamsScoredRate > 60 ? 0.7 : 0.5,
      description: `Both teams have scored in ${patternFrequencies.bothTeamsScoredRate.toFixed(0)}% of matches`,
      historicalSuccess: Math.round(patternFrequencies.bothTeamsScoredRate),
      oddsValue: 1.8
    },
    {
      type: 'draw' as const,
      confidence: patternFrequencies.drawRate > 30 ? 0.6 : 0.4,
      description: `Matches ended in a draw ${patternFrequencies.drawRate.toFixed(0)}% of the time`,
      historicalSuccess: Math.round(patternFrequencies.drawRate),
      oddsValue: 3.4
    },
    {
      type: 'ht_ft_reversal' as const,
      confidence: patternFrequencies.htftReversalRate > 20 ? 0.5 : 0.3,
      description: `Result at halftime was different from full time in ${patternFrequencies.htftReversalRate.toFixed(0)}% of matches`,
      historicalSuccess: Math.round(patternFrequencies.htftReversalRate),
      oddsValue: 4.5
    },
    {
      type: 'specific_score' as const,
      confidence: patternFrequencies.oneAllDrawRate > 15 ? 0.4 : 0.2,
      description: `Score of 1-1 occurred in ${patternFrequencies.oneAllDrawRate.toFixed(0)}% of matches`,
      historicalSuccess: Math.round(patternFrequencies.oneAllDrawRate),
      oddsValue: 6.5
    }
  ];
}

/**
 * Calculate frequencies of various betting patterns from match data
 */
function calculatePatternFrequencies(matches: Match[]) {
  const totalMatches = matches.length;
  
  const bothTeamsScored = matches.filter(
    m => m.home_score > 0 && m.away_score > 0
  ).length;
  
  const draws = matches.filter(
    m => m.home_score === m.away_score
  ).length;
  
  const htftReversals = matches.filter(
    m => {
      const htHomeWin = m.ht_home_score > m.ht_away_score;
      const htAwayWin = m.ht_home_score < m.ht_away_score;
      const ftHomeWin = m.home_score > m.away_score;
      const ftAwayWin = m.home_score < m.away_score;
      
      return (htHomeWin && ftAwayWin) || (htAwayWin && ftHomeWin);
    }
  ).length;
  
  // Calculate the number of matches with specific score lines
  const oneNilHomeWins = matches.filter(
    m => m.home_score === 1 && m.away_score === 0
  ).length;
  
  const twoOneHomeWins = matches.filter(
    m => m.home_score === 2 && m.away_score === 1
  ).length;
  
  const oneAllDraws = matches.filter(
    m => m.home_score === 1 && m.away_score === 1
  ).length;
  
  const scorelessDraws = matches.filter(
    m => m.home_score === 0 && m.away_score === 0
  ).length;
  
  // Calculate rates
  return {
    bothTeamsScoredRate: (bothTeamsScored / totalMatches) * 100,
    drawRate: (draws / totalMatches) * 100,
    htftReversalRate: (htftReversals / totalMatches) * 100,
    oneNilHomeWinRate: (oneNilHomeWins / totalMatches) * 100,
    twoOneHomeWinRate: (twoOneHomeWins / totalMatches) * 100,
    oneAllDrawRate: (oneAllDraws / totalMatches) * 100,
    scorelessDrawRate: (scorelessDraws / totalMatches) * 100
  };
}

/**
 * Get default betting patterns when there's no sufficient historical data
 */
function getDefaultBettingPatterns(): BettingPattern[] {
  return [
    {
      type: 'both_teams_score',
      confidence: 0.5,
      description: 'Based on league averages, both teams have a moderate chance of scoring',
      historicalSuccess: 55,
      oddsValue: 1.8
    },
    {
      type: 'draw',
      confidence: 0.3,
      description: 'Average draw rate in this league',
      historicalSuccess: 25,
      oddsValue: 3.4
    },
    {
      type: 'ht_ft_reversal',
      confidence: 0.2,
      description: 'Result reversals between halftime and fulltime occur occasionally',
      historicalSuccess: 15,
      oddsValue: 4.5
    },
    {
      type: 'specific_score',
      confidence: 0.15,
      description: 'Common scorelines include 1-1',
      historicalSuccess: 10,
      oddsValue: 6.5
    }
  ];
}
