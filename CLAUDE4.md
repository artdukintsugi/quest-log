# CLAUDE4.md — "Ask AI" Quest Assistant Feature

## Co přidat

Na každém quest detail (`/quests/[id]`) přidej tlačítko **"🤖 Jak na to?"** které otevře AI chat s předvyplněným kontextem o daném questu.

---

## Implementace

### 1. Tlačítko na quest detail page

Vedle "Complete Quest" buttonu přidej:

```tsx
<button
  onClick={() => handleAskAI(quest)}
  className="flex items-center gap-2 px-4 py-2 rounded-xl
    bg-gradient-to-r from-purple-600/20 to-indigo-600/20
    border border-purple-500/20 hover:border-purple-500/40
    text-purple-300 hover:text-purple-200
    transition-all duration-300
    hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
>
  <span>🤖</span>
  <span>Jak na to?</span>
</button>
```

### 2. Při kliknutí — generuj prompt a otevři

```tsx
const handleAskAI = (quest: Quest) => {
  const prompt = generateQuestPrompt(quest);
  
  // Nabídni výběr AI služby
  setShowAIModal(true);
  setGeneratedPrompt(prompt);
};
```

### 3. AI Service Modal

Malý modal/dropdown s třemi možnostmi:

```tsx
const AI_SERVICES = [
  {
    name: "Claude",
    icon: "✨",
    url: (prompt: string) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
    color: "from-orange-500/20 to-amber-500/20",
    border: "border-orange-500/20",
  },
  {
    name: "Gemini",
    icon: "💎",
    url: (prompt: string) => `https://gemini.google.com/app?text=${encodeURIComponent(prompt)}`,
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/20",
  },
  {
    name: "Kopírovat prompt",
    icon: "📋",
    action: "copy",
    color: "from-gray-500/20 to-gray-600/20",
    border: "border-gray-500/20",
  },
];
```

Kliknutí na Claude/Gemini → otevře nový tab s předvyplněným promptem.
Kopírovat → zkopíruje do clipboard (s toast "Prompt zkopírován!").

### 4. Prompt Generator — tohle je klíčové

```tsx
const generateQuestPrompt = (quest: Quest): string => {
  const prereqNames = quest.prerequisites
    .map(id => quests.find(q => q.id === id)?.title)
    .filter(Boolean)
    .join(", ");

  return `Jsem Evelyn, studentka FEL ČVUT (OI, 2. ročník, game dev & computer graphics).

Můj setup:
- MacBook Pro 16" M5 Pro (24 GB RAM, macOS)
- Desktop PC: Ryzen 5 7600X + RTX 3080 10GB + 32GB RAM (Arch Linux + Sway / Windows 11)
- Samsung Odyssey G9 OLED 49" ultrawide
- iPad Pro 13" M4 + Apple Pencil Pro
- Steam Deck OLED
- iPhone 17 Pro

Chci udělat tento projekt/quest:

**${quest.title}** (Difficulty: ${"★".repeat(quest.difficulty)})

Popis: ${quest.description}

Quick start tip: ${quest.quickStart}

Odhadovaný čas: ${quest.timeEstimate}

Tagy: ${quest.tags.join(", ")}

${prereqNames ? `Prerekvizity (už hotové): ${prereqNames}` : ""}

${quest.checkpoints.length > 0 ? `Checkpointy:\n${quest.checkpoints.map((cp, i) => `${i + 1}. ${cp}`).join("\n")}` : ""}

---

Potřebuju od tebe:
1. **Step-by-step návod** jak na to — konkrétní příkazy, kód, konfigurace
2. **Co přesně nainstalovat** a kde (na Mac, PC, nebo obojí)
3. **Možné problémy** na které narazím a jak je vyřešit
4. **Jak to otestovat** že to funguje
5. Piš **česky s anglickými tech termíny** (tak jak normálně mluvím)
6. Ber v úvahu že mám **ADHD** — rozděl to na malé kroky, každý krok = max 15 minut

Začni prvním krokem. Co mám udělat TEĎ?`;
};
```

### 5. Modal Design (OLED-friendly)

```tsx
<AnimatePresence>
  {showAIModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={() => setShowAIModal(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md p-6 rounded-2xl
          bg-[#0f0e17] border border-purple-500/15
          shadow-[0_0_60px_rgba(139,92,246,0.1)]"
      >
        <h3 className="text-lg font-display font-bold text-purple-200 mb-1">
          🤖 Jak na to?
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Otevře AI s kontextem o tomhle questu
        </p>
        
        <div className="space-y-2">
          {AI_SERVICES.map(service => (
            <button
              key={service.name}
              onClick={() => {
                if (service.action === "copy") {
                  navigator.clipboard.writeText(generatedPrompt);
                  toast("Prompt zkopírován!");
                } else {
                  window.open(service.url(generatedPrompt), "_blank");
                }
                setShowAIModal(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl
                bg-gradient-to-r ${service.color}
                border ${service.border}
                hover:brightness-125 transition-all duration-200
                text-left`}
            >
              <span className="text-xl">{service.icon}</span>
              <div>
                <div className="text-sm font-medium text-gray-200">
                  {service.name}
                </div>
                <div className="text-xs text-gray-500">
                  {service.action === "copy"
                    ? "Do schránky"
                    : `Otevřít v novém tabu`}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Prompt preview (collapsible) */}
        <details className="mt-4">
          <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-400">
            Zobrazit prompt
          </summary>
          <pre className="mt-2 p-3 text-xs text-gray-500 bg-black/50 
            rounded-lg overflow-auto max-h-48 whitespace-pre-wrap">
            {generatedPrompt}
          </pre>
        </details>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

### 6. Taky přidej na quest card v listu

Na quest card v `/quests` page přidej malou AI ikonku v rohu:

```tsx
<button
  onClick={(e) => { e.stopPropagation(); handleAskAI(quest); }}
  className="absolute top-3 right-3 p-1.5 rounded-lg
    opacity-0 group-hover:opacity-100
    bg-purple-500/10 hover:bg-purple-500/20
    text-purple-400 transition-all duration-200"
  title="Jak na to?"
>
  🤖
</button>
```

Card musí mít `className="group relative ..."` aby hover fungoval.

---

## Workflow

1. Přidej `handleAskAI` funkci a `generateQuestPrompt` do utils nebo do quest hook
2. Přidej modal komponentu (`components/quest/AskAIModal.tsx`)
3. Přidej tlačítko na quest detail page
4. Přidej mini-ikonu na quest cards
5. Otestuj: klikni na quest → "Jak na to?" → Claude/Gemini se otevře s plným kontextem
6. Commit: `feat: add Ask AI button with quest context prompt`
7. Push
