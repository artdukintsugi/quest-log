"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Scroll,
  GitBranch,
  Trophy,
  BarChart2,
} from "lucide-react";
import { useQuestContext } from "@/context/QuestContext";
import { getLevelInfo } from "@/lib/data/levels";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quests", label: "Questy", icon: Scroll },
  { href: "/tree", label: "Dependency Tree", icon: GitBranch },
  { href: "/achievements", label: "Achievementy", icon: Trophy },
  { href: "/stats", label: "Statistiky", icon: BarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { state } = useQuestContext();
  const levelInfo = getLevelInfo(state.totalXP);
  const nextXP = levelInfo.next.xp;
  const curXP = levelInfo.current.xp;
  const pct =
    nextXP > curXP
      ? Math.min(((state.totalXP - curXP) / (nextXP - curXP)) * 100, 100)
      : 100;
  const completedCount = Object.values(state.questStates).filter(
    (s) => s.completed
  ).length;

  return (
    <aside
      className="hidden lg:flex flex-col w-60 min-h-screen p-4 gap-4 border-r"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "rgba(139,92,246,0.15)",
      }}
    >
      {/* Logo */}
      <div className="pt-2 pb-1">
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: "var(--font-fraunces)",
            color: "var(--accent-secondary)",
          }}
        >
          ⚔️ Quest Log
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Evelyn&apos;s Life RPG
        </p>
      </div>

      {/* Level card */}
      <div
        className="rounded-xl p-3 border"
        style={{
          backgroundColor: "var(--bg-tertiary)",
          borderColor: "rgba(139,92,246,0.2)",
        }}
      >
        <div className="flex items-baseline justify-between mb-1">
          <span
            className="text-lg font-bold"
            style={{ color: "var(--xp-gold)", fontFamily: "monospace" }}
          >
            Lvl {state.level}
          </span>
          <span className="text-xs truncate ml-2" style={{ color: "var(--text-muted)" }}>
            {state.levelName}
          </span>
        </div>
        <div
          className="w-full rounded-full h-1.5 overflow-hidden"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))",
              boxShadow: "0 0 6px var(--accent-glow)",
            }}
          />
        </div>
        <p
          className="text-xs mt-1 text-right"
          style={{ color: "var(--text-muted)" }}
        >
          {state.totalXP} / {nextXP} XP
        </p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={
                active
                  ? {
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--accent-secondary)",
                      borderLeft: "2px solid var(--accent-primary)",
                      boxShadow: "inset 0 0 12px rgba(139,92,246,0.08)",
                    }
                  : { color: "var(--text-secondary)" }
              }
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="text-xs pb-1" style={{ color: "var(--text-muted)" }}>
        {completedCount} / 200 questů
      </div>
    </aside>
  );
}
