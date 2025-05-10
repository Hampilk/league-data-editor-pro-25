
import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, BarChart4 } from "lucide-react"

interface PredictionsHeaderProps {
  selectedLeague?: { id: string; name: string } | null
  isLoading: boolean
  advancedMode: boolean
  onBack: () => void
  onRefresh: () => void
  onToggleAdvancedMode: () => void
}

export const PredictionsHeader: React.FC<PredictionsHeaderProps> = ({
  selectedLeague,
  isLoading,
  advancedMode,
  onBack,
  onRefresh,
  onToggleAdvancedMode
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h2 className="text-2xl font-bold text-white">
          Match Predictions {selectedLeague ? `- ${selectedLeague.name}` : ''}
        </h2>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant={advancedMode ? "secondary" : "outline"} 
          onClick={onToggleAdvancedMode} 
          className="gap-2"
        >
          <BarChart4 className="h-4 w-4" />
          {advancedMode ? "Standard Mode" : "Advanced Mode"}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </div>
  )
}
