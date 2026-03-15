"use client";

import { useMemo } from "react";
import { UserState, DailyBonus } from "@/lib/storage";
import { QUESTS } from "@/lib/data/quests";

const DAILY_BONUS_MULTIPLIER = 2;

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Deterministically picks a daily bonus quest for a given date string.
 * Uses a simple hash of the date so the same quest is always chosen on the same day.
 */
function pickDailyQuestId(
  date: string,
  questStates: UserState["questStates"]
): number | null {
  const incomplete = QUESTS.filter((q) => !questStates[q.id]?.completed);
  if (incomplete.length === 0) return null;

  // Simple hash of the date to pick a consistent index
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (hash * 31 + date.charCodeAt(i)) >>> 0;
  }
  const idx = hash % incomplete.length;
  return incomplete[idx].id;
}

export interface DailyBonusInfo {
  bonus: DailyBonus | null;
  /** Whether the bonus quest is the given questId */
  isBonusQuest: (questId: number) => boolean;
  /** XP multiplier for bonus quest (2x) */
  multiplier: number;
}

/**
 * Computes today's daily bonus quest.
 * Returns the bonus state to be stored (if it needs rotating) and helper functions.
 */
export function computeDailyBonus(state: UserState): DailyBonus | null {
  const today = todayString();
  if (state.dailyBonus && state.dailyBonus.date === today) {
    // Verify the quest is still incomplete; if completed, re-roll
    if (!state.questStates[state.dailyBonus.questId]?.completed) {
      return state.dailyBonus;
    }
  }
  const questId = pickDailyQuestId(today, state.questStates);
  if (questId === null) return null;
  return { questId, date: today };
}

export function useDailyBonus(state: UserState): DailyBonusInfo {
  const bonus = useMemo(() => computeDailyBonus(state), [state]);

  return {
    bonus,
    isBonusQuest: (questId: number) => bonus?.questId === questId,
    multiplier: DAILY_BONUS_MULTIPLIER,
  };
}
