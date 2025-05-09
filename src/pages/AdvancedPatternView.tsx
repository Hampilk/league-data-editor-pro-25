
import { memo, useState } from "react"
import { ArrowLeft, BarChart3, Network, Target, Wand2, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLeagueState } from "@/hooks/league"
import { ValueBetTracker } from "@/components/predictions/ValueBetTracker"
import { calculateValueBets } from "@/utils/leagueStatistics"

export const AdvancedPatternView = memo(() => {
  const { goBack, currentMatches } = useLeagueState()
  const [selectedTab, setSelectedTab] = useState("visualization")
  
  // Generate some sample patterns for the value betting tab
  const samplePatterns = currentMatches && currentMatches.length > 0 
    ? calculateValueBets(
        currentMatches[0]?.home_team || "Team A", 
        currentMatches[0]?.away_team || "Team B", 
        currentMatches
      )
    : []

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3">
        <Button
          onClick={goBack}
          size="icon"
          variant="outline"
          className="bg-white/5 border-white/10 text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h2 className="text-2xl font-bold text-white">Advanced Pattern Analysis</h2>
      </div>

      <Card className="bg-black/20 border-white/5">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Network className="h-5 w-5 text-blue-500" />
            Pattern Recognition System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-4 bg-black/20 w-full rounded-xl mb-6">
              <TabsTrigger
                value="visualization"
                className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-black/20"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Pattern Visualization</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="correlations"
                className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-black/20"
              >
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  <span>Correlations</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="predictions"
                className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-black/20"
              >
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Predictions</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="value-bets"
                className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-black/20"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Value Bets</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visualization">
              <div className="p-6 bg-black/20 rounded-xl border border-white/10">
                <h3 className="text-lg font-medium mb-4">Pattern Visualization</h3>
                <p className="text-gray-400">
                  Visualize complex patterns in match data using advanced statistical models. 
                  This tool helps identify recurring patterns and anomalies in team performance.
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="text-center p-8 text-gray-500">
                    Pattern visualization tools will be implemented here
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="correlations">
              <div className="p-6 bg-black/20 rounded-xl border border-white/10">
                <h3 className="text-lg font-medium mb-4">Statistical Correlations</h3>
                <p className="text-gray-400">
                  Analyze correlations between various match factors to identify statistically 
                  significant relationships and dependencies that can predict outcomes.
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="text-center p-8 text-gray-500">
                    Correlation analysis tools will be implemented here
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="predictions">
              <div className="p-6 bg-black/20 rounded-xl border border-white/10">
                <h3 className="text-lg font-medium mb-4">Pattern-Based Predictions</h3>
                <p className="text-gray-400">
                  Use identified patterns to generate high-confidence predictions for upcoming matches.
                  Advanced AI algorithms process historical patterns to forecast results.
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="text-center p-8 text-gray-500">
                    Pattern-based prediction tools will be implemented here
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="value-bets">
              <div className="p-6 bg-black/20 rounded-xl border border-white/10">
                <h3 className="text-lg font-medium mb-4">Value Betting Analysis</h3>
                <p className="text-gray-400">
                  Identify value betting opportunities where statistical probability exceeds the
                  implied probability of bookmaker odds, creating positive expected value bets.
                </p>
                <div className="mt-8">
                  <ValueBetTracker 
                    patterns={samplePatterns}
                    match={currentMatches && currentMatches.length > 0 ? currentMatches[0] : undefined}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
})

AdvancedPatternView.displayName = "AdvancedPatternView"
