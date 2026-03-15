"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { QUESTS } from "@/lib/data/quests";
import { ACTS } from "@/lib/data/acts";
import { useQuestContext } from "@/context/QuestContext";
import { getQuestStatus } from "@/lib/utils";
import { fireQuestComplete } from "@/lib/confetti";
import DifficultyStars from "@/components/quest/DifficultyStars";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  CheckCircle2,
  Clock,
  Zap,
  ArrowLeft,
} from "lucide-react";

export default function QuestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { state, completeCheckpoint, completeQuest, uncompleteQuest } =
    useQuestContext();
  const [xpFloat, setXpFloat] = useState(false);

  const quest = useMemo(() => QUESTS.find((q) => q.id === id), [id]);
  const prevQuest = QUESTS.find((q) => q.id === id - 1);
  const nextQuest = QUESTS.find((q) => q.id === id + 1);

  if (!quest) {
    return (
      <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>
        Quest #{id} nenalezen.{" "}
        <Link href="/quests" style={{ color: "var(--accent-secondary)" }}>
          Zpět
        </Link>
      </div>
    );
  }

  const status = getQuestStatus(quest.id, state.questStates, quest.prerequisites);
  const questState = state.questStates[quest.id];
  const checkpoints = questState?.checkpoints ?? [];
  const act = ACTS.find((a) => a.id === quest.act);

  const allCheckpointsDone =
    quest.checkpoints.length === 0 ||
    quest.checkpoints.every((_, i) => checkpoints[i]);

  const handleComplete = () => {
    fireQuestComplete();
    setXpFloat(true);
    setTimeout(() => setXpFloat(false), 1500);
    completeQuest(quest.id);
  };

  const prereqQuests = quest.prerequisites.map((pid) =>
    QUESTS.find((q) => q.id === pid)
  );

  const dependents = QUESTS.filter((q) => q.prerequisites.includes(quest.id));

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-5 text-sm transition-colors hover:text-white"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={16} />
        Zpět
      </button>

      {/* Quest header */}
      <div
        className="rounded-2xl p-6 mb-4 border relative overflow-hidden"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor:
            status === "completed"
              ? "rgba(34,197,94,0.3)"
              : "rgba(139,92,246,0.2)",
        }}
      >
        {/* XP float animation */}
        {xpFloat && (
          <div
            className="absolute top-4 right-4 text-2xl font-bold font-mono pointer-events-none float-up"
            style={{ color: "var(--xp-gold)" }}
          >
            +{quest.xp} XP ⚡
          </div>
        )}

        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-mono"
                style={{ color: "var(--text-muted)" }}
              >
                #{String(quest.id).padStart(3, "0")}
              </span>
              {act && (
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: "rgba(139,92,246,0.1)",
                    color: "var(--accent-secondary)",
                  }}
                >
                  {act.emoji} {act.name}
                </span>
              )}
            </div>
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-fraunces)",
                color: "var(--text-primary)",
              }}
            >
              {quest.title}
            </h1>
          </div>
          {status === "completed" && (
            <CheckCircle2
              size={28}
              style={{ color: "var(--success)", flexShrink: 0 }}
            />
          )}
          {status === "locked" && (
            <Lock size={24} style={{ color: "var(--danger)", flexShrink: 0 }} />
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <DifficultyStars difficulty={quest.difficulty} />
          <span
            className="font-bold font-mono text-sm px-2 py-0.5 rounded"
            style={{
              color: "var(--xp-gold)",
              backgroundColor: "rgba(251,191,36,0.1)",
              border: "1px solid rgba(251,191,36,0.2)",
            }}
          >
            {quest.xp} XP
          </span>
          <div
            className="flex items-center gap-1 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <Clock size={14} />
            {quest.timeEstimate}
          </div>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          {quest.description}
        </p>

        {/* Quick Start */}
        {quest.quickStart && (
          <div
            className="rounded-lg p-3 mb-4 border-l-2"
            style={{
              backgroundColor: "rgba(139,92,246,0.06)",
              borderColor: "var(--accent-primary)",
            }}
          >
            <p
              className="text-xs font-semibold mb-1"
              style={{ color: "var(--accent-secondary)" }}
            >
              ⚡ Jak začít za 5 min
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {quest.quickStart}
            </p>
          </div>
        )}

        {/* Tags */}
        {quest.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {quest.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded"
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
      </div>

      {/* Checkpoints */}
      {quest.checkpoints.length > 0 && (
        <div
          className="rounded-2xl p-5 mb-4 border"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "rgba(139,92,246,0.15)",
          }}
        >
          <h2
            className="text-base font-semibold mb-3"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: "var(--text-primary)",
            }}
          >
            Checkpoints ({checkpoints.filter(Boolean).length}/
            {quest.checkpoints.length})
          </h2>
          <div className="flex flex-col gap-2">
            {quest.checkpoints.map((cp, i) => {
              const done = checkpoints[i] ?? false;
              return (
                <label
                  key={i}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={done}
                    disabled={status === "locked"}
                    onChange={(e) =>
                      completeCheckpoint(quest.id, i, e.target.checked)
                    }
                    className="sr-only"
                  />
                  <div
                    className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                    style={{
                      borderColor: done
                        ? "var(--success)"
                        : "rgba(139,92,246,0.4)",
                      backgroundColor: done
                        ? "var(--success)"
                        : "transparent",
                    }}
                  >
                    {done && (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                      >
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-sm transition-colors"
                    style={{
                      color: done ? "var(--text-muted)" : "var(--text-secondary)",
                      textDecoration: done ? "line-through" : "none",
                    }}
                  >
                    {cp}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Complete / Uncomplete button */}
      {status !== "locked" && (
        <div className="mb-4">
          {status === "completed" ? (
            <button
              onClick={() => uncompleteQuest(quest.id)}
              className="w-full py-3 rounded-xl text-sm font-semibold border transition-all duration-200 hover:opacity-80"
              style={{
                borderColor: "rgba(100,116,139,0.3)",
                color: "var(--text-muted)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              ↩ Označit jako nesplněné
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={quest.checkpoints.length > 0 && !allCheckpointsDone}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: allCheckpointsDone
                  ? "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))"
                  : "var(--bg-tertiary)",
                color: "white",
                boxShadow: allCheckpointsDone
                  ? "0 0 20px var(--accent-glow)"
                  : "none",
              }}
            >
              <Zap size={16} className="inline mr-2" />
              {allCheckpointsDone || quest.checkpoints.length === 0
                ? `Dokončit Quest (+${quest.xp} XP)`
                : `Dokonči checkpoints (${checkpoints.filter(Boolean).length}/${quest.checkpoints.length})`}
            </button>
          )}
        </div>
      )}

      {/* Locked notice */}
      {status === "locked" && (
        <div
          className="rounded-xl p-4 mb-4 border text-sm"
          style={{
            backgroundColor: "rgba(239,68,68,0.05)",
            borderColor: "rgba(239,68,68,0.2)",
            color: "var(--danger)",
          }}
        >
          🔒 Quest je zamčený. Dokonči nejdřív prerekvizity.
        </div>
      )}

      {/* Prerequisites */}
      {prereqQuests.length > 0 && (
        <div
          className="rounded-2xl p-5 mb-4 border"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "rgba(139,92,246,0.15)",
          }}
        >
          <h2
            className="text-base font-semibold mb-3"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: "var(--text-primary)",
            }}
          >
            Prerekvizity
          </h2>
          <div className="flex flex-col gap-2">
            {prereqQuests.map((pq) => {
              if (!pq) return null;
              const pStatus = getQuestStatus(
                pq.id,
                state.questStates,
                pq.prerequisites
              );
              return (
                <Link key={pq.id} href={`/quests/${pq.id}`}>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--text-muted)" }}
                    >
                      #{String(pq.id).padStart(3, "0")}
                    </span>
                    <span
                      className="flex-1 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {pq.title}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        color:
                          pStatus === "completed"
                            ? "var(--success)"
                            : pStatus === "available"
                            ? "var(--accent-secondary)"
                            : "var(--text-muted)",
                        backgroundColor:
                          pStatus === "completed"
                            ? "rgba(34,197,94,0.1)"
                            : "rgba(139,92,246,0.1)",
                      }}
                    >
                      {pStatus === "completed"
                        ? "✓ Splněno"
                        : pStatus === "available"
                        ? "Dostupné"
                        : "Zamčeno"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Dependents */}
      {dependents.length > 0 && (
        <div
          className="rounded-2xl p-5 mb-4 border"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "rgba(139,92,246,0.15)",
          }}
        >
          <h2
            className="text-base font-semibold mb-3"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: "var(--text-primary)",
            }}
          >
            Odemkne questy
          </h2>
          <div className="flex flex-col gap-2">
            {dependents.map((dq) => (
              <Link key={dq.id} href={`/quests/${dq.id}`}>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <span
                    className="text-xs font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    #{String(dq.id).padStart(3, "0")}
                  </span>
                  <span
                    className="flex-1 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {dq.title}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--accent-secondary)" }}
                  >
                    → odemkne
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Prev / Next */}
      <div className="flex gap-3 mt-2">
        {prevQuest ? (
          <Link href={`/quests/${prevQuest.id}`} className="flex-1">
            <div
              className="flex items-center gap-2 p-3 rounded-xl border text-sm transition-all hover:border-purple-500/40"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "rgba(139,92,246,0.15)",
                color: "var(--text-secondary)",
              }}
            >
              <ChevronLeft size={16} />
              <span className="truncate">#{prevQuest.id} {prevQuest.title}</span>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {nextQuest ? (
          <Link href={`/quests/${nextQuest.id}`} className="flex-1">
            <div
              className="flex items-center justify-end gap-2 p-3 rounded-xl border text-sm transition-all hover:border-purple-500/40"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "rgba(139,92,246,0.15)",
                color: "var(--text-secondary)",
              }}
            >
              <span className="truncate">#{nextQuest.id} {nextQuest.title}</span>
              <ChevronRight size={16} />
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
