"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LEVELS } from "@/lib/data/levels";

interface Props {
  show: boolean;
  level: number;
  onClose: () => void;
}

export default function LevelUpOverlay({ show, level, onClose }: Props) {
  const info = LEVELS.find((l) => l.level === level);

  useEffect(() => {
    if (show) {
      const t = setTimeout(onClose, 3500);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer"
          style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="text-center px-8 py-10 rounded-3xl border"
            style={{
              backgroundColor: "rgba(18,18,26,0.95)",
              borderColor: "rgba(167,139,250,0.5)",
              boxShadow: "0 0 60px rgba(139,92,246,0.3), 0 0 120px rgba(139,92,246,0.1)",
              maxWidth: "380px",
              width: "90vw",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="text-6xl mb-4"
            >
              ⚡
            </motion.div>
            <p className="text-sm font-mono mb-2" style={{ color: "var(--text-muted)" }}>
              LEVEL UP
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p
                className="text-6xl font-bold mb-3"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  color: "var(--xp-gold)",
                  textShadow: "0 0 30px rgba(251,191,36,0.6)",
                }}
              >
                {level}
              </p>
              <p
                className="text-2xl font-bold"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  color: "var(--accent-secondary)",
                  textShadow: "0 0 20px rgba(167,139,250,0.5)",
                }}
              >
                {info?.name}
              </p>
            </motion.div>
            <p className="text-xs mt-6" style={{ color: "var(--text-muted)" }}>
              klikni nebo počkej…
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
