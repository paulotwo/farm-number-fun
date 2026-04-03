import React, { useState, useRef, useEffect } from "react";
import { useI18n, SPEECH_LANGS } from "@/i18n";
import type { Locale } from "@/i18n";
import { speak } from "@/lib/sounds";

import flagBr from "@/assets/flags/br.png";
import flagUs from "@/assets/flags/us.png";
import flagEs from "@/assets/flags/es.png";
import flagFr from "@/assets/flags/fr.png";
import flagIt from "@/assets/flags/it.png";
import flagDe from "@/assets/flags/de.png";

const LANGUAGES: { code: Locale; flag: string; label: string }[] = [
  { code: "pt", flag: flagBr, label: "Português" },
  { code: "en", flag: flagUs, label: "English" },
  { code: "es", flag: flagEs, label: "Español" },
  { code: "fr", flag: flagFr, label: "Français" },
  { code: "it", flag: flagIt, label: "Italiano" },
  { code: "de", flag: flagDe, label: "Deutsch" },
];

const LanguageSelector: React.FC = () => {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  const current = LANGUAGES.find((l) => l.code === locale)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-2 text-sm font-semibold text-muted-foreground transition-transform active:scale-95"
        aria-label="Change language"
      >
        <img src={current.flag} alt={current.label} className="h-5 w-7 rounded-sm object-cover" />
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[140px] rounded-xl bg-card shadow-lg border border-border overflow-hidden">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
                speak(lang.label, SPEECH_LANGS[lang.code]);
              }}
              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                lang.code === locale
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <img src={lang.flag} alt={lang.label} className="h-5 w-7 rounded-sm object-cover" />
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
