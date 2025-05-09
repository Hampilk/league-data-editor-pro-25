
import { useCallback } from "react"
import type { LeagueData } from "../../types"

interface FormErrors {
  name?: string
  season?: string
  status?: string
  winner?: string
  secondPlace?: string
  thirdPlace?: string
}

interface LeagueFormFieldsProps {
  league: LeagueData
  onChange: (updatedLeague: LeagueData) => void
  errors?: FormErrors
}

export const LeagueFormFields = ({ league, onChange, errors = {} }: LeagueFormFieldsProps) => {
  const handleChange = useCallback(
    (field: keyof LeagueData, value: string) => {
      onChange({
        ...league,
        [field]: value,
      })
    },
    [league, onChange]
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label htmlFor="league-name" className="block text-sm text-gray-300">
          League Name
        </label>
        <input
          id="league-name"
          type="text"
          value={league.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={`w-full bg-black/30 text-white border ${
            errors.name ? "border-red-500" : "border-white/10"
          } rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="league-season" className="block text-sm text-gray-300">
          Season
        </label>
        <input
          id="league-season"
          type="text"
          value={league.season}
          onChange={(e) => handleChange("season", e.target.value)}
          className={`w-full bg-black/30 text-white border ${
            errors.season ? "border-red-500" : "border-white/10"
          } rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
        />
        {errors.season && (
          <p className="text-xs text-red-500 mt-1">{errors.season}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="league-id" className="block text-sm text-gray-300">
          League ID
        </label>
        <input
          id="league-id"
          type="text"
          value={league.id}
          readOnly
          className="w-full bg-black/30 text-gray-400 border border-white/10 rounded-lg px-4 py-2.5 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500">League ID cannot be changed after creation</p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="league-status" className="block text-sm text-gray-300">
          Status
        </label>
        <select
          id="league-status"
          value={league.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className={`w-full bg-black/30 text-white border ${
            errors.status ? "border-red-500" : "border-white/10"
          } rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
        >
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        {errors.status && (
          <p className="text-xs text-red-500 mt-1">{errors.status}</p>
        )}
      </div>
      
      {league.status === "Completed" && (
        <>
          <div className="space-y-2">
            <label htmlFor="league-winner" className="block text-sm text-gray-300">
              Winner
            </label>
            <input
              id="league-winner"
              type="text"
              value={league.winner}
              onChange={(e) => handleChange("winner", e.target.value)}
              className={`w-full bg-black/30 text-white border ${
                errors.winner ? "border-red-500" : "border-white/10"
              } rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.winner && (
              <p className="text-xs text-red-500 mt-1">{errors.winner}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="league-runner-up" className="block text-sm text-gray-300">
              Runner Up
            </label>
            <input
              id="league-runner-up"
              type="text"
              value={league.secondPlace}
              onChange={(e) => handleChange("secondPlace", e.target.value)}
              className={`w-full bg-black/30 text-white border ${
                errors.secondPlace ? "border-red-500" : "border-white/10"
              } rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.secondPlace && (
              <p className="text-xs text-red-500 mt-1">{errors.secondPlace}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="league-third" className="block text-sm text-gray-300">
              Third Place
            </label>
            <input
              id="league-third"
              type="text"
              value={league.thirdPlace}
              onChange={(e) => handleChange("thirdPlace", e.target.value)}
              className={`w-full bg-black/30 text-white border ${
                errors.thirdPlace ? "border-red-500" : "border-white/10"
              } rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.thirdPlace && (
              <p className="text-xs text-red-500 mt-1">{errors.thirdPlace}</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
