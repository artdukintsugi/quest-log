"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuestContext } from "@/context/QuestContext";
import { QUESTS } from "@/lib/data/quests";
import { ACTS } from "@/lib/data/acts";
import { getLevelInfo } from "@/lib/data/levels";
import { ACHIEVEMENTS } from "@/lib/data/achievements";
import { getQuestStatus } from "@/lib/utils";
import { Zap, Target, CheckCircle2, Shuffle, ChevronRight, Star } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: "easeOut" as const },
});

export default function Dashboard() {
  const { state } = useQuestContext();
  const levelInfo = getLevelInfo(state.totalXP);
  const nextXP = levelInfo.next.xp;
  const curXP = levelInfo.current.xp;
  const pct =
    nextXP > curXP
      ? Math.min(((state.totalXP - curXP) / (nextXP - curXP)) * 100, 100)
      : 100;

  const completedQuests = useMemo(
    () =>
      QUESTS.filter((q) => state.questStates[q.id]?.completed).sort((a, b) => {
        const aD = state.questStates[a.id]?.completedAt ?? "";
        const bD = state.questStates[b.id]?.completedAt ?? "";
        return bD.localeCompare(aD);
      }),
    [state.questStates]
  );

  const availableQuests = useMemo(
    () =>
      QUESTS.filter(
        (q) =>
          getQuestStatus(q.id, state.questStates, q.prerequisites) === "available"
      ),
    [state.questStates]
  );

  const randomQuest = () => {
    if (availableQuests.length === 0) return;
    const q = availableQuests[Math.floor(Math.random() * availableQuests.length)];
    window.location.href = `/quests/${q.id}`;
  };

  const recentActivity = completedQuests.slice(0, 5);
  const unlockedAchievements = ACHIEVEMENTS.filter((a) =>
    state.achievements.includes(a.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 lg:p-8 max-w-5xl mx-auto"
    >
      {/* Header */}
      <motion.div {...fadeUp(0)} className="mb-6">
        <h1
          className="text-3xl lg:text-4xl font-bold mb-1"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
        >
          Vítej zpět,{" "}
          <span style={{ color: "var(--accent-secondary)" }}>Evelyn</span>
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {new Date().toLocaleDateString("cs-CZ", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

      {/* XP Bar */}
      <motion.div {...fadeUp(0.05)} className="rounded-2xl p-5 mb-5 border glass" style={{ borderColor: "rgba(139,92,246,0.2)" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Current Level</p>
            <div className="flex items-baseline gap-2">
              <span
                className="text-3xl font-bold glow-text-gold"
                style={{ color: "var(--xp-gold)", fontFamily: "monospace" }}
              >
                {state.level}
              </span>
              <span
                className="text-lg font-semibold"
                style={{ color: "var(--accent-secondary)", fontFamily: "var(--font-fraunces)" }}
              >
                {state.levelName}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Total XP</p>
            <span
              className="text-2xl font-bold glow-text-gold"
              style={{ color: "var(--xp-gold)", fontFamily: "monospace" }}
            >
              {state.totalXP.toLocaleString()} ⚡
            </span>
          </div>
        </div>
        <div className="w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
          <motion.div
            className="h-3 rounded-full xp-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>{state.totalXP} XP</span>
          <span>Další level: {nextXP} XP</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Dokončeno", value: `${completedQuests.length}/210`, icon: CheckCircle2, color: "var(--success)" },
          { label: "Dostupné", value: availableQuests.length.toString(), icon: Target, color: "var(--accent-secondary)" },
          { label: "XP", value: state.totalXP.toLocaleString(), icon: Zap, color: "var(--xp-gold)" },
          { label: "Achievementy", value: `${state.achievements.length}/13`, icon: Star, color: "#f472b6" },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            {...fadeUp(0.1 + i * 0.05)}
            className="rounded-xl p-4 border glass"
            style={{ borderColor: "rgba(139,92,246,0.12)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={15} style={{ color }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
            </div>
            <div className="text-xl font-bold" style={{ color, fontFamily: "monospace" }}>
              {value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Act Progress */}
      <motion.div {...fadeUp(0.3)} className="rounded-2xl p-5 mb-5 border glass" style={{ borderColor: "rgba(139,92,246,0.12)" }}>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
        >
          Progress per Akt
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ACTS.map((act, i) => {
            const actQuests = QUESTS.filter((q) => q.act === act.id);
            const done = actQuests.filter((q) => state.questStates[q.id]?.completed).length;
            const p = actQuests.length > 0 ? Math.round((done / actQuests.length) * 100) : 0;
            return (
              <div key={act.id}>
                <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                  <span>{act.emoji} {act.name}</span>
                  <span style={{ color: "var(--text-muted)" }}>{done}/{actQuests.length}</span>
                </div>
                <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
                  <motion.div
                    className="h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${p}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.04, ease: "easeOut" }}
                    style={{ backgroundColor: p === 100 ? "var(--success)" : "var(--accent-primary)" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Activity */}
        <motion.div {...fadeUp(0.4)} className="rounded-2xl p-5 border glass" style={{ borderColor: "rgba(139,92,246,0.12)" }}>
          <h2
            className="text-lg font-semibold mb-3"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
          >
            Nedávná Aktivita
          </h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Zatím žádné dokončené questy. Jdi na to! ⚔️
            </p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {recentActivity.map((quest) => (
                <Link key={quest.id} href={`/quests/${quest.id}`}>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                      #{String(quest.id).padStart(3, "0")}
                    </span>
                    <span className="flex-1 text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                      {quest.title}
                    </span>
                    <span className="text-xs font-bold font-mono" style={{ color: "var(--xp-gold)" }}>
                      +{quest.xp}XP
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fadeUp(0.45)} className="rounded-2xl p-5 border glass" style={{ borderColor: "rgba(139,92,246,0.12)" }}>
          <h2
            className="text-lg font-semibold mb-3"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
          >
            Quick Actions
          </h2>
          <div className="flex flex-col gap-2.5">
            <motion.button
              onClick={randomQuest}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-between p-3 rounded-xl w-full text-left"
              style={{
                background: "linear-gradient(135deg, var(--bg-tertiary), rgba(139,92,246,0.08))",
                border: "1px solid rgba(139,92,246,0.25)",
                color: "var(--text-primary)",
              }}
            >
              <div className="flex items-center gap-3">
                <Shuffle size={17} style={{ color: "var(--accent-secondary)" }} />
                <span className="font-medium text-sm">Random Quest</span>
              </div>
              <ChevronRight size={15} style={{ color: "var(--text-muted)" }} />
            </motion.button>

            <Link href="/quests">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, var(--bg-tertiary), rgba(139,92,246,0.08))",
                  border: "1px solid rgba(139,92,246,0.25)",
                }}
              >
                <div className="flex items-center gap-3">
                  <Target size={17} style={{ color: "var(--accent-secondary)" }} />
                  <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                    Všechny Questy
                  </span>
                </div>
                <ChevronRight size={15} style={{ color: "var(--text-muted)" }} />
              </motion.div>
            </Link>
          </div>

          {unlockedAchievements.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
                Odemčené Achievementy
              </h3>
              <div className="flex gap-2 flex-wrap">
                {unlockedAchievements.slice(0, 4).map((a) => (
                  <div
                    key={a.id}
                    className="px-2 py-1 rounded-lg text-xs border flex items-center gap-1"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      borderColor: "rgba(139,92,246,0.2)",
                    }}
                  >
                    <span>{a.icon}</span>
                    <span style={{ color: "var(--text-secondary)" }}>{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
