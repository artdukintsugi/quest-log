"use client";

import { useEffect } from "react";
import { loadState, saveState } from "@/lib/storage";
import { getLevelInfo } from "@/lib/data/levels";
import { QUESTS } from "@/lib/data/quests";

// Quest IDs that are already implemented in the codebase
// Marking them done automatically so they show up as completed
const IMPLEMENTED_QUEST_IDS = [
  507,  // Vercel Build Check ✓
  509,  // Favicon Generator ✓ (app/icon.tsx)
  510,  // Pre-flight Logic ✓ (export/import JSON works)
  513,  // Local Storage Cleanup Script ✓ (reset in settings)
  514,  // Skeleton Screens ✓ (SkeletonCard.tsx)
  519,  // PWA Manifest ✓ (app/manifest.ts)
  520,  // Custom Cursor ✓ (globals.css)
  521,  // Performance Logging ✓ (sidebar shows XP/day)
  523,  // Confetti Presets ✓ (per quest type)
  524,  // Global Shortcuts ✓ (CommandPalette Ctrl+K)
  531,  // Color Palette Variables ✓ (all CSS vars)
  537,  // Scroll-to-Top Button ✓ (ScrollToTop.tsx)
  538,  // Quest Search Highlighting ✓ (Highlight.tsx)
  540,  // Achievement Toast Notifications ✓ (ToastContainer)
  549,  // Digital Kanye Easter Egg ✓ (KanyeEasterEgg.tsx)
  550,  // The Friday Countdown ✓ (M5Countdown.tsx)
];

const DONE_KEY = "auto-complete-done-v1";

export function useAutoComplete() {
  useEffect(() => {
    if (localStorage.getItem(DONE_KEY)) return;

    const state = loadState();
    let changed = false;
    const now = new Date().toISOString();

    for (const id of IMPLEMENTED_QUEST_IDS) {
      if (state.questStates[id]?.completed) continue;
      const quest = QUESTS.find((q) => q.id === id);
      if (!quest) continue;

      state.questStates[id] = {
        completed: true,
        completedAt: now,
        checkpoints: quest.checkpoints.map(() => true),
      };
      state.totalXP += quest.xp;
      changed = true;
    }

    if (changed) {
      const levelInfo = getLevelInfo(state.totalXP);
      state.level = levelInfo.current.level;
      state.levelName = levelInfo.current.name;
      saveState(state);
      localStorage.setItem(DONE_KEY, "1");
      window.location.reload();
    } else {
      localStorage.setItem(DONE_KEY, "1");
    }
  }, []);
}
