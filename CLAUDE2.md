# CLAUDE2.md — Quest Log Major Upgrade

## Instrukce pro Claude Code

Přečti tento celý soubor. Pak se zeptej na VŠECHNA potvrzení najednou (jeden blok otázek). Jakmile dostaneš "yes" nebo "go", začni pracovat. Na konci napiš: **"Všechno je hotové, můžeš jít spát. Ráno to najdeš deployed. 💜"**

---

## Co existuje

Repo: `https://github.com/artdukintsugi/quest-log`
Stack: Next.js (App Router) + TypeScript + Tailwind
Stav: Funkční MVP s 200 questy, ale vizuálně "cheap" — vypadá jako první draft, ne jako polished app.

Struktura:
```
app/          — Next.js App Router pages
components/   — UI komponenty
context/      — React context (pravděpodobně quest state)
lib/          — Data, utils
```

---

## Tvůj úkol: VISUAL & UX OVERHAUL

Nepiš app od nuly. Upgraduj existující kód. Zachovej funkčnost, data, strukturu. Zlepši DESIGN, ANIMACE, FEEDBACK, a POLISH.

---

## 1. DESIGN OVERHAUL

### Problém
Aktuální design vypadá jako generic dark mode dashboard. Chybí mu: textura, hloubka, glow efekty, výrazná typografie, micro-interakce, a celkový "wow" faktor.

### Cílová estetika: "Dark Vault" 
Představ si achievement menu z Hollow Knight nebo Celeste, nebo inventory screen z Persona 5. Tmavé, atmosférické, s jemnými světelnými efekty. NE generic SaaS dashboard.

### Konkrétní změny

#### Barvy — přidej hloubku
```css
/* Aktuální palette je ok, ale chybí textury a gradient */
/* Přidej: */
--bg-gradient: radial-gradient(ellipse at top, #1a1030 0%, #0a0a0f 50%);
--card-border: 1px solid rgba(139, 92, 246, 0.15);
--card-glow-hover: 0 0 20px rgba(139, 92, 246, 0.1);
--card-bg: rgba(18, 18, 26, 0.8);
--backdrop-blur: backdrop-filter: blur(12px);
```

#### Pozadí
- Body background: Jemný radial gradient (tmavě fialový uprostřed nahoře → černá)
- Přidej SUBTILNÍ noise texture overlay (CSS: `background-image: url("data:image/svg+xml,...")` nebo tiny-noise pattern). Opacity 0.02-0.05. Přidá to "texturu" která oddělí app od generic flat designu.
- Bonus: Jemné plovoucí particles v pozadí (CSS-only nebo lightweight canvas). VELMI subtilní, jen atmosféra. Jako prach v slunečním paprsku.

#### Cards
- Glassmorphism: `backdrop-blur(12px)` + `bg-opacity-80` + jemný border (`border-white/5`)
- Hover: border glow pulse (transition na box-shadow)
- Completed quest cards: Jemný zelený/fialový shimmer efekt na border

#### Typografie
- Přidej Google Font: **Fraunces** (display, variable) pro headings — má charakter, je výrazný
- Body: **JetBrains Mono** nebo **Maple Mono** (monospace pro tech feel)
- XP čísla a stats: Monospace, `text-shadow: 0 0 10px var(--xp-gold)` pro glow
- Level name: Větší, bold, s fialovým glow

#### XP Bar
- Aktuální je pravděpodobně basic progress bar
- Upgraduj: Animated gradient fill (fialová → zlatá), glow pulse na leading edge, particle trail efekt
- Při hover: zobraz tooltip s přesným XP / next level
- Transition: smooth width animation (500ms ease-out)

#### Sidebar / Navigation
- Přidej subtle gradient na sidebar background
- Active item: fialový glow + accent line vlevo
- Icons: Přidej Lucide icons ke každé nav položce
- Level badge v sidebar: kruhový progress ring kolem level čísla
- Sidebar collapse na menších obrazovkách → hamburger menu

---

## 2. ANIMACE & MICRO-INTERAKCE

### Framer Motion všude
Pokud ještě není v projektu: `pnpm add framer-motion`

#### Page transitions
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
```

#### Quest card animations
- Stagger on mount: Cards se objeví postupně (50ms delay between each)
- Hover: `scale(1.02)` + border glow
- Click: Subtle press effect `scale(0.98)` → navigate
- Completion: Card se "rozsvítí" (border + background pulse)

#### Checkbox / Checkpoint
- Custom checkbox (ne browser default): fialový check mark, animated SVG path draw
- Při check: micro-confetti burst (3-5 particles, lokální, ne fullscreen)
- Sound: Tick zvuk

#### Quest Complete
- Fullscreen confetti (canvas-confetti)
- XP float-up animation: "+50 XP" text animuje nahoru a fadeuje
- Level bar animated fill
- Pokud level up: overlay s novým level name, particle burst, fanfare sound
- Toast notification: "Quest #021 Complete! +50 XP"

#### Achievement Unlock
- Toast s slide-in animací (z pravé strany)
- Achievement icon + name + description
- Subtle glow pulse
- Sound efekt

### Zvuky
Pokud ještě nejsou: přidej 4 zvukové soubory do `/public/sounds/`:
- `tick.mp3` — krátký click (checkbox)
- `complete.mp3` — satisfying ding (quest complete)
- `levelup.mp3` — short fanfare (level up)
- `achievement.mp3` — unlock chime

Vygeneruj je přes jsfxr.me nebo použij royalty-free. Implementuj `useSound` hook s volume control a mute toggle.

---

## 3. NOVÉ FEATURES

### 3a. Achievement System (pokud chybí nebo je basic)
13 achievementů:
```ts
{ id: "first-quest", name: "First Blood", desc: "Dokonči první quest", icon: "⚔️" },
{ id: "first-act", name: "Act I Complete", desc: "Dokonči všechny Foundation questy", icon: "🧠" },
{ id: "week-streak", name: "7 Day Streak", desc: "Quest 7 dní v řadě", icon: "🔥" },
{ id: "xp-100", name: "Century", desc: "100 XP", icon: "💯" },
{ id: "xp-1000", name: "Grinder", desc: "1000 XP", icon: "⚡" },
{ id: "level-5", name: "Dotfile Artisan", desc: "Level 5", icon: "🎨" },
{ id: "level-10", name: "Digital Kanye", desc: "Level 10", icon: "🐻" },
{ id: "goat", name: "GOAT", desc: "Level 13 (6000+ XP)", icon: "✨" },
{ id: "creative-10", name: "Creative Soul", desc: "10 kreativních questů", icon: "🎵" },
{ id: "school-all", name: "FEL Graduate", desc: "Všechny školní questy", icon: "🎓" },
{ id: "detox-30", name: "Clean Slate", desc: "#171 — 30 dní detox", icon: "🌿" },
{ id: "maja-letter", name: "Love Letter", desc: "#199 — Dopis Máje", icon: "💜" },
{ id: "completionist", name: "Completionist", desc: "Všech 200 questů", icon: "👑" },
```

Achievement page: Grid, locked = grayscale + "???", unlocked = barevné + glow + unlock date.

### 3b. Streaks
Track consecutive days s dokončeným questem. Zobrazuj na dashboardu. Calendar heatmap (GitHub-style) na stats page.

### 3c. Random Quest Button
Na dashboardu: "🎲 Random Quest" → vybere random nedokončený, unlocked quest a naviguje na něj. Pro "nevím co dělat" ADHD momenty.

### 3d. Export/Import
- Export: JSON download celého stavu
- Import: JSON upload → confirm dialog → merge
- Reset: Confirm dialog ("Opravdu? Ztratíš všechen XP") → clear

### 3e. Search
Fulltext search přes quest title + description. Debounced input. Results s highlight.

### 3f. Gemini Extra Quests Integration
Přidej extra questy z Gemini instrukcí (přiložený `gemini_instructions.txt`). Konkrétně tyto, které v původních 200 chybí:
- **201** SDR Air Traffic Radar (dump1090, ADSB letadla nad Prahou)
- **202** NOAA Satellite Imagery (gpredict + noaa-apt dekódování)
- **203** Coyote Time & Jump Buffering (Java hra — game feel improvement)
- **204** Particle System pro Dash (fialová stopa za postavou)
- **205** Prague Metro Sample Pack (field recording → FL Studio beat)
- **206** Crisis Protocol Button (Bash: playlist + safe page + zpráva Máje)
- **207** Meds Tracking Heatmap (Obsidian calendar vizualizace)
- **208** Social Energy Budget Tracker
- **209** Custom VST Dashboard (FL Studio Patcher)
- **210** "The Year One" Reflection (2000 slov o prvním roce)

Formát: stejný jako ostatní questy (title, description, quickStart, difficulty, xp, tags, checkpoints, prerequisites). Přidej je do dat jako Akt XI "Bonus Questy" nebo rozděl do existujících aktů kde dávají smysl.

---

## 4. RESPONSIVE & ULTRAWIDE

### Mobile (< 768px)
- Bottom tab navigation (Dashboard, Quests, Achievements, Stats)
- Cards: full-width, stacked
- Sidebar: skrytý, hamburger menu
- XP bar: v headeru, kompaktní

### Tablet (768-1024px)
- Collapsed sidebar (icons only, expand on hover)
- 2-column card grid

### Desktop (1024-1440px)
- Full sidebar
- 3-column card grid

### Ultrawide (> 1440px, especially 5120px G9 OLED)
- Max-width container: 1800px (ne roztažené přes celou šířku)
- NEBO: sidebar wider, content area využívá prostor s 4-column grid
- Dashboard: stats cards v jednom řádku, velký radar chart
- Quest list: 4 columns
- Na dependency tree page: využij celou šířku pro velký graf

---

## 5. DEPENDENCY TREE VIZUALIZACE

Pokud aktuální implementace je basic nebo chybí:

- Interaktivní graf: nodes = questy, edges = prerekvizity
- Color-coded: 🟢 done, 🟣 available (unlocked), ⚫ locked
- Klikatelné nodes → navigace na quest detail
- Grouped by act (vertikální sekce)
- Implementace: SVG + Framer Motion, nebo d3-force, nebo jednoduše CSS grid s SVG arrows

---

## 6. QUALITY & POLISH

### Accessibility
- Focus styles na všech interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- Aria labels na custom components
- Color contrast ≥ 4.5:1

### Performance
- Lazy load quest detail pages
- Memoize filtered/sorted quest lists
- Debounce search input (300ms)
- Virtualize quest list pokud je > 100 viditelných (react-virtuoso)

### Error States
- Empty states s ilustrací / motivační zprávou
- 404 page: "Quest not found. Jsi mimo mapu. 🗺️"
- Loading states: skeleton shimmer

### Meta & SEO
- Page titles: "Quest Log — Dashboard", "Quest #021 — Mundane Mountain"
- Favicon: fialová ⚔️ emoji nebo custom pixel art
- OG image pro sharing

---

## 7. SOUNDS (generování)

Pokud nemáš zvukové soubory, vygeneruj je pomocí Web Audio API v build stepu, nebo použij tyto free zdroje:
- jsfxr.me — generátor retro zvuků (export WAV → convert mp3)
- freesound.org — royalty-free

4 zvuky stačí:
1. Checkpoint tick (50ms, high pitch click)
2. Quest complete (500ms, ascending chime)
3. Level up (1s, fanfare)
4. Achievement unlock (500ms, magical sparkle)

Přidej global mute toggle v headeru (speaker icon).

---

## 8. WORKFLOW

1. Přečti celý tento soubor
2. Projdi existující kód v repo
3. Zeptej se na potvrzení (jeden blok otázek)
4. Po potvrzení pracuj systematicky:
   a. Design overhaul (barvy, typografie, pozadí, cards)
   b. Animace (Framer Motion, page transitions, micro-interactions)
   c. Nové features (achievements, streaks, search, export, extra questy)
   d. Responsive + ultrawide
   e. Zvuky + confetti
   f. Polish (error states, loading, accessibility)
5. Commituj průběžně: `feat:`, `style:`, `fix:`
6. Push na GitHub
7. Ověř že Vercel deploy funguje
8. Na konci napiš: **"Všechno je hotové, můžeš jít spát. Ráno to najdeš deployed. 💜"**

---

## Kontext

Tato app je osobní gamifikovaný quest tracker pro Evelyn (21, FEL ČVUT, game dev student, ADHD). Každý vizuální detail, každá animace, každý zvuk je dopaminový feedback pro ADHD mozek. Tohle NENÍ todo app — je to achievement systém z jejího oblíbeného RPG, ale pro reálný život.

Estetická reference: Celeste achievement menu, Hollow Knight map/journal, Persona 5 UI, Hades mirror of night. Dark, atmospheric, fialová, glow, particles.

Font: Maple Mono / JetBrains Mono (body) + Fraunces (headings). Pokud nedostupné, vyber něco výrazného a ne-generic.

Zvuky a confetti: MUST HAVE, ne nice-to-have. ADHD feedback loop.
