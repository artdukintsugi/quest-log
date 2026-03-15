"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BeatStreakState {
  streak: number;
  lastDate: string | null;
  totalDays: number;
}

const STORAGE_KEY = "beat-streak";

function loadState(): BeatStreakState {
  if (typeof window === "undefined") return { streak: 0, lastDate: null, totalDays: 0 };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as BeatStreakState;
  } catch { /* ignore */ }
  return { streak: 0, lastDate: null, totalDays: 0 };
}

function saveState(state: BeatStreakState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayStr(): string {
  return new Date().toDateString();
}

function isYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toDateString();
}

export default function BeatStreak() {
  const [state, setState] = useState<BeatStreakState>({ streak: 0, lastDate: null, totalDays: 0 });
  const [justMarked, setJustMarked] = useState(false);
  const [popVisible, setPopVisible] = useState(false);

  useEffect(() => {
    setState(loadState());
  }, []);

  const today = todayStr();
  const alreadyMarked = state.lastDate === today;

  function markToday() {
    if (alreadyMarked) return;

    const prev = loadState();
    let newStreak = 1;

    if (prev.lastDate === today) {
      // Already done
      return;
    } else if (prev.lastDate && isYesterday(prev.lastDate)) {
      newStreak = prev.streak + 1;
    } else if (prev.lastDate === today) {
      newStreak = prev.streak;
    }

    const newState: BeatStreakState = {
      streak: newStreak,
      lastDate: today,
      totalDays: prev.totalDays + 1,
    };

    setState(newState);
    saveState(newState);
    setJustMarked(true);
    setPopVisible(true);
    setTimeout(() => setPopVisible(false), 2000);
  }

  const streakFire = state.streak >= 7 ? "🔥🔥🔥" : state.streak >= 3 ? "🔥🔥" : state.streak >= 1 ? "🔥" : "❄️";

  return (
    <div className="relative flex flex-col gap-3 rounded-xl border border-[var(--accent-primary)]/20 bg-[var(--bg-secondary)] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎹</span>
          <span className="font-mono text-sm font-bold text-[var(--text-primary)]">Producer Mode</span>
        </div>
        <span className="text-xs font-mono text-[var(--text-muted)]">
          celkem {state.totalDays} dní
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-3xl font-black text-[var(--accent-primary)] font-mono">
            {state.streak}
          </span>
          <span className="text-xs text-[var(--text-muted)] font-mono">dní streak {streakFire}</span>
        </div>

        <div className="flex-1 text-right">
          {alreadyMarked ? (
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-mono text-[var(--success)]">✓ Dnes splněno</span>
              <span className="text-xs text-[var(--text-muted)]">FL Studio otevřeno</span>
            </div>
          ) : (
            <motion.button
              onClick={markToday}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-lg border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 px-3 py-2 text-xs font-mono text-[var(--accent-secondary)] transition-all hover:bg-[var(--accent-primary)]/20"
            >
              🎹 FL Studio heute geöffnet
            </motion.button>
          )}
        </div>
      </div>

      {/* Streak milestone message */}
      {state.streak > 0 && (
        <div className="rounded-lg bg-[var(--bg-tertiary)] px-3 py-2 text-xs font-mono text-[var(--text-muted)]">
          {state.streak >= 30
            ? "🏆 Legendary. Ye would approve."
            : state.streak >= 14
            ? "🔥 Two weeks straight. You're built different."
            : state.streak >= 7
            ? "⚡ 7 days. That's a full album's worth of dedication."
            : state.streak >= 3
            ? "🎵 Getting in the zone. Keep pushing."
            : "🎹 Starting the journey. Every beat counts."}
        </div>
      )}

      {/* Pop animation on mark */}
      <AnimatePresence>
        {popVisible && (
          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <motion.span
              className="text-2xl font-black text-amber-400"
              initial={{ scale: 0.5, y: 0 }}
              animate={{ scale: 1.4, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              +1 {streakFire}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
