
import { memo } from "react"
import { Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SortField } from "../matches/useMatchSorting"

interface MatchesHeaderProps {
  viewType: "rounds" | "all" | "cards"
  setViewType: (value: "rounds" | "all" | "cards") => void
  requestSort: (key: SortField) => void
  getSortIcon: (key: SortField) => JSX.Element
}

export const MatchesHeader = memo(({ viewType, setViewType, requestSort, getSortIcon }: MatchesHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-blue-500" />
        <CardTitle className="text-white">Match Schedule</CardTitle>
      </div>

      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span>Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#0a0f14] border-white/10 text-white">
            <DropdownMenuItem
              onClick={() => requestSort("date")}
              className="flex items-center gap-2 cursor-pointer"
            >
              Date {getSortIcon("date")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => requestSort("round")}
              className="flex items-center gap-2 cursor-pointer"
            >
              Round {getSortIcon("round")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => requestSort("goals")}
              className="flex items-center gap-2 cursor-pointer"
            >
              Total Goals {getSortIcon("goals")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tabs
          value={viewType}
          onValueChange={(value) => setViewType(value as "rounds" | "all" | "cards")}
          className="w-auto"
        >
          <TabsList className="bg-black/30 border border-white/10">
            <TabsTrigger value="rounds" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              By Round
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              All Matches
            </TabsTrigger>
            <TabsTrigger value="cards" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Cards
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
})

MatchesHeader.displayName = "MatchesHeader"
