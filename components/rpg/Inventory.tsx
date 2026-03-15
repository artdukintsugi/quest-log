"use client";

import { motion } from "framer-motion";
import { useQuestContext } from "@/context/QuestContext";
import { useInventory } from "@/hooks/useInventory";
import { INVENTORY_ITEMS } from "@/lib/data/inventory";

export default function Inventory() {
  const { state } = useQuestContext();
  const entries = useInventory(state);

  return (
    <div className="rounded-xl border border-[#1a1a2e] bg-[#12121a] p-4">
      <h2 className="mb-4 font-display text-lg font-semibold text-[#a78bfa]">
        🎒 Inventory
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {entries.map(({ item, earned }) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            title={earned ? item.description : `Locked — ${item.unlockHint}`}
            className={`
              flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center
              transition-all duration-200
              ${earned
                ? "border-[#8b5cf6] bg-[#1a1a2e] shadow-[0_0_12px_#8b5cf640]"
                : "border-[#1a1a2e] bg-[#0a0a0f] opacity-40 grayscale"
              }
            `}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs font-medium text-[#e2e8f0] leading-tight">
              {item.name}
            </span>
            {!earned && (
              <span className="text-[10px] text-[#64748b] leading-tight">
                {item.unlockHint}
              </span>
            )}
          </motion.div>
        ))}
      </div>
      <p className="mt-3 text-xs text-[#64748b]">
        {entries.filter((e) => e.earned).length} / {INVENTORY_ITEMS.length} items earned
      </p>
    </div>
  );
}
