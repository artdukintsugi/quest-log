"use client";

import { useEffect, useState, useCallback } from "react";
import { useQuestContext } from "@/context/QuestContext";
import ToastContainer, { ToastData } from "@/components/ui/Toast";
import LevelUpOverlay from "@/components/ui/LevelUpOverlay";
import { ACHIEVEMENTS } from "@/lib/data/achievements";
import { soundLevelUp, soundAchievement, soundComplete } from "@/lib/sounds";
import { fireAchievement } from "@/lib/confetti";
import CommandPalette from "@/components/ui/CommandPalette";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { justLeveledUp, newLevel, clearLevelUp, newlyUnlockedAchievements, clearNewAchievements } = useQuestContext();
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((t: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { ...t, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Level up
  useEffect(() => {
    if (justLeveledUp) {
      soundLevelUp();
    }
  }, [justLeveledUp]);

  // Achievements
  useEffect(() => {
    if (newlyUnlockedAchievements.length === 0) return;
    newlyUnlockedAchievements.forEach((id) => {
      const ach = ACHIEVEMENTS.find((a) => a.id === id);
      if (!ach) return;
      soundAchievement();
      fireAchievement();
      addToast({
        type: "achievement",
        title: `${ach.name} odemčeno!`,
        subtitle: ach.description,
        icon: ach.icon,
      });
    });
    clearNewAchievements();
  }, [newlyUnlockedAchievements, addToast, clearNewAchievements]);

  return (
    <>
      {children}
      <CommandPalette />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <LevelUpOverlay
        show={justLeveledUp}
        level={newLevel}
        onClose={clearLevelUp}
      />
    </>
  );
}
