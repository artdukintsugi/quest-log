export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  /** How this item is earned (display text) */
  unlockHint: string;
}

export const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: "obsidian-crystal",
    name: "Obsidian Crystal",
    icon: "🪨",
    description: "A shard of crystallised knowledge, forged in the Základy.",
    unlockHint: "Complete Act 1 — Základy",
  },
  {
    id: "m5-chip",
    name: "M5 Chip",
    icon: "🔲",
    description: "A legendary silicon artifact. Your environment is perfected.",
    unlockHint: "Complete Act 2 — Stroje & Prostředí",
  },
  {
    id: "fel-diploma",
    name: "FEL Diploma",
    icon: "🎓",
    description: "The sacred scroll of the Faculty of Electrical Engineering.",
    unlockHint: "Complete Act 3 — Škola",
  },
  {
    id: "vinyl-record",
    name: "Vinyl Record",
    icon: "💿",
    description: "Pressed in Prague, mastered in the void. Your sound is real.",
    unlockHint: "Complete Act 6 — Audio & Hudba",
  },
  {
    id: "game-cartridge",
    name: "Game Cartridge",
    icon: "🎮",
    description: "582 hours of Terraria live in this chip.",
    unlockHint: "Complete Act 7 — Gaming",
  },
  {
    id: "purple-gem",
    name: "Purple Gem",
    icon: "💎",
    description: "A gem that resonates with level 5 energy.",
    unlockHint: "Reach Level 5",
  },
  {
    id: "golden-star",
    name: "Golden Star",
    icon: "⭐",
    description: "Digital Kanye energy crystallised into a star.",
    unlockHint: "Reach Level 10",
  },
  {
    id: "goat-trophy",
    name: "GOAT Trophy",
    icon: "🏆",
    description: "The greatest of all time. No notes.",
    unlockHint: "Reach Level 13 — ✨ GOAT ✨",
  },
  {
    id: "streak-flame",
    name: "Streak Flame",
    icon: "🔥",
    description: "Seven consecutive days of pure momentum.",
    unlockHint: "Achieve a 7-day streak",
  },
  {
    id: "completionist-crown",
    name: "Completionist Crown",
    icon: "👑",
    description: "All quests. Every single one. You are everything.",
    unlockHint: "Complete all 250+ quests",
  },
];

export type ItemId = (typeof INVENTORY_ITEMS)[number]["id"];
