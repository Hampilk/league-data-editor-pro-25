
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PredictionPatterns } from "./PredictionPatterns";
import { HalfTimeFullTimeAnalysis } from "./HalfTimeFullTimeAnalysis";
import { PredictionStats } from "./PredictionStats";
import { Info } from "lucide-react";
import { MatchPrediction } from "@/types";
import useTranslation from "@/utils/i18n";
import { EmptyDataState } from "./EmptyDataState";

interface PredictionTabsProps {
  patterns: any[];
  htftData: any[];
  headToHead: any;
  currentPrediction: MatchPrediction | null;
}

export const PredictionTabs: React.FC<PredictionTabsProps> = ({
  patterns,
  htftData,
  headToHead,
  currentPrediction
}) => {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="patterns">
      <TabsList className="grid w-full grid-cols-3 bg-black/20">
        <TabsTrigger value="patterns">{t("ui.tab.overview")}</TabsTrigger>
        <TabsTrigger value="htft">{t("predictions.htft")}</TabsTrigger>
        <TabsTrigger value="stats">{t("ui.tab.statistics")}</TabsTrigger>
      </TabsList>
      
      <div className="mt-4">
        <TabsContent value="patterns">
          <PredictionPatterns patterns={patterns} />
        </TabsContent>
        
        <TabsContent value="htft">
          <HalfTimeFullTimeAnalysis data={htftData} />
        </TabsContent>
        
        <TabsContent value="stats">
          {headToHead ? (
            <PredictionStats 
              headToHead={headToHead} 
              currentPrediction={currentPrediction} 
            />
          ) : (
            <EmptyDataState message={t("predictions.noDataAvailable")} />
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
};
