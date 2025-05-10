
import { useState, useEffect } from 'react';
import { 
  PredictionPattern, 
  HalfTimeFullTime, 
  HeadToHeadStat, 
  MatchPrediction,
  Match
} from '@/types';
import { mockPredictionPatterns, mockHalfTimeFullTime, mockHeadToHead } from '@/data/mockPredictions';

interface UsePredictionsOptions {
  advancedMode?: boolean;
  generateAdvancedPrediction?: (homeTeam: string, awayTeam: string) => MatchPrediction | null;
}

export function usePredictions({ advancedMode = false, generateAdvancedPrediction }: UsePredictionsOptions = {}) {
  const [homeTeam, setHomeTeam] = useState<string>("");
  const [awayTeam, setAwayTeam] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [patterns, setPatterns] = useState<PredictionPattern[]>([]);
  const [htftData, setHtftData] = useState<HalfTimeFullTime[]>([]);
  const [headToHead, setHeadToHead] = useState<HeadToHeadStat | null>(null);
  const [currentPrediction, setCurrentPrediction] = useState<MatchPrediction | null>(null);
  
  // Reset predictions when teams change
  useEffect(() => {
    setPatterns([]);
    setHtftData([]);
    setHeadToHead(null);
    setCurrentPrediction(null);
  }, [homeTeam, awayTeam]);
  
  const generatePrediction = () => {
    if (!homeTeam || !awayTeam || homeTeam === awayTeam) return;
    
    setIsLoading(true);
    
    // If advanced mode is enabled and generator function exists, use it
    if (advancedMode && generateAdvancedPrediction) {
      setTimeout(() => {
        const advancedPrediction = generateAdvancedPrediction(homeTeam, awayTeam);
        
        if (advancedPrediction) {
          setPatterns(advancedPrediction.patterns);
          setHtftData(advancedPrediction.htftAnalysis);
          setHeadToHead(advancedPrediction.headToHead);
          setCurrentPrediction(advancedPrediction);
        }
        
        setIsLoading(false);
      }, 1000);
      return;
    }
    
    // Standard mode - use mock data
    setTimeout(() => {
      const matchKey = `${homeTeam}-${awayTeam}`;
      const matchPatterns = mockPredictionPatterns[matchKey] || [];
      const matchHtft = mockHalfTimeFullTime[matchKey] || [];
      const matchHeadToHead = mockHeadToHead[matchKey] || null;
      
      setPatterns(matchPatterns);
      setHtftData(matchHtft);
      setHeadToHead(matchHeadToHead);
      
      // Create a match prediction object
      if (matchHeadToHead) {
        const mockMatch: Match = {
          date: new Date().toISOString(),
          home_team: homeTeam,
          away_team: awayTeam,
          home_score: 0,
          away_score: 0,
          ht_home_score: 0,
          ht_away_score: 0
        };
        
        // Determine predicted result based on patterns and head-to-head
        let predictedResult: 'home_win' | 'draw' | 'away_win' = 'draw';
        let confidenceLevel = 0.5;
        let predictedScore = { home: 1, away: 1 };
        
        // Use head-to-head data to determine prediction
        const { homeWins, awayWins, draws } = matchHeadToHead;
        const totalMatches = homeWins + awayWins + draws;
        
        if (homeWins > awayWins && homeWins > draws) {
          predictedResult = 'home_win';
          confidenceLevel = homeWins / totalMatches + 0.1; // +0.1 for home advantage
          predictedScore = { home: 2, away: 1 };
        } else if (awayWins > homeWins && awayWins > draws) {
          predictedResult = 'away_win';
          confidenceLevel = awayWins / totalMatches;
          predictedScore = { home: 0, away: 1 };
        } else {
          predictedResult = 'draw';
          confidenceLevel = draws / totalMatches;
          predictedScore = { home: 1, away: 1 };
        }
        
        // Create the prediction object
        const prediction: MatchPrediction = {
          match: mockMatch,
          predictedResult,
          confidenceLevel,
          predictedScore,
          patterns: matchPatterns,
          htftAnalysis: matchHtft,
          headToHead: matchHeadToHead
        };
        
        setCurrentPrediction(prediction);
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return {
    homeTeam,
    awayTeam,
    isLoading,
    patterns,
    htftData,
    headToHead,
    currentPrediction,
    setHomeTeam,
    setAwayTeam,
    generatePrediction
  };
}
