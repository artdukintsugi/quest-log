"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useQuestContext } from "@/context/QuestContext";

export default function ComboDisplay() {
  const { comboCount, comboMultiplier } = useQuestContext();

  const isActive = comboCount >= 3;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="combo"
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 8 }}
          className="flex items-center gap-2 rounded-lg border border-[#fbbf24] bg-[#12121a] px-3 py-1.5 shadow-[0_0_16px_#fbbf2440]"
        >
          <span className="text-lg">⚡</span>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-bold text-[#fbbf24]">
              COMBO ×{comboMultiplier}
            </span>
            <span className="text-[10px] text-[#94a3b8]">
              {comboCount} quests in a row
            </span>
          </div>
          {/* Pulsing dot */}
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-[#fbbf24]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
