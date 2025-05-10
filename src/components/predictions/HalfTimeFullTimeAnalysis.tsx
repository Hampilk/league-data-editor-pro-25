import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Repeat, TrendingUp, AlertCircle } from "lucide-react";
import { HalfTimeFullTime } from "@/types";
import useTranslation from "@/utils/i18n";
import { EmptyDataState } from "./EmptyDataState";

interface HalfTimeFullTimeAnalysisProps {
  data: HalfTimeFullTime[];
}

export const HalfTimeFullTimeAnalysis: React.FC<HalfTimeFullTimeAnalysisProps> = ({ data }) => {
  const { t } = useTranslation();
  
  // Filter to get only reversal patterns and sort by odds (highest first)
  const reversals = data
    .filter(item => item.isReversal)
    .sort((a, b) => b.odds - a.odds);
  
  // Get the remaining patterns sorted by confidence
  const regular = data
    .filter(item => !item.isReversal)
    .sort((a, b) => b.confidence - a.confidence);
  
  // Combined list with reversals first
  const sortedData = [...reversals, ...regular];
  
  if (!data || data.length === 0) {
    return <EmptyDataState 
      message={t("predictions.noDataAvailable")} 
      icon={<AlertCircle className="w-12 h-12 mb-3 opacity-50" />} 
    />;
  }

  return (
    <Card className="bg-black/20 border-white/5">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Repeat className="h-5 w-5 text-amber-400" />
          {t("predictions.htft")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sortedData.map((item, index) => {
            // Determine badge class based on type
            let badgeClass = "bg-gray-500/20 border-gray-500/30 text-gray-300";
            let backgroundClass = "bg-black/30";
            
            if (item.isReversal) {
              badgeClass = "bg-amber-500/20 border-amber-500/30 text-amber-300";
              backgroundClass = "bg-amber-950/30";
            }
            
            return (
              <div 
                key={index} 
                className={`${backgroundClass} rounded-lg border border-white/5 p-3`}
              >
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline" className={badgeClass}>
                    {t(`htft.${item.type}`)}
                  </Badge>
                  <span className="text-sm font-medium text-blue-400">
                    {item.odds.toFixed(2)}x
                  </span>
                </div>
                
                <div className="space-y-2 mt-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">{t("predictions.confidence")}</span>
                    <span className="text-blue-400">{(item.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={item.confidence * 100} 
                    className="h-1.5 bg-gray-700" 
                  />
                </div>
                
                {item.isReversal && (
                  <div className="mt-2 text-amber-300 text-xs flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>{t("predictions.highValue")}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
