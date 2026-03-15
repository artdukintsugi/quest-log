"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Quest } from "@/lib/data/quests";
import { QUESTS } from "@/lib/data/quests";
import { useState } from "react";
import { X } from "lucide-react";

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
  action?: "copy";
  url?: (p: string) => string;
};

const AI_SERVICES: AIService[] = [
  {
    name: "Claude",
    icon: "✨",
    color: "from-orange-500/15 to-amber-500/15",
    border: "border-orange-500/25",
    url: (p) => `https://claude.ai/new?q=${encodeURIComponent(p)}`,
  },
  {
    name: "Gemini",
    icon: "💎",
    color: "from-blue-500/15 to-cyan-500/15",
    border: "border-blue-500/25",
    url: (p) => `https://gemini.google.com/app?text=${encodeURIComponent(p)}`,
  },
  {
    name: "Kopírovat prompt",
    icon: "📋",
    color: "from-gray-500/15 to-gray-600/15",
    border: "border-gray-500/20",
    action: "copy",
  },
];

function generateQuestPrompt(quest: Quest): string {
  const prereqNames = quest.prerequisites
    .map((id) => QUESTS.find((q) => q.id === id)?.title)
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
}

export default function AskAIModal({ quest, open, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const prompt = generateQuestPrompt(quest);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(onClose, 300);
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
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl p-6 border relative"
            style={{
              background: "linear-gradient(145deg, #0f0c1f 0%, #0a0814 100%)",
              borderColor: "rgba(139,92,246,0.2)",
              boxShadow: "0 0 60px rgba(139,92,246,0.12), 0 24px 48px rgba(0,0,0,0.7)",
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: "var(--text-muted)" }}
            >
              <X size={16} />
            </button>

            <h3
              className="text-lg font-bold mb-0.5"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
            >
              🤖 Jak na to?
            </h3>
            <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
              Otevře AI s plným kontextem o tomhle questu
            </p>

            <div className="space-y-2">
              {AI_SERVICES.map((service) => (
                <button
                  key={service.name}
                  onClick={() => {
                    if (service.action === "copy") {
                      handleCopy();
                    } else if (service.url) {
                      window.open(service.url(prompt), "_blank");
                      onClose();
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r ${service.color} border ${service.border} hover:brightness-125 transition-all duration-200 text-left`}
                >
                  <span className="text-xl">{service.icon}</span>
                  <div>
                    <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {service.action === "copy" && copied ? "Zkopírováno! ✓" : service.name}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {service.action === "copy" ? "Do schránky" : "Otevřít v novém tabu"}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <details className="mt-4">
              <summary
                className="text-xs cursor-pointer transition-colors hover:text-gray-400 select-none"
                style={{ color: "var(--text-muted)" }}
              >
                Zobrazit vygenerovaný prompt
              </summary>
              <pre
                className="mt-2 p-3 text-xs rounded-lg overflow-auto max-h-40 whitespace-pre-wrap"
                style={{
                  color: "var(--text-muted)",
                  backgroundColor: "rgba(0,0,0,0.4)",
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
