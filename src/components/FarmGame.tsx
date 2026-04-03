import { useState, useCallback, useEffect, useMemo } from "react";
import AnimalEmoji, { getAnimalData, getAnimalKeys, type AnimalMode } from "./AnimalEmoji";
import NumberOption from "./NumberOption";
import LanguageSelector from "./LanguageSelector";
import farmBg from "@/assets/farm-bg.jpg";
import { useI18n } from "@/i18n";
import {
  playCorrectSound,
  playWrongSound,
  playPopSound,
  playCelebrateSound,
  playClickSound,
  speak,
  preloadVoices,
} from "@/lib/sounds";
import { requestFullscreen } from "@/lib/fullscreen";

type Phase = "showing" | "choosing" | "correct" | "transition";
type OptionState = "idle" | "correct" | "wrong";

function generateRound(mode: AnimalMode, prevAnimal?: string) {
  const count = Math.floor(Math.random() * 5) + 1;
  const keys = getAnimalKeys(mode);
  const available = keys.filter((a) => a !== prevAnimal);
  const animal = available[Math.floor(Math.random() * available.length)];

  const options = new Set<number>([count]);
  while (options.size < 3) {
    const opt = Math.max(1, count + Math.floor(Math.random() * 5) - 2);
    if (opt <= 9) options.add(opt);
  }
  const shuffled = Array.from(options).sort(() => Math.random() - 0.5);

  return { count, animal, options: shuffled };
}

const FarmGame = () => {
  const { t, speechLang } = useI18n();
  const [mode, setMode] = useState<AnimalMode | null>(null);
  const [round, setRound] = useState(() => generateRound("domestic"));
  const [phase, setPhase] = useState<Phase>("showing");
  const [optionStates, setOptionStates] = useState<OptionState[]>(["idle", "idle", "idle"]);
  const [score, setScore] = useState(0);
  const [roundNum, setRoundNum] = useState(1);
  const [showAnimals, setShowAnimals] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => { preloadVoices(); }, []);

  const narration = useMemo(
    () => t.narrateText(round.count, round.animal),
    [round, t]
  );

  const handleStart = useCallback((selectedMode: AnimalMode) => {
    setMode(selectedMode);
    setRound(generateRound(selectedMode));
    setStarted(true);
    requestFullscreen();
  }, []);

  const handleGoHome = useCallback(() => {
    setStarted(false);
    setMode(null);
    setScore(0);
    setRoundNum(1);
    setPhase("showing");
    setOptionStates(["idle", "idle", "idle"]);
    setShowAnimals(false);
  }, []);

  // Show animals with pop sounds
  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => {
      setShowAnimals(true);
      for (let i = 0; i < round.count; i++) {
        playPopSound(i * 300);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [round, started]);

  // Speak narration then transition to choosing
  useEffect(() => {
    if (!started || phase !== "showing" || !showAnimals) return;
    const speakDelay = setTimeout(() => {
      speak(narration, speechLang, () => setPhase("choosing"));
      const fallback = setTimeout(() => setPhase("choosing"), 4000);
      return () => clearTimeout(fallback);
    }, round.count * 300 + 400);
    return () => clearTimeout(speakDelay);
  }, [phase, showAnimals, narration, round.count, started, speechLang]);

  const handleChoice = useCallback((n: number) => {
    if (phase !== "choosing" || !mode) return;
    playClickSound();

    if (n === round.count) {
      playCorrectSound();
      setOptionStates(round.options.map((o) => (o === n ? "correct" : "idle")));
      setPhase("correct");
      setScore((s) => s + 1);

      setTimeout(() => {
        playCelebrateSound();
        speak(t.celebrationSpeech(round.count), speechLang);
      }, 300);

      setTimeout(() => {
        setPhase("transition");
        setTimeout(() => {
          setShowAnimals(false);
          setRound(generateRound(mode, round.animal));
          setOptionStates(["idle", "idle", "idle"]);
          setPhase("showing");
          setRoundNum((r) => r + 1);
        }, 400);
      }, 2500);
    } else {
      playWrongSound();
      const idx = round.options.indexOf(n);
      setOptionStates((prev) => prev.map((s, i) => (i === idx ? "wrong" : s)));
      speak(t.ui.tryAgain, speechLang);
      setTimeout(() => {
        setOptionStates((prev) => prev.map((s, i) => (i === idx ? "idle" : s)));
      }, 600);
    }
  }, [phase, round, mode, t, speechLang]);

  // Welcome screen with mode selection
  if (!started) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${farmBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
        }}
      >
        <div className="absolute inset-0 bg-foreground/20" />
        <div className="absolute top-4 right-4 z-20">
          <LanguageSelector />
        </div>
        <div className="relative z-10 text-center flex flex-col items-center gap-6 px-4">
          <h1
            className="text-4xl md:text-6xl font-extrabold text-primary-foreground drop-shadow-lg"
            style={{ textShadow: "2px 3px 8px rgba(0,0,0,0.5)" }}
          >
            {t.ui.gameTitle}
          </h1>
          <p
            className="text-lg md:text-2xl text-primary-foreground font-bold"
            style={{ textShadow: "1px 2px 4px rgba(0,0,0,0.5)" }}
          >
            {t.ui.subtitle}
          </p>
          <p
            className="text-base md:text-xl text-primary-foreground font-semibold"
            style={{ textShadow: "1px 2px 4px rgba(0,0,0,0.5)" }}
          >
            {t.ui.chooseMode}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleStart("domestic")}
              className="px-8 py-5 bg-secondary text-foreground text-xl md:text-2xl font-extrabold rounded-3xl shadow-2xl hover:scale-110 transition-transform animate-float border-4 border-border"
            >
              {t.ui.domesticButton}
            </button>
            <button
              onClick={() => handleStart("wild")}
              className="px-8 py-5 bg-accent text-accent-foreground text-xl md:text-2xl font-extrabold rounded-3xl shadow-2xl hover:scale-110 transition-transform animate-float border-4 border-border"
              style={{ animationDelay: "0.3s" }}
            >
              {t.ui.wildButton}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${farmBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/20" />

      <header className="relative z-10 w-full flex items-start pt-6 pb-2 px-4">
        <button
          onClick={handleGoHome}
          className="rounded-lg bg-muted px-3 py-2 text-lg transition-transform active:scale-95"
          title="Voltar ao início"
        >
          🏠
        </button>
        <div className="flex-1 text-center">
          <h1
            className="text-3xl md:text-5xl font-extrabold text-primary-foreground drop-shadow-lg"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
          >
            {mode === "wild" ? t.ui.wildTitle : t.ui.gameTitle}
          </h1>
          <div className="mt-2 flex gap-4 justify-center">
            <span className="bg-card/90 backdrop-blur px-4 py-1 rounded-full text-sm font-bold text-foreground shadow">
              {t.ui.scoreLabel} {score}
            </span>
            <span className="bg-card/90 backdrop-blur px-4 py-1 rounded-full text-sm font-bold text-foreground shadow">
              {t.ui.roundLabel} {roundNum}
            </span>
          </div>
        </div>
        <LanguageSelector />
      </header>

      <main
        className={`relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-4 transition-opacity duration-400 ${
          phase === "transition" ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="bg-card/95 backdrop-blur-sm rounded-3xl px-6 py-3 shadow-xl max-w-md text-center animate-bounce-in">
          <p className="text-lg md:text-2xl font-bold text-foreground">
            {phase === "correct" ? t.celebrationText(round.count) : narration}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 md:gap-5 justify-center items-end min-h-[120px]">
          {showAnimals &&
            Array.from({ length: round.count }).map((_, i) => (
              <AnimalEmoji
                key={`${round.animal}-${i}`}
                animal={round.animal}
                index={i}
                total={round.count}
              />
            ))}
        </div>

        {phase === "correct" && (
          <div
            className="text-8xl md:text-9xl font-black text-farm-correct animate-celebrate drop-shadow-lg"
            style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.2)" }}
          >
            {round.count}
          </div>
        )}

        {(phase === "choosing" || phase === "correct") && (
          <div className="flex gap-4 md:gap-6">
            {round.options.map((n, i) => (
              <NumberOption
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

export default FarmGame;
