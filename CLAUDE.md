# CLAUDE.md — Evelyn's Quest Log App

## Přehled projektu

Interaktivní gamifikovaná quest log / task tracker app pro jednoho uživatele (Evelyn). 200 questů/projektů organizovaných do 10 aktů s XP systémem, level progression, achievement systémem, dependency tree, a filtrovacím UI. Data jsou statická (definovaná v kódu), stav (checkboxy, XP) se ukládá v localStorage + je exportovatelný jako JSON.

**Live reference projektu stejné autorky:** https://personality-assessment-vert.vercel.app/ (React 18 + Vite + Tailwind + Recharts)

**Zdrojový markdown se všemi 200 questy:** Přiložený soubor `evelyn-quest-log.md` — parsuj ho a extrahuj všechna data (questy, XP, tagy, prerekvizity, checkboxy).

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 4
- **Animace:** Framer Motion
- **Grafy:** Recharts (autorka ho zná a má ráda)
- **Confetti:** canvas-confetti
- **Zvuky:** Tone.js nebo jednoduché HTML5 Audio
- **Icons:** Lucide React
- **Font:** Maple Mono (monospace, autorka ho používá everywhere) + jeden display font (něco výrazného, ne Inter/Roboto)
- **Deploy:** Vercel
- **State:** localStorage (žádný backend, žádná databáze)
- **Package manager:** pnpm

---

## Design Direction

### Aesthetic: "Dark Purple Neon Vault"
Představ si herní achievement menu z Celeste nebo Hollow Knight, ale jako webová app. Tmavé pozadí, fialové accent barvy, jemný glow, pixel-art inspirované detaily (ale ne pixel art samotný — moderní, clean).

### Barvy (CSS variables)
```css
--bg-primary: #0a0a0f;        /* skoro černá s modrým nádechem */
--bg-secondary: #12121a;      /* card background */
--bg-tertiary: #1a1a2e;       /* hover, active states */
--accent-primary: #8b5cf6;    /* fialová — hlavní accent */
--accent-secondary: #a78bfa;  /* světlejší fialová */
--accent-glow: #8b5cf680;     /* glow efekt */
--text-primary: #e2e8f0;      /* hlavní text */
--text-secondary: #94a3b8;    /* secondary text */
--text-muted: #64748b;        /* muted */
--success: #22c55e;           /* completed quest */
--xp-gold: #fbbf24;           /* XP barva */
--danger: #ef4444;            /* locked/failed */
```

### Typografie
- **Headings:** Výrazný display font (Fraunces, Space Grotesk, nebo Outfit — autorka používala Fraunces + Outfit v jiném projektu "alBa")
- **Body:** Maple Mono nebo fallback JetBrains Mono
- **XP/Stats čísla:** Monospace, bold, glow efekt

### Layout principy
- Mobile-first, responsive do ultrawide (Samsung G9 5120x1440)
- Na ultrawide: sidebar navigation vlevo, content vpravo (dashboard layout)
- Na mobile: bottom tab navigation
- Generous spacing, card-based quest items
- Subtle glassmorphism na cards (backdrop-blur, semi-transparent bg)
- Smooth page transitions (Framer Motion)

### Micro-interactions
- Quest completion: checkbox → confetti burst + XP float-up animation + success sound
- Level up: full-screen overlay s nový level name + particle efekt
- Filter/sort: smooth layout animation (Framer Motion AnimatePresence)
- XP bar: animated fill with glow pulse
- Hover na quest card: subtle lift + border glow
- Achievement unlock: toast notification s achievement icon + zvuk

---

## Datový Model

### Quest
```typescript
interface Quest {
  id: number;                    // 1-200
  title: string;                 // "Obsidian Vault: Second Brain"
  description: string;           // Plný popis
  quickStart: string;            // "Jak začít za 5 minut" tip
  timeEstimate: string;          // "2h", "30min/den", "ongoing"
  difficulty: 1 | 2 | 3 | 4 | 5;
  xp: number;                   // 10, 25, 50, 100, 200
  prerequisites: number[];       // IDs jiných questů
  tags: string[];               // ["#adhd", "#mac", "#foundational"]
  act: number;                   // 1-10 (akt/kategorie)
  actName: string;               // "Základy", "System", etc.
  checkpoints: string[];         // Sub-tasky ["Vault vytvořen", "Složky hotové", ...]
  completedCheckpoints: boolean[]; // stav (persisted)
  completed: boolean;            // celý quest hotový
  completedAt?: string;          // ISO date
}
```

### User State (localStorage)
```typescript
interface UserState {
  totalXP: number;
  level: number;
  levelName: string;
  questStates: Record<number, {
    completed: boolean;
    completedAt?: string;
    checkpoints: boolean[];
  }>;
  achievements: string[];        // unlocked achievement IDs
  startDate: string;             // kdy začala používat app
}
```

### Level System
```typescript
const LEVELS = [
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
```

### Achievements
```typescript
const ACHIEVEMENTS = [
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
```

### Akty (kategorie)
```typescript
const ACTS = [
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
  { id: 11, name: "Side Quests", emoji: "🔮", range: [75, 200] },
];
```

---

## Stránky / Routes

### `/` — Dashboard (hlavní stránka)
- **XP Bar:** Aktuální XP / XP pro další level. Animated fill, glow, level name.
- **Stats Overview:** Celkový XP, Level, Dokončené questy (X/200), Aktuální streak
- **Radar Chart:** Progress per akt (Recharts RadarChart)
- **Recent Activity:** Posledních 5 dokončených questů s timestamps
- **Quick Actions:** "Random quest" button (vybere random nedokončený quest), "Continue" (poslední rozpracovaný)
- **Achievement Showcase:** Posledních 3 odemčené achievementy

### `/quests` — Quest List
- **Filtrování:** Per akt, per difficulty (★-★★★★★), per tag, status (todo/done/locked)
- **Řazení:** Default (by ID), by difficulty, by XP, by completion status
- **Search:** Fulltext search přes title + description
- **View modes:** Card grid (default), Compact list
- **Každý quest card zobrazuje:** Číslo, title, difficulty stars, XP badge, status (todo/locked/done), tags, progress bar (checkpoints)

### `/quests/[id]` — Quest Detail
- **Full quest info:** Title, description, quickStart tip, time estimate, difficulty, XP
- **Checkpoints:** Interaktivní checkboxy. Každý checkbox = micro-progress.
- **Prerequisites:** Linky na požadované questy (s jejich statusem — done/locked)
- **Dependencies:** Questy které na tomhle závisí ("Odemkne: #039 RAG Pipeline")
- **Complete button:** Až jsou všechny checkpoints done, zobrazí se "Complete Quest" button → confetti + XP
- **Navigation:** Prev/Next quest šipky

### `/tree` — Dependency Tree
- **Vizuální strom/graf** prerekvizit. Ideálně interaktivní (nodes klikatelné → quest detail).
- Jednoduchá implementace: grouped by act, s šipkami mezi questy.
- Advanced: force-directed graph (d3-force) nebo hierarchický layout.
- Color-coded: zelená (done), fialová (available), šedá (locked)

### `/achievements` — Achievement Gallery
- Grid achievementů. Odemčené = barevné + glow. Zamčené = grayscale + "???" description.
- Achievement detail: kdy odemčeno, co bylo potřeba.

### `/stats` — Statistiky
- **XP Over Time:** Line chart (Recharts)
- **Quests per Act:** Bar chart
- **Difficulty Distribution:** Pie/donut chart (kolik ★ vs ★★★★★ jsem udělala)
- **Tag Cloud:** Nejčastější tagy
- **Streaks:** Kalendář heatmap (jako GitHub contributions)
- **Time Since Start:** "X dní od prvního questu"
- **Estimated Completion:** "Při tvém tempu budeš GOAT za ~X dní"

---

## Klíčové Implementační Detaily

### Data Loading
Všechna quest data jsou statická — definuj je v `src/data/quests.ts` jako TypeScript array. Parsuj z přiloženého markdown souboru. Stav (completion, checkpoints) se ukládá/načítá z localStorage.

### Confetti
```typescript
import confetti from 'canvas-confetti';

const questComplete = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#8b5cf6', '#a78bfa', '#fbbf24', '#22c55e'],
  });
};

const levelUp = () => {
  // Full celebration
  confetti({ particleCount: 200, spread: 160, origin: { y: 0.3 } });
  // Play sound
};
```

### Sound Effects
Minimální, ne otravné. 3 zvuky:
1. **Checkpoint complete:** Krátký "tick" (100ms)
2. **Quest complete:** Satisfying "ding" + whoosh (500ms)  
3. **Level up:** Fanfare (1s)
4. **Achievement:** Unlock sound (500ms)

Použij Web Audio API nebo předgenerované .mp3 soubory v `/public/sounds/`.

### localStorage Schema
```typescript
const STORAGE_KEY = 'evelyn-quest-log';

// Save
localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));

// Load
const saved = localStorage.getItem(STORAGE_KEY);
const state = saved ? JSON.parse(saved) : defaultState;
```

### Export/Import
- **Export:** JSON download s celým stavem
- **Import:** JSON upload → merge/overwrite
- **Reset:** Smazat vše (s confirm dialogem)

---

## Project Structure

```
evelyn-quest-log/
├── public/
│   ├── sounds/
│   │   ├── tick.mp3
│   │   ├── complete.mp3
│   │   ├── levelup.mp3
│   │   └── achievement.mp3
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, font loading, providers
│   │   ├── page.tsx            # Dashboard
│   │   ├── quests/
│   │   │   ├── page.tsx        # Quest list
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Quest detail
│   │   ├── tree/
│   │   │   └── page.tsx        # Dependency tree
│   │   ├── achievements/
│   │   │   └── page.tsx        # Achievement gallery
│   │   └── stats/
│   │       └── page.tsx        # Statistics
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx     # Desktop nav
│   │   │   ├── BottomNav.tsx   # Mobile nav
│   │   │   └── Header.tsx      # XP bar, level badge
│   │   ├── quest/
│   │   │   ├── QuestCard.tsx
│   │   │   ├── QuestDetail.tsx
│   │   │   ├── QuestCheckpoint.tsx
│   │   │   ├── QuestFilters.tsx
│   │   │   └── DifficultyStars.tsx
│   │   ├── stats/
│   │   │   ├── XPBar.tsx
│   │   │   ├── RadarChart.tsx
│   │   │   ├── ActivityHeatmap.tsx
│   │   │   └── StatsCards.tsx
│   │   ├── achievements/
│   │   │   ├── AchievementCard.tsx
│   │   │   └── AchievementToast.tsx
│   │   └── ui/
│   │       ├── ConfettiTrigger.tsx
│   │       ├── SoundPlayer.tsx
│   │       ├── SearchInput.tsx
│   │       └── TagBadge.tsx
│   ├── data/
│   │   ├── quests.ts           # All 200 quests
│   │   ├── achievements.ts     # Achievement definitions
│   │   ├── levels.ts           # Level thresholds
│   │   └── acts.ts             # Act metadata
│   ├── hooks/
│   │   ├── useQuestState.ts    # Quest completion logic + localStorage
│   │   ├── useXP.ts            # XP calculation + level
│   │   ├── useAchievements.ts  # Achievement checking
│   │   ├── useSound.ts         # Sound playback
│   │   └── useStreak.ts        # Streak tracking
│   ├── lib/
│   │   ├── storage.ts          # localStorage helpers
│   │   ├── utils.ts            # cn() helper, formatters
│   │   └── constants.ts
│   └── styles/
│       └── globals.css         # Tailwind + CSS variables + custom styles
├── tailwind.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
├── .gitignore
├── CLAUDE.md                   # This file
├── evelyn-quest-log.md         # Source data
└── README.md
```

---

## Deployment

### Local Dev
```bash
pnpm install
pnpm dev
# → http://localhost:3000
```

### Build
```bash
pnpm build
pnpm start
```

### Vercel Deploy
```bash
# Push to GitHub
git init
git add .
git commit -m "feat: initial quest log app"
git remote add origin https://github.com/artdukintsugi/quest-log.git
git push -u origin main

# Vercel auto-deploys from GitHub
# Framework: Next.js (auto-detected)
# Build: pnpm build
# Output: .next
```

---

## Kontext o Autorce (pro personalizaci)

Evelyn Vybíralová, 21, MTF, studentka FEL ČVUT OI (2. ročník, game dev & computer graphics). Bydlí v Praze u mámy. Přítelkyně Mája, nejlepší kamarádka Johanka.

**Diagnózy (in progress):** ADHD (čeká diagnostiku 10.4.2026), BPD (Bohnice), CPTSD, disociace. Léky: Venlafaxin 150mg, Trittico 25mg, Progesteron Besins, Neofollin (E2), Lamotrigin.

**Tech:** Arch Linux + Sway + Kitty + Bash, macOS power user (SketchyBar, Raycast, Karabiner), React/Next.js, Java, C++, Python. Miluje customizaci, statistiky, a "dělání věcí po svém."

**Hudba:** Kanye West (pre-2021), Kendrick Lamar, King Crimson, Car Seat Headrest, The Cure, Metallica, Tyler the Creator, Pink Floyd, MCR, K/DA, český rap (Yzomandias, CA$HANOVA BULHAR). Chce tvořit: MF DOOM × early Kanye × Depeche Mode Memphisto horrorcore.

**Hry:** Terraria (582h), Celeste (77h, 29/32), Disco Elysium, Persona 5 Royal, Hollow Knight, Firewatch. Narrative indie focus.

**Estetika:** Dark, fialová, "pretty but functional." Catppuccin/Dracula theming. Maple Mono font.

**ADHD specifika pro UX:**
- Zero friction — věci musí být dostupné na 1 klik
- Okamžitý feedback (animace, zvuky, confetti)
- Vizuální progress (XP bar, checkboxy, heatmap)
- Gamifikace = dopamin = motivace
- "Good enough" checkpoints — nemusíš dokončit celý quest, i checkpoint je progress
- Random quest button pro "nevím co dělat" momenty

---

## Poznámky pro Claude Code

1. **Parsuj quest data z `evelyn-quest-log.md`** — extrahuj všech 200 questů do TypeScript dat. Hlavní questy (001-074) mají plný detail. Side questy (075-200) jsou v tabulce — parsuj je taky.

2. **Design je KRITICKÝ.** Tohle není generic todo app. Je to osobní gamifikovaný tracker. Musí vypadat jako achievement menu z AAA hry, ne jako Bootstrap template. Fialová, glow efekty, smooth animace, custom fonty.

3. **Mobile-first ale ultrawide-aware.** Autorka má Samsung G9 OLED (5120x1440) — na ultrawide to musí vypadat epic, ne jen "roztažené."

4. **Zvuky a confetti nejsou nice-to-have, jsou must-have.** Celý point je dopaminový feedback pro ADHD mozek.

5. **localStorage je ok pro v1.** Žádný backend. Export/import JSON pro backup.

6. **Jazykový mix:** UI labels česky, technické termíny anglicky (tak jak autorka přirozeně mluví). Quest content je v češtině s anglickými tech terms.

7. **Commituj průběžně** s conventional commits (`feat:`, `fix:`, `style:`, `refactor:`).

8. **Po dokončení:** Push na GitHub `artdukintsugi/quest-log`, deploy na Vercel.
