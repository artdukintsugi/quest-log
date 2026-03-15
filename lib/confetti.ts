import confetti from "canvas-confetti";

export function fireQuestComplete() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#8b5cf6", "#a78bfa", "#fbbf24", "#22c55e"],
  });
}

export function fireLevelUp() {
  confetti({ particleCount: 200, spread: 160, origin: { y: 0.3 } });
  setTimeout(() => {
    confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
  }, 300);
}

export function fireAchievement() {
  confetti({
    particleCount: 60,
    spread: 50,
    origin: { y: 0.7, x: 0.5 },
    colors: ["#8b5cf6", "#fbbf24"],
    scalar: 1.2,
  });
}
