
import { memo, useState } from "react"
import { useLeagueState } from "@/hooks/league"
import { Button } from "@/components/ui/button"
import { RefreshCw, ArrowLeft, PieChart } from "lucide-react"
import { LeagueStats } from "@/components/stats/LeagueStats"
import { calculateLeagueStatistics, predictMatchOutcome } from "@/utils/leagueStatistics"
import { MatchPredictionSystem } from "@/components/predictions/MatchPredictionSystem"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MatchPrediction } from "@/types"
import { PredictionHistory } from "@/components/predictions/PredictionHistory"

export const PredictionsView = memo(() => {
  const { 
    currentMatches, 
    selectedLeagueId, 
    leaguesList, 
    navigate, 
    isLoading, 
    refreshData 
  } = useLeagueState()
  
  const [savedPredictions, setSavedPredictions] = useState<MatchPrediction[]>([])
  const [activeTab, setActiveTab] = useState("predictions")
  
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
      return [...prev, prediction]
    })
  }
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("leagues")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h2 className="text-2xl font-bold text-white">
            Match Predictions {selectedLeague ? `- ${selectedLeague.name}` : ''}
          </h2>
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          onClick={refreshData}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-black/20">
          <TabsTrigger value="predictions">Prediction System</TabsTrigger>
          <TabsTrigger value="history">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Prediction History
            </div>
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MatchPredictionSystem onSavePrediction={handleSavePrediction} />
              </div>
              
              <div>
                <LeagueStats statistics={leagueStatistics} league={selectedLeague} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <PredictionHistory predictions={savedPredictions} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
})

PredictionsView.displayName = "PredictionsView"
