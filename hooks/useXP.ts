"use client";

import { useMemo } from "react";
import { UserState } from "@/lib/storage";
import { getLevelInfo, LEVELS } from "@/lib/data/levels";

export interface XPInfo {
  totalXP: number;
  level: number;
  levelName: string;
  /** XP required for current level */
  currentLevelXP: number;
  /** XP required for next level */
  nextLevelXP: number;
  /** XP earned within the current level range */
  progressXP: number;
  /** XP needed to reach the next level from current level start */
  levelRangeXP: number;
  /** 0–1 fill fraction for the XP bar */
  progressFraction: number;
  /** True if at max level */
  isMaxLevel: boolean;
}

export function useXP(state: UserState): XPInfo {
  return useMemo(() => {
    const { current, next } = getLevelInfo(state.totalXP);
    const isMaxLevel = current.level === LEVELS[LEVELS.length - 1].level;
    const currentLevelXP = current.xp;
    const nextLevelXP = next.xp;
    const progressXP = state.totalXP - currentLevelXP;
    const levelRangeXP = nextLevelXP - currentLevelXP;
    const progressFraction = isMaxLevel
      ? 1
      : Math.min(1, progressXP / levelRangeXP);

    return {
      totalXP: state.totalXP,
      level: current.level,
      levelName: current.name,
      currentLevelXP,
      nextLevelXP,
      progressXP,
      levelRangeXP,
      progressFraction,
      isMaxLevel,
    };
  }, [state.totalXP, state.level]);
}
