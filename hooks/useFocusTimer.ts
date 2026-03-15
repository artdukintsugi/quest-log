"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { soundTick } from "@/lib/sounds";

export type TimerPreset = {
  label: string;
  minutes: number;
  emoji: string;
};

export const TIMER_PRESETS: TimerPreset[] = [
  { label: "Quick", minutes: 5, emoji: "⚡" },
  { label: "Pomodoro", minutes: 25, emoji: "🍅" },
  { label: "Extended", minutes: 45, emoji: "🔥" },
  { label: "Deep Work", minutes: 90, emoji: "🧠" },
];

export type TimerState = "idle" | "running" | "paused" | "done";

export function useFocusTimer() {
  const [preset, setPreset] = useState<TimerPreset>(TIMER_PRESETS[1]);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_PRESETS[1].minutes * 60);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = preset.minutes * 60;
  const progress = 1 - secondsLeft / totalSeconds;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setTimerState("running");
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setTimerState("done");
          soundTick();
          // Play a completion sound sequence
          setTimeout(() => soundTick(), 200);
          setTimeout(() => soundTick(), 400);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const pause = useCallback(() => {
    clearTimer();
    setTimerState("paused");
  }, [clearTimer]);

  const resume = useCallback(() => {
    setTimerState("running");
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setTimerState("done");
          soundTick();
          setTimeout(() => soundTick(), 200);
          setTimeout(() => soundTick(), 400);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setTimerState("idle");
    setSecondsLeft(preset.minutes * 60);
  }, [clearTimer, preset.minutes]);

  const selectPreset = useCallback((p: TimerPreset) => {
    clearTimer();
    setPreset(p);
    setSecondsLeft(p.minutes * 60);
    setTimerState("idle");
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const displayTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    preset,
    selectPreset,
    secondsLeft,
    totalSeconds,
    progress,
    timerState,
    displayTime,
    start,
    pause,
    resume,
    reset,
  };
}
