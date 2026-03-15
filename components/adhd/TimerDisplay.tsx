"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SESSION_START_KEY = "evelyn-session-start";

const ARC_RADIUS = 36;
const ARC_CIRCUMFERENCE = 2 * Math.PI * ARC_RADIUS;
const MAX_MINUTES = 120; // 2 hours — full arc

function getColor(minutes: number): string {
  if (minutes < 30) return "#22c55e";   // green
  if (minutes < 60) return "#fbbf24";   // yellow
  if (minutes < 90) return "#f97316";   // orange
  return "#ef4444";                      // red
}

function getSessionStart(): number {
  if (typeof window === "undefined") return Date.now();
  const stored = localStorage.getItem(SESSION_START_KEY);
  if (!stored) {
    const now = Date.now();
    localStorage.setItem(SESSION_START_KEY, now.toString());
    return now;
  }
  return Number(stored);
}

export default function TimerDisplay() {
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    const startTime = getSessionStart();

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000 / 60);
      setMinutes(elapsed);
    };

    tick();
    const interval = setInterval(tick, 10_000); // update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const clampedMinutes = Math.min(minutes, MAX_MINUTES);
  const progress = clampedMinutes / MAX_MINUTES;
  const dashOffset = ARC_CIRCUMFERENCE * (1 - progress);
  const color = getColor(minutes);

  const displayText =
    minutes < 60
      ? `${minutes} min`
      : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

  return (
    <div
      className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl"
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      title={`Jsi tu ${displayText}`}
    >
      {/* Depleting arc SVG */}
      <div className="relative w-[40px] h-[40px] flex-shrink-0">
        <svg width="40" height="40" viewBox="0 0 80 80" className="rotate-[-90deg]">
          {/* Track */}
          <circle
            cx="40"
            cy="40"
            r={ARC_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="7"
          />
          {/* Progress arc */}
          <motion.circle
            cx="40"
            cy="40"
            r={ARC_RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={ARC_CIRCUMFERENCE}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 4px ${color}80)`,
            }}
          />
        </svg>
        {/* Center icon */}
        <div
          className="absolute inset-0 flex items-center justify-center text-[11px]"
          style={{ paddingTop: "2px" }}
        >
          ⏱
        </div>
      </div>

      {/* Text */}
      <div>
        <p className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
          Jsi tu
        </p>
        <p
          className="text-xs font-bold font-mono leading-tight"
          style={{ color }}
        >
          {displayText}
        </p>
      </div>
    </div>
  );
}
