
import React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, PieChart } from "lucide-react"

interface PredictionTabsViewProps {
  activeTab: string
  onTabChange: (value: string) => void
}

export const PredictionTabsView: React.FC<PredictionTabsViewProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3 bg-black/20">
        <TabsTrigger value="predictions">Prediction System</TabsTrigger>
        <TabsTrigger value="value-bets">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Value Bets
          </div>
        </TabsTrigger>
        <TabsTrigger value="history">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Prediction History
          </div>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
