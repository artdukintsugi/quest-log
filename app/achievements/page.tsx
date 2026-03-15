"use client";

import { motion } from "framer-motion";
import { ACHIEVEMENTS } from "@/lib/data/achievements";
import { useQuestContext } from "@/context/QuestContext";
import { Trophy } from "lucide-react";

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
        <div className="flex items-center gap-3 mb-1">
          <Trophy size={28} style={{ color: "var(--accent-secondary)", filter: "drop-shadow(0 0 8px rgba(139,92,246,0.4))" }} />
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
          >
            Achievementy
          </h1>
        </div>
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
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.5) }}
              whileHover={unlocked ? { scale: 1.03, y: -3 } : {}}
              className="rounded-xl p-5 border transition-all duration-300 relative overflow-hidden"
              style={{
                backgroundColor: unlocked ? "rgba(18,18,26,0.8)" : "rgba(10,10,15,0.6)",
                borderColor: unlocked ? "rgba(139,92,246,0.35)" : "rgba(100,116,139,0.08)",
                boxShadow: unlocked ? "0 0 24px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05)" : "none",
                filter: unlocked ? "none" : "grayscale(0.9) opacity(0.4)",
                backdropFilter: unlocked ? "blur(12px)" : "none",
              }}
            >
              {/* Ambient glow for unlocked */}
              {unlocked && (
                <div
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none ambient-breathe"
                  style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15), transparent 60%)" }}
                />
              )}

              <motion.div
                className="text-5xl mb-3 relative z-10"
                animate={unlocked ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              >
                {unlocked ? achievement.icon : "❓"}
              </motion.div>
              <h3
                className="font-bold text-base mb-1 relative z-10"
                style={{
                  fontFamily: "var(--font-outfit)",
                  color: unlocked ? "var(--text-primary)" : "var(--text-muted)",
                }}
              >
                {unlocked ? achievement.name : "???"}
              </h3>
              <p className="text-xs leading-relaxed relative z-10" style={{ color: unlocked ? "var(--text-secondary)" : "var(--text-muted)" }}>
                {unlocked ? achievement.description : "Podmínky odemčení jsou skryty..."}
              </p>
              {unlocked && (
                <div
                  className="mt-3 text-xs font-mono px-2.5 py-1 rounded-md inline-flex items-center gap-1 relative z-10"
                  style={{
                    color: "var(--success)",
                    backgroundColor: "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(34,197,94,0.15)",
                    textShadow: "0 0 8px rgba(34,197,94,0.3)",
                  }}
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
