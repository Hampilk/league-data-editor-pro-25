
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Scales, TrendingUp, Percent, AlertCircle } from "lucide-react";
import { PredictionPattern } from "@/types";
import useTranslation from "@/utils/i18n";

interface PredictionPatternsProps {
  patterns: PredictionPattern[];
}

export const PredictionPatterns: React.FC<PredictionPatternsProps> = ({ patterns }) => {
  const { t } = useTranslation();
  
  if (!patterns || patterns.length === 0) {
    return (
      <Card className="bg-black/20 border-white/5">
        <CardHeader>
          <CardTitle className="text-white text-lg">
            {t("predictions.noDataAvailable")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-gray-400">
            <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
            <p>{t("predictions.noDataAvailable")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/20 border-white/5">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          {t("predictions.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {patterns.map((pattern, index) => {
          // Determine badge color based on pattern type
          let badgeClass = "bg-blue-500/20 border-blue-500/30 text-blue-300"; // Default
          if (pattern.type === "both_teams_score") {
            badgeClass = "bg-green-500/20 border-green-500/30 text-green-300";
          } else if (pattern.type === "draw") {
            badgeClass = "bg-purple-500/20 border-purple-500/30 text-purple-300";
          } else if (pattern.type === "ht_ft_reversal") {
            badgeClass = "bg-amber-500/20 border-amber-500/30 text-amber-300";
          }
          
          // Get display name based on pattern type
          let typeName = "";
          switch (pattern.type) {
            case "both_teams_score":
              typeName = t("predictions.bothTeamsScore");
              break;
            case "draw":
              typeName = t("predictions.drawLikelihood");
              break;
            case "ht_ft_reversal":
              typeName = t("predictions.reversal");
              break;
            case "specific_score":
              typeName = t("predictions.predictedResult");
              break;
          }
          
          return (
            <div key={index} className="bg-black/30 rounded-lg border border-white/5 p-4">
              <div className="flex justify-between items-center mb-3">
                <Badge variant="outline" className={badgeClass}>
                  {typeName}
                </Badge>
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">
                    {pattern.oddsValue.toFixed(2)}x
                  </span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-3">{pattern.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">{t("predictions.confidence")}</span>
                  <span className="text-blue-400">{(pattern.confidence * 100).toFixed(0)}%</span>
                </div>
                <Progress 
                  value={pattern.confidence * 100} 
                  className="h-1.5 bg-gray-700" 
                />
              </div>
              
              <div className="flex justify-between items-center mt-3 text-xs">
                <div className="flex items-center gap-1 text-gray-400">
                  <Scales className="h-3.5 w-3.5" />
                  <span>{t("predictions.results.confidence")}</span>
                </div>
                <span className="text-gray-300">{(pattern.historicalSuccess * 100).toFixed(0)}%</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
