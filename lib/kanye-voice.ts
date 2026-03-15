"use client";

// Web Speech API — Ye speaks directly into your soul (and your ears)
// Pitch: 0.85 (deeper), Rate: 0.88 (slower, deliberate), Volume: 0.9

const VOICE_LINES: Record<string, string[]> = {
  questComplete: [
    "Yo, I finished that. I finished that. Nobody thought I could finish that.",
    "That quest right there? That was my best work. That was beautiful.",
    "I'm a creative genius. I just proved it again.",
    "This is a God-level completion. You're welcome.",
    "Everybody said don't do it. I did it. Now what.",
    "That took real vision. Not everyone has that.",
    "Quest complete. I feel like Pablo right now.",
    "I'm living my best life. One quest at a time.",
  ],
  levelUp: [
    "I'm the greatest. I've always been the greatest. Now the numbers agree.",
    "New level. I needed that. The world needed that.",
    "Level up. That's not ego, that's just... facts.",
    "I am not afraid of the new level. I am the new level.",
    "This is what happens when you believe in yourself like I believe in myself.",
  ],
  achievement: [
    "Achievement unlocked. That's historic. Write that down.",
    "This achievement represents me at my most expressive.",
    "I deserve every achievement. I've been saying that for years.",
    "They told me I couldn't get this achievement. Classic.",
  ],
  greeting: [
    "Good morning. I'm Kanye West. Welcome to your quest log.",
    "Yo. You ready to be great today? Because I am.",
    "This is the greatest quest log ever made. I helped make it.",
  ],
  checkpointDone: [
    "Checkpoint. Keep going. Don't stop.",
    "That's progress. Real progress.",
    "One step closer to the vision.",
  ],
  random: [
    "I'm the nucleus.",
    "Has anyone told you lately that you're amazing?",
    "Believe in your flyness. Conquer your shyness.",
    "My greatest pain in life is that I will never be able to see myself perform live.",
    "I still think I am the greatest.",
    "Name one genius that ain't crazy.",
    "Everything I'm not made me everything I am.",
    "I refuse to accept other people's ideas of happiness for me.",
  ],
};

let speaking = false;

function getVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  // Prefer a deeper US English male voice
  return (
    voices.find((v) => v.lang === "en-US" && v.name.toLowerCase().includes("male")) ||
    voices.find((v) => v.lang === "en-US") ||
    voices[0] ||
    null
  );
}

function speak(text: string): void {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;

  // Check mute setting
  try {
    const settings = JSON.parse(localStorage.getItem("evelyn-settings") || "{}");
    if (settings.soundsEnabled === false) return;
    // Kanye voice has its own toggle
    if (settings.kanyeVoiceEnabled === false) return;
  } catch { /* ignore */ }

  if (speaking) {
    window.speechSynthesis.cancel();
  }

  speaking = true;
  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = 0.82;   // slightly deeper
  utter.rate = 0.85;    // slower, deliberate
  utter.volume = 0.85;

  // Wait for voices to load if needed
  const trySpeak = () => {
    const voice = getVoice();
    if (voice) utter.voice = voice;
    utter.onend = () => { speaking = false; };
    utter.onerror = () => { speaking = false; };
    window.speechSynthesis.speak(utter);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => { trySpeak(); };
  } else {
    trySpeak();
  }
}

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function kanyeSayQuestComplete() {
  speak(pick(VOICE_LINES.questComplete));
}

export function kanyeSayLevelUp() {
  speak(pick(VOICE_LINES.levelUp));
}

export function kanyeSayAchievement() {
  speak(pick(VOICE_LINES.achievement));
}

export function kanyeSayGreeting() {
  speak(pick(VOICE_LINES.greeting));
}

export function kanyeSayCheckpoint() {
  speak(pick(VOICE_LINES.checkpointDone));
}

export function kanyeSayRandom() {
  speak(pick(VOICE_LINES.random));
}

/** Play a specific line by text — for the Easter egg etc */
export function kanyeSay(text: string) {
  speak(text);
}
