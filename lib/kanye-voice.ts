"use client";

// Kanye speaks — as a floating speech bubble because TTS is cooked

const VOICE_LINES: Record<string, string[]> = {
  questComplete: [
    "Yo, I finished that. Nobody thought I could finish that.",
    "That was my best work. That was beautiful.",
    "I'm a creative genius. I just proved it again.",
    "This is a God-level completion. You're welcome.",
    "Everybody said don't do it. I did it. Now what.",
    "Quest complete. I feel like Pablo right now.",
    "I'm living my best life. One quest at a time.",
    "That took real vision. Not everyone has that.",
    // iconic lines
    "I'mma let you finish, but that was one of the best quests of all time.",
    "You ain't got the answers! I been doing this since forever!",
    "I am a god. So hurry up with my damn quest.",
    "Fish sticks? I'm a genius.",
    "I specifically ordered this quest with cherub imagery.",
    "My greatest pain in life is that I will never get to see myself complete this live.",
    "I just talked to God. He said what up.",
    "I'm nice at ping pong.",
    "IT AIN'T THAT HARD, SWAY.",
    "I'm not even gonna act humble about it.",
    "Fur pillows are actually hard to sleep on.",
    "I am the nucleus.",
  ],
  levelUp: [
    "I'm the greatest. I've always been the greatest. Now the numbers agree.",
    "New level. I needed that. The world needed that.",
    "Level up. That's not ego, that's just... facts.",
    "I am not afraid of the new level. I AM the new level.",
    "This is what happens when you believe in yourself like I believe in myself.",
    "I am Warhol. I am the number one most impactful artist of our generation. In this quest log.",
    "I've reached a new level of awesome that I didn't know existed.",
    "No one man should have all that XP.",
  ],
  achievement: [
    "Achievement unlocked. That's historic. Write that down.",
    "This achievement represents me at my most expressive.",
    "I deserve every achievement. I've been saying that for years.",
    "They told me I couldn't get this achievement. Classic.",
    "I am so credible and so influential and so relevant that I will forever be the greatest.",
    "Name one genius that ain't crazy. I'll wait.",
  ],
  hanh: [
    "Hanh?",
    "...Hanh??",
    "HANH.",
  ],
};

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function showBubble(text: string) {
  if (typeof document === "undefined") return;
  try {
    const settings = JSON.parse(localStorage.getItem("evelyn-settings") || "{}");
    if (settings.kanyeVoiceEnabled === false) return;
  } catch { /* ignore */ }

  const el = document.createElement("div");
  el.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:10px;">
      <span style="font-size:28px;line-height:1;flex-shrink:0;">🐻</span>
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:#a78bfa;margin-bottom:4px;font-family:monospace;">YE</div>
        <div style="font-size:13px;font-style:italic;line-height:1.4;color:#e2e8f0;">"${text}"</div>
      </div>
    </div>
  `;
  Object.assign(el.style, {
    position: "fixed",
    bottom: "80px",
    right: "24px",
    zIndex: "99999",
    background: "rgba(10,8,20,0.96)",
    border: "1px solid rgba(139,92,246,0.4)",
    borderRadius: "16px",
    padding: "14px 16px",
    maxWidth: "280px",
    boxShadow: "0 0 24px rgba(139,92,246,0.25), 0 8px 32px rgba(0,0,0,0.6)",
    backdropFilter: "blur(12px)",
    fontFamily: "system-ui, sans-serif",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    opacity: "0",
    transform: "translateY(12px) scale(0.95)",
    pointerEvents: "none",
  });

  document.body.appendChild(el);

  // Animate in
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateY(0) scale(1)";
  });

  // Animate out after 3.5s
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(-8px) scale(0.97)";
    setTimeout(() => el.remove(), 350);
  }, 3500);
}

export function kanyeSayQuestComplete() { showBubble(pick(VOICE_LINES.questComplete)); }
export function kanyeSayLevelUp()       { showBubble(pick(VOICE_LINES.levelUp)); }
export function kanyeSayAchievement()   { showBubble(pick(VOICE_LINES.achievement)); }
export function kanyeSay(text: string)  { showBubble(text); }
export function kanyeSayGreeting()      { showBubble(pick(VOICE_LINES.questComplete)); }
export function kanyeSayCheckpoint()    { /* silent */ }
export function kanyeSayRandom()        { showBubble(pick(VOICE_LINES.questComplete)); }
