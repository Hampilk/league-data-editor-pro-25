
import { Match, PredictionPattern } from "@/types";

/**
 * Advanced prediction engine that implements algorithms from the PHP system
 */

/**
 * Calculate percentage of matches where both teams scored
 */
export function calculateBothTeamsScoredPercentage(matches: Match[]): number {
  if (!matches.length) return 0;

  const bothTeamsScoredCount = matches.reduce((count, match) => {
    return count + ((match.home_score > 0 && match.away_score > 0) ? 1 : 0);
  }, 0);

  return Number((bothTeamsScoredCount / matches.length * 100).toFixed(2));
}

/**
 * Calculate average goals statistics
 */
export function calculateAverageGoals(matches: Match[]): {
  average_total_goals: number;
  average_home_goals: number;
  average_away_goals: number;
} {
  if (!matches.length) {
    return {
      average_total_goals: 0,
      average_home_goals: 0,
      average_away_goals: 0
    };
  }

  const totalMatches = matches.length;
  const goals = matches.reduce((acc, match) => {
    const homeGoals = match.home_score || 0;
    const awayGoals = match.away_score || 0;
    
    return {
      total: acc.total + homeGoals + awayGoals,
      home: acc.home + homeGoals,
      away: acc.away + awayGoals
    };
  }, { total: 0, home: 0, away: 0 });

  return {
    average_total_goals: Number((goals.total / totalMatches).toFixed(2)),
    average_home_goals: Number((goals.home / totalMatches).toFixed(2)),
    average_away_goals: Number((goals.away / totalMatches).toFixed(2))
  };
}

/**
 * Calculate team form index based on recent games
 */
export function calculateFormIndex(matches: Match[], team: string, recentGames = 5): number {
  if (!team || !matches.length) return 0;
  
  const teamMatches = matches.filter(match => 
    match.home_team.toLowerCase() === team.toLowerCase() || 
    match.away_team.toLowerCase() === team.toLowerCase()
  );

  if (!teamMatches.length) return 0;

  const recentMatches = teamMatches.slice(0, Math.min(teamMatches.length, recentGames));
  
  const points = recentMatches.reduce((sum, match) => {
    const isHomeTeam = match.home_team.toLowerCase() === team.toLowerCase();
    const homeScore = match.home_score;
    const awayScore = match.away_score;

    if (isHomeTeam) {
      if (homeScore > awayScore) return sum + 3;
      if (homeScore === awayScore) return sum + 1;
    } else {
      if (awayScore > homeScore) return sum + 3;
      if (homeScore === awayScore) return sum + 1;
    }

    return sum;
  }, 0);

  const maxPossiblePoints = recentMatches.length * 3;
  return maxPossiblePoints > 0 
    ? Number((points / maxPossiblePoints * 100).toFixed(2)) 
    : 0;
}

/**
 * Calculate head-to-head statistics between teams
 */
export function calculateHeadToHeadStats(matches: Match[]): {
  home_wins: number;
  away_wins: number;
  draws: number;
  home_win_percentage: number;
  away_win_percentage: number;
  draw_percentage: number;
} {
  if (!matches.length) {
    return {
      home_wins: 0,
      away_wins: 0,
      draws: 0,
      home_win_percentage: 0,
      away_win_percentage: 0,
      draw_percentage: 0
    };
  }

  const totalMatches = matches.length;
  
  const stats = matches.reduce((acc, match) => {
    const homeScore = match.home_score;
    const awayScore = match.away_score;
    
    if (homeScore > awayScore) {
      acc.home_wins++;
    } else if (homeScore < awayScore) {
      acc.away_wins++;
    } else {
      acc.draws++;
    }
    return acc;
  }, { home_wins: 0, away_wins: 0, draws: 0 });

  return {
    home_wins: stats.home_wins,
    away_wins: stats.away_wins,
    draws: stats.draws,
    home_win_percentage: Number((stats.home_wins / totalMatches * 100).toFixed(2)),
    away_win_percentage: Number((stats.away_wins / totalMatches * 100).toFixed(2)),
    draw_percentage: Number((stats.draws / totalMatches * 100).toFixed(2))
  };
}

/**
 * Calculate expected goals for a team
 */
export function calculateExpectedGoals(team: string, matches: Match[]): number {
  if (!team || !matches.length) return 0;

  const teamMatches = matches.filter(match =>
    match.home_team.toLowerCase() === team.toLowerCase() || 
    match.away_team.toLowerCase() === team.toLowerCase()
  );

  if (!teamMatches.length) return 0;

  const totalGoals = teamMatches.reduce((sum, match) => {
    const isHomeTeam = match.home_team.toLowerCase() === team.toLowerCase();
    return sum + (isHomeTeam ? match.home_score : match.away_score);
  }, 0);

  return Number((totalGoals / teamMatches.length).toFixed(2));
}

/**
 * Calculate probability of both teams to score
 */
export function calculateBothTeamsToScoreProb(matches: Match[]): number {
  if (!matches.length) return 0;

  const bothScoredCount = matches.filter(match => 
    match.home_score > 0 && match.away_score > 0
  ).length;

  return Number((bothScoredCount / matches.length * 100).toFixed(2));
}

/**
 * Predict winner based on historical head-to-head matches
 */
export function predictWinner(homeTeam: string, awayTeam: string, matches: Match[]): {
  winner: 'home' | 'away' | 'draw' | 'unknown';
  confidence: number;
} {
  if (!homeTeam || !awayTeam || !matches.length) {
    return { winner: 'unknown', confidence: 0 };
  }

  const h2hMatches = matches.filter(match => 
    (match.home_team.toLowerCase() === homeTeam.toLowerCase() && 
     match.away_team.toLowerCase() === awayTeam.toLowerCase()) ||
    (match.home_team.toLowerCase() === awayTeam.toLowerCase() && 
     match.away_team.toLowerCase() === homeTeam.toLowerCase())
  );

  if (!h2hMatches.length) {
    return { winner: 'unknown', confidence: 0 };
  }

  const stats = h2hMatches.reduce((acc, match) => {
    const homeScore = match.home_score;
    const awayScore = match.away_score;
    
    if (homeScore > awayScore) {
      acc.home_wins++;
    } else if (homeScore < awayScore) {
      acc.away_wins++;
    } else {
      acc.draws++;
    }
    return acc;
  }, { home_wins: 0, away_wins: 0, draws: 0 });

  const totalMatches = h2hMatches.length;
  
  if (stats.home_wins > stats.away_wins && stats.home_wins > stats.draws) {
    return { winner: 'home', confidence: Number((stats.home_wins / totalMatches).toFixed(2)) };
  } else if (stats.away_wins > stats.home_wins && stats.away_wins > stats.draws) {
    return { winner: 'away', confidence: Number((stats.away_wins / totalMatches).toFixed(2)) };
  } else {
    return { winner: 'draw', confidence: Number((stats.draws / totalMatches).toFixed(2)) };
  }
}

/**
 * Calculate win probability based on winner prediction and outcome type
 */
export function calculateWinProbability(
  winnerPrediction: { winner: 'home' | 'away' | 'draw' | 'unknown', confidence: number },
  outcomeType: 'home' | 'away' | 'draw'
): number {
  if (winnerPrediction.winner === 'unknown') {
    // Equal probability for all outcomes when unknown
    return Number((1/3).toFixed(2));
  }
  
  if (winnerPrediction.winner === outcomeType) {
    return winnerPrediction.confidence;
  }
  
  // Distribute remaining probability among non-predicted outcomes
  const remainingProb = 1 - winnerPrediction.confidence;
  const nonPredictedOutcomes = 2; // There are always 2 other outcomes (home, away, draw)
  return Number((remainingProb / nonPredictedOutcomes).toFixed(2));
}

/**
 * Run complete match prediction analysis
 */
export function runPrediction(homeTeam: string, awayTeam: string, matches: Match[]): {
  homeExpectedGoals: number;
  awayExpectedGoals: number;
  bothTeamsToScoreProb: number;
  predictedWinner: 'home' | 'away' | 'draw' | 'unknown';
  confidence: number;
  modelPredictions: {
    randomForest: string;
    poisson: {
      homeGoals: number;
      awayGoals: number;
    };
    elo: {
      homeWinProb: number;
      drawProb: number;
      awayWinProb: number;
    };
  };
  patterns: PredictionPattern[];
} {
  const homeExpectedGoals = calculateExpectedGoals(homeTeam, matches);
  const awayExpectedGoals = calculateExpectedGoals(awayTeam, matches);
  const bothTeamsToScoreProb = calculateBothTeamsToScoreProb(matches);
  const winnerPrediction = predictWinner(homeTeam, awayTeam, matches);
  
  // Create prediction patterns based on calculated statistics
  const patterns: PredictionPattern[] = [];
  
  // Both teams to score pattern
  if (bothTeamsToScoreProb > 50) {
    patterns.push({
      type: 'both_teams_score',
      confidence: bothTeamsToScoreProb / 100,
      description: `Based on historical data, both teams have a ${bothTeamsToScoreProb}% probability of scoring`,
      historicalSuccess: bothTeamsToScoreProb,
      oddsValue: 1.8
    });
  }
  
  // Draw pattern
  if (winnerPrediction.winner === 'draw') {
    patterns.push({
      type: 'draw',
      confidence: winnerPrediction.confidence,
      description: `Historical data shows ${Math.round(winnerPrediction.confidence * 100)}% probability of a draw`,
      historicalSuccess: Math.round(winnerPrediction.confidence * 100),
      oddsValue: 3.4
    });
  }

  return {
    homeExpectedGoals,
    awayExpectedGoals,
    bothTeamsToScoreProb,
    predictedWinner: winnerPrediction.winner,
    confidence: winnerPrediction.confidence,
    modelPredictions: {
      randomForest: winnerPrediction.winner === 'unknown' ? 
        'insufficient_data' : `${winnerPrediction.winner}_win`,
      poisson: {
        homeGoals: Math.round(homeExpectedGoals),
        awayGoals: Math.round(awayExpectedGoals)
      },
      elo: {
        homeWinProb: calculateWinProbability(winnerPrediction, 'home'),
        drawProb: calculateWinProbability(winnerPrediction, 'draw'),
        awayWinProb: calculateWinProbability(winnerPrediction, 'away')
      }
    },
    patterns
  };
}
