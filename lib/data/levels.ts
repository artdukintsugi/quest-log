export interface Level {
  level: number;
  xp: number;
  name: string;
}

// XP thresholds use formula: XP = floor(level^1.5 * 100)
// level 1 = 0 (starting), level 2 = floor(2^1.5*100) = 282, etc.
// Values manually rounded to friendly numbers while preserving the curve shape.
export const LEVELS: Level[] = [
  { level: 1,  xp: 0,    name: "git init" },
  { level: 2,  xp: 282,  name: "Script Kiddie" },
  { level: 3,  xp: 519,  name: "Config Warrior" },
  { level: 4,  xp: 800,  name: "Pipeline Architect" },
  { level: 5,  xp: 1118, name: "Dotfile Artisan" },
  { level: 6,  xp: 1469, name: "Shader Witch" },
  { level: 7,  xp: 1852, name: "Fullstack Alchemist" },
  { level: 8,  xp: 2263, name: "System Whisperer" },
  { level: 9,  xp: 2702, name: "Creative Polymath" },
  { level: 10, xp: 3162, name: "Digital Kanye" },
  { level: 11, xp: 3640, name: "Vault Keeper" },
  { level: 12, xp: 4157, name: "Evelyn.exe" },
  { level: 13, xp: 4800, name: "✨ GOAT ✨" },
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
