
import React from "react"
import { TabsContent } from "@/components/ui/tabs"
import { MatchPredictionSystem } from "./MatchPredictionSystem"
import { LeagueStats } from "@/components/stats/LeagueStats"
import { ValueBetTracker } from "./ValueBetTracker"
import { PredictionHistory } from "./PredictionHistory"
import { LeagueStatistics } from "@/utils/leagueStatistics"
import { MatchPrediction, ValueBet } from "@/types"

interface PredictionTabContentProps {
  activeTab: string
  leagueStatistics: LeagueStatistics
  selectedLeague?: { id: string; name: string } | null
  savedPredictions: MatchPrediction[]
  valueBets: ValueBet[]
  advancedMode: boolean
  activePrediction: MatchPrediction | null
  onSavePrediction: (prediction: MatchPrediction) => void
  onSaveValueBet: (bet: ValueBet) => void
  onUpdateValueBet: (bet: ValueBet) => void
  generateAdvancedPrediction: (homeTeam: string, awayTeam: string) => MatchPrediction | null
}

export const PredictionTabContent: React.FC<PredictionTabContentProps> = ({
  activeTab,
  leagueStatistics,
  selectedLeague,
  savedPredictions,
  valueBets,
  advancedMode,
  activePrediction,
  onSavePrediction,
  onSaveValueBet,
  onUpdateValueBet,
  generateAdvancedPrediction
}) => {
  return (
    <div className="mt-6">
      <TabsContent value="predictions" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MatchPredictionSystem 
              onSavePrediction={onSavePrediction} 
              advancedMode={advancedMode}
              generateAdvancedPrediction={generateAdvancedPrediction}
            />
          </div>
          
          <div>
            <LeagueStats statistics={leagueStatistics} league={selectedLeague} />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="value-bets">
        <ValueBetTracker 
          match={activePrediction?.match}
          patterns={activePrediction?.patterns || []}
          existingBets={valueBets}
          onSaveBet={onSaveValueBet}
          onUpdateBet={onUpdateValueBet}
        />
      </TabsContent>
      
      <TabsContent value="history">
        <PredictionHistory predictions={savedPredictions} />
      </TabsContent>
    </div>
  )
}
