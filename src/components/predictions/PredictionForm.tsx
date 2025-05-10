
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Lightbulb } from "lucide-react";
import useTranslation from "@/utils/i18n";

interface PredictionFormProps {
  homeTeam: string;
  awayTeam: string;
  teams: string[];
  isLoading: boolean;
  advancedMode: boolean;
  onHomeTeamChange: (team: string) => void;
  onAwayTeamChange: (team: string) => void;
  onGeneratePrediction: () => void;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({
  homeTeam,
  awayTeam,
  teams,
  isLoading,
  advancedMode,
  onHomeTeamChange,
  onAwayTeamChange,
  onGeneratePrediction
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">{t("predictions.homeTeam")}</label>
          <Select value={homeTeam} onValueChange={onHomeTeamChange}>
            <SelectTrigger className="w-full bg-black/30 border-white/10 text-white">
              <SelectValue placeholder={t("predictions.selectTeam")} />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={`home-${team}`} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-gray-400">{t("predictions.awayTeam")}</label>
          <Select value={awayTeam} onValueChange={onAwayTeamChange}>
            <SelectTrigger className="w-full bg-black/30 border-white/10 text-white">
              <SelectValue placeholder={t("predictions.selectTeam")} />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={`away-${team}`} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        onClick={onGeneratePrediction} 
        disabled={!homeTeam || !awayTeam || homeTeam === awayTeam || isLoading}
        className={`w-full ${advancedMode ? 
          'bg-amber-600 hover:bg-amber-700 text-white' : 
          'bg-blue-500 hover:bg-blue-600 text-white'}`}
      >
        {isLoading ? (
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t("predictions.loading")}
          </div>
        ) : (
          advancedMode ? (
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              {t("predictions.buttonLabelAdvanced") || "Generate Advanced Prediction"}
            </div>
          ) : t("predictions.buttonLabel")
        )}
      </Button>
    </div>
  );
};
