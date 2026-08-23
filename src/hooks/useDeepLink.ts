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
        }
      }).then((handle) => {
        removeListener = () => handle.remove();
      });
    });

    return () => removeListener?.();
  }, [router]);
}
