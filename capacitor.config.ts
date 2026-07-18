import type { CapacitorConfig } from "@capacitor/cli";
import * as dotenv from "dotenv";
dotenv.config();

const config: CapacitorConfig = {
  appId: "com.janakpositioning.app",
  appName: "Janak",
  webDir: "out",                     // Next.js static export output directory
  server: {
    url: process.env.CAPACITOR_SERVER_URL ?? "https://janak-fe-roan.vercel.app",
    cleartext: false,
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
