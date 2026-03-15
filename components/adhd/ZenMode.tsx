"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ZenModeProps {
  questTitle: string;
  onExit: () => void;
}

export default function ZenMode({ questTitle, onExit }: ZenModeProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onExit]);

  return (
    <AnimatePresence>
      <motion.div
        key="zen-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
        style={{ backgroundColor: "#05040d" }}
      >
        {/* Close button */}
        <button
          onClick={onExit}
          className="absolute top-6 right-6 p-2 rounded-xl transition-colors hover:bg-white/5"
          style={{ color: "rgba(148,163,184,0.4)" }}
          aria-label="Exit Zen Mode"
        >
          <X size={20} />
        </button>

        {/* ESC hint */}
        <p
          className="absolute bottom-8 text-xs font-mono"
          style={{ color: "rgba(100,116,139,0.35)" }}
        >
          ESC pro exit
        </p>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="px-8 text-center max-w-2xl"
        >
          <p
            className="text-xs font-mono uppercase tracking-widest mb-8"
            style={{ color: "rgba(139,92,246,0.45)" }}
          >
            Zen Mode — focus
          </p>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: "#c4b5fd",
              textShadow: "0 0 60px rgba(139,92,246,0.5), 0 0 120px rgba(139,92,246,0.25)",
            }}
          >
            {questTitle}
          </h1>

          <motion.div
            className="mt-10 mx-auto h-px w-24"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)",
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
