"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator) ||
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      return;
    }

    const registerWhenIdle = () => {
      const idleCallback = (window as typeof window & {
        requestIdleCallback?: (callback: () => void) => number;
        cancelIdleCallback?: (id: number) => void;
      }).requestIdleCallback;

      if (typeof idleCallback === "function") {
        const id = idleCallback(() => {
          void navigator.serviceWorker.register("/sw.js", { scope: "/" });
        });
        return () => {
          const cancelIdle = (window as typeof window & {
            cancelIdleCallback?: (id: number) => void;
          }).cancelIdleCallback;
          if (typeof cancelIdle === "function") cancelIdle(id);
        };
      }

      const timeoutId = globalThis.setTimeout(() => {
        void navigator.serviceWorker.register("/sw.js", { scope: "/" });
      }, 2500);
      return () => globalThis.clearTimeout(timeoutId);
    };

    const cleanup = registerWhenIdle();
    return cleanup;
  }, []);

  return null;
}
