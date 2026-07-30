"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "rf_exit_intent_shown";

export function useExitIntent(enabled = true) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!enabled) return;

    const alreadyShown = sessionStorage.getItem(STORAGE_KEY);
    if (alreadyShown) return;

    const isMobile = window.matchMedia("(max-width: 1024px)").matches;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isMobile) {
        open();
      }
    };

    const timeout = window.setTimeout(() => {
      open();
    }, 30000);

    if (!isMobile) {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.clearTimeout(timeout);
    };
  }, [enabled, open]);

  return { isOpen, close, open };
}
