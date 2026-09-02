"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

/**
 * Deep-link trampoline page.
 *
 * The payment gateway always redirects to an HTTPS URL (this page) after
 * finishing payment. We immediately fire the janakapp:// deep link so the
 * native app is brought back to the foreground. This is more reliable than
 * asking the payment gateway to redirect straight to a custom URL scheme,
 * because Chrome Custom Tab can silently fail on janakapp:// redirects.
 *
 * Flow (native):
 *   payment gateway → /payment-complete (Chrome Custom Tab)
 *   → window.location = janakapp://payment-result
 *   → Android intent opens/foregrounds the Janak app
 *   → Chrome Custom Tab closes → browserFinished fires
 *   → app navigates to /payment-result in the WebView
 *
 * Flow (web / fallback):
 *   The deep link won't open anything, so we show a button instead.
 */
export default function PaymentCompletePage() {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Attempt to open the app via deep link immediately.
    window.location.href = "janakapp://payment-result";

    // If the app didn't open within 2 s the user is probably on plain web —
    // show the manual fallback button.
    const timer = setTimeout(() => setShowFallback(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6">
      <Loader2 className="w-12 h-12 text-accent animate-spin" />
      <p className="text-base font-semibold text-[#111827]">
        Payment received! Opening app…
      </p>
      <p className="text-sm text-[#6B7280] text-center">
        You will be redirected back to the Janak app automatically.
      </p>

      {showFallback && (
        <a
          href="janakapp://payment-result"
          className="mt-4 inline-block bg-accent text-white text-sm font-semibold px-6 py-3 rounded-xl"
        >
          Open Janak App
        </a>
      )}
    </div>
  );
}
