"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, RotateCcw, Timer } from "lucide-react";
import { useFocusTimer, TIMER_PRESETS } from "@/hooks/useFocusTimer";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CircularProgress({ progress }: { progress: number }) {
  const offset = CIRCUMFERENCE * (1 - progress);
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="rotate-[-90deg]">
      {/* Track */}
      <circle
        cx="70"
        cy="70"
        r={RADIUS}
        fill="none"
        stroke="rgba(139,92,246,0.1)"
        strokeWidth="8"
      />
      {/* Progress */}
      <circle
        cx="70"
        cy="70"
        r={RADIUS}
        fill="none"
        stroke="url(#timerGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 1s linear",
          filter: "drop-shadow(0 0 6px rgba(139,92,246,0.5))",
        }}
      />
      <defs>
        <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function FocusTimer() {
  const [open, setOpen] = useState(false);
  const {
    preset,
    selectPreset,
    timerState,
    displayTime,
    progress,
    start,
    pause,
    resume,
    reset,
  } = useFocusTimer();

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-24 right-20 z-[100] w-12 h-12 rounded-full flex items-center justify-center shadow-lg lg:bottom-6"
        style={{
          background: "linear-gradient(135deg, #1e1040, #2d1b6e)",
          border: "1px solid rgba(139,92,246,0.35)",
          boxShadow: "0 0 16px rgba(139,92,246,0.3), 0 4px 16px rgba(0,0,0,0.4)",
          color: "var(--accent-secondary)",
        }}
        title="Focus Timer"
        aria-label="Open Focus Timer"
      >
        <Timer size={20} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="timer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="timer-panel"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="fixed z-[210] bottom-36 right-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:right-8 w-72 rounded-2xl p-6 border"
              style={{
                backgroundColor: "rgba(14,10,28,0.97)",
                borderColor: "rgba(139,92,246,0.2)",
                boxShadow: "0 0 40px rgba(139,92,246,0.18), 0 24px 48px rgba(0,0,0,0.5)",
                backdropFilter: "blur(24px)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3
                  className="text-sm font-bold"
                  style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
                >
                  Focus Timer
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Preset selector */}
              <div className="grid grid-cols-4 gap-1.5 mb-6">
                {TIMER_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => selectPreset(p)}
                    disabled={timerState === "running"}
                    className="py-1.5 rounded-lg text-[10px] font-mono transition-all border"
                    style={{
                      backgroundColor:
                        preset.label === p.label
                          ? "rgba(139,92,246,0.2)"
                          : "rgba(255,255,255,0.03)",
                      borderColor:
                        preset.label === p.label
                          ? "rgba(139,92,246,0.45)"
                          : "rgba(255,255,255,0.05)",
                      color:
                        preset.label === p.label
                          ? "var(--accent-secondary)"
                          : "var(--text-muted)",
                    }}
                  >
                    {p.emoji}
                    <br />
                    {p.minutes}m
                  </button>
                ))}
              </div>

              {/* Circular progress */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <CircularProgress progress={timerState === "idle" ? 0 : progress} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-2xl font-bold font-mono"
                      style={{
                        color: timerState === "done" ? "var(--success)" : "var(--text-primary)",
                        textShadow:
                          timerState === "done"
                            ? "0 0 20px rgba(34,197,94,0.5)"
                            : "0 0 16px rgba(139,92,246,0.3)",
                      }}
                    >
                      {timerState === "done" ? "✓" : displayTime}
                    </span>
                    <span className="text-[10px] font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {preset.emoji} {preset.label}
                    </span>
                  </div>
                </div>

                {timerState === "done" && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm mt-3 text-center"
                    style={{ color: "var(--success)" }}
                  >
                    Skvělá práce! 🎉
                  </motion.p>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                {timerState === "idle" && (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={start}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                      color: "white",
                      boxShadow: "0 0 16px var(--accent-glow)",
                    }}
                  >
                    <Play size={14} /> Start
                  </motion.button>
                )}
                {timerState === "running" && (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={pause}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 transition-all"
                    style={{
                      borderColor: "rgba(139,92,246,0.25)",
                      color: "var(--accent-secondary)",
                      backgroundColor: "rgba(139,92,246,0.07)",
                    }}
                  >
                    <Pause size={14} /> Pauza
                  </motion.button>
                )}
                {timerState === "paused" && (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={resume}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                      color: "white",
                      boxShadow: "0 0 16px var(--accent-glow)",
                    }}
                  >
                    <Play size={14} /> Pokračovat
                  </motion.button>
                )}
                {timerState === "done" && (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={reset}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                      color: "white",
                    }}
                  >
                    <RotateCcw size={14} /> Reset
                  </motion.button>
                )}
                {(timerState === "running" || timerState === "paused") && (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={reset}
                    className="p-2.5 rounded-xl border transition-all"
                    style={{
                      borderColor: "rgba(100,116,139,0.2)",
                      color: "var(--text-muted)",
                    }}
                    title="Reset"
                  >
                    <RotateCcw size={15} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
