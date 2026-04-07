import { useState, useEffect } from "react";

/** Debug mode is active when ?debug=1 is in the URL */
export function useDebugMode() {
  const [debug, setDebug] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search).get("debug") === "1";
    const isLovablePreview = !window.location.hostname.includes("farm-number-fun.lovable.app");
    return params || isLovablePreview;
  });

  const [fastMode, setFastMode] = useState(false);

  useEffect(() => {
    const isDebug = new URLSearchParams(window.location.search).get("debug") === "1" || !window.location.hostname.includes("farm-number-fun.lovable.app");
    setDebug(isDebug);
    document.documentElement.classList.toggle("debug", isDebug);
  }, []);

  return { debug, fastMode, setFastMode };
}
