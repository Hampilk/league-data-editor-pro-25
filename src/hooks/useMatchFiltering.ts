
import { useState, useCallback, useMemo } from "react"
import type { Match } from "@/types"
import { useMatchSorting, SortConfig, SortField } from "@/components/matches/useMatchSorting"

interface MatchFilters {
  team?: string
  round?: string
  result?: "home" | "away" | "draw" | ""
  goals?: "under2" | "2-3" | "over3" | ""
}

export function useMatchFiltering(matches: Match[] = [], initialFilters?: MatchFilters, initialSort?: SortConfig) {
  const [filters, setFilters] = useState<MatchFilters>(initialFilters || {})
  const { sortConfig, requestSort, sortMatches, getSortIcon } = useMatchSorting(initialSort)

  const filteredMatches = useMemo(() => {
    return (matches || []).filter((match) => {
      const teamMatch = filters.team
        ? match.home_team.toLowerCase().includes(filters.team.toLowerCase()) ||
          match.away_team.toLowerCase().includes(filters.team.toLowerCase())
        : true

      const roundMatch = filters.round ? match.round === filters.round : true

      let resultMatch = true
      if (filters.result === "home") {
        resultMatch = match.home_score > match.away_score
      } else if (filters.result === "away") {
        resultMatch = match.home_score < match.away_score
      } else if (filters.result === "draw") {
        resultMatch = match.home_score === match.away_score
      }

      let goalsMatch = true
      const totalGoals = match.home_score + match.away_score
      if (filters.goals === "under2") {
        goalsMatch = totalGoals < 2
      } else if (filters.goals === "2-3") {
        goalsMatch = totalGoals >= 2 && totalGoals <= 3
      } else if (filters.goals === "over3") {
        goalsMatch = totalGoals > 3
      }

      return teamMatch && roundMatch && resultMatch && goalsMatch
    })
  }, [matches, filters])

  const sortedMatches = useMemo(() => {
    return sortMatches(filteredMatches)
  }, [filteredMatches, sortMatches])

  const matchesByRound = useMemo(() => {
    return sortedMatches.reduce((acc, match) => {
      const round = String(match.round || "Unknown")
      if (!acc[round]) {
        acc[round] = []
      }
      acc[round].push(match)
      return acc
    }, {} as Record<string, Match[]>)
  }, [sortedMatches])

  return {
    filters,
    setFilters,
    filteredMatches,
    sortedMatches,
    matchesByRound,
    requestSort,
    sortConfig,
    getSortIcon
  }
}
