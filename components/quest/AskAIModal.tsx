"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Quest } from "@/lib/data/quests";
import { QUESTS } from "@/lib/data/quests";
import { useQuestContext } from "@/context/QuestContext";
import { useState } from "react";
import { X, Copy, Check, ExternalLink } from "lucide-react";

interface Props {
  quest: Quest;
  open: boolean;
  onClose: () => void;
}

type AIService = {
  name: string;
  icon: string;
  color: string;
  border: string;
  url: string;
};

const AI_SERVICES: AIService[] = [
  {
    name: "Claude",
    icon: "✨",
    color: "from-orange-500/15 to-amber-500/15",
    border: "border-orange-500/25",
    url: "https://claude.ai/new",
  },
  {
    name: "ChatGPT",
    icon: "🌿",
    color: "from-emerald-500/15 to-teal-500/15",
    border: "border-emerald-500/25",
    url: "https://chat.openai.com",
  },
  {
    name: "Gemini",
    icon: "💎",
    color: "from-blue-500/15 to-cyan-500/15",
    border: "border-blue-500/25",
    url: "https://gemini.google.com/app",
  },
];

function generateQuestPrompt(quest: Quest, completedTitles: string[]): string {
  const prereqNames = quest.prerequisites
    .map((id) => QUESTS.find((q) => q.id === id)?.title)
    .filter(Boolean)
    .join(", ");

  const completedSection = completedTitles.length > 0
    ? `\nUž jsem dokončila tyto projekty/questy:\n${completedTitles.slice(0, 20).map((t, i) => `${i + 1}. ${t}`).join("\n")}${completedTitles.length > 20 ? `\n... a dalších ${completedTitles.length - 20}` : ""}\n`
    : "";

  return `Jsem Evelyn, studentka FEL ČVUT (OI, 2. ročník, game dev & computer graphics).

Můj setup:
- MacBook Pro 16" M5 Pro (24 GB RAM, macOS)
- Desktop PC: Ryzen 5 7600X + RTX 3080 10GB + 32GB RAM (Arch Linux + Sway / Windows 11)
- Samsung Odyssey G9 OLED 49" ultrawide
- iPad Pro 13" M4 + Apple Pencil Pro
- Steam Deck OLED
- iPhone 17 Pro
${completedSection}
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
}

export default function AskAIModal({ quest, open, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const { state } = useQuestContext();

  const completedTitles = QUESTS
    .filter((q) => state.questStates[q.id]?.completed)
    .map((q) => q.title);

  const prompt = generateQuestPrompt(quest, completedTitles);

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenAI = (service: AIService) => {
    // Copy first, then open — URL pre-fill is unreliable across AI services
    navigator.clipboard.writeText(prompt).catch(() => {});
    window.open(service.url, "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.88)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl p-5 border relative"
            style={{
              background: "linear-gradient(160deg, #130f26 0%, #0a0814 100%)",
              borderColor: "rgba(139,92,246,0.22)",
              boxShadow: "0 0 48px rgba(139,92,246,0.1), 0 20px 40px rgba(0,0,0,0.8)",
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: "var(--text-muted)" }}
            >
              <X size={14} />
            </button>

            <h3
              className="text-base font-bold mb-0.5 pr-8"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
            >
              🤖 Jak na to?
            </h3>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Prompt s kontextem questu + tvoje hotové projekty se zkopíruje do schránky, pak stačí vložit.
            </p>

            {/* Copy prompt button — primary action */}
            <button
              onClick={copyPrompt}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl mb-3 font-semibold text-sm transition-all duration-200"
              style={{
                background: copied
                  ? "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.08))"
                  : "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.15))",
                border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(139,92,246,0.3)"}`,
                color: copied ? "var(--success)" : "var(--accent-secondary)",
              }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied
                ? `Zkopírováno! (${completedTitles.length} splněných questů v kontextu)`
                : "Zkopírovat prompt"}
            </button>

            <p className="text-[11px] text-center mb-3" style={{ color: "var(--text-muted)" }}>
              Pak otevři AI a vlož (Ctrl+V / Cmd+V):
            </p>

            {/* AI service links */}
            <div className="grid grid-cols-3 gap-2">
              {AI_SERVICES.map((service) => (
                <button
                  key={service.name}
                  onClick={() => handleOpenAI(service)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-gradient-to-b ${service.color} border ${service.border} hover:brightness-125 transition-all duration-200`}
                >
                  <span className="text-lg">{service.icon}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                      {service.name}
                    </span>
                    <ExternalLink size={9} style={{ color: "var(--text-muted)" }} />
                  </div>
                </button>
              ))}
            </div>

            {completedTitles.length > 0 && (
              <p className="text-[10px] mt-3 text-center" style={{ color: "rgba(100,116,139,0.5)" }}>
                Prompt obsahuje {completedTitles.length} splněných questů jako kontext
              </p>
            )}

            {/* Prompt preview */}
            <details className="mt-3">
              <summary
                className="text-[11px] cursor-pointer transition-colors hover:text-gray-400 select-none"
                style={{ color: "var(--text-muted)" }}
              >
                Zobrazit prompt ({prompt.length} znaků)
              </summary>
              <pre
                className="mt-2 p-2.5 text-[10px] rounded-lg overflow-auto max-h-32 whitespace-pre-wrap"
                style={{
                  color: "var(--text-muted)",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                {prompt}
              </pre>
            </details>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
