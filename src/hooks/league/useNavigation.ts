
import { useState, useCallback } from "react"
import { RouteType } from "@/types"

interface RouteHistoryItem {
  route: RouteType
  leagueId?: string
  matchId?: string
  tab?: string
}

interface NavigateParams {
  leagueId?: string
  matchId?: string
  tab?: string
}

export const useNavigation = () => {
  // Navigation state
  const [currentRoute, setCurrentRoute] = useState<RouteType>("leagues")
  const [routeHistory, setRouteHistory] = useState<RouteHistoryItem[]>([])
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null)
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<string | null>(null)
  
  // Navigation actions
  const navigate = useCallback(
    (route: RouteType, params?: NavigateParams) => {
      // Add current route to history before changing
      setRouteHistory((prev) => [
        ...prev, 
        { 
          route: currentRoute, 
          leagueId: selectedLeagueId || undefined, 
          matchId: selectedMatchId || undefined,
          tab: selectedTab || undefined
        }
      ])
      
      setCurrentRoute(route)
      
      if (params?.leagueId !== undefined) {
        setSelectedLeagueId(params.leagueId)
      }
      
      if (params?.matchId !== undefined) {
        setSelectedMatchId(params.matchId)
      }

      if (params?.tab !== undefined) {
        setSelectedTab(params.tab)
      }
    },
    [currentRoute, selectedLeagueId, selectedMatchId, selectedTab]
  )

  const goBack = useCallback(() => {
    if (routeHistory.length > 0) {
      const prevRoute = routeHistory[routeHistory.length - 1]
      setRouteHistory((prev) => prev.slice(0, -1))
      
      setCurrentRoute(prevRoute.route)
      setSelectedLeagueId(prevRoute.leagueId || null)
      setSelectedMatchId(prevRoute.matchId || null)
      setSelectedTab(prevRoute.tab || null)
    } else {
      // Default fallback if no history
      setCurrentRoute("leagues")
      setSelectedLeagueId(null)
      setSelectedMatchId(null)
      setSelectedTab(null)
    }
  }, [routeHistory])

  const resetNavigation = useCallback(() => {
    setCurrentRoute("leagues")
    setSelectedLeagueId(null)
    setSelectedMatchId(null)
    setSelectedTab(null)
    setRouteHistory([])
  }, [])

  return {
    // Navigation state
    currentRoute,
    selectedLeagueId,
    selectedMatchId,
    selectedTab,
    
    // Navigation actions
    navigate,
    goBack,
    resetNavigation,
    
    // For internal use
    setSelectedLeagueId,
    setSelectedTab
  }
}
