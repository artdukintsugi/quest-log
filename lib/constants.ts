/** How long a combo window lasts in milliseconds (30 minutes) */
export const COMBO_WINDOW_MS = 30 * 60 * 1000;

/** Combo XP multiplier thresholds */
export const COMBO_THRESHOLDS = [
  { count: 5, multiplier: 2 },
  { count: 3, multiplier: 1.5 },
  { count: 0, multiplier: 1 },
] as const;

/** Daily bonus XP multiplier */
export const DAILY_BONUS_MULTIPLIER = 2;

/** Class XP bonus percentage */
export const CLASS_BONUS_PERCENT = 0.1;

/** SPECIAL attribute visual bar cap (for display scaling) */
export const SPECIAL_BAR_MAX = 50;

/** Minimum streak days to earn the Streak Flame inventory item */
export const STREAK_FLAME_THRESHOLD = 7;
