import { db } from "@/lib/db";
import { startOfDay, differenceInDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export async function getStreakData(userId: string) {
  // Find all events for the user, ordered by date descending
  const events = await db.habitEvent.findMany({
    where: { userId },
    orderBy: { eventDate: "desc" },
  });

  // Calculate current streak
  // Current streak = days since last RELAPSE event.
  const lastRelapse = events.find((e) => e.type === "RELAPSE");

  const now = new Date();
  const istTime = toZonedTime(now, "Asia/Kolkata");
  const today = startOfDay(istTime);

  let currentStreak = 0;

  if (!lastRelapse) {
    // If no relapse ever, streak is from the first event (or 0 if no events)
    if (events.length > 0) {
      const firstEvent = events[events.length - 1];
      currentStreak = differenceInDays(today, firstEvent.eventDate) + 1; // +1 if today counts as Day 1
    }
  } else {
    // Streak is days since last relapse
    currentStreak = differenceInDays(today, lastRelapse.eventDate);
  }

  // Ensure current streak is never negative (e.g. if relapse is somehow in future)
  currentStreak = Math.max(0, currentStreak);

  // Calculate longest streak
  // We iterate through all events to find the longest gap between relapses
  let longestStreak = currentStreak;

  // Let's get all relapses sorted ascending
  const relapsesAsc = [...events].filter(e => e.type === "RELAPSE").sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
  
  if (relapsesAsc.length > 0) {
    // Check gap before first relapse
    const firstEvent = events[events.length - 1];
    if (firstEvent && firstEvent.eventDate < relapsesAsc[0].eventDate) {
      const gap = differenceInDays(relapsesAsc[0].eventDate, firstEvent.eventDate);
      longestStreak = Math.max(longestStreak, gap);
    }

    // Check gaps between relapses
    for (let i = 1; i < relapsesAsc.length; i++) {
      const gap = differenceInDays(relapsesAsc[i].eventDate, relapsesAsc[i - 1].eventDate) - 1; 
      longestStreak = Math.max(longestStreak, gap);
    }
  }

  // Determine current tree stage
  let treeStage = "🌱 Seed";
  if (currentStreak >= 3 && currentStreak < 7) treeStage = "🌱 Sprout";
  else if (currentStreak >= 7 && currentStreak < 14) treeStage = "🌿 Small plant";
  else if (currentStreak >= 14 && currentStreak < 30) treeStage = "🌳 Young tree";
  else if (currentStreak >= 30 && currentStreak < 60) treeStage = "🌳 Mature tree";
  else if (currentStreak >= 60 && currentStreak < 90) treeStage = "🌲 Large tree";
  else if (currentStreak >= 90) treeStage = "🌲 Fully developed tree";

  return {
    currentStreak,
    longestStreak,
    treeStage,
    events, // For calendar
  };
}
