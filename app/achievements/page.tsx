"use client";

import { motion } from "framer-motion";
import { ACHIEVEMENTS } from "@/lib/data/achievements";
import { useQuestContext } from "@/context/QuestContext";

export default function AchievementsPage() {
  const { state } = useQuestContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 lg:p-8 max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <h1
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
        >
          Achievementy
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {state.achievements.length} / {ACHIEVEMENTS.length} odemčeno
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((achievement, i) => {
          const unlocked = state.achievements.includes(achievement.id);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.5) }}
              className="rounded-xl p-5 border transition-all duration-300"
              style={{
                backgroundColor: unlocked ? "var(--bg-secondary)" : "rgba(12,12,18,0.7)",
                borderColor: unlocked ? "rgba(139,92,246,0.4)" : "rgba(100,116,139,0.12)",
                boxShadow: unlocked ? "0 0 20px rgba(139,92,246,0.12), inset 0 1px 0 rgba(255,255,255,0.04)" : "none",
                filter: unlocked ? "none" : "grayscale(0.8) opacity(0.5)",
              }}
            >
              <motion.div
                className="text-4xl mb-3"
                animate={unlocked ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                {unlocked ? achievement.icon : "❓"}
              </motion.div>
              <h3
                className="font-bold text-base mb-1"
                style={{
                  fontFamily: "var(--font-outfit)",
                  color: unlocked ? "var(--text-primary)" : "var(--text-muted)",
                }}
              >
                {unlocked ? achievement.name : "???"}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {unlocked ? achievement.description : "Podmínky splnění jsou skryty..."}
              </p>
              {unlocked && (
                <div
                  className="mt-3 text-xs font-mono px-2 py-0.5 rounded inline-block"
                  style={{ color: "var(--success)", backgroundColor: "rgba(34,197,94,0.1)" }}
                >
                  ✓ Odemčeno
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
