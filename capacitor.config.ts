import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.yourname.fia",           // ← change to your domain
  appName: "FIA",
  webDir: "dist",                       // Next.js export output
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#060b18",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "Dark",
      backgroundColor: "#060b18",
    },
  },
  android: {
    allowMixedContent: true,
    buildOptions: {
      keystorePath: "release.keystore",   // generate with keytool
      keystorePassword: "your_password",
      keystoreAlias: "fia-key",
      keystoreAliasPassword: "your_password",
      releaseType: "APK",
    },
  },
  ios: {
    scheme: "FIA",
    contentInset: "always",
  },
};

export default config;
