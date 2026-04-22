import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Guard PWA service worker: never register in iframe or preview hosts
const isInIframe = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

const isPreviewHost =
  window.location.hostname.includes("id-preview--") ||
  window.location.hostname.includes("lovableproject.com");

if (isPreviewHost || isInIframe) {
  navigator.serviceWorker?.getRegistrations().then((registrations) => {
    registrations.forEach((r) => r.unregister());
  });
}

document.addEventListener("contextmenu", (e) => {
  if (new URLSearchParams(location.search).get("debug") === "1") return;
  e.preventDefault();
});

createRoot(document.getElementById("root")!).render(<App />);
