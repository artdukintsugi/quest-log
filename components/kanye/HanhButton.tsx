"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { soundHanh } from "@/lib/sounds";

export default function HanhButton() {
  const [flashing, setFlashing] = useState(false);
  const [showText, setShowText] = useState(false);

  function handleHanh() {
    soundHanh();

    // Confetti burst
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5, x: 0.5 },
      colors: ["#8b5cf6", "#a78bfa", "#fbbf24", "#f59e0b"],
      scalar: 1.2,
    });

    // Flash overlay
    setFlashing(true);
    setShowText(true);
    setTimeout(() => setFlashing(false), 200);
    setTimeout(() => setShowText(false), 1400);
  }

  return (
    <>
      {/* Flash overlay */}
      <AnimatePresence>
        {flashing && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[9999] bg-violet-500/20"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Floating HANH? text */}
      <AnimatePresence>
        {showText && (
          <motion.div
            className="pointer-events-none fixed left-1/2 top-1/3 z-[9998] -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 1, scale: 0.8, y: 0 }}
            animate={{ opacity: 0, scale: 1.6, y: -60 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <span
              className="text-5xl font-black text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              HANH? 🐻
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The button itself */}
      <motion.button
        onClick={handleHanh}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-2.5 text-amber-400 transition-all hover:border-amber-400/60 hover:bg-amber-950/40 hover:shadow-[0_0_16px_rgba(251,191,36,0.3)]"
      >
        <span className="text-xl">🐻</span>
        <span className="font-mono text-sm font-bold tracking-wider">HANH?</span>
      </motion.button>
    </>
  );
}
