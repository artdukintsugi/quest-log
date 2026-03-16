"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";

const PRESETS = [
  { label: "25 min", seconds: 25 * 60 },
  { label: "15 min", seconds: 15 * 60 },
  { label: "5 min",  seconds: 5 * 60 },
];

interface Props {
  onComplete?: () => void;
  questTitle?: string;
}

export default function PomodoroTimer({ onComplete, questTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState(0);
  const [remaining, setRemaining] = useState(PRESETS[0].seconds);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = PRESETS[preset].seconds;
  const pct = remaining / total;
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const dash = pct * circ;

  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");

  const reset = useCallback(() => {
    setRunning(false);
    setDone(false);
    setRemaining(PRESETS[preset].seconds);
  }, [preset]);

  useEffect(() => {
    reset();
  }, [preset, reset]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setDone(true);
            // Notify sound
            try {
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain); gain.connect(ctx.destination);
              osc.frequency.value = 880;
              gain.gain.setValueAtTime(0.3, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
              osc.start(); osc.stop(ctx.currentTime + 0.8);
            } catch {}
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200"
        style={{
          backgroundColor: open ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.06)",
          border: `1px solid ${open ? "rgba(139,92,246,0.35)" : "rgba(139,92,246,0.15)"}`,
          color: "var(--accent-secondary)",
        }}
      >
        <Timer size={13} />
        Pomodoro
        {running && (
          <span className="font-bold tabular-nums" style={{ color: "var(--xp-gold)" }}>
            {mins}:{secs}
          </span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 mt-2 z-50 rounded-2xl p-5 flex flex-col items-center gap-4 w-64"
            style={{
              background: "rgba(10,8,20,0.97)",
              border: "1px solid rgba(139,92,246,0.2)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 24px rgba(139,92,246,0.08)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Preset buttons */}
            <div className="flex gap-1.5">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => { setPreset(i); setRunning(false); setDone(false); }}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono transition-all"
                  style={{
                    backgroundColor: preset === i ? "rgba(139,92,246,0.2)" : "transparent",
                    border: `1px solid ${preset === i ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.1)"}`,
                    color: preset === i ? "var(--accent-secondary)" : "var(--text-muted)",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* SVG ring timer */}
            <div className="relative flex items-center justify-center">
              <svg width="96" height="96" className="-rotate-90">
                <circle cx="48" cy="48" r={radius} fill="none"
                  stroke="rgba(139,92,246,0.1)" strokeWidth="4" />
                <motion.circle
                  cx="48" cy="48" r={radius} fill="none"
                  stroke={done ? "#22c55e" : "url(#pomGrad)"}
                  strokeWidth="4" strokeLinecap="round"
                  animate={{ strokeDasharray: `${dash} ${circ}` }}
                  transition={{ duration: 0.5 }}
                  style={{ filter: `drop-shadow(0 0 6px ${done ? "rgba(34,197,94,0.5)" : "rgba(139,92,246,0.5)"})` }}
                />
                <defs>
                  <linearGradient id="pomGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-2xl font-bold font-mono tabular-nums"
                  style={{ color: done ? "var(--success)" : "var(--text-primary)", letterSpacing: "-0.05em" }}
                >
                  {mins}:{secs}
                </span>
                {done && <span className="text-[10px] mt-0.5" style={{ color: "var(--success)" }}>done ✓</span>}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRunning((r) => !r)}
                disabled={done}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-sm font-semibold transition-all"
                style={{
                  background: done ? "rgba(34,197,94,0.1)" : "rgba(139,92,246,0.15)",
                  border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(139,92,246,0.3)"}`,
                  color: done ? "var(--success)" : "var(--accent-secondary)",
                  opacity: done ? 0.6 : 1,
                }}
              >
                {running ? <Pause size={14} /> : <Play size={14} />}
                {running ? "Pauza" : "Start"}
              </button>
              <button
                onClick={reset}
                className="p-2 rounded-xl transition-all"
                style={{ backgroundColor: "rgba(100,116,139,0.1)", border: "1px solid rgba(100,116,139,0.15)", color: "var(--text-muted)" }}
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Quest complete prompt */}
            <AnimatePresence>
              {done && onComplete && (
                <motion.button
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={() => { onComplete(); setOpen(false); }}
                  className="w-full py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.1))",
                    border: "1px solid rgba(34,197,94,0.35)",
                    color: "var(--success)",
                  }}
                >
                  ✓ Dokončit quest
                </motion.button>
              )}
            </AnimatePresence>

            {questTitle && (
              <p className="text-[10px] text-center truncate w-full" style={{ color: "var(--text-muted)" }}>
                {questTitle}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
