"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Quest } from "@/lib/data/quests";
import { getQuestStatus, getCheckpointProgress } from "@/lib/utils";
import { useQuestContext } from "@/context/QuestContext";
import DifficultyStars from "./DifficultyStars";
import { Lock, CheckCircle2, ChevronRight } from "lucide-react";

interface Props {
  quest: Quest;
  compact?: boolean;
  index?: number;
}

export default function QuestCard({ quest, compact = false, index = 0 }: Props) {
  const { state } = useQuestContext();
  const status = getQuestStatus(quest.id, state.questStates, quest.prerequisites);
  const progress = getCheckpointProgress(quest, state.questStates);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.4), ease: "easeOut" as const }}
    >
      <Link href={`/quests/${quest.id}`}>
        <motion.div
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.15 }}
          className={`rounded-xl p-4 border transition-all duration-200 cursor-pointer relative overflow-hidden ${
            status === "completed" ? "shimmer-completed" : "glass-hover"
          }`}
          style={{
            backgroundColor:
              status === "locked" ? "rgba(12,12,18,0.5)" : "var(--bg-secondary)",
            borderColor:
              status === "completed"
                ? "rgba(34,197,94,0.25)"
                : status === "available"
                ? "rgba(139,92,246,0.15)"
                : "rgba(100,116,139,0.08)",
            opacity: status === "locked" ? 0.5 : 1,
            boxShadow: status === "completed"
              ? "0 0 16px rgba(34,197,94,0.06)"
              : status === "available"
              ? "0 2px 12px rgba(0,0,0,0.2)"
              : "none",
          }}
        >
          {/* Subtle accent gradient for available quests */}
          {status === "available" && (
            <div
              className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
              style={{
                background: "radial-gradient(circle at top right, rgba(139,92,246,0.06), transparent 70%)",
              }}
            />
          )}

          <div className="flex items-start justify-between gap-2 mb-2 relative">
            <div className="flex items-start gap-2.5 min-w-0">
              <span className="text-[11px] font-mono shrink-0 mt-0.5 tabular-nums" style={{ color: "var(--text-muted)" }}>
                #{String(quest.id).padStart(3, "0")}
              </span>
              <span
                className={`font-semibold leading-snug ${compact ? "text-sm" : "text-[15px]"}`}
                style={{
                  color: status === "locked" ? "var(--text-muted)" : "var(--text-primary)",
                  fontFamily: "var(--font-outfit)",
                }}
              >
                {quest.title}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {status === "completed" && <CheckCircle2 size={17} style={{ color: "var(--success)", filter: "drop-shadow(0 0 4px rgba(34,197,94,0.4))" }} />}
              {status === "locked" && <Lock size={14} style={{ color: "var(--text-muted)" }} />}
              {status === "available" && <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <DifficultyStars difficulty={quest.difficulty} size="sm" />
            <span
              className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded tabular-nums"
              style={{
                color: "var(--xp-gold)",
                backgroundColor: "rgba(251,191,36,0.08)",
                border: "1px solid rgba(251,191,36,0.15)",
                textShadow: "0 0 6px rgba(251,191,36,0.3)",
              }}
            >
              +{quest.xp}XP
            </span>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {quest.timeEstimate}
            </span>
          </div>

          {quest.tags.length > 0 && !compact && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {quest.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded"
                  style={{
                    color: "var(--accent-secondary)",
                    backgroundColor: "rgba(139,92,246,0.06)",
                    border: "1px solid rgba(139,92,246,0.08)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {quest.checkpoints.length > 0 && !compact && (
            <div className="mt-3">
              <div className="flex justify-between text-[10px] mb-1" style={{ color: "var(--text-muted)" }}>
                <span>{quest.checkpoints.length} checkpoints</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
              <div className="w-full rounded-full h-1 overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
                <motion.div
                  className="h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" as const }}
                  style={{
                    backgroundColor: status === "completed" ? "var(--success)" : "var(--accent-primary)",
                    boxShadow: progress > 0 ? "0 0 6px rgba(139,92,246,0.3)" : "none",
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}
