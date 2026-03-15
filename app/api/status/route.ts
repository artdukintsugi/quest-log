import { NextResponse } from "next/server";
import { STORAGE_KEY } from "@/lib/storage";
import { QUESTS } from "@/lib/data/quests";
import { getLevelInfo } from "@/lib/data/levels";

// GET /api/status — returns current user state as JSON
// Useful for Waybar, SketchyBar, or any external status bar
export async function GET() {
  // This runs server-side, so we can't access localStorage directly.
  // Return a static shape — clients should call this and pass their localStorage state,
  // or use the client-side version via a dedicated endpoint.
  return NextResponse.json({
    _note: "Quest Log status API. Embed ?xp=N&level=N&quest=Title in URL from client-side code.",
    level: 1,
    xp: 0,
    active_quest: null,
    storage_key: STORAGE_KEY,
  });
}

// POST /api/status — accepts state from client and returns enriched response
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { totalXP = 0, questStates = {} } = body;

    const levelInfo = getLevelInfo(totalXP);
    const completedCount = Object.values(questStates as Record<string, { completed: boolean }>)
      .filter((v) => v?.completed).length;

    const activeQuestId = Object.entries(questStates as Record<string, { completed: boolean }>)
      .find(([, v]) => !v?.completed)?.[0];
    const activeQuest = activeQuestId
      ? QUESTS.find((q) => q.id === Number(activeQuestId))?.title ?? null
      : null;

    return NextResponse.json({
      level: levelInfo.current.level,
      level_name: levelInfo.current.name,
      xp: totalXP,
      xp_next: levelInfo.next.xp,
      quests_done: completedCount,
      quests_total: QUESTS.length,
      active_quest: activeQuest,
    });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}
