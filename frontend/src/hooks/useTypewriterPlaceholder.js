import { useEffect, useRef, useState } from "react";

const TYPE_MS = 52;
const DELETE_MS = 30;
const PAUSE_FULL_MS = 2600;
const PAUSE_EMPTY_MS = 560;

function delayAfterChar(char) {
  if (char === ",") return 140;
  if (char === ".") return 180;
  if (char === " ") return 36;
  return 0;
}

export function useTypewriterPlaceholder(text, enabled = true) {
  const [displayed, setDisplayed] = useState("");
  const rafRef = useRef(null);
  const stateRef = useRef({
    index: 0,
    deleting: false,
    waiting: false,
    waitUntil: 0,
    nextStepAt: 0,
  });

  useEffect(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (!enabled) {
      setDisplayed("");
      stateRef.current = {
        index: 0,
        deleting: false,
        waiting: false,
        waitUntil: 0,
        nextStepAt: 0,
      };
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayed(text);
      return;
    }

    const resetState = () => {
      stateRef.current = {
        index: 0,
        deleting: false,
        waiting: false,
        waitUntil: 0,
        nextStepAt: performance.now() + PAUSE_EMPTY_MS,
      };
      setDisplayed("");
    };

    resetState();

    const loop = (now) => {
      const state = stateRef.current;

      if (state.waiting) {
        if (now < state.waitUntil) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
        state.waiting = false;
        state.deleting = true;
        state.nextStepAt = now;
      }

      if (now < state.nextStepAt) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (!state.deleting) {
        if (state.index < text.length) {
          state.index += 1;
          setDisplayed(text.slice(0, state.index));
          const char = text[state.index - 1];
          state.nextStepAt = now + TYPE_MS + delayAfterChar(char);
        } else {
          state.waiting = true;
          state.waitUntil = now + PAUSE_FULL_MS;
        }
      } else if (state.index > 0) {
        state.index -= 1;
        setDisplayed(text.slice(0, state.index));
        state.nextStepAt = now + DELETE_MS;
      } else {
        state.deleting = false;
        state.nextStepAt = now + PAUSE_EMPTY_MS;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, enabled]);

  return displayed;
}
