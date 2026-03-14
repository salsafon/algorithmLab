import { useEffect } from "react";

interface Shortcuts {
  onRun?: () => void;
  onReset?: () => void;
  onShuffle?: () => void;
}

export function useKeyboard({ onRun, onReset, onShuffle }: Shortcuts) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.code === "Space") {
        e.preventDefault();
        onRun?.();
      }
      if (e.code === "KeyR") {
        e.preventDefault();
        onReset?.();
      }
      if (e.code === "KeyS") {
        e.preventDefault();
        onShuffle?.();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onRun, onReset, onShuffle]);
}