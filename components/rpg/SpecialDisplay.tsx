"use client";

import { motion } from "framer-motion";
import { useQuestContext } from "@/context/QuestContext";
import { SPECIAL_ATTRS, SpecialAttrDef } from "@/lib/data/special";
import { SpecialAttributes } from "@/lib/storage";

const MAX_POINTS = 50; // cap for visual bar scaling

function AttrBar({ attr, value }: { attr: SpecialAttrDef; value: number }) {
  const pct = Math.min(100, (value / MAX_POINTS) * 100);

  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <div className="flex w-20 shrink-0 items-center gap-1.5">
        <span className="text-base leading-none">{attr.icon}</span>
        <span className="text-xs font-bold text-[#94a3b8]" title={attr.fullName}>
          {attr.fullName}
        </span>
      </div>

      {/* Bar track */}
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[#1a1a2e]">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${attr.color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Value */}
      <span className="w-8 shrink-0 text-right font-mono text-xs font-bold text-[#e2e8f0]">
        {value}
      </span>
    </div>
  );
}

export default function SpecialDisplay() {
  const { state } = useQuestContext();
  const special: SpecialAttributes = state.special;

  return (
    <div className="rounded-xl border border-[#1a1a2e] bg-[#12121a] p-4">
      <h2 className="mb-1 font-display text-lg font-semibold text-[#a78bfa]">
        S.P.E.C.I.A.L.
      </h2>
      <p className="mb-4 text-xs text-[#64748b]">
        Attribute points earned from completed quests
      </p>
      <div className="flex flex-col gap-3">
        {SPECIAL_ATTRS.map((attr) => (
          <AttrBar key={attr.key} attr={attr} value={special[attr.key] ?? 0} />
        ))}
      </div>
    </div>
  );
}
