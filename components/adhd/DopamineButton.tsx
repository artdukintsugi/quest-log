"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const OPTIONS = [
  {
    id: "kanye",
    emoji: "🎵",
    label: "Kanye",
    sublabel: "POWER",
    action: "link",
    url: "https://www.youtube.com/results?search_query=Kanye+West+POWER",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.35)",
  },
  {
    id: "celeste",
    emoji: "🎮",
    label: "Celeste OST",
    sublabel: "Confronting Myself",
    action: "link",
    url: "https://www.youtube.com/results?search_query=Celeste+Confronting+Myself+OST",
    color: "#67e8f9",
    glow: "rgba(103,232,249,0.35)",
  },
  {
    id: "maja",
    emoji: "💜",
    label: "Mája moment",
    sublabel: "Pro tebe",
    action: "message",
    message: "Mája tě má ráda. Jsi dost. 💜",
    color: "#c084fc",
    glow: "rgba(192,132,252,0.45)",
  },
] as const;

export default function DopamineButton() {
  const [open, setOpen] = useState(false);
  const [majaMessage, setMajaMessage] = useState(false);

  const handleOption = (opt: (typeof OPTIONS)[number]) => {
    if (opt.action === "link") {
      window.open(opt.url, "_blank", "noopener,noreferrer");
      setOpen(false);
    } else if (opt.action === "message") {
      setMajaMessage(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setMajaMessage(false);
  };

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
        transition={{
          rotate: { duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 6 },
        }}
        className="fixed bottom-24 right-4 z-[100] w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg lg:bottom-6"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #c084fc)",
          boxShadow: "0 0 20px rgba(192,132,252,0.5), 0 4px 16px rgba(0,0,0,0.4)",
        }}
        title="Emergency Dopamine"
        aria-label="Emergency Dopamine Button"
      >
        🎵
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="dopa-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300]"
              style={{ backgroundColor: "rgba(5,4,13,0.95)" }}
              onClick={handleClose}
            />

            <motion.div
              key="dopa-content"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 z-[310] flex flex-col items-center justify-center px-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-2.5 rounded-xl transition-colors hover:bg-white/10 z-10"
                style={{ color: "rgba(148,163,184,0.5)" }}
              >
                <X size={24} />
              </button>

              {majaMessage ? (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center max-w-sm"
                >
                  <motion.div
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-6xl mb-6"
                  >
                    💜
                  </motion.div>
                  <p
                    className="text-3xl font-bold leading-snug"
                    style={{
                      fontFamily: "var(--font-fraunces)",
                      color: "#c084fc",
                      textShadow: "0 0 40px rgba(192,132,252,0.5)",
                    }}
                  >
                    Mája tě má ráda.
                  </p>
                  <p
                    className="text-2xl font-bold mt-3"
                    style={{
                      fontFamily: "var(--font-fraunces)",
                      color: "#e2e8f0",
                    }}
                  >
                    Jsi dost. 💜
                  </p>
                  <motion.button
                    onClick={handleClose}
                    whileTap={{ scale: 0.96 }}
                    className="mt-10 px-8 py-3 rounded-2xl text-base font-bold transition-all"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #c084fc)",
                      color: "white",
                      boxShadow: "0 0 30px rgba(192,132,252,0.4)",
                    }}
                  >
                    Díky 💜
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="text-center mb-10"
                  >
                    <p
                      className="text-xs font-mono uppercase tracking-widest mb-2"
                      style={{ color: "rgba(139,92,246,0.6)" }}
                    >
                      Emergency Mode
                    </p>
                    <h2
                      className="text-2xl font-bold"
                      style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
                    >
                      Co potřebuješ teď?
                    </h2>
                  </motion.div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                    {OPTIONS.map((opt, i) => (
                      <motion.button
                        key={opt.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + i * 0.06 }}
                        whileHover={{ scale: 1.04, y: -4 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleOption(opt)}
                        className="flex-1 py-6 px-5 rounded-2xl flex flex-col items-center gap-3 border transition-all"
                        style={{
                          backgroundColor: `${opt.color}0d`,
                          borderColor: `${opt.color}30`,
                          boxShadow: `0 0 24px ${opt.glow}`,
                        }}
                      >
                        <span className="text-4xl">{opt.emoji}</span>
                        <div className="text-center">
                          <p
                            className="font-bold text-base"
                            style={{ color: opt.color }}
                          >
                            {opt.label}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {opt.sublabel}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
