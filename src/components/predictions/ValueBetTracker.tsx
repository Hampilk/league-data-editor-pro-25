import { useState, useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ValueBet, PredictionPattern, Match } from "@/types"
import { PlusCircle, Sparkles, TrendingUp, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"

interface ValueBetTrackerProps {
  match?: Match
  patterns?: PredictionPattern[]
  onSaveBet?: (bet: ValueBet) => void
  existingBets?: ValueBet[]
  onUpdateBet?: (bet: ValueBet) => void
}

export function ValueBetTracker({ 
  match, 
  patterns = [],
  existingBets = [],
  onSaveBet,
  onUpdateBet
}: ValueBetTrackerProps) {
  const [selectedPattern, setSelectedPattern] = useState<PredictionPattern | null>(null)
  const [bookmakerOdds, setBookmakerOdds] = useState<number | "">("")
  const [stake, setStake] = useState<number | "">("")
  const [isAddingBet, setIsAddingBet] = useState(false)

  // Calculate total metrics
  const totalMetrics = useMemo(() => {
    return existingBets.reduce((acc, bet) => {
      const totalStake = acc.totalStake + bet.stake
      const totalReturn = acc.totalReturn + (bet.actualReturn || 0)
      const wonBets = bet.isWon ? acc.wonBets + 1 : acc.wonBets
      
      return {
        totalStake,
        totalReturn,
        wonBets,
        totalBets: acc.totalBets + 1,
        roi: totalStake > 0 ? ((totalReturn - totalStake) / totalStake) * 100 : 0
      }
    }, {
      totalStake: 0,
      totalReturn: 0,
      wonBets: 0,
      totalBets: 0,
      roi: 0
    })
  }, [existingBets])

  const calculateExpectedValue = (pattern: PredictionPattern, odds: number): number => {
    // EV = (Probability of Success × Potential Payout) - (Probability of Failure × Stake)
    // For simplicity, we'll use the pattern confidence as our probability
    const probability = pattern.historicalSuccess / 100
    const potentialPayout = odds - 1 // Minus 1 because odds include the stake
    return (probability * potentialPayout) - ((1 - probability) * 1)
  }

  const calculateValueRating = (expectedValue: number): number => {
    // Value rating from 1-5 based on expected value
    if (expectedValue <= 0) return 1
    if (expectedValue < 0.1) return 2
    if (expectedValue < 0.2) return 3
    if (expectedValue < 0.4) return 4
    return 5
  }

  const handleSelectPattern = (pattern: PredictionPattern) => {
    setSelectedPattern(pattern)
    setIsAddingBet(true)
  }

  const handleCreateBet = () => {
    if (!match || !selectedPattern || !bookmakerOdds || !stake) {
      toast.error("Please fill in all fields")
      return
    }

    const expectedValue = calculateExpectedValue(selectedPattern, Number(bookmakerOdds))
    const valueRating = calculateValueRating(expectedValue)
    
    const newBet: ValueBet = {
      matchId: match.id || `${match.home_team}-${match.away_team}-${match.date}`,
      pattern: selectedPattern,
      stake: Number(stake),
      potentialReturn: Number(stake) * Number(bookmakerOdds),
      bookmakerOdds: Number(bookmakerOdds),
      expectedValue,
      valueRating,
      recommendedStake: Math.round(valueRating * 10) // Simple calculation based on value rating
    }

    onSaveBet?.(newBet)
    toast.success("Value bet recorded")
    resetForm()
  }

  const resetForm = () => {
    setSelectedPattern(null)
    setBookmakerOdds("")
    setStake("")
    setIsAddingBet(false)
  }

  const handleResult = (bet: ValueBet, isWon: boolean) => {
    const updatedBet: ValueBet = {
      ...bet,
      isWon,
      actualReturn: isWon ? bet.potentialReturn : 0
    }
    onUpdateBet?.(updatedBet)
    toast.success(`Bet marked as ${isWon ? 'won' : 'lost'}`)
  }

  // Value Opportunity Section - shown when not actively adding a bet
  const renderValueOpportunities = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Value Opportunities</h3>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setIsAddingBet(true)}
          className="bg-white/5 border-white/10 text-white hover:bg-white/10"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Value Bet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {patterns.map((pattern, index) => (
          <div 
            key={index}
            className="bg-black/30 p-3 rounded-lg border border-white/5 hover:border-blue-500/40 cursor-pointer transition-all"
            onClick={() => handleSelectPattern(pattern)}
          >
            <div className="flex justify-between items-center mb-2">
              <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-300">
                {pattern.type.replace('_', ' ')}
              </Badge>
              <span className="text-sm font-medium text-blue-400">
                {pattern.oddsValue.toFixed(2)}x
              </span>
            </div>
            
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-blue-400">{pattern.historicalSuccess}%</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-300 mt-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{pattern.description}</span>
              </div>
            </div>
          </div>
        ))}
        
        {patterns.length === 0 && (
          <div className="col-span-full text-center p-6 bg-black/20 rounded-lg border border-white/5">
            <p className="text-gray-400">No value betting opportunities found for this match</p>
          </div>
        )}
      </div>
    </div>
  )

  // Form for adding a new bet
  const renderAddBetForm = () => (
    <div className="bg-black/30 rounded-lg border border-white/5 p-4">
      <h3 className="text-lg font-medium text-white mb-4">Add Value Bet</h3>
      
      {selectedPattern ? (
        <div className="mb-4 p-3 bg-blue-950/30 border border-blue-500/20 rounded-lg">
          <div className="flex justify-between">
            <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-300">
              {selectedPattern.type.replace('_', ' ')}
            </Badge>
            <span className="text-sm text-blue-400">{selectedPattern.oddsValue.toFixed(2)}x (Fair odds)</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">{selectedPattern.description}</p>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-sm text-gray-400">Select a pattern from below:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {patterns.map((pattern, index) => (
              <div
                key={index}
                className="p-2 border border-white/10 rounded bg-black/20 cursor-pointer hover:bg-black/30"
                onClick={() => setSelectedPattern(pattern)}
              >
                <div className="flex justify-between">
                  <span className="text-sm">{pattern.type.replace('_', ' ')}</span>
                  <span className="text-sm text-blue-400">{pattern.historicalSuccess}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 block mb-1">Bookmaker Odds</label>
          <Input
            type="number"
            step="0.01"
            min="1"
            value={bookmakerOdds}
            onChange={(e) => setBookmakerOdds(e.target.value ? parseFloat(e.target.value) : "")}
            className="bg-black/30 border-white/10 text-white"
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-400 block mb-1">Stake Amount</label>
          <Input
            type="number"
            step="1"
            min="1"
            value={stake}
            onChange={(e) => setStake(e.target.value ? parseFloat(e.target.value) : "")}
            className="bg-black/30 border-white/10 text-white"
          />
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={resetForm} className="border-white/10 text-white">
            Cancel
          </Button>
          
          <Button 
            onClick={handleCreateBet} 
            disabled={!selectedPattern || !bookmakerOdds || !stake}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Record Bet
          </Button>
        </div>
      </div>
    </div>
  )

  // Existing bets table
  const renderExistingBets = () => (
    <>
      {existingBets.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-white">Tracked Value Bets</h3>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-400">ROI: </span>
                <span className={`font-medium ${totalMetrics.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalMetrics.roi.toFixed(1)}%
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Win Rate: </span>
                <span className="font-medium text-blue-400">
                  {totalMetrics.totalBets > 0 
                    ? ((totalMetrics.wonBets / totalMetrics.totalBets) * 100).toFixed(0) 
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-white/5">
            <Table>
              <TableHeader className="bg-black/40">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-gray-400 w-1/4">Pattern</TableHead>
                  <TableHead className="text-gray-400 text-right">Stake</TableHead>
                  <TableHead className="text-gray-400 text-right">Odds</TableHead>
                  <TableHead className="text-gray-400 text-right">Value Rating</TableHead>
                  <TableHead className="text-gray-400 text-right">Return</TableHead>
                  <TableHead className="text-gray-400 text-center w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {existingBets.map((bet, index) => (
                  <TableRow key={index} className="border-white/5">
                    <TableCell className="font-medium">
                      {bet.pattern.type.replace('_', ' ')}
                    </TableCell>
                    <TableCell className="text-right">{bet.stake.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {bet.bookmakerOdds?.toFixed(2) || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {bet.valueRating ? (
                        <Badge className={`bg-blue-${Math.min(bet.valueRating * 100, 500)}/20`}>
                          {bet.valueRating}/5
                        </Badge>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {typeof bet.isWon !== 'undefined' ? (
                        <span className={bet.isWon ? "text-green-400" : "text-red-400"}>
                          {bet.isWon ? `+${bet.actualReturn?.toFixed(2)}` : "-" + bet.stake.toFixed(2)}
                        </span>
                      ) : (
                        `${bet.potentialReturn.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>
                      {typeof bet.isWon === 'undefined' ? (
                        <div className="flex justify-center gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7 w-7 p-0 bg-green-500/10 border-green-500/20 hover:bg-green-500/20"
                            onClick={() => handleResult(bet, true)}
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7 w-7 p-0 bg-red-500/10 border-red-500/20 hover:bg-red-500/20" 
                            onClick={() => handleResult(bet, false)}
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ) : (
                        <Badge className={bet.isWon 
                          ? "bg-green-500/20 text-green-400 border-green-500/30" 
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                        }>
                          {bet.isWon ? "Won" : "Lost"}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  )

  return (
    <Card className="bg-black/20 border-white/5">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-amber-400" />
          Value Betting
        </CardTitle>
        <CardDescription>
          Track high-value betting opportunities and their performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAddingBet ? renderAddBetForm() : renderValueOpportunities()}
        {renderExistingBets()}
      </CardContent>
    </Card>
  )
}
