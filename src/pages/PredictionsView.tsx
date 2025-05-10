
import { memo } from "react"
import { PredictionsHeader } from "@/components/predictions/PredictionsHeader"
import { PredictionTabsView } from "@/components/predictions/PredictionTabsView"
import { PredictionTabContent } from "@/components/predictions/PredictionTabContent"
import { usePredictionView } from "@/hooks/usePredictionView"

export const PredictionsView = memo(() => {
  const {
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
  } = usePredictionView()
  
  const handleBack = () => navigate("leagues")
  const handleToggleAdvancedMode = () => setAdvancedMode(prev => !prev)
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <PredictionsHeader
        selectedLeague={selectedLeague}
        isLoading={isLoading}
        advancedMode={advancedMode}
        onBack={handleBack}
        onRefresh={refreshData}
        onToggleAdvancedMode={handleToggleAdvancedMode}
      />
      
      <PredictionTabsView
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <PredictionTabContent
        activeTab={activeTab}
        leagueStatistics={leagueStatistics}
        selectedLeague={selectedLeague}
        savedPredictions={savedPredictions}
        valueBets={valueBets}
        advancedMode={advancedMode}
        activePrediction={activePrediction}
        onSavePrediction={handleSavePrediction}
        onSaveValueBet={handleSaveValueBet}
        onUpdateValueBet={handleUpdateValueBet}
        generateAdvancedPrediction={generateAdvancedPrediction}
      />
    </div>
  )
})

PredictionsView.displayName = "PredictionsView"
