
import React from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { MatchPredictionSystem } from "./MatchPredictionSystem"
import { LeagueStats } from "@/components/stats/LeagueStats"
import { ValueBetTracker } from "./ValueBetTracker"
import { PredictionHistory } from "./PredictionHistory"
import { VSportMatchTracker } from "./VSportMatchTracker"
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
  onRefreshData?: () => void
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
  generateAdvancedPrediction,
  onRefreshData
}) => {
  return (
    <div className="mt-6">
      <Tabs value={activeTab}>
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MatchPredictionSystem 
                onSavePrediction={onSavePrediction} 
                advancedMode={advancedMode}
                generateAdvancedPrediction={generateAdvancedPrediction}
              />
            </div>
            
            <div className="space-y-6">
              <LeagueStats statistics={leagueStatistics} league={selectedLeague} />
              <VSportMatchTracker onRefresh={onRefreshData} />
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
      </Tabs>
    </div>
  )
}
