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
import { Zap, Target, CheckCircle2, Shuffle, ChevronRight, Star, Clock } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 } as const,
  animate: { opacity: 1, y: 0 } as const,
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

  // SVG ring for hero
  const heroRadius = 52;
  const heroCirc = 2 * Math.PI * heroRadius;
  const heroDash = (pct / 100) * heroCirc;

  // XP per day
  const startDate = state.startDate ? new Date(state.startDate) : new Date();
  const daysSince = Math.max(1, Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const xpPerDay = state.totalXP > 0 ? (state.totalXP / daysSince).toFixed(1) : "0";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 lg:p-8 max-w-5xl mx-auto"
    >
      {/* Hero section */}
      <motion.div {...fadeUp(0)} className="mb-6">
        <h1
          className="text-3xl lg:text-4xl font-bold mb-1"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
        >
          Vítej zpět,{" "}
          <span className="gradient-text-evelyn">Evelyn</span>
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

      {/* XP Hero Card */}
      <motion.div
        {...fadeUp(0.05)}
        className="rounded-2xl p-6 mb-5 border glass relative overflow-hidden"
        style={{ borderColor: "rgba(139,92,246,0.2)" }}
      >
        {/* Ambient glow */}
        <div
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full pointer-events-none ambient-breathe"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent 60%)" }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full pointer-events-none ambient-breathe"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.06), transparent 60%)", animationDelay: "3s" }}
        />

        <div className="flex items-center gap-6 relative z-10">
          {/* XP Ring */}
          <div className="shrink-0 hidden sm:block">
            <svg width="130" height="130" className="-rotate-90">
              <circle cx="65" cy="65" r={heroRadius} fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="5" />
              <motion.circle
                cx="65" cy="65" r={heroRadius}
                fill="none"
                stroke="url(#heroGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${heroCirc}` }}
                animate={{ strokeDasharray: `${heroDash} ${heroCirc}` }}
                transition={{ duration: 1.8, ease: "easeOut" as const, delay: 0.3 }}
                style={{ filter: "drop-shadow(0 0 8px rgba(139,92,246,0.5))" }}
              />
              <defs>
                <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="50%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              <text
                x="65" y="60"
                textAnchor="middle"
                style={{
                  fill: "var(--xp-gold)",
                  fontSize: "28px",
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  transform: "rotate(90deg)",
                  transformOrigin: "65px 65px",
                }}
              >
                {state.level}
              </text>
              <text
                x="65" y="78"
                textAnchor="middle"
                style={{
                  fill: "var(--text-muted)",
                  fontSize: "9px",
                  fontFamily: "monospace",
                  transform: "rotate(90deg)",
                  transformOrigin: "65px 65px",
                }}
              >
                LEVEL
              </text>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <span
                className="text-3xl font-bold glow-text-gold sm:hidden"
                style={{ color: "var(--xp-gold)", fontFamily: "monospace" }}
              >
                {state.level}
              </span>
              <span
                className="text-xl font-semibold"
                style={{ color: "var(--accent-secondary)", fontFamily: "var(--font-fraunces)" }}
              >
                {state.levelName}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span
                className="text-2xl font-bold glow-text-gold"
                style={{ color: "var(--xp-gold)", fontFamily: "monospace" }}
              >
                {state.totalXP.toLocaleString()}
              </span>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>XP</span>
            </div>

            {/* XP Bar */}
            <div className="w-full rounded-full h-3 overflow-hidden mb-2" style={{ backgroundColor: "var(--bg-primary)" }}>
              <motion.div
                className="h-3 rounded-full xp-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, ease: "easeOut" as const, delay: 0.2 }}
              />
            </div>
            <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
              <span>{Math.round(pct)}% to next</span>
              <span>{nextXP.toLocaleString()} XP</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Dokončeno", value: `${completedQuests.length}/${QUESTS.length}`, icon: CheckCircle2, color: "var(--success)" },
          { label: "Dostupné", value: availableQuests.length.toString(), icon: Target, color: "var(--accent-secondary)" },
          { label: "XP/den", value: xpPerDay, icon: Zap, color: "var(--xp-gold)" },
          { label: "Achievementy", value: `${state.achievements.length}/${ACHIEVEMENTS.length}`, icon: Star, color: "#f472b6" },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            {...fadeUp(0.1 + i * 0.05)}
            className="rounded-xl p-4 border glass card-lift"
            style={{ borderColor: "rgba(139,92,246,0.1)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} style={{ color }} />
              <span className="text-[11px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</span>
            </div>
            <div className="text-xl font-bold" style={{ color, fontFamily: "monospace" }}>
              {value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Act Progress */}
      <motion.div {...fadeUp(0.3)} className="rounded-2xl p-5 mb-5 border glass" style={{ borderColor: "rgba(139,92,246,0.1)" }}>
        <h2
          className="text-base font-semibold mb-4"
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
                  <span style={{ color: p === 100 ? "var(--success)" : "var(--text-muted)" }}>
                    {done}/{actQuests.length}
                  </span>
                </div>
                <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
                  <motion.div
                    className="h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${p}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.04, ease: "easeOut" as const }}
                    style={{
                      backgroundColor: p === 100 ? "var(--success)" : "var(--accent-primary)",
                      boxShadow: p === 100 ? "0 0 8px var(--success-glow)" : undefined,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Activity */}
        <motion.div {...fadeUp(0.4)} className="rounded-2xl p-5 border glass" style={{ borderColor: "rgba(139,92,246,0.1)" }}>
          <h2
            className="text-base font-semibold mb-3 flex items-center gap-2"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
          >
            <Clock size={15} style={{ color: "var(--accent-secondary)" }} />
            Nedávná Aktivita
          </h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: "var(--text-muted)" }}>
              Zatím žádné dokončené questy. Jdi na to!
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {recentActivity.map((quest, i) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.2 }}
                >
                  <Link href={`/quests/${quest.id}`}>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
                      <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                        #{String(quest.id).padStart(3, "0")}
                      </span>
                      <span className="flex-1 text-sm truncate group-hover:text-white transition-colors" style={{ color: "var(--text-secondary)" }}>
                        {quest.title}
                      </span>
                      <span className="text-xs font-bold font-mono" style={{ color: "var(--xp-gold)" }}>
                        +{quest.xp}XP
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions + Achievements */}
        <motion.div {...fadeUp(0.45)} className="rounded-2xl p-5 border glass" style={{ borderColor: "rgba(139,92,246,0.1)" }}>
          <h2
            className="text-base font-semibold mb-3 flex items-center gap-2"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
          >
            <Zap size={15} style={{ color: "var(--xp-gold)" }} />
            Quick Actions
          </h2>
          <div className="flex flex-col gap-2.5">
            <motion.button
              onClick={randomQuest}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-between p-3.5 rounded-xl w-full text-left group"
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.02))",
                border: "1px solid rgba(139,92,246,0.2)",
                color: "var(--text-primary)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(139,92,246,0.15)" }}>
                  <Shuffle size={16} style={{ color: "var(--accent-secondary)" }} />
                </div>
                <div>
                  <span className="font-medium text-sm block">Random Quest</span>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {availableQuests.length} dostupných
                  </span>
                </div>
              </div>
              <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" style={{ color: "var(--text-muted)" }} />
            </motion.button>

            <Link href="/quests">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-between p-3.5 rounded-xl group"
                style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(139,92,246,0.01))",
                  border: "1px solid rgba(139,92,246,0.15)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(139,92,246,0.1)" }}>
                    <Target size={16} style={{ color: "var(--accent-secondary)" }} />
                  </div>
                  <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                    Všechny Questy
                  </span>
                </div>
                <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" style={{ color: "var(--text-muted)" }} />
              </motion.div>
            </Link>
          </div>

          {unlockedAchievements.length > 0 && (
            <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(139,92,246,0.1)" }}>
              <h3 className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
                Odemčené Achievementy
              </h3>
              <div className="flex gap-2 flex-wrap">
                {unlockedAchievements.slice(0, 4).map((a) => (
                  <div
                    key={a.id}
                    className="px-2.5 py-1 rounded-lg text-xs border flex items-center gap-1.5"
                    style={{
                      backgroundColor: "rgba(139,92,246,0.06)",
                      borderColor: "rgba(139,92,246,0.15)",
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
