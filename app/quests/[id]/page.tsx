"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { QUESTS } from "@/lib/data/quests";
import { ACTS } from "@/lib/data/acts";
import { useQuestContext } from "@/context/QuestContext";
import { getQuestStatus } from "@/lib/utils";
import { fireQuestComplete } from "@/lib/confetti";
import { soundTick, soundComplete } from "@/lib/sounds";
import DifficultyStars from "@/components/quest/DifficultyStars";
import { SkillList } from "@/components/ui/SkillBadge";
import {
  ChevronLeft, ChevronRight, Lock, CheckCircle2, Clock, Zap, ArrowLeft
} from "lucide-react";
import AskAIModal from "@/components/quest/AskAIModal";
import PomodoroTimer from "@/components/ui/PomodoroTimer";

export default function QuestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { state, completeCheckpoint, completeQuest, uncompleteQuest } = useQuestContext();
  const [xpFloat, setXpFloat] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  const quest = useMemo(() => QUESTS.find((q) => q.id === id), [id]);
  const prevQuest = QUESTS.find((q) => q.id === id - 1);
  const nextQuest = QUESTS.find((q) => q.id === id + 1);

  const handleCheckpoint = useCallback((i: number, val: boolean) => {
    soundTick();
    completeCheckpoint(quest!.id, i, val);
  }, [quest, completeCheckpoint]);

  if (!quest) {
    return (
      <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>
        Quest #{id} nenalezen. 🗺️{" "}
        <Link href="/quests" style={{ color: "var(--accent-secondary)" }}>Zpět na list</Link>
      </div>
    );
  }

  const status = getQuestStatus(quest.id, state.questStates, quest.prerequisites);
  const questState = state.questStates[quest.id];
  const checkpoints = questState?.checkpoints ?? [];
  const act = ACTS.find((a) => a.id === quest.act);
  const allCheckpointsDone = quest.checkpoints.length === 0 || quest.checkpoints.every((_, i) => checkpoints[i]);
  const prereqQuests = quest.prerequisites.map((pid) => QUESTS.find((q) => q.id === pid));
  const dependents = QUESTS.filter((q) => q.prerequisites.includes(quest.id));

  const handleComplete = () => {
    fireQuestComplete(quest.tags, quest.xp, quest.act);
    soundComplete();
    setXpFloat(true);
    setTimeout(() => setXpFloat(false), 1600);
    completeQuest(quest.id);
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 lg:p-8 max-w-3xl mx-auto"
    >
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-5 text-sm transition-colors hover:text-white"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={15} /> Zpět
      </button>

      {/* Quest header */}
      <div
        className="rounded-2xl p-6 mb-4 border relative overflow-hidden glass"
        style={{
          borderColor: status === "completed" ? "rgba(34,197,94,0.3)" : "var(--card-border)",
        }}
      >
        {/* XP float */}
        <AnimatePresence>
          {xpFloat && (
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -70, scale: 1.3 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute top-4 right-4 text-2xl font-bold font-mono pointer-events-none z-10"
              style={{ color: "var(--xp-gold)", textShadow: "0 0 20px rgba(251,191,36,0.6)" }}
            >
              +{quest.xp} XP ⚡
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                #{String(quest.id).padStart(3, "0")}
              </span>
              {act && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "rgba(139,92,246,0.1)",
                    color: "var(--accent-secondary)",
                    border: "1px solid rgba(139,92,246,0.2)",
                  }}
                >
                  {act.emoji} {act.name}
                </span>
              )}
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
            >
              {quest.title}
            </h1>
          </div>
          {status === "completed" && <CheckCircle2 size={26} style={{ color: "var(--success)", flexShrink: 0 }} />}
          {status === "locked" && <Lock size={22} style={{ color: "var(--danger)", flexShrink: 0 }} />}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <DifficultyStars difficulty={quest.difficulty} />
          {status === "available" && (
            <PomodoroTimer questTitle={quest.title} onComplete={allCheckpointsDone ? handleComplete : undefined} />
          )}
          <span
            className="font-bold font-mono text-sm px-2 py-0.5 rounded"
            style={{
              color: "var(--xp-gold)",
              backgroundColor: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.2)",
              textShadow: "0 0 8px rgba(251,191,36,0.3)",
            }}
          >
            {quest.xp} XP
          </span>
          <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-muted)" }}>
            <Clock size={13} /> {quest.timeEstimate}
          </span>
        </div>

        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
          {quest.description}
        </p>

        {quest.quickStart && (
          <div
            className="rounded-lg p-3 mb-4"
            style={{
              backgroundColor: "rgba(139,92,246,0.05)",
              borderLeft: "2px solid var(--accent-primary)",
            }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent-secondary)" }}>
              ⚡ Jak začít za 5 min
            </p>
            <p className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
              {quest.quickStart}
            </p>
          </div>
        )}

        {quest.skills?.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
              Skill oblasti
            </p>
            <SkillList skills={quest.skills} size="sm" showApps />
          </div>
        )}

        {quest.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {quest.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded"
                style={{ color: "var(--accent-secondary)", backgroundColor: "rgba(139,92,246,0.08)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Checkpoints */}
      {quest.checkpoints.length > 0 && (
        <div className="rounded-2xl p-5 mb-4 border glass" style={{ borderColor: "var(--card-border)" }}>
          <h2
            className="text-base font-semibold mb-3"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
          >
            Checkpoints ({checkpoints.filter(Boolean).length}/{quest.checkpoints.length})
          </h2>
          {/* Progress bar */}
          <div className="w-full rounded-full h-1.5 overflow-hidden mb-4" style={{ backgroundColor: "var(--bg-primary)" }}>
            <motion.div
              className="h-1.5 rounded-full xp-bar-fill"
              animate={{ width: `${quest.checkpoints.length > 0 ? (checkpoints.filter(Boolean).length / quest.checkpoints.length) * 100 : 0}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex flex-col gap-2">
            {quest.checkpoints.map((cp, i) => {
              const done = checkpoints[i] ?? false;
              return (
                <motion.label
                  key={i}
                  className="flex items-center gap-3 cursor-pointer group select-none"
                  whileTap={{ scale: 0.99 }}
                >
                  <input
                    type="checkbox"
                    checked={done}
                    disabled={status === "locked"}
                    onChange={(e) => handleCheckpoint(i, e.target.checked)}
                    className="quest-checkbox"
                  />
                  <span className="relative text-sm transition-colors duration-300"
                    style={{ color: done ? "var(--text-muted)" : "var(--text-secondary)" }}>
                    {cp}
                    {done && (
                      <svg
                        className="absolute inset-0 w-full overflow-visible pointer-events-none"
                        style={{ top: "50%", height: "2px" }}
                        preserveAspectRatio="none"
                      >
                        <motion.line
                          x1="0" y1="1" x2="100%" y2="1"
                          stroke="rgba(139,92,246,0.55)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      </svg>
                    )}
                  </span>
                </motion.label>
              );
            })}
          </div>
        </div>
      )}

      {/* Complete / Uncomplete + Ask AI */}
      {status !== "locked" && (
        <div className="mb-4 flex flex-col gap-2">
          {status === "completed" ? (
            <button
              onClick={() => uncompleteQuest(quest.id)}
              className="w-full py-3 rounded-xl text-sm font-semibold border transition-all duration-200 hover:opacity-80"
              style={{
                borderColor: "rgba(100,116,139,0.2)",
                color: "var(--text-muted)",
                backgroundColor: "rgba(18,14,32,0.6)",
              }}
            >
              ↩ Označit jako nesplněné
            </button>
          ) : (
            <motion.button
              onClick={handleComplete}
              disabled={quest.checkpoints.length > 0 && !allCheckpointsDone}
              whileHover={allCheckpointsDone || quest.checkpoints.length === 0 ? { scale: 1.02 } : {}}
              whileTap={allCheckpointsDone || quest.checkpoints.length === 0 ? { scale: 0.98 } : {}}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background:
                  allCheckpointsDone || quest.checkpoints.length === 0
                    ? "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))"
                    : "rgba(26,14,46,0.6)",
                color: "white",
                boxShadow:
                  allCheckpointsDone || quest.checkpoints.length === 0
                    ? "0 0 24px var(--accent-glow)"
                    : "none",
              }}
            >
              <Zap size={16} className="inline mr-2" />
              {allCheckpointsDone || quest.checkpoints.length === 0
                ? `Dokončit Quest (+${quest.xp} XP)`
                : `Dokonči checkpoints (${checkpoints.filter(Boolean).length}/${quest.checkpoints.length})`}
            </motion.button>
          )}
          {/* Ask AI button */}
          <button
            onClick={() => setShowAIModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all duration-300 border"
            style={{
              background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.08))",
              borderColor: "rgba(139,92,246,0.2)",
              color: "var(--accent-secondary)",
            }}
          >
            <span>🤖</span>
            <span>Jak na to?</span>
          </button>
        </div>
      )}

      {/* Locked */}
      {status === "locked" && (
        <div
          className="rounded-xl p-4 mb-4 border text-sm"
          style={{
            backgroundColor: "rgba(239,68,68,0.04)",
            borderColor: "rgba(239,68,68,0.2)",
            color: "var(--danger)",
          }}
        >
          🔒 Quest je zamčený. Dokonči nejdřív prerekvizity.
        </div>
      )}

      {/* Prerequisites */}
      {prereqQuests.length > 0 && (
        <div className="rounded-2xl p-5 mb-4 border glass" style={{ borderColor: "var(--card-border)" }}>
          <h2
            className="text-base font-semibold mb-3"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
          >
            Prerekvizity
          </h2>
          {prereqQuests.map((pq) => {
            if (!pq) return null;
            const s = getQuestStatus(pq.id, state.questStates, pq.prerequisites);
            return (
              <Link key={pq.id} href={`/quests/${pq.id}`}>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                    #{String(pq.id).padStart(3, "0")}
                  </span>
                  <span className="flex-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {pq.title}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      color: s === "completed" ? "var(--success)" : s === "available" ? "var(--accent-secondary)" : "var(--text-muted)",
                      backgroundColor: s === "completed" ? "rgba(34,197,94,0.1)" : "rgba(139,92,246,0.08)",
                    }}
                  >
                    {s === "completed" ? "✓ Splněno" : s === "available" ? "Dostupné" : "Zamčeno"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Dependents */}
      {dependents.length > 0 && (
        <div className="rounded-2xl p-5 mb-4 border glass" style={{ borderColor: "var(--card-border)" }}>
          <h2
            className="text-base font-semibold mb-3"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
          >
            Odemkne questy
          </h2>
          {dependents.map((dq) => (
            <Link key={dq.id} href={`/quests/${dq.id}`}>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  #{String(dq.id).padStart(3, "0")}
                </span>
                <span className="flex-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {dq.title}
                </span>
                <span className="text-xs" style={{ color: "var(--accent-secondary)" }}>→ odemkne</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Prev / Next */}
      <div className="flex gap-3 mt-2">
        {prevQuest ? (
          <Link href={`/quests/${prevQuest.id}`} className="flex-1">
            <div
              className="flex items-center gap-2 p-3 rounded-xl border text-sm transition-all glass-hover"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--card-border)", color: "var(--text-secondary)" }}
            >
              <ChevronLeft size={15} />
              <span className="truncate">#{prevQuest.id} {prevQuest.title}</span>
            </div>
          </Link>
        ) : <div className="flex-1" />}
        {nextQuest ? (
          <Link href={`/quests/${nextQuest.id}`} className="flex-1">
            <div
              className="flex items-center justify-end gap-2 p-3 rounded-xl border text-sm transition-all glass-hover"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--card-border)", color: "var(--text-secondary)" }}
            >
              <span className="truncate">#{nextQuest.id} {nextQuest.title}</span>
              <ChevronRight size={15} />
            </div>
          </Link>
        ) : <div className="flex-1" />}
      </div>
    </motion.div>

    {/* Ask AI Modal */}
    <AskAIModal quest={quest} open={showAIModal} onClose={() => setShowAIModal(false)} />
    </>
  );
}
