"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { MICRO_TASKS } from "@/lib/data/microTasks";

function randomTask(exclude?: string): string {
  const pool = exclude ? MICRO_TASKS.filter((t) => t !== exclude) : MICRO_TASKS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function ImStuckButton() {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState<string>("");

  const openWithTask = useCallback(() => {
    setTask(randomTask());
    setOpen(true);
  }, []);

  const reroll = useCallback(() => {
    setTask((prev) => randomTask(prev));
  }, []);

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        onClick={openWithTask}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={{ y: [0, -4, 0] }}
        transition={{
          y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
        }}
        className="fixed bottom-24 left-4 z-[100] w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg lg:bottom-6"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
          boxShadow: "0 0 20px rgba(139,92,246,0.45), 0 4px 16px rgba(0,0,0,0.4)",
        }}
        title="Jsem zaseknutá — pomoz mi!"
        aria-label="I'm stuck — help me"
      >
        🤔
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="stuck-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="stuck-card"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="fixed z-[210] bottom-36 left-4 right-4 md:left-auto md:right-auto md:w-96 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-2xl p-6 border"
              style={{
                backgroundColor: "rgba(18,14,32,0.97)",
                borderColor: "rgba(139,92,246,0.25)",
                boxShadow: "0 0 40px rgba(139,92,246,0.2), 0 24px 48px rgba(0,0,0,0.5)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={16} />
              </button>

              <p
                className="text-xs font-mono uppercase tracking-widest mb-1"
                style={{ color: "rgba(139,92,246,0.6)" }}
              >
                Zaseknutá? Zkus tohle 🤔
              </p>
              <h3
                className="text-base font-bold mb-5 pr-6 leading-snug"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
              >
                {task}
              </h3>

              <div className="flex gap-2">
                <motion.button
                  onClick={reroll}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all"
                  style={{
                    borderColor: "rgba(139,92,246,0.2)",
                    color: "var(--accent-secondary)",
                    backgroundColor: "rgba(139,92,246,0.06)",
                  }}
                >
                  🎲 Zkus jiný
                </motion.button>
                <motion.button
                  onClick={() => setOpen(false)}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                    color: "white",
                    boxShadow: "0 0 16px var(--accent-glow)",
                  }}
                >
                  ✓ Udělám to
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
