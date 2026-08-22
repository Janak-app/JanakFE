"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Handles the Android hardware back button for both Capacitor (native) and PWA.
 *
 * - Capacitor: listens to the App `backButton` event and calls router.back().
 *   On root routes, shows a "press again to exit" toast before minimizing.
 * - PWA / browser: pushes a sentinel history entry so the stack is never empty,
 *   then intercepts `popstate` to drive router.back().
 */
export function useBackButton(isRootRoute: boolean) {
  const router = useRouter();
  const pressedOnceRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let capacitorCleanup: (() => void) | null = null;

    async function setupCapacitor() {
      try {
        const { App } = await import("@capacitor/app");

        const handle = await App.addListener("backButton", () => {
          if (isRootRoute) {
            if (pressedOnceRef.current) {
              App.minimizeApp();
            } else {
              pressedOnceRef.current = true;
              // Show a brief "press again to exit" hint
              const event = new CustomEvent("back-exit-hint");
              window.dispatchEvent(event);

              timerRef.current = setTimeout(() => {
                pressedOnceRef.current = false;
              }, 2000);
            }
          } else {
            router.back();
          }
        });

        capacitorCleanup = () => handle.remove();
      } catch {
        // @capacitor/app not available — PWA/browser path handles it below
      }
    }

    setupCapacitor();

    // PWA / browser fallback: keep at least one sentinel entry in history
    // so pressing back doesn't immediately close the PWA.
    if (typeof window !== "undefined" && !window.history.state?.__sentinel) {
      window.history.pushState({ __sentinel: true }, "");
    }

    function handlePopState() {
      if (isRootRoute) {
        // Re-push sentinel so subsequent back presses don't close the app
        window.history.pushState({ __sentinel: true }, "");
      } else {
        router.back();
      }
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      capacitorCleanup?.();
      window.removeEventListener("popstate", handlePopState);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRootRoute, router]);
}
