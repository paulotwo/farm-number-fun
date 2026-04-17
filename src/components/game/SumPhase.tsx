import { useState, useEffect, useCallback } from "react";
import { getAnimalKeys, getAnimalData, type AnimalMode } from "../AnimalEmoji";
import LanguageSelector from "../LanguageSelector";
import NumberOption from "../NumberOption";
import EasterNumberOption from "../EasterNumberOption";
import { useI18n } from "@/i18n";
import {
  playCorrectSound,
  playWrongSound,
  playPopSound,
  playCelebrateSound,
  playClickSound,
  speak,
} from "@/lib/sounds";

interface SumPhaseProps {
  mode: AnimalMode;
  onComplete: () => void;
  onGoHome: () => void;
  bgImage: string;
  fastMode?: boolean;
}

type RoundPhase = "showing" | "choosing" | "correct" | "transition";
type OptionState = "idle" | "correct" | "wrong";

interface SumRound {
  a: number;
  b: number;
  total: number;
  animal: string;
  options: number[];
}

// 9 progressive sum rounds (totals 2-9)
const SUM_PAIRS: Array<[number, number]> = [
  [1, 1], // 2
  [1, 2], // 3
  [2, 2], // 4
  [2, 3], // 5
  [3, 3], // 6
  [3, 4], // 7
  [4, 4], // 8
  [4, 5], // 9
  [3, 5], // 8 (variation)
];

function shuffleArray<T>(arr: T[]): T[] {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

function generateRound(
  pair: [number, number],
  mode: AnimalMode,
  usedAnimals: Set<string>
): SumRound {
  const keys = getAnimalKeys(mode);
  let available = keys.filter((a) => !usedAnimals.has(a));
  if (available.length === 0) available = keys;
  const animal = available[Math.floor(Math.random() * available.length)];

  const total = pair[0] + pair[1];
  const opts = new Set<number>([total]);
  while (opts.size < 3) {
    const o = Math.max(1, Math.min(9, total + Math.floor(Math.random() * 5) - 2));
    opts.add(o);
  }
  const options = shuffleArray(Array.from(opts));
  return { a: pair[0], b: pair[1], total, animal, options };
}

const SumPhase = ({ mode, onComplete, onGoHome, bgImage, fastMode }: SumPhaseProps) => {
  const { t, speechLang } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [usedAnimals, setUsedAnimals] = useState<Set<string>>(new Set());
  const [round, setRound] = useState<SumRound>(() => generateRound(SUM_PAIRS[0], mode, new Set()));
  const [phase, setPhase] = useState<RoundPhase>("showing");
  const [optionStates, setOptionStates] = useState<OptionState[]>(["idle", "idle", "idle"]);
  const [showAnimals, setShowAnimals] = useState(false);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);

  const NumberComponent = mode === "easter" ? EasterNumberOption : NumberOption;

  // Show animals with pop sounds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimals(true);
      if (!fastMode) {
        for (let i = 0; i < round.total; i++) {
          playPopSound(i * 200);
        }
      }
    }, fastMode ? 50 : 350);
    return () => clearTimeout(timer);
  }, [round, fastMode]);

  // Speak then go to choosing
  useEffect(() => {
    if (phase !== "showing" || !showAnimals) return;
    if (fastMode) {
      const t2 = setTimeout(() => setPhase("choosing"), 100);
      return () => clearTimeout(t2);
    }
    const delay = setTimeout(() => {
      speak(t.ui.sumInstruction(round.a, round.b), speechLang, () => setPhase("choosing"));
      const fallback = setTimeout(() => setPhase("choosing"), 4500);
      return () => clearTimeout(fallback);
    }, round.total * 200 + 500);
    return () => clearTimeout(delay);
  }, [phase, showAnimals, fastMode, round, t, speechLang]);

  const handleChoice = useCallback((n: number) => {
    if (phase !== "choosing") return;
    const idx = round.options.indexOf(n);

    if (n === round.total) {
      if (!fastMode) playClickSound();
      if (!fastMode) playCorrectSound();
      setHits((h) => h + 1);
      setOptionStates(round.options.map((o) => (o === n ? "correct" : "idle")));
      setPhase("correct");

      if (currentIndex < 8 && !fastMode) {
        setTimeout(() => {
          playCelebrateSound();
          speak(t.celebrationSpeech(round.total), speechLang);
        }, 300);
      }

      const nextDelay = fastMode ? 200 : 2500;
      setTimeout(() => {
        if (currentIndex >= 8) {
          onComplete();
        } else {
          setPhase("transition");
          const nextIdx = currentIndex + 1;
          setTimeout(() => {
            setShowAnimals(false);
            setCurrentIndex(nextIdx);
            const newRound = generateRound(SUM_PAIRS[nextIdx], mode, usedAnimals);
            setUsedAnimals((prev) => new Set(prev).add(newRound.animal));
            setRound(newRound);
            setOptionStates(["idle", "idle", "idle"]);
            setPhase("showing");
          }, fastMode ? 50 : 400);
        }
      }, nextDelay);
    } else {
      if (optionStates[idx] === "wrong") return;
      if (!fastMode) playClickSound();
      if (!fastMode) playWrongSound();
      setMisses((m) => m + 1);
      setOptionStates((prev) => prev.map((s, i) => (i === idx ? "wrong" : s)));
      if (!fastMode) speak(t.ui.tryAgain, speechLang);
    }
  }, [phase, round, currentIndex, mode, t, speechLang, fastMode, usedAnimals, optionStates, onComplete]);

  const animalImg = getAnimalData(round.animal)?.image ?? "";

  // Fixed-size boxes; animal size scales by the LARGER of the two groups
  // so both boxes look visually consistent. Sized to fit inside 100px (mobile)
  // / 150px (desktop) boxes accounting for padding (p-2 = 8px) and gaps.
  const maxGroup = Math.max(round.a, round.b);
  const sizeClass =
    maxGroup === 1 ? "w-16 h-16 md:w-24 md:h-24" :
    maxGroup === 2 ? "w-10 h-10 md:w-14 md:h-14" :
    maxGroup === 3 ? "w-7 h-7 md:w-10 md:h-10" :
    maxGroup === 4 ? "w-9 h-9 md:w-14 md:h-14" :
    "w-7 h-7 md:w-10 md:h-10";

  return (
    <div
      className="min-h-screen flex flex-col items-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/20" />

      <header className="relative z-20 w-full flex items-start pt-6 pb-2 px-4">
        <div className="flex flex-col gap-1">
          <button
            onClick={onGoHome}
            className="rounded-lg bg-muted px-3 py-2 text-lg transition-transform active:scale-95"
            title="Home"
          >
            🏠
          </button>
        </div>
        <div className="flex-1 text-center">
          <h1
            className="text-2xl md:text-4xl font-extrabold text-primary-foreground drop-shadow-lg"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
          >
            ➕ {t.ui.phase5Name}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2 justify-center">
            <span className="bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-foreground shadow">
              {t.ui.phaseLabel} 5 — {currentIndex + 1}/9
            </span>
            <span className="bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-farm-correct shadow">
              ✅ {hits}
            </span>
            <span className="bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-farm-wrong shadow">
              ❌ {misses}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <LanguageSelector />
          <button
            onClick={onComplete}
            className="rounded-full bg-card/90 backdrop-blur px-3 py-1.5 text-sm font-bold text-foreground shadow transition-transform active:scale-95 hover:bg-card"
          >
            {t.ui.skipPhase}
          </button>
        </div>
      </header>

      <main
        className={`relative z-10 flex-1 flex flex-col items-center justify-center gap-5 px-4 transition-opacity duration-400 ${
          phase === "transition" ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="bg-card/95 backdrop-blur-sm rounded-3xl px-6 py-3 shadow-xl max-w-md text-center animate-bounce-in">
          <p className="text-lg md:text-2xl font-bold text-foreground">
            {phase === "correct"
              ? t.celebrationText(round.total)
              : t.ui.sumInstruction(round.a, round.b)}
          </p>
        </div>

        {/* Two groups + plus sign — kept on a single row, no wrapping */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 md:gap-5 flex-nowrap w-full max-w-full">
          {/* Group A — fixed size */}
          <div className="shrink-0 bg-card/70 backdrop-blur border-4 border-card/80 rounded-2xl p-2 flex flex-wrap justify-center items-center content-center gap-1 w-[100px] h-[100px] md:w-[150px] md:h-[150px]">
            {showAnimals &&
              Array.from({ length: round.a }).map((_, i) => (
                <img
                  key={`a-${i}`}
                  src={animalImg}
                  alt=""
                  className={`${sizeClass} object-contain animate-pop-in drop-shadow-md`}
                  style={{ animationDelay: `${i * 200}ms`, opacity: 0 }}
                  draggable={false}
                />
              ))}
          </div>

          <div
            className="shrink-0 text-3xl sm:text-5xl md:text-6xl font-black text-primary-foreground drop-shadow-lg"
            style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.3)" }}
          >
            ➕
          </div>

          {/* Group B — fixed size, identical to Group A */}
          <div className="shrink-0 bg-card/70 backdrop-blur border-4 border-card/80 rounded-2xl p-2 flex flex-wrap justify-center items-center content-center gap-1 w-[100px] h-[100px] md:w-[150px] md:h-[150px]">
            {showAnimals &&
              Array.from({ length: round.b }).map((_, i) => (
                <img
                  key={`b-${i}`}
                  src={animalImg}
                  alt=""
                  className={`${sizeClass} object-contain animate-pop-in drop-shadow-md`}
                  style={{ animationDelay: `${(round.a + i) * 200}ms`, opacity: 0 }}
                  draggable={false}
                />
              ))}
          </div>

        </div>

        {/* Equals + result on a new line */}
        <div className="flex items-center justify-center gap-3 md:gap-5">
          <div
            className="text-3xl sm:text-5xl md:text-6xl font-black text-primary-foreground drop-shadow-lg"
            style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.3)" }}
          >
            =
          </div>

          {phase === "correct" ? (
            <div
              className="text-5xl sm:text-7xl md:text-8xl font-black text-farm-correct animate-celebrate drop-shadow-lg"
              style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.2)" }}
            >
              {round.total}
            </div>
          ) : (
            <div
              className="text-4xl sm:text-6xl md:text-7xl font-black text-primary-foreground drop-shadow-lg"
              style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.3)" }}
            >
              ?
            </div>
          )}
        </div>

        {(phase === "choosing" || phase === "correct") && (
          <div className="flex gap-4 md:gap-6">
            {round.options.map((n, i) => (
              <NumberComponent
                key={n}
                number={n}
                onClick={handleChoice}
                state={optionStates[i]}
                disabled={phase !== "choosing"}
                index={i}
              />
            ))}
          </div>
        )}

        {phase === "showing" && (
          <p className="text-muted-foreground text-sm animate-pulse font-medium bg-card/80 backdrop-blur rounded-full px-4 py-2">
            {t.ui.countingHint}
          </p>
        )}
      </main>

      <div className="relative z-10 w-full h-8 bg-gradient-to-t from-farm-grass/40 to-transparent" />
    </div>
  );
};

export default SumPhase;
