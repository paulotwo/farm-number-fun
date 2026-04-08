import { useState, useCallback, useEffect, useMemo } from "react";
import { getAnimalKeys, getAnimalData, type AnimalMode } from "../AnimalEmoji";
import NumberOption from "../NumberOption";
import EasterNumberOption from "../EasterNumberOption";
import LanguageSelector from "../LanguageSelector";
import { useI18n } from "@/i18n";
import {
  playCorrectSound,
  playWrongSound,
  playClickSound,
  playPopSound,
  playCelebrateSound,
  speak,
} from "@/lib/sounds";

type TrainState = "intro" | "showing" | "choosing" | "correct" | "done";

interface TrainPhaseProps {
  mode: AnimalMode;
  bgImage: string;
  fastMode?: boolean;
  setFastMode?: (fn: (prev: boolean) => boolean) => void;
  debug?: boolean;
  onComplete: () => void;
}

function generateOptions(correct: number): number[] {
  const opts = new Set<number>([correct]);
  while (opts.size < 3) {
    const n = Math.max(1, Math.min(9, correct + Math.floor(Math.random() * 5) - 2));
    opts.add(n);
  }
  return Array.from(opts).sort(() => Math.random() - 0.5);
}

function pickAnimalForWagon(mode: AnimalMode, index: number): string {
  const keys = getAnimalKeys(mode);
  return keys[index % keys.length];
}

function getAnimalSizeClass(count: number): string {
  if (count <= 2) return "w-8 h-8 md:w-12 md:h-12";
  if (count <= 4) return "w-7 h-7 md:w-10 md:h-10";
  if (count <= 6) return "w-6 h-6 md:w-8 md:h-8";
  return "w-5 h-5 md:w-7 md:h-7";
}

const TrainPhase = ({ mode, bgImage, fastMode, setFastMode, debug, onComplete }: TrainPhaseProps) => {
  const { t, speechLang } = useI18n();
  const [currentWagon, setCurrentWagon] = useState(1);
  const [state, setState] = useState<TrainState>("intro");
  const [options, setOptions] = useState<number[]>(() => generateOptions(1));
  const [optionStates, setOptionStates] = useState<("idle" | "correct" | "wrong")[]>(["idle", "idle", "idle"]);
  const [completedWagons, setCompletedWagons] = useState<number[]>([]);
  const [flyingNumber, setFlyingNumber] = useState<number | null>(null);
  const [showAnimals, setShowAnimals] = useState(false);

  const animal = useMemo(() => pickAnimalForWagon(mode, currentWagon - 1), [mode, currentWagon]);
  const NumberComponent = mode === "easter" ? EasterNumberOption : NumberOption;

  // Intro speech
  useEffect(() => {
    if (state !== "intro") return;
    if (fastMode) {
      setState("showing");
      return;
    }
    const timer = setTimeout(() => {
      speak(t.ui.trainWagonIntro, speechLang, () => setState("showing"));
      setTimeout(() => setState("showing"), 4000);
    }, 500);
    return () => clearTimeout(timer);
  }, [state, t, speechLang, fastMode]);

  // Show animals with pop sounds, then speak count prompt
  useEffect(() => {
    if (state !== "showing") return;
    const showTimer = setTimeout(() => {
      setShowAnimals(true);
      if (!fastMode) {
        for (let i = 0; i < currentWagon; i++) {
          playPopSound(i * 250);
        }
      }
    }, fastMode ? 50 : 300);

    const speakTimer = setTimeout(() => {
      if (fastMode) {
        setState("choosing");
        return;
      }
      speak(t.ui.trainCountPrompt(currentWagon), speechLang, () => setState("choosing"));
      setTimeout(() => setState("choosing"), 4000);
    }, fastMode ? 150 : currentWagon * 250 + 600);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(speakTimer);
    };
  }, [state, currentWagon, t, speechLang, fastMode]);

  const handleChoice = useCallback((n: number) => {
    if (state !== "choosing") return;
    const idx = options.indexOf(n);

    if (n === currentWagon) {
      if (!fastMode) playClickSound();
      if (!fastMode) playCorrectSound();
      setOptionStates(options.map((o) => (o === n ? "correct" : "idle")));
      setState("correct");
      setFlyingNumber(n);

      if (!fastMode) {
        const nextSpeech = currentWagon >= 9 ? t.ui.trainAllDone : t.ui.trainNextWagon;
        setTimeout(() => {
          speak(t.ui.trainCorrectSpeech(currentWagon), speechLang, () => {
            speak(nextSpeech, speechLang);
          });
        }, 300);
      }

      setTimeout(() => {
        setFlyingNumber(null);
        setCompletedWagons((prev) => [...prev, currentWagon]);

        if (currentWagon >= 9) {
          setState("done");
          if (!fastMode) playCelebrateSound();
        } else {
          const next = currentWagon + 1;
          setCurrentWagon(next);
          setOptions(generateOptions(next));
          setOptionStates(["idle", "idle", "idle"]);
          setShowAnimals(false);
          setState("showing");
        }
      }, fastMode ? 300 : 2000);
    } else {
      if (optionStates[idx] === "wrong") return;
      if (!fastMode) playClickSound();
      if (!fastMode) playWrongSound();
      setOptionStates((prev) => prev.map((s, i) => (i === idx ? "wrong" : s)));
      if (!fastMode) speak(t.ui.tryAgain, speechLang);
    }
  }, [state, options, currentWagon, t, speechLang, optionStates, fastMode]);

  const handlePlayAgain = useCallback(() => {
    onComplete();
  }, [onComplete]);

  if (state === "done") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative z-10 flex flex-col items-center gap-6 px-4">
          <div className="text-6xl md:text-8xl animate-celebrate">🚂</div>
          <div className="bg-card/95 backdrop-blur-sm rounded-3xl px-8 py-5 shadow-2xl animate-bounce-in">
            <h2 className="text-2xl md:text-4xl font-extrabold text-foreground text-center">
              {t.ui.gameCompleteText}
            </h2>
          </div>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n, i) => (
              <span
                key={n}
                className="text-3xl md:text-5xl font-black text-farm-correct animate-pop-in drop-shadow-lg"
                style={{
                  animationDelay: `${i * 100}ms`,
                  opacity: 0,
                  animationFillMode: "forwards",
                  textShadow: "2px 2px 0 rgba(0,0,0,0.2)",
                }}
              >
                {n}
              </span>
            ))}
          </div>
          <button
            onClick={handlePlayAgain}
            className="px-8 py-4 text-xl md:text-2xl font-extrabold rounded-3xl shadow-2xl animate-bounce-in border-4 border-border bg-secondary text-foreground transition-transform hover:scale-110"
          >
            {t.ui.playAgainButton}
          </button>
        </div>
      </div>
    );
  }

  // All wagons to display: completed + current
  const visibleWagons: number[] = [];
  for (let i = 1; i <= currentWagon; i++) {
    visibleWagons.push(i);
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/20" />

      {/* Header */}
      <header className="relative z-20 w-full flex items-start pt-4 pb-1 px-4">
        <div className="flex flex-col gap-1">
          <button
            onClick={onComplete}
            className="rounded-lg bg-muted px-3 py-2 text-lg transition-transform active:scale-95"
            title="Home"
          >
            🏠
          </button>
          {debug && setFastMode && (
            <button
              onClick={() => setFastMode((f) => !f)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-transform active:scale-95 ${
                fastMode ? "bg-farm-correct text-foreground" : "bg-muted text-muted-foreground"
              }`}
              title="Fast mode"
            >
              ⚡ {fastMode ? "ON" : "OFF"}
            </button>
          )}
        </div>
        <div className="flex-1 text-center">
          <h1
            className="text-xl md:text-3xl font-extrabold text-primary-foreground drop-shadow-lg"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
          >
            🚂 {t.ui.phase3Name}
          </h1>
          <div className="mt-1 flex gap-2 justify-center">
            <span className="bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-foreground shadow">
              {t.ui.phaseLabel} 3
            </span>
            <span className="bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-farm-correct shadow">
              🚃 {completedWagons.length}/9
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

      {/* Main train area */}
      <div className="relative z-10 flex-1 flex flex-col justify-between pb-2 overflow-hidden">
        {/* Narration bubble */}
        <div className="flex justify-center px-4 mb-2">
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl px-5 py-2 shadow-xl max-w-sm text-center animate-bounce-in">
            <p className="text-sm md:text-lg font-bold text-foreground">
              {state === "intro" && t.ui.trainWagonIntro}
              {state === "showing" && t.ui.countingHint}
              {state === "choosing" && t.ui.trainCountPrompt(currentWagon)}
              {state === "correct" && t.ui.trainCorrectSpeech(currentWagon)}
            </p>
          </div>
        </div>

        {/* Static train display - fills available space */}
        <div className="flex-1 flex items-center justify-center px-2 overflow-hidden">
          <div className="flex items-end gap-1 md:gap-2 w-full justify-center flex-wrap">
            {/* Locomotive */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="text-5xl md:text-7xl">🚂</div>
              <div className="h-2 w-14 md:w-20 bg-foreground/30 rounded-full" />
            </div>

            {/* Wagons */}
            {visibleWagons.map((wagonNum) => {
              const isActive = wagonNum === currentWagon && !completedWagons.includes(wagonNum);
              const isCompleted = completedWagons.includes(wagonNum);
              const wagonAnimal = pickAnimalForWagon(mode, wagonNum - 1);
              const animalData = getAnimalData(wagonAnimal);
              const sizeClass = getAnimalSizeClass(wagonNum);

              return (
                <div
                  key={wagonNum}
                  className={`flex flex-col items-center flex-shrink-0 transition-all duration-300 ${
                    isActive ? "animate-bounce-in" : ""
                  }`}
                >
                  {/* Wagon box - fixed size, animals adapt inside */}
                  <div
                    className={`relative rounded-xl border-3 flex flex-wrap items-center justify-center gap-0.5 p-1.5 ${
                      isCompleted
                        ? "bg-farm-correct/20 border-farm-correct"
                        : isActive
                        ? "bg-card/90 border-primary shadow-lg"
                        : "bg-card/60 border-border"
                    }`}
                    style={{
                      width: "clamp(56px, 9vw, 90px)",
                      minHeight: "clamp(56px, 9vw, 90px)",
                    }}
                  >
                    {(isActive && showAnimals) || isCompleted ? (
                      Array.from({ length: wagonNum }).map((_, i) => {
                        if (!animalData) return null;
                        return (
                          <img
                            key={i}
                            src={animalData.image}
                            alt={animalData.name}
                            className={`object-contain ${sizeClass} ${
                              isActive && !isCompleted ? "animate-pop-in" : ""
                            }`}
                            style={
                              isActive && !isCompleted
                                ? {
                                    animationDelay: `${i * 200}ms`,
                                    opacity: 0,
                                    animationFillMode: "forwards",
                                  }
                                : undefined
                            }
                            draggable={false}
                          />
                        );
                      })
                    ) : null}

                    {/* Number badge on completed wagons */}
                    {isCompleted && (
                      <div className="absolute -top-2.5 -right-2.5 w-7 h-7 md:w-9 md:h-9 rounded-full bg-farm-correct flex items-center justify-center shadow-lg">
                        <span className="text-xs md:text-base font-black text-primary-foreground">{wagonNum}</span>
                      </div>
                    )}
                  </div>

                  {/* Wheels */}
                  <div className="flex gap-1.5 -mt-0.5">
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-foreground/60 border-2 border-foreground/30" />
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-foreground/60 border-2 border-foreground/30" />
                  </div>
                  <div className="h-1.5 w-full bg-foreground/20 rounded-full" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Flying number animation */}
        {flyingNumber !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <span
              className="text-6xl md:text-8xl font-black text-farm-correct animate-number-fly drop-shadow-lg"
              style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.2)" }}
            >
              {flyingNumber}
            </span>
          </div>
        )}

        {/* Number options */}
        {(state === "choosing" || state === "correct") && (
          <div className="flex gap-4 md:gap-6 justify-center py-3 relative z-20">
            {options.map((n, i) => (
              <NumberComponent
                key={`${currentWagon}-${n}`}
                number={n}
                onClick={handleChoice}
                state={optionStates[i]}
                disabled={state !== "choosing"}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Ground */}
      <div className="relative z-10 w-full h-6 bg-gradient-to-t from-farm-grass/40 to-transparent" />
    </div>
  );
};

export default TrainPhase;
