
import { memo } from "react"
import { useLeagueState } from "@/hooks/league"
import { Button } from "@/components/ui/button"
import { RefreshCw, ArrowLeft } from "lucide-react"
import { LeagueStats } from "@/components/stats/LeagueStats"
import { calculateLeagueStatistics } from "@/utils/leagueStatistics"
import { MatchPredictionSystem } from "@/components/predictions/MatchPredictionSystem"

export const PredictionsView = memo(() => {
  const { 
    currentMatches, 
    selectedLeagueId, 
    leaguesList, 
    navigate, 
    isLoading, 
    refreshData 
  } = useLeagueState()
  
  // Get the currently selected league
  const selectedLeague = leaguesList.find(league => league.id === selectedLeagueId)
  
  // Calculate statistics for the selected league
  const leagueStatistics = calculateLeagueStatistics(currentMatches)
  
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MatchPredictionSystem />
        </div>
        
        <div>
          <LeagueStats statistics={leagueStatistics} league={selectedLeague} />
        </div>
      </div>
    </div>
  )
})

PredictionsView.displayName = "PredictionsView"
