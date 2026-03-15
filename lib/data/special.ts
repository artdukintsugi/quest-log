import { Quest } from "@/lib/data/quests";
import { SpecialAttributes } from "@/lib/storage";

export type SpecialKey = keyof SpecialAttributes;

export interface SpecialAttrDef {
  key: SpecialKey;
  label: string;
  fullName: string;
  icon: string;
  color: string; // Tailwind bg color for the bar
  description: string;
  /** Tags that award points in this attribute */
  tags: string[];
  /** Acts that award points in this attribute */
  acts: number[];
}

export const SPECIAL_ATTRS: SpecialAttrDef[] = [
  {
    key: "S",
    label: "S",
    fullName: "Strength",
    icon: "💪",
    color: "bg-red-500",
    description: "Physical wellbeing and resilience",
    tags: ["#wellbeing", "#sport", "#zdraví", "#fitness", "#pohyb"],
    acts: [8], // Well-being
  },
  {
    key: "P",
    label: "P",
    fullName: "Perception",
    icon: "👁️",
    color: "bg-teal-500",
    description: "Research, signals, and situational awareness",
    tags: ["#sdr", "#research", "#signals", "#hardware"],
    acts: [13], // Signals & Hardware
  },
  {
    key: "E",
    label: "E",
    fullName: "Endurance",
    icon: "⏳",
    color: "bg-orange-500",
    description: "Long-term projects and persistence",
    tags: ["#ongoing", "#dlouhodobý", "#longterm"],
    acts: [9, 10], // Homelab, Dream Projekty
  },
  {
    key: "C",
    label: "C",
    fullName: "Charisma",
    icon: "✨",
    color: "bg-pink-500",
    description: "Social, community and communication",
    tags: ["#community", "#social", "#komunikace", "#sdílení"],
    acts: [19], // Social & Future
  },
  {
    key: "I",
    label: "I",
    fullName: "Intelligence",
    icon: "🧠",
    color: "bg-violet-500",
    description: "Learning, coding and academic mastery",
    tags: ["#škola", "#fel", "#kód", "#dev", "#ai", "#studium"],
    acts: [3, 5], // Škola, AI & Automatizace
  },
  {
    key: "A",
    label: "A",
    fullName: "Agility",
    icon: "⚡",
    color: "bg-yellow-500",
    description: "Productivity, workflow and system efficiency",
    tags: ["#systém", "#productivity", "#workflow", "#mac", "#linux"],
    acts: [2], // Stroje & Prostředí
  },
  {
    key: "L",
    label: "L",
    fullName: "Luck",
    icon: "🎲",
    color: "bg-emerald-500",
    description: "Creative exploration and happy accidents",
    tags: ["#kreativní", "#art", "#design", "#hudba", "#games"],
    acts: [4, 6, 7], // Kreativní, Audio & Hudba, Gaming
  },
];

/** How many attribute points a quest awards (based on XP) */
export function questAttributePoints(xp: number): number {
  if (xp >= 200) return 3;
  if (xp >= 100) return 2;
  return 1;
}

/**
 * Returns which attribute keys a quest contributes to.
 */
export function getQuestAttributes(quest: Quest): SpecialKey[] {
  const keys: SpecialKey[] = [];
  for (const attr of SPECIAL_ATTRS) {
    const tagMatch = quest.tags.some((t) => attr.tags.includes(t.toLowerCase()));
    const actMatch = attr.acts.includes(quest.act);
    if (tagMatch || actMatch) keys.push(attr.key);
  }
  // Default: everything contributes to at least Intelligence
  if (keys.length === 0) keys.push("I");
  return keys;
}

/**
 * Recomputes all SPECIAL points from completed quests.
 */
export function computeSpecial(
  questStates: Record<number, { completed: boolean }>,
  quests: Quest[]
): SpecialAttributes {
  const attrs: SpecialAttributes = { S: 0, P: 0, E: 0, C: 0, I: 0, A: 0, L: 0 };
  for (const quest of quests) {
    if (!questStates[quest.id]?.completed) continue;
    const points = questAttributePoints(quest.xp);
    const keys = getQuestAttributes(quest);
    for (const key of keys) {
      attrs[key] += points;
    }
  }
  return attrs;
}
