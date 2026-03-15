"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// #550 — The Friday Countdown: M5 Pro delivery on 2026-03-20
const DELIVERY = new Date("2026-03-20T09:00:00");

function getTimeLeft() {
  const diff = DELIVERY.getTime() - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, total: diff };
}

export default function M5Countdown() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!time) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-5 border text-center"
        style={{
          background: "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(139,92,246,0.08))",
          borderColor: "rgba(251,191,36,0.3)",
          boxShadow: "0 0 40px rgba(251,191,36,0.15)",
        }}
      >
        <div className="text-4xl mb-2">🎉</div>
        <p className="text-lg font-bold" style={{ color: "#fbbf24", fontFamily: "var(--font-fraunces)" }}>
          M5 Pro je tady!
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Nezapomeň dokončit quest #597.
        </p>
      </motion.div>
    );
  }

  const units = [
    { label: "DNÍ", value: time.d },
    { label: "HODIN", value: time.h },
    { label: "MINUT", value: time.m },
    { label: "SEKUND", value: time.s },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 border relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(251,191,36,0.04))",
        borderColor: "rgba(139,92,246,0.15)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(251,191,36,0.08), transparent 70%)" }}
      />

      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">💻</span>
        <p className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          M5 Pro Countdown
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {units.map(({ label, value }) => (
          <div key={label} className="text-center">
            <motion.div
              key={value}
              initial={{ opacity: 0.5, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-bold font-mono tabular-nums"
              style={{ color: label === "SEKUND" ? "var(--xp-gold)" : "var(--accent-secondary)" }}
            >
              {String(value).padStart(2, "0")}
            </motion.div>
            <div className="text-[9px] font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] font-mono mt-3" style={{ color: "var(--text-muted)" }}>
        20. března 2026 · MacBook Pro M5
      </p>
    </motion.div>
  );
}
