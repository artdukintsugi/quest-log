"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useQuestContext } from "@/context/QuestContext";
import { QUESTS } from "@/lib/data/quests";
import { ACTS } from "@/lib/data/acts";
import { getLevelInfo } from "@/lib/data/levels";
import { ACHIEVEMENTS } from "@/lib/data/achievements";

const DIFF_COLORS = ["#22c55e", "#a78bfa", "#fbbf24", "#f97316", "#ef4444"];

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
        return { name: act.emoji + " " + act.name.split(" ")[0], total: actQuests.length, done };
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

  const totalPossibleXP = QUESTS.reduce((s, q) => s + q.xp, 0);
  const nextXP = levelInfo.next.xp;
  const pct =
    nextXP > levelInfo.current.xp
      ? Math.min(
          ((state.totalXP - levelInfo.current.xp) /
            (nextXP - levelInfo.current.xp)) *
            100,
          100
        )
      : 100;

  const startDate = state.startDate ? new Date(state.startDate) : new Date();
  const daysSince = Math.floor(
    (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1
          className="text-3xl font-bold mb-1"
          style={{
            fontFamily: "var(--font-fraunces)",
            color: "var(--text-primary)",
          }}
        >
          Statistiky
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Tvůj progress v číslech
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Celkem XP",
            value: state.totalXP.toLocaleString(),
            sub: `/ ${totalPossibleXP.toLocaleString()} max`,
          },
          {
            label: "Level",
            value: state.level,
            sub: state.levelName,
          },
          {
            label: "Dokončeno",
            value: completedIds.size,
            sub: `/ 200 questů`,
          },
          {
            label: "Achievementy",
            value: state.achievements.length,
            sub: `/ ${ACHIEVEMENTS.length}`,
          },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            className="rounded-xl p-4 border"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "rgba(139,92,246,0.15)",
            }}
          >
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
              {label}
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--xp-gold)", fontFamily: "monospace" }}
            >
              {value}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Level progress */}
      <div
        className="rounded-2xl p-5 mb-5 border"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "rgba(139,92,246,0.15)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-3"
          style={{
            fontFamily: "var(--font-fraunces)",
            color: "var(--text-primary)",
          }}
        >
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
        <div
          className="w-full rounded-full h-3 overflow-hidden"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary), #fbbf24)",
              boxShadow: "0 0 10px var(--accent-glow)",
            }}
          />
        </div>
        <p
          className="text-xs mt-1.5 text-right"
          style={{ color: "var(--text-muted)" }}
        >
          {state.totalXP} / {nextXP} XP ({pct.toFixed(0)}%)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Quests per act */}
        <div
          className="rounded-2xl p-5 border"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "rgba(139,92,246,0.15)",
          }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: "var(--text-primary)",
            }}
          >
            Questy per Akt
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={actData} margin={{ left: -20 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--text-muted)", fontSize: 10 }}
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
                }}
              />
              <Bar dataKey="done" name="Splněno" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total" name="Celkem" fill="rgba(139,92,246,0.2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Difficulty distribution */}
        <div
          className="rounded-2xl p-5 border"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "rgba(139,92,246,0.15)",
          }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: "var(--text-primary)",
            }}
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
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {diffData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <span style={{ color: "var(--text-muted)" }}>
                      {d.name}: {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p
              className="text-sm py-8 text-center"
              style={{ color: "var(--text-muted)" }}
            >
              Zatím žádné dokončené questy.
            </p>
          )}
        </div>
      </div>

      {/* Days since start */}
      <div
        className="rounded-2xl p-5 mt-5 border"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "rgba(139,92,246,0.15)",
        }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Používáš Quest Log{" "}
          <span
            className="font-bold"
            style={{ color: "var(--accent-secondary)", fontFamily: "monospace" }}
          >
            {daysSince}
          </span>{" "}
          dní.{" "}
          {state.totalXP > 0 && completedIds.size > 0
            ? `Průměr: ${(state.totalXP / Math.max(daysSince, 1)).toFixed(1)} XP/den.`
            : ""}
        </p>
      </div>
    </div>
  );
}
