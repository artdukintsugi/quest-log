import confetti from "canvas-confetti";

const OLED_COLORS = ["#8b5cf6", "#a78bfa", "#c084fc", "#e879f9", "#fbbf24", "#22c55e"];

export function fireQuestComplete() {
  confetti({
    particleCount: 120,
    spread: 75,
    origin: { y: 0.6 },
    colors: OLED_COLORS,
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
