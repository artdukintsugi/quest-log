"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestContext } from "@/context/QuestContext";
import { CLASSES, ClassDef } from "@/lib/data/classes";
import { PlayerClass } from "@/lib/storage";

export default function ClassSelector() {
  const { state, selectClass } = useQuestContext();
  const [open, setOpen] = useState(false);

  const current = CLASSES.find((c) => c.id === state.selectedClass) ?? null;

  function handleSelect(cls: PlayerClass) {
    selectClass(cls);
    setOpen(false);
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-[#1a1a2e] bg-[#12121a] px-3 py-2 text-sm text-[#e2e8f0] transition-all hover:border-[#8b5cf6] hover:shadow-[0_0_10px_#8b5cf640]"
      >
        <span>{current ? current.icon : "❓"}</span>
        <span className="font-medium">{current ? current.label : "Choose Class"}</span>
        <span className="ml-1 text-[#64748b]">▾</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal panel */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#8b5cf6] bg-[#12121a] p-6 shadow-[0_0_40px_#8b5cf640]"
            >
              <h2 className="mb-1 font-display text-xl font-bold text-[#a78bfa]">
                Choose Your Class
              </h2>
              <p className="mb-5 text-sm text-[#64748b]">
                Your class grants a 10% XP bonus on matching quests.
              </p>
              <div className="flex flex-col gap-3">
                {CLASSES.map((cls) => (
                  <ClassOption
                    key={cls.id}
                    cls={cls}
                    selected={state.selectedClass === cls.id}
                    onSelect={() => handleSelect(cls.id)}
                  />
                ))}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="mt-5 w-full rounded-lg border border-[#1a1a2e] py-2 text-sm text-[#64748b] hover:text-[#e2e8f0]"
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ClassOption({
  cls,
  selected,
  onSelect,
}: {
  cls: ClassDef;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`
        flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all
        ${selected
          ? "border-[#8b5cf6] bg-[#1a1a2e] shadow-[0_0_12px_#8b5cf640]"
          : "border-[#1a1a2e] bg-[#0a0a0f] hover:border-[#8b5cf680]"
        }
      `}
    >
      <span className="text-2xl leading-none">{cls.icon}</span>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#e2e8f0]">{cls.label}</span>
          {selected && (
            <span className="rounded bg-[#8b5cf6] px-1.5 py-0.5 text-[10px] font-bold text-white">
              ACTIVE
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-[#94a3b8]">{cls.description}</p>
      </div>
    </motion.button>
  );
}
