"use client";

import { useMemo } from "react";
import { useQuestContext } from "@/context/QuestContext";

const DAYS = 365;
const COLS = 53; // 53 weeks

function getDateStr(offsetFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetFromToday);
  return d.toISOString().split("T")[0];
}

function cellColor(count: number): string {
  if (count === 0) return "#1a1a2e";
  if (count === 1) return "#4c1d95";  // light purple
  if (count === 2) return "#7c3aed";  // medium violet
  return "#a78bfa";                   // bright — 3+
}

function cellGlow(count: number): string {
  if (count >= 3) return "0 0 6px #8b5cf6";
  if (count >= 2) return "0 0 4px #7c3aed80";
  return "none";
}

export default function ActivityHeatmap() {
  const { state } = useQuestContext();

  const dayCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const entry of Object.values(state.questStates)) {
      if (entry.completed && entry.completedAt) {
        const day = entry.completedAt.split("T")[0];
        map[day] = (map[day] ?? 0) + 1;
      }
    }
    return map;
  }, [state.questStates]);

  // Build array of cells: index 0 = oldest (364 days ago), last = today
  const cells = useMemo(() => {
    return Array.from({ length: DAYS }, (_, i) => {
      const dateStr = getDateStr(DAYS - 1 - i);
      return { dateStr, count: dayCounts[dateStr] ?? 0 };
    });
  }, [dayCounts]);

  const totalQuests = Object.values(dayCounts).reduce((a, b) => a + b, 0);

  // Pad start so week 0 starts on Sunday
  const firstDate = new Date(cells[0].dateStr);
  const startPad = firstDate.getDay(); // 0=Sun

  return (
    <div className="rounded-xl border border-[#1a1a2e] bg-[#12121a] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-[#a78bfa]">
          📅 Activity
        </h2>
        <span className="text-xs text-[#64748b]">{totalQuests} quests in the last year</span>
      </div>

      {/* Grid: 53 columns × 7 rows using CSS grid */}
      <div
        className="overflow-x-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 12px)`,
            gridTemplateRows: "repeat(7, 12px)",
            gridAutoFlow: "column",
            gap: "3px",
            width: "fit-content",
          }}
        >
          {/* Empty padding cells at start */}
          {Array.from({ length: startPad }).map((_, i) => (
            <div key={`pad-${i}`} style={{ width: 12, height: 12 }} />
          ))}

          {cells.map(({ dateStr, count }) => (
            <div
              key={dateStr}
              title={`${dateStr}: ${count} quest${count !== 1 ? "s" : ""}`}
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                backgroundColor: cellColor(count),
                boxShadow: cellGlow(count),
                transition: "background-color 0.2s",
                cursor: "default",
              }}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-2 text-xs text-[#64748b]">
        <span>Less</span>
        {[0, 1, 2, 3].map((lvl) => (
          <div
            key={lvl}
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              backgroundColor: cellColor(lvl),
              boxShadow: cellGlow(lvl),
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
