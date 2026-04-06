import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

document.addEventListener("contextmenu", (e) => {
  if (new URLSearchParams(location.search).get("debug") === "1") return;
  e.preventDefault();
});

createRoot(document.getElementById("root")!).render(<App />);
