"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const SESSION_START_KEY = "evelyn-session-start";
const BREAK_DISMISSED_KEY = "evelyn-break-dismissed";
const ACTIVE_THRESHOLD_MS = 60 * 60 * 1000; // 60 minutes
const CHECK_INTERVAL_MS = 30 * 1000; // check every 30s

export default function BreakReminder() {
  const [show, setShow] = useState(false);
  const [pauseLabel, setPauseLabel] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize session start if not set
    if (!localStorage.getItem(SESSION_START_KEY)) {
      localStorage.setItem(SESSION_START_KEY, Date.now().toString());
    }

    const check = () => {
      const start = Number(localStorage.getItem(SESSION_START_KEY) ?? "0");
      const dismissed = localStorage.getItem(BREAK_DISMISSED_KEY);
      const elapsed = Date.now() - start;

      if (elapsed >= ACTIVE_THRESHOLD_MS && dismissed !== getTodayHourKey()) {
        setShow(true);
      }
    };

    check();
    intervalRef.current = setInterval(check, CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function getTodayHourKey() {
    const now = new Date();
    return `${now.toISOString().split("T")[0]}-${now.getHours()}`;
  }

  const dismiss = () => {
    localStorage.setItem(BREAK_DISMISSED_KEY, getTodayHourKey());
    setShow(false);
    setPauseLabel(null);
  };

  const takePause = (label: string, minutes: number) => {
    setPauseLabel(label);
    // Reset session start so reminder appears again after returning
    const futureStart = Date.now() + minutes * 60 * 1000;
    localStorage.setItem(SESSION_START_KEY, futureStart.toString());
    localStorage.setItem(BREAK_DISMISSED_KEY, getTodayHourKey());
    setTimeout(() => {
      setShow(false);
      setPauseLabel(null);
    }, 1800);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            key="break-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[180] bg-black/30"
          />
          <motion.div
            key="break-card"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="fixed z-[190] top-6 left-1/2 -translate-x-1/2 w-[340px] rounded-2xl p-6 border"
            style={{
              backgroundColor: "rgba(12,10,24,0.97)",
              borderColor: "rgba(139,92,246,0.2)",
              boxShadow: "0 0 40px rgba(139,92,246,0.15), 0 20px 40px rgba(0,0,0,0.5)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Dismiss X */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <X size={15} />
            </button>

            {pauseLabel ? (
              <div className="text-center py-2">
                <p className="text-2xl mb-2">🌱</p>
                <p style={{ color: "var(--text-primary)" }} className="font-semibold">
                  {pauseLabel} spuštěna
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  Odpočívej. Vrátíme se za chvíli.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-5 text-center">
                  <span className="text-2xl">🌱</span>
                  <h3
                    className="text-base font-bold mt-2 mb-1"
                    style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
                  >
                    Jsi tu už hodinu
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Dej si pauzu — mozek to ocení.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => takePause("5min pauza", 5)}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                      color: "white",
                      boxShadow: "0 0 14px var(--accent-glow)",
                    }}
                  >
                    🌿 5 min pauza
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => takePause("15min pauza", 15)}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold border transition-all"
                    style={{
                      borderColor: "rgba(139,92,246,0.2)",
                      color: "var(--accent-secondary)",
                      backgroundColor: "rgba(139,92,246,0.06)",
                    }}
                  >
                    ☕ 15 min pauza
                  </motion.button>
                  <button
                    onClick={dismiss}
                    className="w-full py-2 text-xs transition-colors"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Ignorovat
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
