
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import useTranslation from "@/utils/i18n";
import { Badge } from "@/components/ui/badge";
import { HeadToHeadStat, MatchPrediction } from "@/types";

interface PredictionStatsProps {
  headToHead: HeadToHeadStat | null;
  currentPrediction: MatchPrediction | null;
}

export const PredictionStats: React.FC<PredictionStatsProps> = ({ 
  headToHead, 
  currentPrediction 
}) => {
  const { t } = useTranslation();

  if (!headToHead) return null;

  return (
    <Card className="bg-black/20 border-white/5">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-400" />
          {t("predictions.previousMatches")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/30 rounded-lg p-4 border border-white/5">
            <h3 className="text-sm text-gray-400 mb-2">
              {t("predictions.results.title")}
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-green-900/30 rounded-lg">
                <div className="text-green-400 text-lg font-semibold">{headToHead.homeWins}</div>
                <div className="text-xs text-gray-400">{headToHead.homeTeam}</div>
              </div>
              <div className="p-2 bg-blue-900/30 rounded-lg">
                <div className="text-blue-400 text-lg font-semibold">{headToHead.draws}</div>
                <div className="text-xs text-gray-400">{t("predictions.drawLikelihood")}</div>
              </div>
              <div className="p-2 bg-amber-900/30 rounded-lg">
                <div className="text-amber-400 text-lg font-semibold">{headToHead.awayWins}</div>
                <div className="text-xs text-gray-400">{headToHead.awayTeam}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-4 border border-white/5">
            <h3 className="text-sm text-gray-400 mb-2">
              {t("predictions.goalScoringTitle")}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">{t("predictions.bothTeamsScore")}</span>
                <span className="text-sm">
                  {Math.round((headToHead.bothTeamsScored / headToHead.totalMatches) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">{t("predictions.results.totalGoals")}</span>
                <span className="text-sm">{headToHead.avgTotalGoals.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">{t("predictions.reversal")}</span>
                <span className="text-sm">
                  {headToHead.htftReversals}/{headToHead.totalMatches}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {currentPrediction && (
          <div className="mt-6 bg-black/30 rounded-lg p-4 border border-white/5">
            <h3 className="text-sm text-gray-400 mb-3">
              {t("predictions.results.predictedResult")}
            </h3>
            <div className="flex justify-center items-center">
              <div className="text-center mx-4">
                <div className="text-gray-300">{currentPrediction.match.home_team}</div>
                <div className="text-3xl font-bold text-white mt-1">{currentPrediction.predictedScore?.home}</div>
              </div>
              <div className="text-gray-500 mx-2">vs</div>
              <div className="text-center mx-4">
                <div className="text-gray-300">{currentPrediction.match.away_team}</div>
                <div className="text-3xl font-bold text-white mt-1">{currentPrediction.predictedScore?.away}</div>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <Badge 
                variant="outline" 
                className={`
                  ${currentPrediction.predictedResult === 'home_win' ? 'bg-green-500/20 text-green-400 border-green-500/20' : ''}
                  ${currentPrediction.predictedResult === 'draw' ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : ''}
                  ${currentPrediction.predictedResult === 'away_win' ? 'bg-amber-500/20 text-amber-400 border-amber-500/20' : ''}
                  px-3 py-1
                `}
              >
                {currentPrediction.predictedResult === 'home_win' && t("predictions.homeWin")}
                {currentPrediction.predictedResult === 'draw' && t("predictions.drawLikelihood")}
                {currentPrediction.predictedResult === 'away_win' && t("predictions.awayWin")}
              </Badge>
            </div>
            
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-400">{t("predictions.confidence")}</div>
              <div className="text-lg font-medium text-white">
                {Math.round(currentPrediction.confidenceLevel * 100)}%
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
