// Load environment variables with proper priority (system > .env)
import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

const bundleId = "space.manus.seelenplanerin.app.t20260225150400";
const timestamp = bundleId.split(".").pop()?.replace(/^t/, "") ?? "";
const schemeFromBundleId = `manus${timestamp}`;

const env = {
  appName: "Die Seelenplanerin",
  appSlug: "seelenplanerin-app",
  logoUrl: "https://private-us-east-1.manuscdn.com/sessionFile/sSYWNj16Qoj6WJh8eZ0LRH/sandbox/NNJ5FTF4Zm3dVawLXTdc54-img-1_1772031963000_na1fn_c2VlbGVucGxhbmVyaW4tbG9nbw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvc1NZV05qMTZRb2o2V0poOGVaMExSSC9zYW5kYm94L05OSjVGVEY0Wm0zZFZhd0xYVGRjNTQtaW1nLTFfMTc3MjAzMTk2MzAwMF9uYTFmbl9jMlZsYkdWdWNHeGhibVZ5YVc0dGJHOW5idy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=XhusDUP1M0LE5JdQFxN79RTaSpkgj6EoYmdQwLb7SUk7E4-yKnd401E6EgZlO7ZRiTqbbe-9mMiarBTofzxSPvXAMaY1uav98R4dbylZQ5d80hhFCaXlvm~LXA1-TpyiiDc804JNGYjIalRP4YJy4~y2MYsheRXWYRfVTKACDUBxrYxyc84u9DqtGRpg1d7WgayiWm8RP3WiFFs1IbwSd-0BJWERjhj0MR1h2KZVIdmCG0-sWlRgoCQjQtM2o0r7s5Eu32~BzABPYClipMqTC7XJUaSL3Y5AzoDW5P4bSyatbSjDNJQpaJSTead9QhUOra-dx83wSx1VVCKlXk18nw__",
  scheme: schemeFromBundleId,
  iosBundleId: bundleId,
  androidPackage: bundleId,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: env.iosBundleId,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#0F0A1E",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,
    permissions: ["POST_NOTIFICATIONS"],
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [{ scheme: env.scheme, host: "*" }],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    ["expo-audio", { microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone." }],
    ["expo-video", { supportsBackgroundPlayback: true, supportsPictureInPicture: true }],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#0F0A1E",
        dark: { backgroundColor: "#0F0A1E" },
      },
    ],
    ["expo-build-properties", { android: { buildArchs: ["armeabi-v7a", "arm64-v8a"] } }],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
