export interface Act {
  id: number;
  name: string;
  emoji: string;
  range: [number, number];
}

export const ACTS: Act[] = [
  { id: 1, name: "Základy", emoji: "🧠", range: [1, 10] },
  { id: 2, name: "Stroje & Prostředí", emoji: "🖥️", range: [11, 20] },
  { id: 3, name: "Škola", emoji: "🎓", range: [21, 28] },
  { id: 4, name: "Kreativní", emoji: "🎨", range: [29, 38] },
  { id: 5, name: "AI & Automatizace", emoji: "🤖", range: [39, 45] },
  { id: 6, name: "Audio & Hudba", emoji: "🎧", range: [46, 50] },
  { id: 7, name: "Gaming", emoji: "🎮", range: [51, 60] },
  { id: 8, name: "Well-being", emoji: "💜", range: [61, 65] },
  { id: 9, name: "Homelab", emoji: "🏠", range: [66, 68] },
  { id: 10, name: "Dream Projekty", emoji: "🌟", range: [69, 74] },
  { id: 11, name: "Side Quests", emoji: "🔮", range: [75, 251] },
  { id: 12, name: "Bonus Questy", emoji: "💎", range: [201, 210] },
  { id: 13, name: "Signals & Hardware", emoji: "🛰️", range: [211, 215] },
  { id: 14, name: "Advanced FEL", emoji: "🎓", range: [216, 220] },
  { id: 15, name: "Game Dev Advanced", emoji: "🎮", range: [221, 224] },
  { id: 16, name: "Music & Aesthetics", emoji: "🎵", range: [225, 229] },
  { id: 17, name: "Wellness Systems", emoji: "🧘", range: [230, 234] },
  { id: 18, name: "Infrastructure", emoji: "🔧", range: [235, 249] },
  { id: 19, name: "Social & Future", emoji: "🌍", range: [239, 242] },
  { id: 20, name: "Meta Quests", emoji: "🏆", range: [243, 250] },
];
