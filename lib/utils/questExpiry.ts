import { Quest } from "@/lib/data/quests";

const URGENT_TAGS = ["#škola", "#fel", "#studium"];

const URGENT_KEYWORDS = [
  "zkouška",
  "zkoušk",
  "deadline",
  "semestr",
  "odevzd",
  "zápočet",
  "kolokv",
  "exam",
  "submit",
  "due",
];

/**
 * Returns true if a quest should show a visual "burning" urgency indicator.
 * Criteria: has a school-related tag AND title/description contains deadline keywords.
 */
export function isUrgentQuest(quest: Quest): boolean {
  const hasSchoolTag = quest.tags.some((t) => URGENT_TAGS.includes(t.toLowerCase()));
  if (!hasSchoolTag) return false;

  const haystack = `${quest.title} ${quest.description}`.toLowerCase();
  return URGENT_KEYWORDS.some((kw) => haystack.includes(kw));
}
