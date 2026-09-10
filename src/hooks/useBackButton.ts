"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Handles the Android hardware back button for both Capacitor (native) and PWA.
 *
 * - Capacitor: listens to the App `backButton` event once (at mount).
 *   On root routes, shows a "press again to exit" toast before minimizing.
 *   On tab routes (e.g. /explore), navigates to the specified parentRoute.
 *   On all other routes, calls router.back().
 * - PWA / browser: pushes a sentinel history entry once so the stack is never
 *   empty, then intercepts `popstate` to drive navigation.
 *
 * isRootRoute and parentRoute are tracked via refs so the one-time listener
 * always reads the latest values without being re-registered on every navigation.
 */
export function useBackButton(isRootRoute: boolean, parentRoute?: string) {
  const router = useRouter();
  const pressedOnceRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCapacitorRef = useRef(false);

  // Refs mirror the latest prop values so the one-time effect closure stays fresh
  const isRootRouteRef = useRef(isRootRoute);
  const parentRouteRef = useRef(parentRoute);

  // Sync refs whenever the route context changes — no side effects here
  useEffect(() => {
    isRootRouteRef.current = isRootRoute;
    parentRouteRef.current = parentRoute;
  }, [isRootRoute, parentRoute]);

  // One-time setup: register Capacitor listener + PWA sentinel exactly once.
  // Empty deps array is intentional — re-registering on every navigation is
  // what caused the double-tap bug (a new sentinel entry was pushed each time).
  useEffect(() => {
    let capacitorCleanup: (() => void) | null = null;

    async function setupCapacitor() {
      try {
        const { App } = await import("@capacitor/app");

        const handle = await App.addListener("backButton", () => {
          if (isRootRouteRef.current) {
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
          } else if (parentRouteRef.current) {
            router.push(parentRouteRef.current);
          } else {
            router.back();
          }
        });

        isCapacitorRef.current = true;
        capacitorCleanup = () => {
          handle.remove();
          isCapacitorRef.current = false;
        };
      } catch {
        // @capacitor/app not available — PWA/browser path handles it below
      }
    }

    setupCapacitor();

    // PWA / browser fallback: push sentinel once so the history stack is never
    // empty and a single back press won't close the PWA immediately.
    if (typeof window !== "undefined" && !window.history.state?.__sentinel) {
      window.history.pushState({ __sentinel: true }, "");
    }

    function handlePopState() {
      // Capacitor already handled the back press via its own listener;
      // if we also react here, the user ends up going back 2 screens.
      if (isCapacitorRef.current) return;

      if (isRootRouteRef.current) {
        // Re-push sentinel so subsequent back presses don't close the app
        window.history.pushState({ __sentinel: true }, "");
      } else if (parentRouteRef.current) {
        router.push(parentRouteRef.current);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
