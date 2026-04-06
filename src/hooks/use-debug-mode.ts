import { useState, useEffect } from "react";

/** Debug mode is active when ?debug=1 is in the URL */
export function useDebugMode() {
  const [debug, setDebug] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("debug") === "1";
  });

  const [fastMode, setFastMode] = useState(false);

  useEffect(() => {
    const isDebug = new URLSearchParams(window.location.search).get("debug") === "1";
    setDebug(isDebug);
    document.documentElement.classList.toggle("debug", isDebug);
  }, []);

  return { debug, fastMode, setFastMode };
}
