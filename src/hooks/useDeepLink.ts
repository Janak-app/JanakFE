import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";

export function useDeepLink() {
  const router = useRouter();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let removeListener: (() => void) | undefined;

    import("@capacitor/app").then(({ App }) => {
      App.addListener("appUrlOpen", (data) => {
        if (data.url.startsWith("janakapp://payment-result")) {
          router.replace("/payment-result");
          return;
        }

        if (data.url.startsWith("janakapp://order-success")) {
          // Extract orderId query param if present.
          // data.url looks like: janakapp://order-success?orderId=abc123
          const queryString = data.url.split("?")[1] ?? "";
          const params = new URLSearchParams(queryString);
          const orderId = params.get("orderId");
          router.replace(
            orderId
              ? `/checkout/success?orderId=${encodeURIComponent(orderId)}`
              : "/checkout/success"
          );
        }
      }).then((handle) => {
        removeListener = () => handle.remove();
      });
    });

    return () => removeListener?.();
  }, [router]);
}
