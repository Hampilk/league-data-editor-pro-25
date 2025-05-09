
import { memo } from "react"
import type { Match } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, TrendingUp } from "lucide-react"

interface MatchDetailViewProps {
  match: Match
}

export const MatchDetailView = memo(({ match }: MatchDetailViewProps) => {
  const isHomeWin = match.home_score > match.away_score
  const isAwayWin = match.home_score < match.away_score
  const isDraw = match.home_score === match.away_score

  const getResultBadge = () => {
    if (isDraw) {
      return <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-300">Draw</Badge>
    } else if (isHomeWin) {
      return <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-300">Home Win</Badge>
    } else {
      return <Badge variant="outline" className="bg-amber-500/20 border-amber-500/30 text-amber-300">Away Win</Badge>
    }
  }

  return (
    <Card className="bg-black/20 border-white/5">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-300">
              Round {match.round}
            </Badge>
            {getResultBadge()}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{match.date}</span>
          </div>
        </div>
        <CardTitle className="text-center text-xl">
          {match.home_team} vs {match.away_team}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-6">
          <div className="text-center md:text-right flex-1">
            <div className="text-2xl font-bold text-white mb-2">{match.home_team}</div>
            <div className="text-sm text-gray-400">Home Team</div>
          </div>
          
          <div className="bg-gradient-to-b from-black/50 to-black/20 p-5 rounded-xl border border-white/10">
            <div className="flex items-center gap-6 text-4xl font-bold">
              <span className={isHomeWin ? "text-green-400" : "text-white"}>{match.home_score}</span>
              <span className="text-gray-500">-</span>
              <span className={isAwayWin ? "text-green-400" : "text-white"}>{match.away_score}</span>
            </div>
            <div className="text-center mt-2 text-gray-500 text-sm">
              Half-time: {match.ht_home_score} - {match.ht_away_score}
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="text-2xl font-bold text-white mb-2">{match.away_team}</div>
            <div className="text-sm text-gray-400">Away Team</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-black/30 rounded-lg p-4 border border-white/5">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Match Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Goals (1st Half)</span>
                <div className="flex items-center gap-2">
                  <span>{match.ht_home_score}</span>
                  <span className="text-gray-500">-</span>
                  <span>{match.ht_away_score}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Goals (2nd Half)</span>
                <div className="flex items-center gap-2">
                  <span>{match.home_score - match.ht_home_score}</span>
                  <span className="text-gray-500">-</span>
                  <span>{match.away_score - match.ht_away_score}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Goals</span>
                <span>{match.home_score + match.away_score}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-4 border border-white/5">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-400" />
              Match Info
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Competition</span>
                <span>League Match</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Round</span>
                <span>{match.round}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Result</span>
                <span>
                  {isDraw ? "Draw" : (isHomeWin ? `${match.home_team} Win` : `${match.away_team} Win`)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

MatchDetailView.displayName = "MatchDetailView"
