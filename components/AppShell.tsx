"use client";

import { useEffect, useState, useCallback } from "react";
import { useQuestContext } from "@/context/QuestContext";
import ToastContainer, { ToastData } from "@/components/ui/Toast";
import LevelUpOverlay from "@/components/ui/LevelUpOverlay";
import { ACHIEVEMENTS } from "@/lib/data/achievements";
import { soundLevelUp, soundAchievement, soundComplete } from "@/lib/sounds";
import { fireAchievement } from "@/lib/confetti";
import CommandPalette from "@/components/ui/CommandPalette";
import KanyeEasterEgg from "@/components/ui/KanyeEasterEgg";
import { useAutoComplete } from "@/hooks/useAutoComplete";

// Apply accent color + dark mode from localStorage on every mount
function useGlobalTheme() {
  useEffect(() => {
    try {
      const settings = JSON.parse(localStorage.getItem("evelyn-settings") || "{}");
      const root = document.documentElement;
      if (settings.accentColor) root.style.setProperty("--accent-primary", settings.accentColor);
      if (settings.darkMode === "oled") root.style.setProperty("--bg-primary", "#000000");
      if (settings.highContrast) root.style.setProperty("--text-primary", "#ffffff");
      if (settings.glowEffects === false) root.classList.add("no-glow");
      if (settings.animationsEnabled === false) root.classList.add("reduce-motion");
    } catch { /* ignore */ }
  }, []);
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  useGlobalTheme();
  useAutoComplete();
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
      <KanyeEasterEgg />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <LevelUpOverlay
        show={justLeveledUp}
        level={newLevel}
        onClose={clearLevelUp}
      />
    </>
  );
}
