"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

/**
 * Deep-link trampoline page.
 *
 * The payment gateway redirects here (an HTTPS URL) after payment completes.
 * We redirect the user back to the native app using two strategies in order:
 *
 * 1. intent:// URL (Android) — Chrome Custom Tab on Android handles this
 *    natively: it reads the package name, creates an Android Intent, and opens
 *    the app. This is the most reliable method in Chrome Custom Tab.
 *
 * 2. janakapp:// deep link — fallback for iOS (SFSafariViewController handles
 *    custom URL schemes from user-initiated navigation and from JS).
 *
 * If neither auto-redirect fires (plain web browser, or the app isn't
 * installed), we show a button so the user can tap manually.
 */

// Android intent URL — Chrome Custom Tab recognises this and opens the app.
const INTENT_URL =
  "intent://payment-result#Intent;scheme=janakapp;package=com.janakpositioning.janakglobal;S.browser_fallback_url=https%3A%2F%2Fjanak-fe-roan.vercel.app%2Fpayment-complete;end";

// Fallback for iOS / plain browsers.
const DEEP_LINK = "janakapp://payment-result";

export default function PaymentCompletePage() {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const isAndroid = /android/i.test(navigator.userAgent);

    if (isAndroid) {
      // intent:// is handled by Chrome (Custom Tab and regular) on Android.
      // It creates a real Android Intent so the OS opens the app directly.
      window.location.href = INTENT_URL;
    } else {
      // iOS: SFSafariViewController handles janakapp:// when triggered here.
      window.location.href = DEEP_LINK;
    }

    // If the page is still visible after 2 s the auto-redirect didn't work —
    // show a manual button the user can tap.
    const timer = setTimeout(() => setShowFallback(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-6">
      <div className="w-20 h-20 rounded-full bg-[#16A34A] flex items-center justify-center shadow-[0_8px_32px_rgba(22,163,74,0.3)]">
        <CheckCircle className="w-12 h-12 text-white" />
      </div>

      <div className="text-center">
        <h1 className="text-xl font-bold text-[#111827]">Payment Successful!</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Opening the Janak app…
        </p>
      </div>

      {!showFallback && (
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      )}

      {showFallback && (
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          <p className="text-sm text-[#6B7280] text-center">
            Tap the button below to return to the app.
          </p>
          <a
            href={DEEP_LINK}
            className="w-full text-center bg-accent text-white text-sm font-semibold px-6 py-3 rounded-xl"
          >
            Open Janak App
          </a>
        </div>
      )}
    </div>
  );
}
