
import { PredictionPattern, HalfTimeFullTime, HeadToHeadStat } from "@/types";

// Mock prediction patterns
export const mockPredictionPatterns: Record<string, PredictionPattern[]> = {
  "West Ham-Nottingham": [
    {
      type: "both_teams_score",
      confidence: 0.85,
      description: "Az utóbbi 5 meccs alapján rendszeresen mindkét csapat gólt szerez ebben a párosításban.",
      historicalSuccess: 0.78,
      oddsValue: 1.85
    },
    {
      type: "ht_ft_reversal",
      confidence: 0.42,
      description: "Az elmúlt 10 mérkőzésen 3 alkalommal fordult elő fordítás ebben a párosításban.",
      historicalSuccess: 0.30,
      oddsValue: 15.0
    }
  ],
  "Aston Oroszlán-Manchester Kék": [
    {
      type: "both_teams_score",
      confidence: 0.75,
      description: "A Manchester Kék és az Aston Oroszlán mérkőzésein gyakori a gólváltás (73%).",
      historicalSuccess: 0.73,
      oddsValue: 1.76
    },
    {
      type: "draw",
      confidence: 0.55,
      description: "Az elmúlt egymás elleni 6 mérkőzésből 3 döntetlennel zárult.",
      historicalSuccess: 0.50,
      oddsValue: 3.25
    }
  ],
  "Newcastle-London Ágyúk": [
    {
      type: "draw",
      confidence: 0.65,
      description: "A Newcastle otthon játszott mérkőzésein magas a döntetlenek aránya (40%).",
      historicalSuccess: 0.40,
      oddsValue: 4.0
    }
  ]
};

// Mock HTFT data
export const mockHalfTimeFullTime: Record<string, HalfTimeFullTime[]> = {
  "West Ham-Nottingham": [
    {
      type: "home_away",
      label: "Félidőben hazai vezetés, vendég győzelem",
      isReversal: true,
      odds: 29.0,
      confidence: 0.15
    },
    {
      type: "away_home",
      label: "Félidőben vendég vezetés, hazai győzelem",
      isReversal: true,
      odds: 21.0,
      confidence: 0.18
    },
    {
      type: "home_home",
      label: "Félidőben hazai vezetés, hazai győzelem",
      isReversal: false,
      odds: 2.5,
      confidence: 0.60
    }
  ],
  "Newcastle-London Ágyúk": [
    {
      type: "draw_draw",
      label: "Félidőben döntetlen, végeredmény döntetlen",
      isReversal: false,
      odds: 5.5,
      confidence: 0.40
    },
    {
      type: "draw_home",
      label: "Félidőben döntetlen, hazai győzelem",
      isReversal: false,
      odds: 4.3,
      confidence: 0.35
    }
  ]
};

// Mock head-to-head stats
export const mockHeadToHead: Record<string, HeadToHeadStat> = {
  "West Ham-Nottingham": {
    homeTeam: "West Ham",
    awayTeam: "Nottingham",
    totalMatches: 8,
    homeWins: 4,
    draws: 1,
    awayWins: 3,
    homeGoals: 12,
    awayGoals: 11,
    bothTeamsScored: 6,
    avgTotalGoals: 2.88,
    htftReversals: 3
  },
  "Aston Oroszlán-Manchester Kék": {
    homeTeam: "Aston Oroszlán",
    awayTeam: "Manchester Kék",
    totalMatches: 10,
    homeWins: 3,
    draws: 4,
    awayWins: 3,
    homeGoals: 13,
    awayGoals: 14,
    bothTeamsScored: 8,
    avgTotalGoals: 2.7,
    htftReversals: 2
  },
  "Newcastle-London Ágyúk": {
    homeTeam: "Newcastle",
    awayTeam: "London Ágyúk",
    totalMatches: 6,
    homeWins: 2,
    draws: 3,
    awayWins: 1,
    homeGoals: 8,
    awayGoals: 7,
    bothTeamsScored: 5,
    avgTotalGoals: 2.5,
    htftReversals: 1
  }
};
