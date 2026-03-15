# CLAUDE3.md — OLED Display Overhaul

## Kontext

Tato app běží na zařízeních s prémiový displays:
- **Samsung Odyssey G9 OLED** — 49" ultrawide, 5120×1440, nekonečný kontrast, HDR
- **MacBook Pro 16" M5 Pro** — Mini-LED XDR, 3456×2234, 1600 nits HDR
- **iPhone 17 Pro** — Super Retina XDR OLED, 2796×1290
- **iPad Pro 13" M4** — Ultra Retina XDR OLED, 2752×2064
- **Steam Deck OLED** — 7.4" HDR OLED, 1280×800

Všechny displeje mají OLED nebo Mini-LED = **true black (#000000 = pixel off)**. Aktuální design to nevyužívá — pozadí je tmavě šedé/modré, ne černé. Na OLED to vypadá jako "svítící šedá plocha" místo "UI plovoucí v prázdnotě."

## Instrukce

Přečti celý soubor. Projdi existující kód v repo. Implementuj změny. Commituj průběžně. Push. Na konci napiš: **"OLED overhaul hotový. Zkontroluj na svém G9. 💜"**

---

## 1. TRUE BLACK FOUNDATIONS

### Pozadí: Černá je tvůj canvas

```css
/* STARÝ přístup — šedé pozadí, pixely svítí */
--bg-primary: #0a0a0f;

/* NOVÝ přístup — true black základ, barva jen kde má být */
--bg-void: #000000;           /* body background — pixel OFF na OLED */
--bg-surface: #08070d;        /* card/panel — sotva viditelný nad černou */
--bg-elevated: #0f0e17;       /* hover, active, modaly */
--bg-overlay: #16142266;      /* backdrop za modaly */
```

Body background MUSÍ být `#000000`. Ne `#0a0a0f`, ne `#111`. Čistá černá. Na OLED to znamená, že pixely jsou VYPNUTÉ — nulová spotřeba, nekonečný kontrast, a UI elementy vypadají jako by se vznášely v prostoru.

### Gradient efekty na true black

```css
/* Subtilní radial glow ZA content area — jako by tam byl světelný zdroj */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 50% at 50% 0%,
    rgba(139, 92, 246, 0.03) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}
```

Tohle vytvoří jemný fialový "glow" v horní části stránky, jako by sidebar a header vyzařovaly světlo. Na OLED to vypadá magicky — barva se vynořuje z absolutní tmy.

---

## 2. CARD & SURFACE REDESIGN

### Glassmorphism na OLED

Na OLED funguje glassmorphism JINAK než na LCD. Protože pozadí je true black, `backdrop-blur` nemá co rozmazat. Místo toho použij:

```css
.card {
  background: linear-gradient(
    135deg,
    rgba(15, 14, 23, 0.9) 0%,
    rgba(10, 9, 16, 0.95) 100%
  );
  border: 1px solid rgba(139, 92, 246, 0.08);
  border-radius: 16px;
  box-shadow:
    0 0 0 1px rgba(139, 92, 246, 0.05),     /* inner glow line */
    0 4px 24px rgba(0, 0, 0, 0.8),            /* deep shadow */
    inset 0 1px 0 rgba(255, 255, 255, 0.02);  /* top highlight */
}

.card:hover {
  border-color: rgba(139, 92, 246, 0.2);
  box-shadow:
    0 0 0 1px rgba(139, 92, 246, 0.1),
    0 0 30px rgba(139, 92, 246, 0.05),         /* outer glow */
    0 8px 32px rgba(0, 0, 0, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  transform: translateY(-1px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Card hierarchy

Tři úrovně povrchů (jako Material Design elevation, ale pro OLED):

| Úroveň | Background | Border | Použití |
|---------|-----------|--------|---------|
| Void | `#000000` | none | Body, page background |
| Surface | `rgba(8,7,13,0.9)` | `rgba(139,92,246,0.08)` | Cards, panels |
| Elevated | `rgba(15,14,23,0.95)` | `rgba(139,92,246,0.15)` | Modaly, dropdown, hover states |

---

## 3. TYPOGRAPHY PRO OLED

Na OLED bílý text na černé je extrémně kontrastní (může být až nepříjemné). Uprav:

```css
/* Ne pure white — lehce ztlumená pro OLED pohodlí */
--text-primary: #e0dfe6;       /* hlavní text — ne #ffffff */
--text-heading: #f0eef5;       /* headings — o trochu jasnější */
--text-secondary: #8b8a94;     /* secondary — nízký kontrast ale čitelný */
--text-muted: #5a596a;         /* muted — sotva viditelný */
--text-accent: #a78bfa;        /* fialový accent text */
```

### Heading glow efekt

```css
h1, .quest-title-large {
  color: var(--text-heading);
  text-shadow: 0 0 40px rgba(139, 92, 246, 0.15);
}
```

Na OLED ten glow vypadá jako by text sám vyzařoval světlo. Subtilní ale výrazný.

### "Evelyn" v nadpisu

V "Vítej zpět, **Evelyn**" — jméno by mělo mít:
```css
.name-highlight {
  background: linear-gradient(135deg, #a78bfa, #c084fc, #e879f9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 12px rgba(167, 139, 250, 0.3));
}
```

---

## 4. XP BAR — OLED HERO ELEMENT

XP bar je hlavní vizuální element. Na OLED musí zářit:

```css
.xp-bar-container {
  background: rgba(8, 7, 13, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.xp-bar-fill {
  background: linear-gradient(
    90deg,
    #7c3aed 0%,
    #8b5cf6 40%,
    #a78bfa 60%,
    #fbbf24 100%
  );
  border-radius: 12px;
  position: relative;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animated glow na leading edge */
.xp-bar-fill::after {
  content: '';
  position: absolute;
  right: 0;
  top: -4px;
  bottom: -4px;
  width: 20px;
  background: radial-gradient(circle, rgba(251,191,36,0.6) 0%, transparent 70%);
  filter: blur(4px);
  animation: pulse 2s ease-in-out infinite;
}

/* Shimmer efekt přes celou bar */
.xp-bar-fill::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.1) 50%,
    transparent 100%
  );
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
```

### Level Ring

Ten kruhový level indicator — na OLED by měl mít:
- SVG stroke s gradient (fialová → zlatá)
- Glow filter: `filter: drop-shadow(0 0 8px rgba(139,92,246,0.4))`
- Animated progress (stroke-dashoffset transition)
- Level číslo uprostřed s text-shadow glow

---

## 5. PROGRESS PER AKT — OLED BARS

Aktuální "Progress per Akt" sekce je text. Přeměň na vizuální progress bary:

```tsx
// Místo "🧠 Základy  0/10"
// Udělej:
<div className="flex items-center gap-3">
  <span className="text-lg">{act.emoji}</span>
  <span className="text-sm flex-1">{act.name}</span>
  <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
      style={{ width: `${(completed/total)*100}%` }}
    />
  </div>
  <span className="text-xs text-muted tabular-nums">{completed}/{total}</span>
</div>
```

Na OLED ty tenké fialové proužky na černém pozadí vypadají jako neonové čáry. Gorgeous.

---

## 6. SIDEBAR — OLED REFINEMENT

Aktuální sidebar je ok, ale na OLED by měl:

- Background: `rgba(5, 4, 10, 0.95)` — tmavší než cards, skoro černý
- Oddělovací čára vpravo: `border-right: 1px solid rgba(139,92,246,0.06)` — sotva viditelná
- Active item: fialový glow line vlevo (ne solid bar — glow):
  ```css
  .nav-active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 25%;
    bottom: 25%;
    width: 3px;
    background: #8b5cf6;
    border-radius: 0 3px 3px 0;
    box-shadow: 0 0 12px rgba(139, 92, 246, 0.5);
  }
  ```
- Active item background: `rgba(139, 92, 246, 0.08)` — ne solid, jemný
- Level badge: glow ring animace

---

## 7. STAT CARDS — NEON NUMBERS

Ty 4 stat cards nahoře (Dokončeno, Dostupné, XP/Den, Achievementy):

```css
.stat-number {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.stat-number-green {
  color: #22c55e;
  text-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}

.stat-number-purple {
  color: #a78bfa;
  text-shadow: 0 0 20px rgba(167, 139, 250, 0.3);
}

.stat-number-gold {
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
}
```

Na OLED ty text-shadow glow efekty vypadají jako neonové cedule. Čísla doslova svítí.

### Stat card borders

Každá karta má svou accent barvu jako jemný top-border:
```css
.stat-card-green { border-top: 2px solid rgba(34, 197, 94, 0.3); }
.stat-card-purple { border-top: 2px solid rgba(167, 139, 250, 0.3); }
.stat-card-gold { border-top: 2px solid rgba(251, 191, 36, 0.3); }
```

---

## 8. AMBIENT PARTICLES (Optional ale wow)

Jemné plovoucí částice v pozadí — jako prach ve tmě osvětlený fialovým světlem.

```tsx
// Lightweight CSS-only particle effect
// 15-20 particles, very slow movement, very low opacity
// Na OLED: individuální svítící body na absolutně černém pozadí = hvězdy
```

Implementuj jako:
- CSS-only s `@keyframes float` + random `animation-delay` + `animation-duration`
- Nebo lightweight canvas (requestAnimationFrame, ~20 particles, no libraries)
- Opacity: 0.03–0.08 max
- Barvy: mix fialové a bílé
- Pozice: fixed, za vším contentem (z-index: 0)

MUSÍ být performance-friendly. Žádný lag. Na Macu s ProMotion (120Hz) musí být butter smooth.

---

## 9. QUEST CARDS — OLED TREATMENT

### Completed quest card
```css
.quest-card-completed {
  border-color: rgba(34, 197, 94, 0.15);
  background: linear-gradient(135deg, rgba(8,7,13,0.9), rgba(10,20,10,0.9));
}

/* Subtle animated shimmer on completed cards */
.quest-card-completed::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 40%,
    rgba(34, 197, 94, 0.03) 50%,
    transparent 60%
  );
  animation: card-shimmer 4s ease-in-out infinite;
}
```

### Locked quest card
```css
.quest-card-locked {
  opacity: 0.4;
  filter: grayscale(0.5);
  border-color: rgba(255,255,255,0.03);
  pointer-events: none; /* nebo click → "Odemkni nejdřív: #XXX" toast */
}
```

### Difficulty stars
Na OLED: plné hvězdy svítí zlatě, prázdné jsou sotva viditelné.
```css
.star-filled { color: #fbbf24; filter: drop-shadow(0 0 4px rgba(251,191,36,0.4)); }
.star-empty { color: rgba(251,191,36,0.15); }
```

---

## 10. CONFETTI & CELEBRATION — OLED OPTIMIZED

Na OLED confetti particles vypadají jako exploze barevného světla v temnotě. Uprav barvy:

```ts
confetti({
  particleCount: 150,
  spread: 80,
  origin: { y: 0.6 },
  colors: ['#8b5cf6', '#a78bfa', '#c084fc', '#fbbf24', '#22c55e'],
  // Na OLED tyto barvy doslova svítí na černém pozadí
});
```

### Level Up overlay
```css
.level-up-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);  /* skoro černá — OLED friendly */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.level-up-text {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  background: linear-gradient(135deg, #a78bfa, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 40px rgba(139, 92, 246, 0.5));
  animation: level-up-entrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes level-up-entrance {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
```

---

## 11. DARK MODE ONLY — REMOVE LIGHT MODE

Pokud existuje jakýkoliv light mode toggle nebo fallback — **odstraň ho**. Tato app je VÝHRADNĚ dark. Na OLED displays light mode doslova páli oči a plýtvá baterií. Žádné `prefers-color-scheme: light` fallbacky.

---

## 12. FONT LOADING

```tsx
// app/layout.tsx nebo next.config
import { JetBrains_Mono } from 'next/font/google';
// Pro Fraunces:
import { Fraunces } from 'next/font/google';

const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-mono',
});

const display = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
});

// V body: className={`${mono.variable} ${display.variable}`}
// Headings: font-family: var(--font-display)
// Body/code: font-family: var(--font-mono)
```

---

## 13. ULTRAWIDE G9 SPECIFIKA

Na 5120×1440:
- Content max-width: `max-w-[1800px]` s `mx-auto`
- Sidebar width: `w-64` (fixed)
- Dashboard: stat cards v jednom řádku (4 columns)
- Quest grid: 4 columns
- Dependency tree: využij celou šířku
- Na menších: 3 → 2 → 1 columns responsive

Breakpoint:
```css
@media (min-width: 2560px) {
  /* Ultrawide specifics */
  .quest-grid { grid-template-columns: repeat(4, 1fr); }
  .stat-grid { grid-template-columns: repeat(4, 1fr); }
}
```

---

## 14. PERFORMANCE PRO OLED

OLED displeje = 120Hz (MacBook Pro, iPhone Pro, iPad Pro). Animace MUSÍ být:
- `will-change: transform` na animated elements
- `transform: translateZ(0)` pro GPU acceleration
- Žádné animace na `width`, `height`, `top`, `left` — pouze `transform` a `opacity`
- `transition: all` NIKDY — vždy specifikuj přesné properties

---

## Workflow

1. Přečti tento soubor
2. Projdi aktuální kód v repo
3. Implementuj změny v tomto pořadí:
   a. Body background → `#000000`
   b. Card redesign (glassmorphism na OLED)
   c. Typography (fonts, text colors, glow)
   d. XP bar animation
   e. Sidebar refinement
   f. Stat cards neon numbers
   g. Progress bars per akt
   h. Quest card states (completed, locked, hover)
   i. Ambient particles (pokud performance ok)
   j. Confetti/celebration OLED optimalizace
   k. Responsive + ultrawide
   l. Performance audit
4. Commituj: `style: OLED display overhaul`
5. Push + verify Vercel deploy
6. **"OLED overhaul hotový. Zkontroluj na svém G9. 💜"**
