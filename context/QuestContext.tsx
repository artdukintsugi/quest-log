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
  loadState,
  saveState,
  getDefaultState,
} from "@/lib/storage";
import { QUESTS } from "@/lib/data/quests";
import { getLevelInfo } from "@/lib/data/levels";
import { ACHIEVEMENTS } from "@/lib/data/achievements";

interface QuestContextType {
  state: UserState;
  completeCheckpoint: (questId: number, checkpointIndex: number, value: boolean) => void;
  completeQuest: (questId: number) => void;
  uncompleteQuest: (questId: number) => void;
  resetAll: () => void;
  newlyUnlockedAchievements: string[];
  clearNewAchievements: () => void;
  justLeveledUp: boolean;
  newLevel: number;
  clearLevelUp: () => void;
}

const QuestContext = createContext<QuestContextType | null>(null);

export function QuestProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserState>(getDefaultState);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState<string[]>([]);
  const [justLeveledUp, setJustLeveledUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  useEffect(() => {
    setState(loadState());
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

        const prevLevel = prev.level;
        const newTotalXP = prev.totalXP + quest.xp;
        const levelInfo = getLevelInfo(newTotalXP);
        const curLevel = levelInfo.current.level;

        const next: UserState = {
          ...prev,
          totalXP: newTotalXP,
          level: curLevel,
          levelName: levelInfo.current.name,
          questStates: {
            ...prev.questStates,
            [questId]: {
              completed: true,
              completedAt: new Date().toISOString(),
              checkpoints: quest.checkpoints.map(() => true),
            },
          },
        };

        if (curLevel > prevLevel) {
          setJustLeveledUp(true);
          setNewLevel(curLevel);
        }

        const unlocked = checkAchievements(next);
        if (unlocked.length > 0) {
          next.achievements = [...next.achievements, ...unlocked];
          setNewlyUnlockedAchievements((a) => [...a, ...unlocked]);
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

      const next: UserState = {
        ...prev,
        totalXP: newTotalXP,
        level: levelInfo.current.level,
        levelName: levelInfo.current.name,
        questStates: {
          ...prev.questStates,
          [questId]: {
            completed: false,
            checkpoints: prev.questStates[questId]?.checkpoints ?? [],
          },
        },
      };
      saveState(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    const fresh = getDefaultState();
    setState(fresh);
    saveState(fresh);
  }, []);

  return (
    <QuestContext.Provider
      value={{
        state,
        completeCheckpoint,
        completeQuest,
        uncompleteQuest,
        resetAll,
        newlyUnlockedAchievements,
        clearNewAchievements: () => setNewlyUnlockedAchievements([]),
        justLeveledUp,
        newLevel,
        clearLevelUp: () => setJustLeveledUp(false),
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
