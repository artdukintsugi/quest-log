"use client";

import { motion } from "framer-motion";
import KanyeQuote from "@/components/kanye/KanyeQuote";
import VibePalette from "@/components/kanye/VibePalette";
import HanhButton from "@/components/kanye/HanhButton";
import BeatStreak from "@/components/kanye/BeatStreak";
import LyricsPad from "@/components/kanye/LyricsPad";
import CombatLog from "@/components/kanye/CombatLog";
import FocusPlayer from "@/components/audio/FocusPlayer";
import AmbientPlayer from "@/components/audio/AmbientPlayer";
import SoundscapeMixer from "@/components/audio/SoundscapeMixer";
import SoundTest from "@/components/audio/SoundTest";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.35, delay, ease: "easeOut" as const },
});

export default function VibesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10">
      {/* Hero */}
      <motion.div {...fadeUp(0)} className="flex flex-col gap-2">
        <h1
          className="text-5xl font-black text-[var(--text-primary)] drop-shadow-[0_0_30px_var(--accent-glow)]"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          Vibes 🎵
        </h1>
        <p className="font-mono text-sm text-[var(--text-muted)]">
          Creative mode — music, lyrics, ambience, producer streak
        </p>
      </motion.div>

      {/* Top row: Quote + Palette + Hanh */}
      <motion.div {...fadeUp(0.05)} className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <KanyeQuote />
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <VibePalette />
          <HanhButton />
        </div>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <motion.div {...fadeUp(0.1)}>
            <BeatStreak />
          </motion.div>

          <motion.div {...fadeUp(0.15)}>
            <LyricsPad />
          </motion.div>

          <motion.div {...fadeUp(0.2)}>
            <CombatLog />
          </motion.div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <motion.div {...fadeUp(0.1)}>
            <FocusPlayer />
          </motion.div>

          <motion.div {...fadeUp(0.15)}>
            <AmbientPlayer />
          </motion.div>

          <motion.div {...fadeUp(0.2)}>
            <SoundscapeMixer />
          </motion.div>
        </div>
      </div>

      {/* Sound Test — full width */}
      <motion.div {...fadeUp(0.25)}>
        <SoundTest />
      </motion.div>

      {/* Footer flavor */}
      <motion.div {...fadeUp(0.3)} className="text-center">
        <p
          className="text-xs text-[var(--text-muted)] italic"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          &ldquo;Name one genius that ain&apos;t crazy.&rdquo; — Ye
        </p>
      </motion.div>
    </div>
  );
}
