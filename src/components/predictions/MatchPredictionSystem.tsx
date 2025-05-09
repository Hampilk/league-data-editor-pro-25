
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Info, BarChart3, Save, Lightbulb } from "lucide-react";
import { PredictionPatterns } from "./PredictionPatterns";
import { HalfTimeFullTimeAnalysis } from "./HalfTimeFullTimeAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PredictionPattern, HalfTimeFullTime, HeadToHeadStat, MatchPrediction, Match } from "@/types";
import useTranslation from "@/utils/i18n";
import { toast } from "sonner";

// Mock data for demonstration until API is connected
const mockTeams = [
  "West Ham",
  "Nottingham",
  "Aston Oroszlán",
  "Manchester Kék",
  "Newcastle",
  "London Ágyúk",
  "Wolverhampton",
  "Brentford",
  "Crystal Palace",
  "Wolves"
];

// Mock prediction patterns for demonstration
const mockPatterns: Record<string, PredictionPattern[]> = {
  "West Ham-Nottingham": [
    {
      type: "both_teams_score",
      confidence: 0.85,
      description: "Az utóbbi 5 meccs alapján rendszeresen mindkét csapat gólt szerez ebben a párosításban.",
      historicalSuccess: 0.78,
      oddsValue: 1.85
    },
    {
      type: "ht_ft_reversal",
      confidence: 0.42,
      description: "Az elmúlt 10 mérkőzésen 3 alkalommal fordult elő fordítás ebben a párosításban.",
      historicalSuccess: 0.30,
      oddsValue: 15.0
    }
  ],
  "Aston Oroszlán-Manchester Kék": [
    {
      type: "both_teams_score",
      confidence: 0.75,
      description: "A Manchester Kék és az Aston Oroszlán mérkőzésein gyakori a gólváltás (73%).",
      historicalSuccess: 0.73,
      oddsValue: 1.76
    },
    {
      type: "draw",
      confidence: 0.55,
      description: "Az elmúlt egymás elleni 6 mérkőzésből 3 döntetlennel zárult.",
      historicalSuccess: 0.50,
      oddsValue: 3.25
    }
  ],
  "Newcastle-London Ágyúk": [
    {
      type: "draw",
      confidence: 0.65,
      description: "A Newcastle otthon játszott mérkőzésein magas a döntetlenek aránya (40%).",
      historicalSuccess: 0.40,
      oddsValue: 4.0
    }
  ]
};

// Mock HTFT data
const mockHtft: Record<string, HalfTimeFullTime[]> = {
  "West Ham-Nottingham": [
    {
      type: "home_away",
      label: "Félidőben hazai vezetés, vendég győzelem",
      isReversal: true,
      odds: 29.0,
      confidence: 0.15
    },
    {
      type: "away_home",
      label: "Félidőben vendég vezetés, hazai győzelem",
      isReversal: true,
      odds: 21.0,
      confidence: 0.18
    },
    {
      type: "home_home",
      label: "Félidőben hazai vezetés, hazai győzelem",
      isReversal: false,
      odds: 2.5,
      confidence: 0.60
    }
  ],
  "Newcastle-London Ágyúk": [
    {
      type: "draw_draw",
      label: "Félidőben döntetlen, végeredmény döntetlen",
      isReversal: false,
      odds: 5.5,
      confidence: 0.40
    },
    {
      type: "draw_home",
      label: "Félidőben döntetlen, hazai győzelem",
      isReversal: false,
      odds: 4.3,
      confidence: 0.35
    }
  ]
};

// Mock head-to-head stats
const mockHeadToHead: Record<string, HeadToHeadStat> = {
  "West Ham-Nottingham": {
    homeTeam: "West Ham",
    awayTeam: "Nottingham",
    totalMatches: 8,
    homeWins: 4,
    draws: 1,
    awayWins: 3,
    homeGoals: 12,
    awayGoals: 11,
    bothTeamsScored: 6,
    avgTotalGoals: 2.88,
    htftReversals: 3
  },
  "Aston Oroszlán-Manchester Kék": {
    homeTeam: "Aston Oroszlán",
    awayTeam: "Manchester Kék",
    totalMatches: 10,
    homeWins: 3,
    draws: 4,
    awayWins: 3,
    homeGoals: 13,
    awayGoals: 14,
    bothTeamsScored: 8,
    avgTotalGoals: 2.7,
    htftReversals: 2
  },
  "Newcastle-London Ágyúk": {
    homeTeam: "Newcastle",
    awayTeam: "London Ágyúk",
    totalMatches: 6,
    homeWins: 2,
    draws: 3,
    awayWins: 1,
    homeGoals: 8,
    awayGoals: 7,
    bothTeamsScored: 5,
    avgTotalGoals: 2.5,
    htftReversals: 1
  }
};

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
  
  const [homeTeam, setHomeTeam] = useState<string>("");
  const [awayTeam, setAwayTeam] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [patterns, setPatterns] = useState<PredictionPattern[]>([]);
  const [htftData, setHtftData] = useState<HalfTimeFullTime[]>([]);
  const [headToHead, setHeadToHead] = useState<HeadToHeadStat | null>(null);
  const [currentPrediction, setCurrentPrediction] = useState<MatchPrediction | null>(null);
  
  // Reset predictions when teams change
  useEffect(() => {
    setPatterns([]);
    setHtftData([]);
    setHeadToHead(null);
    setCurrentPrediction(null);
  }, [homeTeam, awayTeam]);
  
  const handleGeneratePrediction = () => {
    if (!homeTeam || !awayTeam || homeTeam === awayTeam) return;
    
    setIsLoading(true);
    
    // If advanced mode is enabled and generator function exists, use it instead of mock data
    if (advancedMode && generateAdvancedPrediction) {
      setTimeout(() => {
        const advancedPrediction = generateAdvancedPrediction(homeTeam, awayTeam);
        
        if (advancedPrediction) {
          setPatterns(advancedPrediction.patterns);
          setHtftData(advancedPrediction.htftAnalysis);
          setHeadToHead(advancedPrediction.headToHead);
          setCurrentPrediction(advancedPrediction);
        }
        
        setIsLoading(false);
      }, 1000);
      return;
    }
    
    // Standard mode - use mock data
    setTimeout(() => {
      const matchKey = `${homeTeam}-${awayTeam}`;
      const matchPatterns = mockPatterns[matchKey] || [];
      const matchHtft = mockHtft[matchKey] || [];
      const matchHeadToHead = mockHeadToHead[matchKey] || null;
      
      setPatterns(matchPatterns);
      setHtftData(matchHtft);
      setHeadToHead(matchHeadToHead);
      
      // Create a match prediction object
      const mockMatch: Match = {
        date: new Date().toISOString(),
        home_team: homeTeam,
        away_team: awayTeam,
        home_score: 0,
        away_score: 0,
        ht_home_score: 0,
        ht_away_score: 0
      };
      
      // Determine predicted result based on patterns and head-to-head
      let predictedResult: 'home_win' | 'draw' | 'away_win' = 'draw';
      let confidenceLevel = 0.5;
      let predictedScore = { home: 1, away: 1 };
      
      if (matchHeadToHead) {
        // Use head-to-head data to determine prediction
        const { homeWins, awayWins, draws } = matchHeadToHead;
        const totalMatches = homeWins + awayWins + draws;
        
        if (homeWins > awayWins && homeWins > draws) {
          predictedResult = 'home_win';
          confidenceLevel = homeWins / totalMatches + 0.1; // +0.1 for home advantage
          predictedScore = { home: 2, away: 1 };
        } else if (awayWins > homeWins && awayWins > draws) {
          predictedResult = 'away_win';
          confidenceLevel = awayWins / totalMatches;
          predictedScore = { home: 0, away: 1 };
        } else {
          predictedResult = 'draw';
          confidenceLevel = draws / totalMatches;
          predictedScore = { home: 1, away: 1 };
        }
      }
      
      // Create the prediction object
      const prediction: MatchPrediction = {
        match: mockMatch,
        predictedResult,
        confidenceLevel,
        predictedScore,
        patterns: matchPatterns,
        htftAnalysis: matchHtft,
        headToHead: matchHeadToHead
      };
      
      setCurrentPrediction(prediction);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleSaveCurrentPrediction = () => {
    if (currentPrediction && onSavePrediction) {
      onSavePrediction(currentPrediction);
    }
  };

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
                {advancedMode ? "Using enhanced statistical models based on historical data" : t("predictions.subtitle")}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">{t("predictions.homeTeam")}</label>
              <Select value={homeTeam} onValueChange={setHomeTeam}>
                <SelectTrigger className="w-full bg-black/30 border-white/10 text-white">
                  <SelectValue placeholder={t("predictions.selectTeam")} />
                </SelectTrigger>
                <SelectContent>
                  {mockTeams.map((team) => (
                    <SelectItem key={`home-${team}`} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">{t("predictions.awayTeam")}</label>
              <Select value={awayTeam} onValueChange={setAwayTeam}>
                <SelectTrigger className="w-full bg-black/30 border-white/10 text-white">
                  <SelectValue placeholder={t("predictions.selectTeam")} />
                </SelectTrigger>
                <SelectContent>
                  {mockTeams.map((team) => (
                    <SelectItem key={`away-${team}`} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleGeneratePrediction} 
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
              advancedMode ? "Generate Advanced Prediction" : t("predictions.buttonLabel")
            )}
          </Button>
        </CardContent>
      </Card>
      
      {(patterns.length > 0 || htftData.length > 0) && (
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
                ) : (
                  <Card className="bg-black/20 border-white/5">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Info className="h-12 w-12 mb-3 opacity-50" />
                        <p>{t("predictions.noDataAvailable")}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
      
      <Card className="bg-black/20 border-white/5">
        <CardHeader>
          <CardTitle className="text-white">{advancedMode ? "Advanced Prediction Model" : t("predictions.predictionModelInfo")}</CardTitle>
          <CardDescription>{advancedMode ? "Using statistical algorithms and historical data analysis" : t("predictions.howItWorks")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">
            {advancedMode ? 
              "The advanced prediction engine uses statistical algorithms to analyze historical match data, identifying patterns and calculating probabilities for various outcomes." : 
              t("predictions.predictionDescription")
            }
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
    </div>
  );
};
