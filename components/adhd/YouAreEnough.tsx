"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "evelyn-you-are-enough";

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function shouldShow(): boolean {
  if (typeof window === "undefined") return false;
  const last = localStorage.getItem(STORAGE_KEY);
  return last !== getTodayKey();
}

function markShown() {
  localStorage.setItem(STORAGE_KEY, getTodayKey());
}

const WORDS = [
  { text: "Evelyn.", delay: 0.3, size: "text-5xl md:text-7xl", pause: 1200 },
  { text: "Jsi dost.", delay: 1.8, size: "text-4xl md:text-6xl", pause: 1000 },
  { text: "Pokračuj.", delay: 3.2, size: "text-3xl md:text-5xl", pause: 0 },
];

interface YouAreEnoughProps {
  /** When true, forces the screen to show regardless of localStorage (for manual trigger) */
  forceShow?: boolean;
  onDismiss?: () => void;
}

export default function YouAreEnough({ forceShow = false, onDismiss }: YouAreEnoughProps) {
  const [show, setShow] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setShow(true);
      return;
    }
    if (shouldShow()) {
      markShown();
      setShow(true);
    }
  }, [forceShow]);

  useEffect(() => {
    if (!show) return;
    // Show button 1s after last word appears
    const t = setTimeout(() => setButtonVisible(true), 4800);
    return () => clearTimeout(t);
  }, [show]);

  const dismiss = () => {
    setShow(false);
    setButtonVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="you-are-enough"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[400] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#05040d" }}
        >
          {/* Particle background — subtle radial glows */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${80 + i * 40}px`,
                  height: `${80 + i * 40}px`,
                  left: `${10 + ((i * 37) % 80)}%`,
                  top: `${5 + ((i * 53) % 85)}%`,
                  background: `radial-gradient(circle, rgba(139,92,246,${0.06 + i * 0.015}) 0%, transparent 70%)`,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 4 + i * 0.7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
              />
            ))}
          </div>

          {/* Words */}
          <div className="relative z-10 text-center px-6 flex flex-col items-center gap-3">
            {WORDS.map((word, i) => (
              <motion.h1
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: word.delay, duration: 0.7, ease: "easeOut" }}
                className={`font-bold ${word.size} leading-tight`}
                style={{
                  fontFamily: "var(--font-fraunces)",
                  color: i === 0 ? "#c4b5fd" : i === 1 ? "#e2e8f0" : "#a78bfa",
                  textShadow:
                    i === 0
                      ? "0 0 60px rgba(139,92,246,0.6), 0 0 120px rgba(139,92,246,0.3)"
                      : i === 1
                      ? "0 0 40px rgba(226,232,240,0.2)"
                      : "0 0 40px rgba(139,92,246,0.4)",
                }}
              >
                {word.text}
              </motion.h1>
            ))}

            <AnimatePresence>
              {buttonVisible && (
                <motion.button
                  initial={{ opacity: 0, y: 16, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  onClick={dismiss}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-10 px-10 py-4 rounded-2xl text-base font-bold transition-all"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                    color: "white",
                    boxShadow: "0 0 40px rgba(139,92,246,0.45), 0 8px 24px rgba(0,0,0,0.5)",
                    fontFamily: "var(--font-outfit)",
                  }}
                >
                  Let&apos;s go 💜
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
