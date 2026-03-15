import { PlayerClass } from "@/lib/storage";

export interface ClassDef {
  id: PlayerClass;
  label: string;
  icon: string;
  description: string;
  /** Tags that get the XP bonus */
  bonusTags: string[];
  /** Acts that get the XP bonus */
  bonusActs: number[];
  bonusPercent: number; // 0.10 = 10%
}

export const CLASSES: ClassDef[] = [
  {
    id: "Coder",
    label: "Coder",
    icon: "🖥️",
    description: "+10% XP on tech quests. Debug the matrix.",
    bonusTags: ["#systém", "#mac", "#linux", "#terminal", "#kód", "#dev"],
    bonusActs: [2, 9], // Stroje & Prostředí, Homelab
    bonusPercent: 0.1,
  },
  {
    id: "Artist",
    label: "Artist",
    icon: "🎨",
    description: "+10% XP on creative quests. Make it beautiful.",
    bonusTags: ["#kreativní", "#design", "#visual", "#art"],
    bonusActs: [4, 10], // Kreativní, Dream Projekty
    bonusPercent: 0.1,
  },
  {
    id: "Scholar",
    label: "Scholar",
    icon: "🎓",
    description: "+10% XP on school quests. Knowledge is power.",
    bonusTags: ["#škola", "#fel", "#studium"],
    bonusActs: [3], // Škola
    bonusPercent: 0.1,
  },
  {
    id: "Hacker",
    label: "Hacker",
    icon: "🔮",
    description: "+10% XP on system quests. Own your machine.",
    bonusTags: ["#systém", "#privacy", "#linux", "#sdr", "#homelab"],
    bonusActs: [9], // Homelab
    bonusPercent: 0.1,
  },
  {
    id: "Musician",
    label: "Musician",
    icon: "🎵",
    description: "+10% XP on audio quests. Frequency is everything.",
    bonusTags: ["#hudba", "#audio", "#production"],
    bonusActs: [6], // Audio & Hudba
    bonusPercent: 0.1,
  },
];

export function getClassDef(cls: PlayerClass): ClassDef | null {
  if (!cls) return null;
  return CLASSES.find((c) => c.id === cls) ?? null;
}

/**
 * Returns the XP multiplier for a given quest given the player's class.
 * Returns 1.0 if no bonus applies, 1.1 if a bonus applies.
 */
export function getClassXPMultiplier(
  classDef: ClassDef | null,
  questTags: string[],
  questAct: number
): number {
  if (!classDef) return 1;
  const tagMatch = questTags.some((t) => classDef.bonusTags.includes(t));
  const actMatch = classDef.bonusActs.includes(questAct);
  return tagMatch || actMatch ? 1 + classDef.bonusPercent : 1;
}
