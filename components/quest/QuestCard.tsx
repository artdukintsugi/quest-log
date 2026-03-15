"use client";

import Link from "next/link";
import { Quest } from "@/lib/data/quests";
import { getQuestStatus, getCheckpointProgress } from "@/lib/utils";
import { useQuestContext } from "@/context/QuestContext";
import DifficultyStars from "./DifficultyStars";
import { Lock, CheckCircle2 } from "lucide-react";

interface Props {
  quest: Quest;
  compact?: boolean;
}

export default function QuestCard({ quest, compact = false }: Props) {
  const { state } = useQuestContext();
  const status = getQuestStatus(quest.id, state.questStates, quest.prerequisites);
  const progress = getCheckpointProgress(quest, state.questStates);

  const statusColors = {
    completed: { border: "rgba(34,197,94,0.35)", glow: "0 0 12px rgba(34,197,94,0.1)" },
    available: { border: "rgba(139,92,246,0.25)", glow: "0 0 12px rgba(139,92,246,0.05)" },
    locked: { border: "rgba(100,116,139,0.15)", glow: "none" },
  };

  const colors = statusColors[status];

  return (
    <Link href={`/quests/${quest.id}`}>
      <div
        className="rounded-xl p-4 border transition-all duration-200 hover:scale-[1.01] cursor-pointer group"
        style={{
          backgroundColor: status === "locked" ? "rgba(18,18,26,0.5)" : "var(--bg-secondary)",
          borderColor: colors.border,
          boxShadow: colors.glow,
          opacity: status === "locked" ? 0.6 : 1,
        }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-start gap-2 min-w-0">
            {/* Quest number */}
            <span
              className="text-xs font-mono shrink-0 mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              #{String(quest.id).padStart(3, "0")}
            </span>
            {/* Title */}
            <span
              className={`font-semibold leading-snug ${compact ? "text-sm" : "text-base"}`}
              style={{
                color: status === "locked" ? "var(--text-muted)" : "var(--text-primary)",
                fontFamily: "var(--font-outfit)",
              }}
            >
              {quest.title}
            </span>
          </div>

          {/* Status icon */}
          <div className="shrink-0">
            {status === "completed" && (
              <CheckCircle2 size={18} style={{ color: "var(--success)" }} />
            )}
            {status === "locked" && (
              <Lock size={16} style={{ color: "var(--text-muted)" }} />
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap">
          <DifficultyStars difficulty={quest.difficulty} size="sm" />
          <span
            className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
            style={{
              color: "var(--xp-gold)",
              backgroundColor: "rgba(251,191,36,0.1)",
              border: "1px solid rgba(251,191,36,0.2)",
            }}
          >
            +{quest.xp} XP
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {quest.timeEstimate}
          </span>
        </div>

        {/* Tags */}
        {quest.tags.length > 0 && !compact && (
          <div className="flex flex-wrap gap-1 mt-2">
            {quest.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  color: "var(--accent-secondary)",
                  backgroundColor: "rgba(139,92,246,0.1)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Checkpoint progress */}
        {quest.checkpoints.length > 0 && !compact && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-muted)" }}>
              <span>Checkpoints</span>
              <span>{progress}%</span>
            </div>
            <div
              className="w-full rounded-full h-1 overflow-hidden"
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              <div
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  backgroundColor:
                    status === "completed" ? "var(--success)" : "var(--accent-primary)",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
