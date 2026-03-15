"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { QUESTS } from "@/lib/data/quests";
import { ACTS } from "@/lib/data/acts";
import { useQuestContext } from "@/context/QuestContext";
import { getQuestStatus } from "@/lib/utils";
import { Lock, CheckCircle2 } from "lucide-react";

export default function TreePage() {
  const { state } = useQuestContext();

  const actGroups = useMemo(() =>
    ACTS.map((act) => ({
      act,
      quests: QUESTS.filter((q) => q.act === act.id),
    })),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 lg:p-8 max-w-6xl mx-auto"
    >
      <div className="mb-6">
        <h1
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
        >
          Dependency Tree
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Quest závislosti vizualizované per akt
        </p>
        <div className="flex items-center gap-4 mt-2 text-xs">
          <span className="flex items-center gap-1.5" style={{ color: "var(--success)" }}>
            <CheckCircle2 size={12} /> Splněno
          </span>
          <span className="flex items-center gap-1.5" style={{ color: "var(--accent-secondary)" }}>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--accent-primary)" }} /> Dostupné
          </span>
          <span className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
            <Lock size={12} /> Zamčeno
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {actGroups.map(({ act, quests }, actIdx) => {
          const done = quests.filter((q) => state.questStates[q.id]?.completed).length;
          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(actIdx * 0.06, 0.5) }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{act.emoji}</span>
                <div>
                  <h2
                    className="text-lg font-bold"
                    style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
                  >
                    Akt {act.id} — {act.name}
                  </h2>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {done}/{quests.length} dokončeno
                  </p>
                </div>
                {/* Mini progress bar */}
                <div className="flex-1 ml-2">
                  <div className="w-full rounded-full h-1 overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
                    <motion.div
                      className="h-1 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: quests.length > 0 ? `${(done / quests.length) * 100}%` : "0%" }}
                      transition={{ duration: 0.8, delay: actIdx * 0.06 + 0.2 }}
                      style={{ backgroundColor: done === quests.length && quests.length > 0 ? "var(--success)" : "var(--accent-primary)" }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {quests.map((quest, qi) => {
                  const status = getQuestStatus(quest.id, state.questStates, quest.prerequisites);
                  const hasPrereqs = quest.prerequisites.length > 0;

                  return (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: Math.min(actIdx * 0.04 + qi * 0.02, 0.6) }}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Link href={`/quests/${quest.id}`}>
                        <div
                          className="rounded-lg p-3 border text-xs transition-colors duration-200 relative h-full"
                          style={{
                            backgroundColor:
                              status === "completed"
                                ? "rgba(34,197,94,0.08)"
                                : status === "locked"
                                ? "rgba(18,18,26,0.5)"
                                : "var(--bg-secondary)",
                            borderColor:
                              status === "completed"
                                ? "rgba(34,197,94,0.3)"
                                : status === "available"
                                ? "rgba(139,92,246,0.3)"
                                : "rgba(100,116,139,0.15)",
                            opacity: status === "locked" ? 0.6 : 1,
                            boxShadow: status === "available" ? "0 0 8px rgba(139,92,246,0.08)" : "none",
                            cursor: "pointer",
                          }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-mono" style={{ color: "var(--text-muted)" }}>
                              #{String(quest.id).padStart(3, "0")}
                            </span>
                            {status === "completed" && (
                              <CheckCircle2 size={12} style={{ color: "var(--success)" }} />
                            )}
                            {status === "locked" && (
                              <Lock size={11} style={{ color: "var(--text-muted)" }} />
                            )}
                          </div>
                          <p
                            className="font-medium leading-tight mb-1"
                            style={{
                              color: status === "locked" ? "var(--text-muted)" : "var(--text-secondary)",
                            }}
                          >
                            {quest.title.length > 40 ? quest.title.substring(0, 38) + "…" : quest.title}
                          </p>
                          {hasPrereqs && (
                            <p style={{ color: "var(--text-muted)" }}>
                              🔗 {quest.prerequisites.length} prereq{quest.prerequisites.length > 1 ? "s" : ""}
                            </p>
                          )}
                          <span className="font-mono font-bold" style={{ color: "var(--xp-gold)" }}>
                            +{quest.xp}XP
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
