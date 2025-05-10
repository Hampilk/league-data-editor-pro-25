
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Lightbulb } from "lucide-react";
import { MatchPrediction } from "@/types";
import useTranslation from "@/utils/i18n";
import { toast } from "sonner";
import { mockTeams } from "@/data/mockTeams";
import { PredictionForm } from "./PredictionForm";
import { PredictionInfo } from "./PredictionInfo";
import { PredictionTabs } from "./PredictionTabs";
import { usePredictions } from "@/hooks/usePredictions";
import { EmptyDataState } from "./EmptyDataState";

interface MatchPredictionSystemProps {
  onSavePrediction?: (prediction: MatchPrediction) => void;
  advancedMode?: boolean;
  generateAdvancedPrediction?: (homeTeam: string, awayTeam: string) => MatchPrediction | null;
}

export const MatchPredictionSystem: React.FC<MatchPredictionSystemProps> = ({ 
  onSavePrediction,
  advancedMode = false,
  generateAdvancedPrediction
}) => {
  const { t } = useTranslation();
  
  const {
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
  } = usePredictions({
    advancedMode,
    generateAdvancedPrediction
  });
  
  const handleSaveCurrentPrediction = () => {
    if (currentPrediction && onSavePrediction) {
      onSavePrediction(currentPrediction);
      toast.success(t("predictions.predictionSaved"));
    }
  };

  const hasResults = patterns.length > 0 || htftData.length > 0;

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 border-white/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                {advancedMode ? (
                  <>
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    {t("predictions.titleAdvanced")} 
                  </>
                ) : (
                  t("predictions.title")
                )}
              </CardTitle>
              <CardDescription>
                {advancedMode ? 
                  "Using enhanced statistical models based on historical data" : 
                  t("predictions.subtitle")}
              </CardDescription>
            </div>
            
            {advancedMode && (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                Advanced Mode
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <PredictionForm
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            teams={mockTeams}
            isLoading={isLoading}
            advancedMode={advancedMode}
            onHomeTeamChange={setHomeTeam}
            onAwayTeamChange={setAwayTeam}
            onGeneratePrediction={generatePrediction}
          />
        </CardContent>
      </Card>
      
      {hasResults ? (
        <div className="animate-fadeIn">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              className="bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20 gap-2"
              onClick={handleSaveCurrentPrediction}
              disabled={!currentPrediction}
            >
              <Save className="h-4 w-4" />
              {t("ui.save")}
            </Button>
          </div>
          
          <PredictionTabs
            patterns={patterns}
            htftData={htftData}
            headToHead={headToHead}
            currentPrediction={currentPrediction}
          />
        </div>
      ) : null}
      
      <PredictionInfo advancedMode={advancedMode} />
    </div>
  );
};

MatchPredictionSystem.displayName = "MatchPredictionSystem";
