"use client";

import { useEffect, useRef } from "react";
import { soundKeyClick } from "@/lib/sounds";

interface KeyboardSoundsProps {
  /** CSS selector for inputs to attach to. Defaults to 'input[type="text"], input[type="search"], textarea' */
  selector?: string;
  enabled?: boolean;
}

/**
 * Drop this component anywhere and it will attach keydown listeners to all
 * matching text inputs on the page, playing a mechanical keyboard click sound.
 */
export default function KeyboardSounds({
  selector = 'input[type="text"], input[type="search"], textarea',
  enabled = true,
}: KeyboardSoundsProps) {
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    function onKeyDown(e: Event) {
      const target = e.target as HTMLElement;
      // Only fire if target matches our selector
      if (!target.matches(selector)) return;
      if (!enabledRef.current) return;
      // Don't click on modifier-only keys
      const ke = e as KeyboardEvent;
      if (["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab"].includes(ke.key)) return;
      soundKeyClick();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selector]);

  // This component renders nothing — it's a pure behavior hook
  return null;
}
