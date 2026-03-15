export interface Level {
  level: number;
  xp: number;
  name: string;
}

export const LEVELS: Level[] = [
  { level: 1, xp: 0, name: "git init" },
  { level: 2, xp: 50, name: "Script Kiddie" },
  { level: 3, xp: 150, name: "Config Warrior" },
  { level: 4, xp: 300, name: "Pipeline Architect" },
  { level: 5, xp: 500, name: "Dotfile Artisan" },
  { level: 6, xp: 750, name: "Shader Witch" },
  { level: 7, xp: 1100, name: "Fullstack Alchemist" },
  { level: 8, xp: 1500, name: "System Whisperer" },
  { level: 9, xp: 2000, name: "Creative Polymath" },
  { level: 10, xp: 2750, name: "Digital Kanye" },
  { level: 11, xp: 3500, name: "Vault Keeper" },
  { level: 12, xp: 4500, name: "Evelyn.exe" },
  { level: 13, xp: 6000, name: "✨ GOAT ✨" },
];

export function getLevelInfo(xp: number): { current: Level; next: Level } {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xp) {
      current = LEVELS[i];
      next = LEVELS[i + 1] ?? LEVELS[LEVELS.length - 1];
    }
  }
  return { current: current!, next: next! };
}
