"use client";

import { useMemo } from "react";
import { UserState } from "@/lib/storage";

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  isActiveToday: boolean;
}

function toDateString(iso: string): string {
  return iso.split("T")[0]; // "YYYY-MM-DD"
}

function daysBetween(a: string, b: string): number {
  const msA = new Date(a).getTime();
  const msB = new Date(b).getTime();
  return Math.round(Math.abs(msA - msB) / 86_400_000);
}

/**
 * Derives streak data purely from questStates completedAt timestamps.
 * A "day" is active if at least one quest was completed (or a checkpoint
 * was ticked — checkpoints don't store timestamps so we rely on quest completions).
 */
export function computeStreak(questStates: UserState["questStates"]): StreakInfo {
  const today = new Date().toISOString().split("T")[0];

  // Collect all unique active days from quest completions
  const activeDaysSet = new Set<string>();
  for (const entry of Object.values(questStates)) {
    if (entry.completed && entry.completedAt) {
      activeDaysSet.add(toDateString(entry.completedAt));
    }
  }

  const activeDays = Array.from(activeDaysSet).sort(); // ascending

  if (activeDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: null, isActiveToday: false };
  }

  const lastActiveDate = activeDays[activeDays.length - 1];
  const isActiveToday = lastActiveDate === today;

  // Compute longest and current streak
  let longestStreak = 1;
  let maxRun = 1;
  let run = 1;

  for (let i = 1; i < activeDays.length; i++) {
    const diff = daysBetween(activeDays[i - 1], activeDays[i]);
    if (diff === 1) {
      run++;
      if (run > maxRun) maxRun = run;
    } else {
      run = 1;
    }
  }
  longestStreak = maxRun;

  // Current streak: count backwards from today (or yesterday if not active today)
  let currentStreak = 0;
  const anchor = isActiveToday ? today : lastActiveDate;

  for (let i = activeDays.length - 1; i >= 0; i--) {
    const expected = new Date(anchor);
    expected.setDate(expected.getDate() - currentStreak);
    const expectedStr = expected.toISOString().split("T")[0];
    if (activeDays[i] === expectedStr) {
      currentStreak++;
    } else {
      break;
    }
  }

  // If last active day was more than 1 day ago, streak is 0
  const daysSinceLastActive = daysBetween(lastActiveDate, today);
  if (daysSinceLastActive > 1) currentStreak = 0;

  return { currentStreak, longestStreak, lastActiveDate, isActiveToday };
}

export function useStreak(questStates: UserState["questStates"]): StreakInfo {
  return useMemo(() => computeStreak(questStates), [questStates]);
}
