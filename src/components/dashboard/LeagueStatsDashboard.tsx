import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ChartBar, ChartLine, ChartPie } from 'lucide-react';
import type { Match, LeagueData } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface LeagueStatsDashboardProps {
  league: LeagueData;
  matches: Match[];
}

const LeagueStatsDashboard: React.FC<LeagueStatsDashboardProps> = ({ league, matches }) => {
  const isMobile = useIsMobile();
  
  // Calculate goals per round
  const goalsByRound = React.useMemo(() => {
    const roundsMap: Record<string, { round: string; totalGoals: number; matches: number }> = {};
    
    matches.forEach(match => {
      // Convert the round to string to ensure it's always a string
      const round = match.round ? String(match.round) : "Unknown";
      const goals = match.home_score + match.away_score;
      
      if (!roundsMap[round]) {
        roundsMap[round] = { round, totalGoals: 0, matches: 0 };
      }
      
      roundsMap[round].totalGoals += goals;
      roundsMap[round].matches += 1;
    });
    
    return Object.values(roundsMap).map(item => ({
      ...item,
      averageGoals: item.matches > 0 ? Number((item.totalGoals / item.matches).toFixed(2)) : 0
    }));
  }, [matches]);
  
  // Calculate team stats
  const teamStats = React.useMemo(() => {
    const stats: Record<string, { team: string; played: number; goalsFor: number; goalsAgainst: number }> = {};
    
    matches.forEach(match => {
      // Home team
      if (!stats[match.home_team]) {
        stats[match.home_team] = { team: match.home_team, played: 0, goalsFor: 0, goalsAgainst: 0 };
      }
      stats[match.home_team].played += 1;
      stats[match.home_team].goalsFor += match.home_score;
      stats[match.home_team].goalsAgainst += match.away_score;
      
      // Away team
      if (!stats[match.away_team]) {
        stats[match.away_team] = { team: match.away_team, played: 0, goalsFor: 0, goalsAgainst: 0 };
      }
      stats[match.away_team].played += 1;
      stats[match.away_team].goalsFor += match.away_score;
      stats[match.away_team].goalsAgainst += match.home_score;
    });
    
    return Object.values(stats)
      .map(team => ({
        ...team,
        goalDifference: team.goalsFor - team.goalsAgainst,
        averageGoalsFor: team.played > 0 ? Number((team.goalsFor / team.played).toFixed(2)) : 0
      }))
      .sort((a, b) => b.averageGoalsFor - a.averageGoalsFor)
      .slice(0, 5); // Top 5 teams
  }, [matches]);
  
  // Calculate result distribution
  const resultDistribution = React.useMemo(() => {
    let homeWins = 0;
    let awayWins = 0;
    let draws = 0;
    
    matches.forEach(match => {
      if (match.home_score > match.away_score) {
        homeWins += 1;
      } else if (match.home_score < match.away_score) {
        awayWins += 1;
      } else {
        draws += 1;
      }
    });
    
    const total = homeWins + awayWins + draws;
    
    return [
      { name: 'Home Wins', value: homeWins, percentage: total > 0 ? Math.round((homeWins / total) * 100) : 0 },
      { name: 'Away Wins', value: awayWins, percentage: total > 0 ? Math.round((awayWins / total) * 100) : 0 },
      { name: 'Draws', value: draws, percentage: total > 0 ? Math.round((draws / total) * 100) : 0 }
    ];
  }, [matches]);
  
  // Colors for pie chart
  const COLORS = ['#10b981', '#ef4444', '#f59e0b'];
  
  if (matches.length === 0) {
    return (
      <div className="bg-black/20 rounded-xl p-8 text-center border border-white/5">
        <p className="text-gray-400">No match data available for statistics. Import matches to see visualizations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {isMobile ? (
          <ChartPie className="h-5 w-5 text-blue-500" />
        ) : (
          <ChartBar className="h-5 w-5 text-blue-500" />
        )}
        <h2 className="text-xl font-bold text-white">League Statistics</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals Per Round Chart */}
        <Card className="bg-black/20 border-white/10 text-white">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Goals Per Round</CardTitle>
              <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                {matches.length} Matches
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer className="h-80" config={{ goals: { theme: { light: '#10b981', dark: '#10b981' } }}}>
              <BarChart data={goalsByRound}>
                <XAxis dataKey="round" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="totalGoals" name="Total Goals" fill="var(--color-goals)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Top Scoring Teams */}
        <Card className="bg-black/20 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Top Scoring Teams</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer className="h-80" config={{ scored: { theme: { light: '#3b82f6', dark: '#3b82f6' } }}}>
              <LineChart data={teamStats}>
                <XAxis dataKey="team" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="averageGoalsFor" name="Avg. Goals Scored" stroke="var(--color-scored)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Result Distribution */}
        <Card className="bg-black/20 border-white/10 text-white lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Result Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col space-y-4">
                {resultDistribution.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                      />
                      <span>{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm">{entry.value} matches</span>
                      <span className="w-10 text-right font-semibold">{entry.percentage}%</span>
                    </div>
                  </div>
                ))}
                
                <div className="pt-2 text-sm text-gray-400">
                  Total matches: {matches.length}
                </div>
              </div>
              
              <div className="flex justify-center h-60">
                <ResponsiveContainer width={200} height="100%">
                  <PieChart>
                    <Pie
                      data={resultDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {resultDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} matches`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeagueStatsDashboard;
