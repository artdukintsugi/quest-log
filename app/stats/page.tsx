"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { useQuestContext } from "@/context/QuestContext";
import { QUESTS } from "@/lib/data/quests";
import { ACTS } from "@/lib/data/acts";
import { getLevelInfo } from "@/lib/data/levels";
import { ACHIEVEMENTS } from "@/lib/data/achievements";
import { BarChart2, TrendingUp, Calendar } from "lucide-react";

const DIFF_COLORS = ["#22c55e", "#a78bfa", "#fbbf24", "#f97316", "#ef4444"];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.35, delay, ease: "easeOut" as const },
});

// Generate heatmap data for last 90 days
function generateHeatmapData(questStates: Record<number, { completed: boolean; completedAt?: string }>) {
  const days: { date: string; count: number; day: number; week: number }[] = [];
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 89);

  // Count completions per day
  const dayCounts: Record<string, number> = {};
  Object.values(questStates).forEach((qs) => {
    if (qs.completed && qs.completedAt) {
      const d = qs.completedAt.split("T")[0];
      dayCounts[d] = (dayCounts[d] || 0) + 1;
    }
  });

  for (let i = 0; i < 90; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dayOfWeek = d.getDay();
    const week = Math.floor(i / 7);
    days.push({
      date: dateStr,
      count: dayCounts[dateStr] || 0,
      day: dayOfWeek,
      week,
    });
  }
  return days;
}

export default function StatsPage() {
  const { state } = useQuestContext();
  const levelInfo = getLevelInfo(state.totalXP);

  const completedIds = useMemo(
    () =>
      new Set(
        Object.entries(state.questStates)
          .filter(([, v]) => v.completed)
          .map(([k]) => Number(k))
      ),
    [state.questStates]
  );

  const actData = useMemo(
    () =>
      ACTS.map((act) => {
        const actQuests = QUESTS.filter((q) => q.act === act.id);
        const done = actQuests.filter((q) => completedIds.has(q.id)).length;
        return { name: act.emoji, total: actQuests.length, done };
      }),
    [completedIds]
  );

  const diffData = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    QUESTS.filter((q) => completedIds.has(q.id)).forEach((q) => {
      counts[q.difficulty - 1]++;
    });
    return counts.map((value, i) => ({
      name: "★".repeat(i + 1),
      value,
      color: DIFF_COLORS[i],
    }));
  }, [completedIds]);

  const heatmapData = useMemo(() => generateHeatmapData(state.questStates), [state.questStates]);

  const totalPossibleXP = QUESTS.reduce((s, q) => s + q.xp, 0);
  const nextXP = levelInfo.next.xp;
  const pct =
    nextXP > levelInfo.current.xp
      ? Math.min(
          ((state.totalXP - levelInfo.current.xp) / (nextXP - levelInfo.current.xp)) * 100,
          100
        )
      : 100;

  const startDate = state.startDate ? new Date(state.startDate) : new Date();
  const daysSince = Math.max(1, Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

  // Streak calculation
  const currentStreak = useMemo(() => {
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const hasCompletion = Object.values(state.questStates).some(
        (qs) => qs.completed && qs.completedAt?.startsWith(dateStr)
      );
      if (hasCompletion) streak++;
      else if (i > 0) break; // skip today if no completion yet
    }
    return streak;
  }, [state.questStates]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 lg:p-8 max-w-5xl mx-auto"
    >
      <motion.div {...fadeUp(0)} className="mb-6 flex items-center gap-3">
        <BarChart2 size={28} style={{ color: "var(--accent-secondary)", filter: "drop-shadow(0 0 8px rgba(139,92,246,0.4))" }} />
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
          >
            Statistiky
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Tvůj progress v číslech
          </p>
        </div>
      </motion.div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Celkem XP", value: state.totalXP.toLocaleString(), sub: `/ ${totalPossibleXP.toLocaleString()}` },
          { label: "Level", value: state.level, sub: state.levelName },
          { label: "Dokončeno", value: completedIds.size, sub: `/ ${QUESTS.length}` },
          { label: "Streak", value: `${currentStreak}d`, sub: currentStreak > 0 ? "🔥" : "—" },
          { label: "XP/den", value: (state.totalXP / daysSince).toFixed(1), sub: `${daysSince} dní` },
        ].map(({ label, value, sub }, i) => (
          <motion.div
            key={label}
            {...fadeUp(0.05 + i * 0.05)}
            className="rounded-xl p-4 border glass card-lift"
            style={{ borderColor: "rgba(139,92,246,0.1)" }}
          >
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
            <p className="text-xl font-bold" style={{ color: "var(--xp-gold)", fontFamily: "monospace" }}>
              {value}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Activity Heatmap */}
      <motion.div
        {...fadeUp(0.25)}
        className="rounded-2xl p-5 mb-5 border glass"
        style={{ borderColor: "rgba(139,92,246,0.1)" }}
      >
        <h2
          className="text-base font-semibold mb-4 flex items-center gap-2"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
        >
          <Calendar size={16} style={{ color: "var(--accent-secondary)" }} />
          Aktivita (posledních 90 dní)
        </h2>
        <div className="overflow-x-auto">
          <div className="flex gap-[3px]" style={{ minWidth: "fit-content" }}>
            {Array.from({ length: Math.ceil(heatmapData.length / 7) }, (_, week) => (
              <div key={week} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }, (_, day) => {
                  const idx = week * 7 + day;
                  const cell = heatmapData[idx];
                  if (!cell) return <div key={day} className="w-3 h-3" />;
                  const intensity = cell.count === 0 ? 0 : Math.min(cell.count, 4);
                  const colors = [
                    "rgba(139,92,246,0.06)",
                    "rgba(139,92,246,0.25)",
                    "rgba(139,92,246,0.45)",
                    "rgba(139,92,246,0.65)",
                    "rgba(139,92,246,0.85)",
                  ];
                  return (
                    <div
                      key={day}
                      className="w-3 h-3 heatmap-cell"
                      title={`${cell.date}: ${cell.count} quest${cell.count !== 1 ? "ů" : ""}`}
                      style={{
                        backgroundColor: colors[intensity],
                        boxShadow: intensity > 2 ? `0 0 4px rgba(139,92,246,${intensity * 0.15})` : "none",
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[10px]" style={{ color: "var(--text-muted)" }}>
            <span>Méně</span>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: [
                    "rgba(139,92,246,0.06)",
                    "rgba(139,92,246,0.25)",
                    "rgba(139,92,246,0.45)",
                    "rgba(139,92,246,0.65)",
                    "rgba(139,92,246,0.85)",
                  ][i],
                }}
              />
            ))}
            <span>Více</span>
          </div>
        </div>
      </motion.div>

      {/* Level progress */}
      <motion.div
        {...fadeUp(0.3)}
        className="rounded-2xl p-5 mb-5 border glass"
        style={{ borderColor: "rgba(139,92,246,0.1)" }}
      >
        <h2
          className="text-base font-semibold mb-3 flex items-center gap-2"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
        >
          <TrendingUp size={16} style={{ color: "var(--xp-gold)" }} />
          Level Progress
        </h2>
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: "var(--accent-secondary)" }}>
            Lvl {levelInfo.current.level} — {levelInfo.current.name}
          </span>
          <span style={{ color: "var(--text-muted)" }}>
            Lvl {levelInfo.next.level} — {levelInfo.next.name}
          </span>
        </div>
        <div className="w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
          <motion.div
            className="h-3 rounded-full xp-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: "easeOut" as const, delay: 0.3 }}
          />
        </div>
        <p className="text-xs mt-1.5 text-right tabular-nums" style={{ color: "var(--text-muted)" }}>
          {state.totalXP} / {nextXP} XP ({pct.toFixed(0)}%)
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Quests per act */}
        <motion.div
          {...fadeUp(0.35)}
          className="rounded-2xl p-5 border glass"
          style={{ borderColor: "rgba(139,92,246,0.1)" }}
        >
          <h2
            className="text-base font-semibold mb-4"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
          >
            Questy per Akt
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={actData} margin={{ left: -20 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="done" name="Splněno" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total" name="Celkem" fill="rgba(139,92,246,0.15)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Difficulty distribution */}
        <motion.div
          {...fadeUp(0.4)}
          className="rounded-2xl p-5 border glass"
          style={{ borderColor: "rgba(139,92,246,0.1)" }}
        >
          <h2
            className="text-base font-semibold mb-4"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
          >
            Dokončené dle Obtížnosti
          </h2>
          {diffData.some((d) => d.value > 0) ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie
                    data={diffData.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {diffData
                      .filter((d) => d.value > 0)
                      .map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-tertiary)",
                      border: "1px solid rgba(139,92,246,0.3)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {diffData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span style={{ color: "var(--text-muted)" }}>
                      {d.name}: {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm py-8 text-center" style={{ color: "var(--text-muted)" }}>
              Zatím žádné dokončené questy.
            </p>
          )}
        </motion.div>
      </div>

      {/* Footer stat */}
      <motion.div
        {...fadeUp(0.45)}
        className="rounded-2xl p-5 mt-5 border glass"
        style={{ borderColor: "rgba(139,92,246,0.1)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Používáš Quest Log{" "}
          <span className="font-bold" style={{ color: "var(--accent-secondary)", fontFamily: "monospace" }}>
            {daysSince}
          </span>{" "}
          dní.{" "}
          {state.totalXP > 0 && completedIds.size > 0
            ? `Při tvém tempu budeš GOAT za ~${Math.ceil((6000 - state.totalXP) / Math.max(state.totalXP / daysSince, 0.1))} dní.`
            : "Začni plnit questy!"}
        </p>
      </motion.div>
    </motion.div>
  );
}
