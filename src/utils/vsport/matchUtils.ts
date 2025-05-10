
import { VSportTrackerMatch } from "@/types/vsport";
import { toast } from "sonner";

/**
 * Updates match statuses based on current time
 */
export const updateMatchStatuses = (matches: VSportTrackerMatch[]): VSportTrackerMatch[] => {
  const now = new Date();
  
  return matches.map(match => {
    const matchTime = new Date(match.kickoff);
    
    if (match.status === 'betting_open' && matchTime <= now) {
      return {...match, status: 'in_progress' as const};
    } else if (match.status === 'in_progress' && (now.getTime() - matchTime.getTime()) > 240000) {
      // 4 minutes after kickoff, match is completed
      return {
        ...match, 
        status: 'completed' as const,
        homeScore: Math.floor(Math.random() * 4),
        awayScore: Math.floor(Math.random() * 3)
      };
    }
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
