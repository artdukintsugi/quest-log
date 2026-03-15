"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { QUESTS } from "@/lib/data/quests";
import { useQuestContext } from "@/context/QuestContext";
import { getQuestStatus } from "@/lib/utils";
import DifficultyStars from "@/components/quest/DifficultyStars";
import { X, Focus } from "lucide-react";

export default function ZenMode() {
  const [open, setOpen] = useState(false);
  const [pinnedId, setPinnedId] = useState<number | null>(null);
  const { state } = useQuestContext();

  const toggle = useCallback(() => setOpen((o) => !o), []);

  // Keyboard shortcut: Ctrl/Cmd + Shift + Z
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "z") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, toggle]);

  const availableQuests = QUESTS.filter(
    (q) => getQuestStatus(q.id, state.questStates, q.prerequisites) === "available"
  );

  const pinnedQuest = pinnedId
    ? QUESTS.find((q) => q.id === pinnedId)
    : availableQuests[0] ?? null;

  const checkpoints = pinnedQuest ? state.questStates[pinnedQuest.id]?.checkpoints ?? [] : [];
  const doneCount = checkpoints.filter(Boolean).length;
  const totalCount = pinnedQuest?.checkpoints.length ?? 0;

  return (
    <>
      {/* Zen trigger button — rendered in sidebar/header via import */}
      <button
        onClick={toggle}
        title="Zen Mode (Cmd+Shift+Z)"
        className="flex items-center gap-2 text-sm transition-colors hover:opacity-100 opacity-60"
        style={{ color: "var(--accent-secondary)" }}
      >
        <Focus size={14} />
        <span className="text-xs">Zen</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
            style={{ backgroundColor: "#000000" }}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl transition-colors hover:bg-white/5"
              style={{ color: "var(--text-muted)" }}
            >
              <X size={20} />
            </button>

            {/* Quest selector */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <select
                value={pinnedId ?? ""}
                onChange={(e) => setPinnedId(Number(e.target.value) || null)}
                className="text-xs rounded-lg px-2 py-1.5 border outline-none"
                style={{
                  backgroundColor: "rgba(18,14,32,0.9)",
                  borderColor: "rgba(139,92,246,0.2)",
                  color: "var(--text-secondary)",
                }}
              >
                <option value="">Auto (první dostupný)</option>
                {availableQuests.map((q) => (
                  <option key={q.id} value={q.id}>
                    #{String(q.id).padStart(3, "0")} {q.title.slice(0, 40)}
                  </option>
                ))}
              </select>
            </div>

            {/* Hint */}
            <p className="absolute bottom-6 text-xs" style={{ color: "rgba(100,116,139,0.4)" }}>
              ESC nebo Cmd+Shift+Z pro exit
            </p>

            {pinnedQuest ? (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="w-full max-w-lg px-8 text-center"
              >
                <div className="mb-2 flex justify-center">
                  <DifficultyStars difficulty={pinnedQuest.difficulty} />
                </div>

                <h1
                  className="text-3xl font-bold mb-4 leading-tight"
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    background: "linear-gradient(135deg, #a78bfa, #c084fc)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {pinnedQuest.title}
                </h1>

                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                  {pinnedQuest.description}
                </p>

                {pinnedQuest.quickStart && (
                  <div
                    className="rounded-lg p-3 mb-6 text-left"
                    style={{
                      backgroundColor: "rgba(139,92,246,0.06)",
                      borderLeft: "2px solid var(--accent-primary)",
                    }}
                  >
                    <p className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                      ⚡ {pinnedQuest.quickStart}
                    </p>
                  </div>
                )}

                {totalCount > 0 && (
                  <div className="mb-6">
                    <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                      {doneCount}/{totalCount} checkpoints
                    </p>
                    <div
                      className="w-full h-1 rounded-full overflow-hidden"
                      style={{ backgroundColor: "rgba(139,92,246,0.1)" }}
                    >
                      <motion.div
                        className="h-1 rounded-full"
                        animate={{ width: `${totalCount > 0 ? (doneCount / totalCount) * 100 : 0}%` }}
                        transition={{ duration: 0.6 }}
                        style={{
                          background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
                          boxShadow: "0 0 8px rgba(139,92,246,0.4)",
                        }}
                      />
                    </div>
                  </div>
                )}

                <Link
                  href={`/quests/${pinnedQuest.id}`}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                    color: "white",
                    boxShadow: "0 0 24px rgba(139,92,246,0.3)",
                  }}
                >
                  Otevřít quest →
                </Link>
              </motion.div>
            ) : (
              <p className="text-lg" style={{ color: "var(--text-muted)" }}>
                Žádné dostupné questy 🎉
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
