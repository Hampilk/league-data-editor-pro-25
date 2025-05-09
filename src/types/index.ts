export interface LeagueData {
  id: string
  name: string
  season: string
  winner: string
  secondPlace: string
  thirdPlace: string
  status: "In Progress" | "Completed"
}

export interface Match {
  id?: string
  date: string
  home_team: string
  away_team: string
  home_score: number
  away_score: number
  ht_home_score: number
  ht_away_score: number
  round?: number | string
  venue?: string
}

export interface TeamForm {
  position: number
  team: string
  played: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: Array<"W" | "D" | "L">
}

export type RouteType = 
  | "leagues" 
  | "league-details" 
  | "analysis"
  | "advanced-pattern"
  | "integrations" 
  | "league-analytics"
  | "league-management"
  | "matches"
  | "settings"
  | "predictions"
  | "team-management"
  | "statistics"

export interface RouteHistoryItem {
  route: RouteType
  leagueId?: string
  matchId?: string
  tab?: string
}

// New prediction types for the enhanced prediction system
export interface PredictionPattern {
  type: 'both_teams_score' | 'draw' | 'ht_ft_reversal' | 'specific_score'
  confidence: number
  description: string
  historicalSuccess: number // Percentage of successful predictions
  oddsValue: number // Potential return multiplier
}

export interface HalfTimeFullTime {
  type: 'home_home' | 'home_draw' | 'home_away' | 'draw_home' | 'draw_draw' | 'draw_away' | 'away_home' | 'away_draw' | 'away_away'
  label: string
  isReversal: boolean
  odds: number
  confidence: number
}

export interface HeadToHeadStat {
  homeTeam: string
  awayTeam: string
  totalMatches: number
  homeWins: number
  draws: number
  awayWins: number
  homeGoals: number
  awayGoals: number
  bothTeamsScored: number // Count of matches where both teams scored
  avgTotalGoals: number
  htftReversals: number // Count of half-time/full-time reversals
}

export interface MatchPrediction {
  match: Match
  predictedResult: 'home_win' | 'draw' | 'away_win'
  confidenceLevel: number
  predictedScore?: {
    home: number
    away: number
  }
  patterns: PredictionPattern[]
  htftAnalysis: HalfTimeFullTime[]
  headToHead?: HeadToHeadStat
}

export interface PredictionHistory {
  id: string
  date: string
  prediction: MatchPrediction
  actualResult?: {
    homeScore: number
    awayScore: number
    result: 'home_win' | 'draw' | 'away_win'
  }
  isCorrect?: boolean
}

// Value bet tracking
export interface ValueBet {
  matchId: string
  pattern: PredictionPattern
  stake: number
  potentialReturn: number
  isWon?: boolean
  actualReturn?: number
}
