"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface Med {
  id: string;
  emoji: string;
  label: string;
  color: string;
  glow: string;
}

const MEDS: Med[] = [
  { id: "venlafaxin", emoji: "💊", label: "Venlafaxin", color: "#a78bfa", glow: "rgba(167,139,250,0.4)" },
  { id: "trittico", emoji: "💜", label: "Trittico", color: "#c084fc", glow: "rgba(192,132,252,0.4)" },
  { id: "progesteron", emoji: "🌸", label: "Progesteron", color: "#f9a8d4", glow: "rgba(249,168,212,0.4)" },
  { id: "neofollin", emoji: "💉", label: "Neofollin", color: "#67e8f9", glow: "rgba(103,232,249,0.35)" },
  { id: "lamotrigin", emoji: "⚡", label: "Lamotrigin", color: "#fbbf24", glow: "rgba(251,191,36,0.4)" },
];

const MEDS_STORAGE_KEY = "evelyn-meds-buff";

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function loadMedsState(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(MEDS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { date: string; taken: Record<string, boolean> };
    if (parsed.date !== getTodayKey()) return {};
    return parsed.taken;
  } catch {
    return {};
  }
}

function saveMedsState(taken: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    MEDS_STORAGE_KEY,
    JSON.stringify({ date: getTodayKey(), taken })
  );
}

export default function MedsBuff() {
  const [taken, setTaken] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setTaken(loadMedsState());

    // Reset at midnight
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const timeout = setTimeout(() => {
      setTaken({});
      saveMedsState({});
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  const toggle = useCallback((id: string) => {
    setTaken((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveMedsState(next);
      return next;
    });
  }, []);

  const takenCount = MEDS.filter((m) => taken[m.id]).length;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span
        className="text-[10px] font-mono mr-1"
        style={{ color: "var(--text-muted)" }}
      >
        Léky ({takenCount}/{MEDS.length})
      </span>
      {MEDS.map((med) => {
        const active = !!taken[med.id];
        return (
          <motion.button
            key={med.id}
            onClick={() => toggle(med.id)}
            whileTap={{ scale: 0.9 }}
            title={`${med.label} — ${active ? "vzato ✓" : "nevzato"}`}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono transition-all duration-200"
            style={{
              backgroundColor: active
                ? `${med.color}18`
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${active ? med.color + "50" : "rgba(255,255,255,0.06)"}`,
              color: active ? med.color : "rgba(100,116,139,0.5)",
              boxShadow: active ? `0 0 8px ${med.glow}` : "none",
              opacity: active ? 1 : 0.55,
            }}
          >
            <span>{med.emoji}</span>
            <span className="hidden sm:inline">{med.label}</span>
            {active && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px]"
              >
                ✓
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
