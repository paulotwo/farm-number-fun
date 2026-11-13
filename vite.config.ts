import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
// Build do app (Capacitor): `vite build --mode native`. Sem service worker
// (o bundle já vai dentro do app) e sem analytics (Política de Famílias do Play).
const stripAnalytics = (): Plugin => ({
  name: "strip-analytics",
  transformIndexHtml: (html) =>
    html.replace(/[ \t]*<!-- analytics:start[\s\S]*?<!-- analytics:end -->\r?\n?/, ""),
});

// As prévias de Open Graph (public/og-image*.png) só servem a quem compartilha
// o link do site; não entram no app.
const dropWebOnlyFiles = (): Plugin => ({
  name: "drop-web-only-files",
  closeBundle: () => {
    const dist = path.resolve(__dirname, "dist");
    for (const file of fs.readdirSync(dist)) {
      if (/^og-image.*\.png$/.test(file) || file === "robots.txt") fs.rmSync(path.join(dist, file));
    }
  },
});

export default defineConfig(({ mode }) => {
  const native = mode === "native";
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      native && stripAnalytics(),
      native && dropWebOnlyFiles(),
      !native &&
        VitePWA({
          registerType: "autoUpdate",
          devOptions: {
            enabled: false,
          },
          workbox: {
            globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff,woff2}"],
            maximumFileSizeToCacheInBytes: 4194304,
            navigateFallbackDenylist: [/^\/~oauth/],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: "CacheFirst",
                options: {
                  cacheName: "google-fonts-cache",
                  expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                  cacheableResponse: { statuses: [0, 200] },
                },
              },
              {
                urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                handler: "CacheFirst",
                options: {
                  cacheName: "gstatic-fonts-cache",
                  expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                  cacheableResponse: { statuses: [0, 200] },
                },
              },
            ],
          },
          manifest: false,
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
  };
});
