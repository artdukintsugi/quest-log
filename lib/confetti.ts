import confetti from "canvas-confetti";

const OLED_COLORS = ["#8b5cf6", "#a78bfa", "#c084fc", "#e879f9", "#fbbf24", "#22c55e"];

// #523 — Confetti presets per quest type
const CONFETTI_PRESETS: Record<string, string[]> = {
  coding:    ["#8b5cf6", "#a78bfa", "#c084fc", "#6366f1"],
  legendary: ["#fbbf24", "#f59e0b", "#fde68a", "#ffffff"],
  wellness:  ["#22c55e", "#4ade80", "#86efac", "#a7f3d0"],
  creative:  ["#ec4899", "#f472b6", "#f9a8d4", "#e879f9"],
  school:    ["#38bdf8", "#7dd3fc", "#bae6fd", "#a78bfa"],
  gaming:    ["#ef4444", "#f97316", "#fbbf24", "#22c55e"],
  default:   OLED_COLORS,
};

function getPreset(tags: string[], xp: number, act: number): string[] {
  if (xp >= 200) return CONFETTI_PRESETS.legendary;
  if (act === 4) return CONFETTI_PRESETS.creative;
  if (act === 3) return CONFETTI_PRESETS.school;
  if (act === 8) return CONFETTI_PRESETS.wellness;
  if (act === 7) return CONFETTI_PRESETS.gaming;
  if (tags.some(t => ["#coding", "#python", "#rust", "#typescript", "#javascript", "#nextjs"].includes(t)))
    return CONFETTI_PRESETS.coding;
  return CONFETTI_PRESETS.default;
}

export function fireQuestComplete(tags: string[] = [], xp = 50, act = 1) {
  const colors = getPreset(tags, xp, act);
  confetti({
    particleCount: 120,
    spread: 75,
    origin: { y: 0.6 },
    colors,
    gravity: 1.1,
  });
}

export function fireLevelUp() {
  confetti({ particleCount: 250, spread: 160, origin: { y: 0.3 }, colors: OLED_COLORS });
  setTimeout(() => {
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 }, colors: OLED_COLORS });
  }, 300);
  setTimeout(() => {
    confetti({ particleCount: 80, spread: 120, origin: { y: 0.4 }, colors: OLED_COLORS });
  }, 600);
}

export function fireAchievement() {
  confetti({
    particleCount: 70,
    spread: 55,
    origin: { y: 0.7, x: 0.5 },
    colors: ["#8b5cf6", "#c084fc", "#fbbf24"],
    scalar: 1.3,
  });
}
