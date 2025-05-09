
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Check, X, BarChart, Trophy } from "lucide-react"
import { MatchPrediction } from "@/types"
import { Badge } from "@/components/ui/badge"
import useTranslation from "@/utils/i18n"

interface PredictionHistoryProps {
  predictions: MatchPrediction[]
}

export const PredictionHistory: React.FC<PredictionHistoryProps> = ({ predictions }) => {
  const { t } = useTranslation()
  
  // Calculate success metrics
  const totalPredictions = predictions.length
  const successfulPredictions = totalPredictions > 0 ? Math.floor(predictions.length * 0.7) : 0 // Mock data - in real app would check actual results
  const successRate = totalPredictions > 0 ? (successfulPredictions / totalPredictions * 100).toFixed(0) : 0
  
  // Get high confidence predictions
  const highConfidencePredictions = predictions.filter(p => p.confidenceLevel > 0.7)
  
  // Group predictions by pattern type
  const patternStatistics = predictions.reduce((acc, prediction) => {
    prediction.patterns.forEach(pattern => {
      if (!acc[pattern.type]) {
        acc[pattern.type] = {
          count: 0,
          successCount: 0,
          avgConfidence: 0,
          totalConfidence: 0
        }
      }
      
      acc[pattern.type].count++
      acc[pattern.type].totalConfidence += pattern.confidence
      // Mock success data
      if (Math.random() > 0.3) {
        acc[pattern.type].successCount++
      }
    })
    
    return acc
  }, {} as Record<string, { count: number, successCount: number, avgConfidence: number, totalConfidence: number }>)
  
  // Calculate average confidence for each pattern
  Object.keys(patternStatistics).forEach(key => {
    const stat = patternStatistics[key]
    stat.avgConfidence = stat.totalConfidence / stat.count
  })
  
  // Sort patterns by count
  const sortedPatterns = Object.entries(patternStatistics)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([type, stats]) => ({
      type,
      ...stats,
      successRate: stats.count > 0 ? (stats.successCount / stats.count * 100).toFixed(0) : "0"
    }))
  
  if (predictions.length === 0) {
    return (
      <Card className="bg-black/20 border-white/5">
        <CardHeader>
          <CardTitle className="text-white">{t("predictions.noHistoryYet")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <BarChart className="h-16 w-16 text-gray-500 mb-4" />
          <p className="text-gray-400 text-center">{t("predictions.makeFirstPrediction")}</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Success rate card */}
        <Card className="bg-black/20 border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{t("predictions.results.successRate")}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{successRate}%</h3>
              </div>
              <div className={`rounded-full p-3 ${Number(successRate) > 60 ? 'bg-green-900/20' : 'bg-amber-900/20'}`}>
                {Number(successRate) > 60 ? (
                  <Check className="h-6 w-6 text-green-400" />
                ) : (
                  <X className="h-6 w-6 text-amber-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Total predictions card */}
        <Card className="bg-black/20 border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{t("predictions.totalPredictions")}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{totalPredictions}</h3>
              </div>
              <div className="rounded-full p-3 bg-blue-900/20">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* High confidence card */}
        <Card className="bg-black/20 border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{t("predictions.highConfidence")}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{highConfidencePredictions.length}</h3>
              </div>
              <div className="rounded-full p-3 bg-purple-900/20">
                <Trophy className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-black/20 border-white/5">
        <CardHeader>
          <CardTitle className="text-white">{t("predictions.patternPerformance")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedPatterns.map((pattern, index) => (
              <div key={index} className="bg-black/30 rounded-lg p-4 border border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/20">
                    {t(`predictions.patternTypes.${pattern.type}`) || pattern.type}
                  </Badge>
                  <span className={`text-sm ${
                    Number(pattern.successRate) > 70 ? 'text-green-400' : 
                    Number(pattern.successRate) > 50 ? 'text-blue-400' : 'text-amber-400'
                  }`}>
                    {pattern.successRate}% {t("predictions.successful")}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{t("predictions.usedTimes")}</span>
                  <span className="text-white">{pattern.count}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{t("predictions.avgConfidence")}</span>
                  <span className="text-white">{(pattern.avgConfidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black/20 border-white/5">
        <CardHeader>
          <CardTitle className="text-white">{t("predictions.recentPredictions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {predictions.slice(0, 5).map((prediction, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg bg-black/30 p-3 border border-white/5">
                <div>
                  <div className="font-medium text-white">
                    {prediction.match.home_team} vs {prediction.match.away_team}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {prediction.predictedResult === 'home_win' && `${prediction.match.home_team} Win`}
                    {prediction.predictedResult === 'away_win' && `${prediction.match.away_team} Win`}
                    {prediction.predictedResult === 'draw' && 'Draw'}
                    {prediction.predictedScore && ` (${prediction.predictedScore.home}-${prediction.predictedScore.away})`}
                  </div>
                </div>
                
                <Badge 
                  variant="outline" 
                  className={`
                    ${Math.random() > 0.3 ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}
                  `}
                >
                  {Math.random() > 0.3 ? t("predictions.hit") : t("predictions.miss")}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
