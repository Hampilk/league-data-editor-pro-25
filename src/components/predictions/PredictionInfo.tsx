
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import useTranslation from "@/utils/i18n";

interface PredictionInfoProps {
  advancedMode: boolean;
}

export const PredictionInfo: React.FC<PredictionInfoProps> = ({ advancedMode }) => {
  const { t } = useTranslation();

  return (
    <Card className="bg-black/20 border-white/5">
      <CardHeader>
        <CardTitle className="text-white">
          {advancedMode ? "Advanced Prediction Model" : t("predictions.predictionModelInfo")}
        </CardTitle>
        <CardDescription>
          {advancedMode ? 
            "Using statistical algorithms and historical data analysis" : 
            t("predictions.howItWorks")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300">
          {advancedMode ? 
            "The advanced prediction engine uses statistical algorithms to analyze historical match data, identifying patterns and calculating probabilities for various outcomes." : 
            t("predictions.predictionDescription")}
        </p>
        <ul className="list-disc pl-6 space-y-1 text-gray-400">
          {advancedMode ? (
            <>
              <li>Expected goals calculation based on team performance</li>
              <li>Head-to-head statistical analysis</li>
              <li>Form index calculation from recent match results</li>
              <li>Win probability distribution using multiple models</li>
              <li>Confidence rating based on statistical significance</li>
            </>
          ) : (
            <>
              <li>{t("predictions.model.historical")}</li>
              <li>{t("predictions.model.recentForm")}</li>
              <li>{t("predictions.model.homeAdvantage")}</li>
              <li>{t("predictions.model.averageGoals")}</li>
              <li>{t("predictions.model.leaguePosition")}</li>
            </>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};
