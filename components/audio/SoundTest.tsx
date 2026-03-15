"use client";

import { motion } from "framer-motion";
import {
  soundTick,
  soundComplete,
  soundLevelUp,
  soundAchievement,
  soundError,
  soundCheckpoint,
  soundHanh,
} from "@/lib/sounds";

interface SoundButton {
  label: string;
  emoji: string;
  fn: () => void;
  description: string;
}

const SOUNDS: SoundButton[] = [
  { label: "Tick", emoji: "✓", fn: soundTick, description: "800Hz sine, 80ms" },
  { label: "Checkpoint", emoji: "📍", fn: soundCheckpoint, description: "Pentatonic cycle" },
  { label: "Complete", emoji: "🎉", fn: soundComplete, description: "C-E-G arpeggio" },
  { label: "Level Up", emoji: "🚀", fn: soundLevelUp, description: "Ascending fanfare" },
  { label: "Achievement", emoji: "🏆", fn: soundAchievement, description: "Sparkle rising" },
  { label: "Error", emoji: "⚠️", fn: soundError, description: "Descending glitch" },
  { label: "Hanh?", emoji: "🐻", fn: soundHanh, description: "Ye descending tone" },
];

export default function SoundTest() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--accent-primary)]/20 bg-[var(--bg-secondary)] p-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-bold text-[var(--text-primary)]">Sound Test Panel</span>
        <span className="text-xs font-mono text-[var(--text-muted)]">— click to preview</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {SOUNDS.map((s) => (
          <motion.button
            key={s.label}
            onClick={s.fn}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.93 }}
            className="flex flex-col items-start gap-1 rounded-lg border border-[var(--accent-primary)]/20 bg-[var(--bg-tertiary)] px-3 py-2.5 text-left transition-all hover:border-[var(--accent-primary)]/50 hover:bg-[var(--accent-primary)]/10"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-base">{s.emoji}</span>
              <span className="font-mono text-xs font-bold text-[var(--text-primary)]">{s.label}</span>
            </div>
            <span className="font-mono text-xs text-[var(--text-muted)]">{s.description}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
