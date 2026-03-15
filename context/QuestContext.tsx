"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  UserState,
  PlayerClass,
  loadState,
  saveState,
  getDefaultState,
} from "@/lib/storage";
import { QUESTS } from "@/lib/data/quests";
import { getLevelInfo } from "@/lib/data/levels";
import { ACHIEVEMENTS } from "@/lib/data/achievements";
import { getClassDef, getClassXPMultiplier } from "@/lib/data/classes";
import { computeSpecial } from "@/lib/data/special";
import { computeEarnedItems } from "@/hooks/useInventory";
import { computeDailyBonus } from "@/hooks/useDailyBonus";
import { computeStreak } from "@/hooks/useStreak";
import { kanyeSayQuestComplete, kanyeSayLevelUp, kanyeSayAchievement } from "@/lib/kanye-voice";

const COMBO_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

interface QuestContextType {
  state: UserState;
  completeCheckpoint: (questId: number, checkpointIndex: number, value: boolean) => void;
  completeQuest: (questId: number) => void;
  uncompleteQuest: (questId: number) => void;
  resetAll: () => void;
  selectClass: (cls: PlayerClass) => void;
  newlyUnlockedAchievements: string[];
  clearNewAchievements: () => void;
  justLeveledUp: boolean;
  newLevel: number;
  clearLevelUp: () => void;
  /** Current combo count and multiplier */
  comboCount: number;
  comboMultiplier: number;
}

const QuestContext = createContext<QuestContextType | null>(null);

function computeComboMultiplier(count: number): number {
  if (count >= 5) return 2;
  if (count >= 3) return 1.5;
  return 1;
}

/** Sync daily bonus into state if it needs to rotate */
function syncDailyBonus(s: UserState): UserState {
  const bonus = computeDailyBonus(s);
  if (bonus?.questId === s.dailyBonus?.questId && bonus?.date === s.dailyBonus?.date) {
    return s;
  }
  return { ...s, dailyBonus: bonus };
}

export function QuestProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserState>(getDefaultState);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState<string[]>([]);
  const [justLeveledUp, setJustLeveledUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  useEffect(() => {
    const loaded = loadState();
    // Sync daily bonus on mount
    const synced = syncDailyBonus(loaded);
    if (synced !== loaded) saveState(synced);
    setState(synced);
  }, []);

  const checkAchievements = useCallback(
    (s: UserState): string[] => {
      const unlocked: string[] = [];
      const completedIds = Object.entries(s.questStates)
        .filter(([, v]) => v.completed)
        .map(([k]) => Number(k));

      const check = (id: string, condition: boolean) => {
        if (condition && !s.achievements.includes(id)) unlocked.push(id);
      };

      check("first-quest", completedIds.length >= 1);
      check("xp-100", s.totalXP >= 100);
      check("xp-1000", s.totalXP >= 1000);
      check("level-5", s.level >= 5);
      check("level-10", s.level >= 10);
      check("goat", s.level >= 13);
      check("detox-30", completedIds.includes(171));
      check("maja-letter", completedIds.includes(199));
      check("completionist", completedIds.length >= 200);

      const act1Ids = QUESTS.filter((q) => q.act === 1).map((q) => q.id);
      check("first-act", act1Ids.every((id) => completedIds.includes(id)));

      const creativeIds = QUESTS.filter((q) => q.act === 4).map((q) => q.id);
      check(
        "creative-10",
        creativeIds.filter((id) => completedIds.includes(id)).length >= 10
      );

      const schoolIds = QUESTS.filter((q) => q.act === 3).map((q) => q.id);
      check(
        "school-all",
        schoolIds.every((id) => completedIds.includes(id))
      );

      return unlocked;
    },
    []
  );

  const completeCheckpoint = useCallback(
    (questId: number, checkpointIndex: number, value: boolean) => {
      setState((prev) => {
        const existing = prev.questStates[questId] ?? {
          completed: false,
          checkpoints: [],
        };
        const checkpoints = [...(existing.checkpoints ?? [])];
        checkpoints[checkpointIndex] = value;
        const next = {
          ...prev,
          questStates: {
            ...prev.questStates,
            [questId]: { ...existing, checkpoints },
          },
        };
        saveState(next);
        return next;
      });
    },
    []
  );

  const completeQuest = useCallback(
    (questId: number) => {
      setState((prev) => {
        if (prev.questStates[questId]?.completed) return prev;
        const quest = QUESTS.find((q) => q.id === questId);
        if (!quest) return prev;

        // ── Combo multiplier ──────────────────────────────────────────────
        const now = Date.now();
        const timeSinceLast = now - (prev.combo.lastQuestTime ?? 0);
        const inWindow = timeSinceLast <= COMBO_WINDOW_MS && prev.combo.lastQuestTime > 0;
        const newComboCount = inWindow ? prev.combo.count + 1 : 1;
        const comboMult = computeComboMultiplier(newComboCount);

        // ── Class bonus ──────────────────────────────────────────────────
        const classDef = getClassDef(prev.selectedClass);
        const classMult = getClassXPMultiplier(classDef, quest.tags, quest.act);

        // ── Daily bonus ──────────────────────────────────────────────────
        const today = new Date().toISOString().split("T")[0];
        const isDailyBonus =
          prev.dailyBonus?.questId === questId && prev.dailyBonus?.date === today;
        const dailyMult = isDailyBonus ? 2 : 1;

        // ── Final XP ─────────────────────────────────────────────────────
        const finalXP = Math.round(quest.xp * comboMult * classMult * dailyMult);

        const prevLevel = prev.level;
        const newTotalXP = prev.totalXP + finalXP;
        const levelInfo = getLevelInfo(newTotalXP);
        const curLevel = levelInfo.current.level;

        // ── SPECIAL attributes ───────────────────────────────────────────
        const newQuestStates = {
          ...prev.questStates,
          [questId]: {
            completed: true,
            completedAt: new Date().toISOString(),
            checkpoints: quest.checkpoints.map(() => true),
          },
        };
        const newSpecial = computeSpecial(newQuestStates, QUESTS);

        // ── Inventory ────────────────────────────────────────────────────
        // Streak check for streak-flame (done after we build next state)
        let next: UserState = {
          ...prev,
          totalXP: newTotalXP,
          level: curLevel,
          levelName: levelInfo.current.name,
          questStates: newQuestStates,
          special: newSpecial,
          combo: {
            count: newComboCount,
            lastQuestTime: now,
            multiplier: comboMult,
          },
          // Rotate daily bonus if the completed quest was the bonus
          dailyBonus: isDailyBonus
            ? computeDailyBonus({ ...prev, questStates: newQuestStates })
            : prev.dailyBonus,
        };

        // Check if 7-day streak earned
        const streakInfo = computeStreak(next.questStates);
        const hasStreakFlame = next.inventory.includes("streak-flame");
        if (streakInfo.currentStreak >= 7 && !hasStreakFlame) {
          next = { ...next, inventory: [...next.inventory, "streak-flame"] };
        }

        // Sync all earned inventory items
        const earnedItems = computeEarnedItems(next);
        const newInventory = Array.from(new Set([...next.inventory, ...earnedItems]));
        next = { ...next, inventory: newInventory };

        if (curLevel > prevLevel) {
          setJustLeveledUp(true);
          setNewLevel(curLevel);
          setTimeout(kanyeSayLevelUp, 800);
        } else {
          setTimeout(kanyeSayQuestComplete, 400);
          // Fire typed confetti after a short delay (allows sound to trigger first)
          import("@/lib/confetti").then(({ fireQuestComplete }) =>
            fireQuestComplete(quest.tags, quest.xp, quest.act)
          );
        }

        const unlocked = checkAchievements(next);
        if (unlocked.length > 0) {
          next.achievements = [...next.achievements, ...unlocked];
          setNewlyUnlockedAchievements((a) => [...a, ...unlocked]);
          setTimeout(kanyeSayAchievement, 1200);
        }

        saveState(next);
        return next;
      });
    },
    [checkAchievements]
  );

  const uncompleteQuest = useCallback((questId: number) => {
    setState((prev) => {
      if (!prev.questStates[questId]?.completed) return prev;
      const quest = QUESTS.find((q) => q.id === questId);
      if (!quest) return prev;

      const newTotalXP = Math.max(0, prev.totalXP - quest.xp);
      const levelInfo = getLevelInfo(newTotalXP);

      const newQuestStates = {
        ...prev.questStates,
        [questId]: {
          completed: false,
          checkpoints: prev.questStates[questId]?.checkpoints ?? [],
        },
      };
      const newSpecial = computeSpecial(newQuestStates, QUESTS);

      const next: UserState = {
        ...prev,
        totalXP: newTotalXP,
        level: levelInfo.current.level,
        levelName: levelInfo.current.name,
        questStates: newQuestStates,
        special: newSpecial,
      };
      saveState(next);
      return next;
    });
  }, []);

  const selectClass = useCallback((cls: PlayerClass) => {
    setState((prev) => {
      const next = { ...prev, selectedClass: cls };
      saveState(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    const fresh = getDefaultState();
    setState(fresh);
    saveState(fresh);
  }, []);

  const comboCount = state.combo.count;
  const comboMultiplier = state.combo.multiplier;

  return (
    <QuestContext.Provider
      value={{
        state,
        completeCheckpoint,
        completeQuest,
        uncompleteQuest,
        resetAll,
        selectClass,
        newlyUnlockedAchievements,
        clearNewAchievements: () => setNewlyUnlockedAchievements([]),
        justLeveledUp,
        newLevel,
        clearLevelUp: () => setJustLeveledUp(false),
        comboCount,
        comboMultiplier,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
}

export function useQuestContext() {
  const ctx = useContext(QuestContext);
  if (!ctx) throw new Error("useQuestContext must be inside QuestProvider");
  return ctx;
}
