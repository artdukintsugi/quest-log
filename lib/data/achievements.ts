export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-quest", name: "First Blood", description: "Dokonči svůj první quest", icon: "⚔️" },
  { id: "first-act", name: "Act I Complete", description: "Dokonči všechny Foundation questy", icon: "🧠" },
  { id: "week-streak", name: "7 Day Streak", description: "Dokonči quest 7 dní v řadě", icon: "🔥" },
  { id: "xp-100", name: "Century", description: "Nasbírej 100 XP", icon: "💯" },
  { id: "xp-1000", name: "Grinder", description: "Nasbírej 1000 XP", icon: "⚡" },
  { id: "level-5", name: "Dotfile Artisan", description: "Dosáhni level 5", icon: "🎨" },
  { id: "level-10", name: "Digital Kanye", description: "Dosáhni level 10", icon: "🐻" },
  { id: "goat", name: "GOAT", description: "Dosáhni level 13 (6000+ XP)", icon: "✨" },
  { id: "creative-10", name: "Creative Soul", description: "Dokonči 10 kreativních questů", icon: "🎵" },
  { id: "school-all", name: "FEL Graduate", description: "Dokonči všechny školní questy", icon: "🎓" },
  { id: "detox-30", name: "Clean Slate", description: "Quest #171 — 30 dní detox", icon: "🌿" },
  { id: "maja-letter", name: "Love Letter", description: "Quest #199 — Dopis Máje", icon: "💜" },
  { id: "completionist", name: "Completionist", description: "Dokonči všech 200 questů", icon: "👑" },
];
