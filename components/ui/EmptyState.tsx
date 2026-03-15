"use client";

import { motion } from "framer-motion";

/**
 * EmptyState (#74)
 * Framer Motion fade-in empty state for quest lists.
 *
 * Props:
 *   type: "no-quests" | "no-results" | "all-done" | "locked"
 */

type EmptyStateType = "no-quests" | "no-results" | "all-done" | "locked";

interface EmptyStateProps {
  type: EmptyStateType;
  className?: string;
}

const CONFIG: Record<
  EmptyStateType,
  { emoji: string; title: string; subtitle: string }
> = {
  "no-quests": {
    emoji: "🗺️",
    title: "Žádné questy",
    subtitle: "Vyber jiný filtr",
  },
  "no-results": {
    emoji: "🔍",
    title: "Nic nenalezeno",
    subtitle: "Zkus jiné klíčové slovo",
  },
  "all-done": {
    emoji: "🎉",
    title: "Všechno hotovo!",
    subtitle: "Jsi legenda 💜",
  },
  locked: {
    emoji: "🔒",
    title: "Vše zamčeno",
    subtitle: "Dokonči dřívější questy",
  },
};

export default function EmptyState({ type, className = "" }: EmptyStateProps) {
  const { emoji, title, subtitle } = CONFIG[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "48px 24px",
        gap: "12px",
      }}
    >
      {/* Emoji with subtle glow ring */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
        style={{
          fontSize: "56px",
          lineHeight: 1,
          filter: "drop-shadow(0 0 16px rgba(139,92,246,0.3))",
          marginBottom: "4px",
        }}
        role="img"
        aria-label={title}
      >
        {emoji}
      </motion.div>

      <p
        style={{
          color: "var(--text-primary)",
          fontFamily: "var(--font-fraunces), serif",
          fontSize: "1.25rem",
          fontWeight: 600,
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </p>

      <p
        style={{
          color: "var(--text-muted)",
          fontFamily: "inherit",
          fontSize: "0.875rem",
          margin: 0,
        }}
      >
        {subtitle}
      </p>
    </motion.div>
  );
}
