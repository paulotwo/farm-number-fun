/** Check if running as installed PWA (standalone mode) */
export function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true
  );
}

/** Request fullscreen if not in standalone/PWA mode */
export function requestFullscreen() {
  if (isStandalone()) return;
  const el = document.documentElement;
  if (el.requestFullscreen) {
    el.requestFullscreen().catch(() => {});
  } else if ((el as any).webkitRequestFullscreen) {
    (el as any).webkitRequestFullscreen();
  }
}
