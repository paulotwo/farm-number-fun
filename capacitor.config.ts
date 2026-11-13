import type { CapacitorConfig } from "@capacitor/cli";

// Casca nativa: sem `server.url`. O WebView serve o bundle de `dist/`
// (gerado por `bun run build:native`) em https://localhost, então o jogo
// funciona offline desde a instalação.
const config: CapacitorConfig = {
  appId: "com.pjdev.farmnumberfun",
  appName: "O Mundo dos Números",
  webDir: "dist",
  android: {
    allowMixedContent: false,
  },
  plugins: {
    // Barra de status visível (relógio, rede) sobre o fundo do jogo. O conteúdo
    // vai de borda a borda (`viewport-fit=cover` no index.html) e se afasta das
    // barras com `env(safe-area-inset-*)`. Ícones claros: os fundos variam de
    // claro a escuro, então o App.tsx põe uma faixa escura translúcida atrás.
    SystemBars: {
      insetsHandling: "native",
      initialViewportFitValueHint: "cover",
      style: "DARK",
    },
  },
};

export default config;
