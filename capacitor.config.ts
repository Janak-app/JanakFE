import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.janakpositioning.app",
  appName: "Janak",
  webDir: "out",                     // Next.js static export output directory
  server: {
    androidScheme: "https",          // Use HTTPS scheme on Android for cookies/auth
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1A4F9C",
      showSpinner: false,
    },
    StatusBar: {
      style: "LIGHT",               // white icons (clock, battery, etc.)
      backgroundColor: "#1A4F9C",  // brand blue
      overlaysWebView: false,       // status bar takes its own space, doesn't overlap app
    },
  },
};

export default config;
