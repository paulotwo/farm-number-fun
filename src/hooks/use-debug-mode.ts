import { useState, useEffect } from "react";
import { isNative } from "@/lib/platform";

/** Fora do domínio de produção (dev local). O app nativo roda em https://localhost e não conta. */
const isDevHost = () => !isNative && !window.location.hostname.includes("farm-number-fun.ksepisteme.com.br");

/** Debug mode is active when ?debug=1 is in the URL */
export function useDebugMode() {
  const [debug, setDebug] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search).get("debug") === "1";
    const isDev = isDevHost();
    return params || isDev;
  });

  const [fastMode, setFastMode] = useState(false);

  useEffect(() => {
    const isDebug = new URLSearchParams(window.location.search).get("debug") === "1" || isDevHost();
    setDebug(isDebug);
    document.documentElement.classList.toggle("debug", isDebug);
  }, []);

  return { debug, fastMode, setFastMode };
}
