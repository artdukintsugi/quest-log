export type QuestTier = "common" | "rare" | "epic" | "legendary";

export interface TierMeta {
  label: string;
  color: string;       // Tailwind text color
  borderColor: string; // Tailwind border color
  glowColor: string;   // CSS box-shadow color
  icon: string;        // emoji
}

export const TIER_META: Record<QuestTier, TierMeta> = {
  common: {
    label: "Common",
    color: "text-slate-400",
    borderColor: "border-slate-600",
    glowColor: "transparent",
    icon: "◇",
  },
  rare: {
    label: "Rare",
    color: "text-blue-400",
    borderColor: "border-blue-500",
    glowColor: "#3b82f680",
    icon: "◈",
  },
  epic: {
    label: "Epic",
    color: "text-violet-400",
    borderColor: "border-violet-500",
    glowColor: "#8b5cf680",
    icon: "◆",
  },
  legendary: {
    label: "Legendary",
    color: "text-amber-400",
    borderColor: "border-amber-500",
    glowColor: "#fbbf2480",
    icon: "★",
  },
};

/**
 * Derive quest tier from its XP reward.
 * 10–25 XP  → common
 * 50 XP     → rare
 * 100 XP    → epic
 * 200 XP    → legendary
 */
export function getQuestTier(xp: number): QuestTier {
  if (xp >= 200) return "legendary";
  if (xp >= 100) return "epic";
  if (xp >= 50)  return "rare";
  return "common";
}

export function getTierMeta(xp: number): TierMeta {
  return TIER_META[getQuestTier(xp)];
}
