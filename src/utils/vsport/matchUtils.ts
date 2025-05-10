
import { VSportTrackerMatch } from "@/types/vsport";
import { toast } from "sonner";

/**
 * Updates match statuses based on current time
 */
export const updateMatchStatuses = (matches: VSportTrackerMatch[]): VSportTrackerMatch[] => {
  const now = new Date();
  
  return matches.map(match => {
    const matchTime = new Date(match.kickoff);
    const timeDiffMinutes = (now.getTime() - matchTime.getTime()) / 60000;
    
    // Match not started yet but less than 5 minutes away - betting open
    if (match.status === 'upcoming' && timeDiffMinutes > -5 && timeDiffMinutes <= 0) {
      return {...match, status: 'betting_open' as const};
    } 
    // Match should be in progress
    else if ((match.status === 'betting_open' || match.status === 'upcoming') && timeDiffMinutes > 0) {
      // Generate random scores for matches that are starting
      const homeScore = match.homeScore || 0;
      const awayScore = match.awayScore || 0;
      
      return {
        ...match, 
        status: 'in_progress' as const,
        homeScore,
        awayScore
      };
    } 
    // Match completed (more than 4 minutes after kickoff)
    else if (match.status === 'in_progress' && timeDiffMinutes > 4) {
      // Generate final scores if not present
      const homeScore = match.homeScore !== undefined ? match.homeScore : Math.floor(Math.random() * 4);
      const awayScore = match.awayScore !== undefined ? match.awayScore : Math.floor(Math.random() * 3);
      
      return {
        ...match, 
        status: 'completed' as const,
        homeScore,
        awayScore
      };
    }
    // In progress matches may get score updates
    else if (match.status === 'in_progress' && Math.random() > 0.7) {
      // 30% chance of score change for in progress matches
      const homeScore = (match.homeScore || 0) + (Math.random() > 0.7 ? 1 : 0);
      const awayScore = (match.awayScore || 0) + (Math.random() > 0.8 ? 1 : 0);
      
      return {...match, homeScore, awayScore};
    }
    
    // No changes needed
    return match;
  });
};

/**
 * Returns a badge component config based on match status
 */
export const getMatchStatusConfig = (status: VSportTrackerMatch['status']) => {
  switch (status) {
    case 'upcoming':
      return { label: "Upcoming", classes: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
    case 'betting_open':
      return { label: "Betting Open", classes: "bg-green-500/10 text-green-400 border-green-500/20" };
    case 'in_progress':
      return { label: "In Progress", classes: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    case 'completed':
      return { label: "Completed", classes: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
    default:
      return { label: "", classes: "" };
  }
};

/**
 * Format date to time string
 */
export const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Calculate time difference from now
 */
export const getTimeDifference = (date: Date) => {
  const now = new Date();
  const diff = Math.floor((date.getTime() - now.getTime()) / 1000);
  
  if (diff < 0) return 'Started';
  
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

/**
 * Get a suitable color class based on odds value
 */
export const getOddsColorClass = (odds: number): string => {
  if (odds < 1.5) return "text-red-400"; // Very low odds (high probability)
  if (odds < 2.0) return "text-orange-400"; // Low odds
  if (odds < 3.0) return "text-yellow-400"; // Medium odds
  if (odds < 5.0) return "text-green-400"; // High odds
  return "text-blue-400"; // Very high odds
};

/**
 * Calculate match time elapsed in minutes
 */
export const getMatchTimeElapsed = (kickoff: Date): string => {
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - kickoff.getTime()) / 60000);
  
  if (diffMinutes < 0) return "Not started";
  if (diffMinutes > 90) return "Full time";
  
  return `${diffMinutes}'`;
};
