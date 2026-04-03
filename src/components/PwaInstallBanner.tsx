import { usePwaInstall } from "@/hooks/use-pwa-install";

const PwaInstallBanner = () => {
  const { canInstall, install, dismiss } = usePwaInstall();

  if (!canInstall) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-card/95 backdrop-blur border-2 border-border rounded-2xl shadow-2xl px-5 py-3 max-w-sm w-[calc(100%-2rem)]">
      <span className="text-2xl">📲</span>
      <p className="flex-1 text-sm font-semibold text-foreground leading-snug">
        Instala a app para jogar sem internet!
      </p>
      <button
        onClick={install}
        className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        Instalar
      </button>
      <button
        onClick={dismiss}
        aria-label="Fechar"
        className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
      >
        ✕
      </button>
    </div>
  );
};

export default PwaInstallBanner;