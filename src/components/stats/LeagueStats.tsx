
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LeagueStatistics } from "@/utils/leagueStatistics"
import { Flag, Gauge, Goal, PieChart, TrendingUp, Users2, Award } from "lucide-react"

interface LeagueStatsProps {
  statistics: LeagueStatistics
  league?: { 
    id: string; 
    name: string;
    season?: string;
    winner?: string;
    secondPlace?: string;
    thirdPlace?: string;
    status?: "In Progress" | "Completed";
  } | null
}

export function LeagueStats({ statistics, league }: LeagueStatsProps) {
  return (
    <Card className="bg-black/20 border-white/5">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <PieChart className="h-5 w-5 text-blue-400" />
          League Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {league && (
          <div className="mb-4">
            <h3 className="font-medium text-lg text-white mb-1">{league.name}</h3>
            <p className="text-sm text-gray-400">{league.season || 'Current Season'} • {league.status || 'In Progress'}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <StatItem 
            icon={<Flag className="h-4 w-4" />} 
            label="Total Matches" 
            value={statistics.totalMatches.toString()} 
          />
          <StatItem 
            icon={<Goal className="h-4 w-4" />} 
            label="Total Goals" 
            value={statistics.totalGoals.toString()} 
          />
          <StatItem 
            icon={<Gauge className="h-4 w-4" />} 
            label="Average Goals/Match" 
            value={statistics.averageGoalsPerMatch.toFixed(2)} 
          />
          <StatItem 
            icon={<TrendingUp className="h-4 w-4" />} 
            label="Home/Away/Draw" 
            value={`${statistics.homeWins}/${statistics.awayWins}/${statistics.draws}`} 
          />
          <StatItem 
            icon={<Award className="h-4 w-4" />} 
            label="Top Scorer" 
            value={statistics.topScorer} 
          />
          <StatItem 
            icon={<Users2 className="h-4 w-4" />} 
            label="Most Clean Sheets" 
            value={statistics.mostCleanSheets} 
          />
        </div>
        
        {league?.status === "Completed" && league.winner && (
          <div className="pt-4 border-t border-white/10">
            <h4 className="font-medium text-white mb-3">Final Results</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-amber-500/30 text-amber-400 rounded-full flex items-center justify-center mr-3">1</div>
                <span className="text-white">{league.winner}</span>
              </div>
              {league.secondPlace && (
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-500/30 text-gray-400 rounded-full flex items-center justify-center mr-3">2</div>
                  <span className="text-white">{league.secondPlace}</span>
                </div>
              )}
              {league.thirdPlace && (
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-amber-700/30 text-amber-700 rounded-full flex items-center justify-center mr-3">3</div>
                  <span className="text-white">{league.thirdPlace}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="text-blue-400">{icon}</div>
        <span className="text-gray-400">{label}</span>
      </div>
      <span className="font-medium text-white">{value}</span>
    </div>
  )
}
