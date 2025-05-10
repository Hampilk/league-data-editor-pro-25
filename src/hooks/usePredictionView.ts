
import { useState } from "react"
import { useLeagueState } from "@/hooks/league"
import { calculateLeagueStatistics } from "@/utils/leagueStatistics"
import { runPrediction } from "@/utils/predictionEngine"
import { MatchPrediction, ValueBet } from "@/types"
import { toast } from "sonner"

export function usePredictionView() {
  const { 
    currentMatches, 
    selectedLeagueId, 
    leaguesList, 
    navigate, 
    isLoading, 
    refreshData 
  } = useLeagueState()
  
  const [savedPredictions, setSavedPredictions] = useState<MatchPrediction[]>([])
  const [valueBets, setValueBets] = useState<ValueBet[]>([])
  const [activeTab, setActiveTab] = useState("predictions")
  const [advancedMode, setAdvancedMode] = useState(false)
  
  // Get the currently selected league
  const selectedLeague = leaguesList.find(league => league.id === selectedLeagueId)
  
  // Calculate statistics for the selected league
  const leagueStatistics = calculateLeagueStatistics(currentMatches)

  // Handler for saving predictions
  const handleSavePrediction = (prediction: MatchPrediction) => {
    setSavedPredictions(prev => {
      // Check if prediction for this match already exists
      const existingIndex = prev.findIndex(
        p => p.match.home_team === prediction.match.home_team && 
             p.match.away_team === prediction.match.away_team
      )
      
      if (existingIndex >= 0) {
        // Replace existing prediction
        const updatedPredictions = [...prev]
        updatedPredictions[existingIndex] = prediction
        return updatedPredictions
      }
      
      // Add new prediction
      toast.success("Prediction saved successfully!")
      return [...prev, prediction]
    })
  }
  
  // Handler for saving value bets
  const handleSaveValueBet = (bet: ValueBet) => {
    setValueBets(prev => [...prev, bet])
    
    // Also update the prediction if it exists
    if (savedPredictions.length > 0) {
      setSavedPredictions(prev => 
        prev.map(prediction => {
          // Find the prediction that matches this bet's match
          if (prediction.match.id === bet.matchId || 
              `${prediction.match.home_team}-${prediction.match.away_team}-${prediction.match.date}` === bet.matchId) {
            return {
              ...prediction,
              valueBets: [...(prediction.valueBets || []), bet]
            }
          }
          return prediction
        })
      )
    }
  }
  
  // Handler for updating value bets
  const handleUpdateValueBet = (updatedBet: ValueBet) => {
    // Update in the main valueBets state
    setValueBets(prev => 
      prev.map(bet => bet.matchId === updatedBet.matchId && 
                       bet.pattern.type === updatedBet.pattern.type ? updatedBet : bet)
    )
    
    // Also update in the related prediction if it exists
    setSavedPredictions(prev => 
      prev.map(prediction => {
        if (!prediction.valueBets) return prediction
        
        // Check if this prediction contains the bet being updated
        const hasBet = prediction.valueBets.some(
          bet => bet.matchId === updatedBet.matchId && bet.pattern.type === updatedBet.pattern.type
        )
        
        if (hasBet) {
          return {
            ...prediction,
            valueBets: prediction.valueBets.map(
              bet => bet.matchId === updatedBet.matchId && 
                     bet.pattern.type === updatedBet.pattern.type ? updatedBet : bet
            )
          }
        }
        return prediction
      })
    )
  }
  
  // Generate advanced prediction using prediction engine
  const generateAdvancedPrediction = (homeTeam: string, awayTeam: string) => {
    if (!homeTeam || !awayTeam) return null;
    
    // Run advanced prediction
    const advancedPrediction = runPrediction(homeTeam, awayTeam, currentMatches);
    
    // Create match object
    const match = {
      date: new Date().toISOString(),
      home_team: homeTeam,
      away_team: awayTeam,
      home_score: 0,
      away_score: 0,
      ht_home_score: 0,
      ht_away_score: 0
    };
    
    // Determine predicted result based on advancedPrediction
    const predictedResult = 
      advancedPrediction.predictedWinner === 'home' ? 'home_win' :
      advancedPrediction.predictedWinner === 'away' ? 'away_win' :
      'draw';
      
    // Convert prediction to our app's format
    const prediction: MatchPrediction = {
      match,
      predictedResult: predictedResult as 'home_win' | 'draw' | 'away_win',
      confidenceLevel: advancedPrediction.confidence,
      predictedScore: {
        home: advancedPrediction.modelPredictions.poisson.homeGoals,
        away: advancedPrediction.modelPredictions.poisson.awayGoals
      },
      patterns: advancedPrediction.patterns,
      htftAnalysis: [],
      headToHead: {
        homeTeam,
        awayTeam,
        totalMatches: 0, // We would need to calculate this
        homeWins: 0,
        draws: 0,
        awayWins: 0,
        homeGoals: 0,
        awayGoals: 0,
        bothTeamsScored: 0,
        avgTotalGoals: advancedPrediction.homeExpectedGoals + advancedPrediction.awayExpectedGoals,
        htftReversals: 0
      }
    };
    
    return prediction;
  };
  
  // Filter value bets by active prediction (if any)
  const getActivePrediction = () => {
    if (savedPredictions.length === 0) return null
    return savedPredictions[savedPredictions.length - 1] // Get the most recent
  }
  
  const activePrediction = getActivePrediction()

  return {
    selectedLeague,
    leagueStatistics,
    savedPredictions,
    valueBets,
    activeTab,
    advancedMode,
    activePrediction,
    isLoading,
    navigate,
    refreshData,
    setActiveTab,
    setAdvancedMode,
    handleSavePrediction,
    handleSaveValueBet,
    handleUpdateValueBet,
    generateAdvancedPrediction
  }
}
