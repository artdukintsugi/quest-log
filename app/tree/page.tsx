"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { QUESTS } from "@/lib/data/quests";
import { ACTS } from "@/lib/data/acts";
import { useQuestContext } from "@/context/QuestContext";
import { getQuestStatus } from "@/lib/utils";
import { Lock, CheckCircle2, GitBranch } from "lucide-react";

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
      className="p-4 lg:p-8 max-w-7xl mx-auto"
    >
      <div className="mb-6 flex items-center gap-3">
        <GitBranch size={28} style={{ color: "var(--accent-secondary)", filter: "drop-shadow(0 0 8px rgba(139,92,246,0.4))" }} />
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
          >
            Dependency Tree
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {QUESTS.length} questů vizualizovaných per akt
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5 mb-6 text-xs" style={{ color: "var(--text-muted)" }}>
        <span className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--success)", boxShadow: "0 0 6px var(--success-glow)" }} />
          Splněno
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--accent-primary)", boxShadow: "0 0 6px var(--accent-glow-sm)" }} />
          Dostupné
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(100,116,139,0.3)" }} />
          Zamčeno
        </span>
      </div>

      <div className="flex flex-col gap-8">
        {actGroups.map(({ act, quests }, actIdx) => {
          if (quests.length === 0) return null;
          const done = quests.filter((q) => state.questStates[q.id]?.completed).length;
          const actPct = quests.length > 0 ? Math.round((done / quests.length) * 100) : 0;

          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(actIdx * 0.06, 0.5) }}
            >
              {/* Act header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{act.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2
                      className="text-lg font-bold"
                      style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
                    >
                      Akt {act.id} — {act.name}
                    </h2>
                    <span className="text-xs font-mono tabular-nums" style={{ color: actPct === 100 ? "var(--success)" : "var(--text-muted)" }}>
                      {done}/{quests.length} ({actPct}%)
                    </span>
                  </div>
                  <div className="w-full rounded-full h-1 mt-1.5 overflow-hidden" style={{ backgroundColor: "rgba(139,92,246,0.08)" }}>
                    <motion.div
                      className="h-1 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${actPct}%` }}
                      transition={{ duration: 0.8, delay: actIdx * 0.06 + 0.2 }}
                      style={{
                        backgroundColor: actPct === 100 ? "var(--success)" : "var(--accent-primary)",
                        boxShadow: actPct === 100 ? "0 0 8px var(--success-glow)" : "0 0 4px var(--accent-glow-sm)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Quest grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
                {quests.map((quest, qi) => {
                  const status = getQuestStatus(quest.id, state.questStates, quest.prerequisites);
                  const hasPrereqs = quest.prerequisites.length > 0;

                  return (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: Math.min(actIdx * 0.04 + qi * 0.015, 0.6) }}
                      whileHover={{ scale: 1.05, y: -3, zIndex: 10 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative"
                    >
                      <Link href={`/quests/${quest.id}`}>
                        <div
                          className="rounded-lg p-3 border text-xs transition-colors duration-200 h-full relative overflow-hidden"
                          style={{
                            backgroundColor:
                              status === "completed"
                                ? "rgba(34,197,94,0.06)"
                                : status === "locked"
                                ? "rgba(10,10,15,0.5)"
                                : "rgba(18,18,26,0.7)",
                            borderColor:
                              status === "completed"
                                ? "rgba(34,197,94,0.25)"
                                : status === "available"
                                ? "rgba(139,92,246,0.25)"
                                : "rgba(100,116,139,0.1)",
                            opacity: status === "locked" ? 0.45 : 1,
                            cursor: "pointer",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          {/* Status glow */}
                          {status === "available" && (
                            <div
                              className="absolute top-0 right-0 w-12 h-12 pointer-events-none"
                              style={{ background: "radial-gradient(circle at top right, rgba(139,92,246,0.1), transparent)" }}
                            />
                          )}

                          <div className="flex justify-between items-start mb-1">
                            <span className="font-mono tabular-nums" style={{ color: "var(--text-muted)" }}>
                              #{String(quest.id).padStart(3, "0")}
                            </span>
                            {status === "completed" && (
                              <CheckCircle2 size={12} style={{ color: "var(--success)", filter: "drop-shadow(0 0 4px rgba(34,197,94,0.4))" }} />
                            )}
                            {status === "locked" && (
                              <Lock size={11} style={{ color: "var(--text-muted)" }} />
                            )}
                          </div>
                          <p
                            className="font-medium leading-tight mb-1.5"
                            style={{
                              color: status === "locked" ? "var(--text-muted)" : "var(--text-secondary)",
                              fontSize: "11px",
                            }}
                          >
                            {quest.title.length > 35 ? quest.title.substring(0, 33) + "…" : quest.title}
                          </p>
                          <div className="flex items-center justify-between">
                            {hasPrereqs && (
                              <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>
                                🔗 {quest.prerequisites.length}
                              </span>
                            )}
                            <span className="font-mono font-bold ml-auto tabular-nums" style={{ color: "var(--xp-gold)", textShadow: "0 0 6px rgba(251,191,36,0.2)", fontSize: "10px" }}>
                              +{quest.xp}XP
                            </span>
                          </div>
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
