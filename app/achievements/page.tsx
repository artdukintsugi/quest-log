"use client";

import { ACHIEVEMENTS } from "@/lib/data/achievements";
import { useQuestContext } from "@/context/QuestContext";

export default function AchievementsPage() {
  const { state } = useQuestContext();

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1
          className="text-3xl font-bold mb-1"
          style={{
            fontFamily: "var(--font-fraunces)",
            color: "var(--text-primary)",
          }}
        >
          Achievementy
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {state.achievements.length} / {ACHIEVEMENTS.length} odemčeno
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((achievement) => {
          const unlocked = state.achievements.includes(achievement.id);
          return (
            <div
              key={achievement.id}
              className="rounded-xl p-5 border transition-all duration-300"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: unlocked
                  ? "rgba(139,92,246,0.4)"
                  : "rgba(100,116,139,0.15)",
                boxShadow: unlocked ? "0 0 20px rgba(139,92,246,0.12)" : "none",
                filter: unlocked ? "none" : "grayscale(0.7) opacity(0.6)",
              }}
            >
              <div className="text-4xl mb-3">{unlocked ? achievement.icon : "❓"}</div>
              <h3
                className="font-bold text-base mb-1"
                style={{
                  fontFamily: "var(--font-outfit)",
                  color: unlocked ? "var(--text-primary)" : "var(--text-muted)",
                }}
              >
                {unlocked ? achievement.name : "???"}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {unlocked ? achievement.description : "Podmínky splnění jsou skryty..."}
              </p>
              {unlocked && (
                <div
                  className="mt-3 text-xs font-mono px-2 py-0.5 rounded inline-block"
                  style={{
                    color: "var(--success)",
                    backgroundColor: "rgba(34,197,94,0.1)",
                  }}
                >
                  ✓ Odemčeno
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
