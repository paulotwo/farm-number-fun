import { useState, useCallback, useEffect, useMemo } from "react";
import AnimalEmoji, { getAnimalKeys, type AnimalMode } from "./AnimalEmoji";
import NumberOption from "./NumberOption";
import WelcomeScreen from "./game/WelcomeScreen";
import PhaseTransition from "./game/PhaseTransition";
import LanguageSelector from "./LanguageSelector";
import farmBg from "@/assets/farm-bg.jpg";
import jungleBg from "@/assets/jungle-bg.jpg";
import oceanBg from "@/assets/ocean-bg.jpg";
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

type RoundPhase = "showing" | "choosing" | "correct" | "transition";
type TransitionType = "none" | "phase-complete" | "phase-fail" | "game-complete";
type OptionState = "idle" | "correct" | "wrong";

const MODE_BG: Record<AnimalMode, string> = {
  domestic: farmBg,
  wild: jungleBg,
  aquatic: oceanBg,
};

const SEQUENTIAL = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function shuffleArray(arr: number[]): number[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateRound(mode: AnimalMode, count: number, prevAnimal?: string) {
  const keys = getAnimalKeys(mode);
  const available = keys.filter((a) => a !== prevAnimal);
  const animal = available[Math.floor(Math.random() * available.length)];

  const options = new Set<number>([count]);
  while (options.size < 3) {
    const opt = Math.max(1, Math.min(9, count + Math.floor(Math.random() * 5) - 2));
    options.add(opt);
  }
  const shuffled = Array.from(options).sort(() => Math.random() - 0.5);

  return { count, animal, options: shuffled };
}

const FarmGame = () => {
  const { t, speechLang } = useI18n();
  const [mode, setMode] = useState<AnimalMode | null>(null);
  const [started, setStarted] = useState(false);
  const [gamePhase, setGamePhase] = useState<1 | 2>(1);
  const [phaseSequence, setPhaseSequence] = useState<number[]>(SEQUENTIAL);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [round, setRound] = useState(() => generateRound("domestic", 1));
  const [roundPhase, setRoundPhase] = useState<RoundPhase>("showing");
  const [optionStates, setOptionStates] = useState<OptionState[]>(["idle", "idle", "idle"]);
  const [showAnimals, setShowAnimals] = useState(false);
  const [transition, setTransition] = useState<TransitionType>("none");

  useEffect(() => { preloadVoices(); }, []);

  const narration = useMemo(
    () => t.narrateText(round.count, round.animal),
    [round, t]
  );

  const bgImage = mode ? MODE_BG[mode] : farmBg;

  const startPhase = useCallback((phase: 1 | 2, m: AnimalMode) => {
    const seq = phase === 1 ? [...SEQUENTIAL] : shuffleArray(SEQUENTIAL);
    setGamePhase(phase);
    setPhaseSequence(seq);
    setCurrentIndex(0);
    setRound(generateRound(m, seq[0]));
    setRoundPhase("showing");
    setOptionStates(["idle", "idle", "idle"]);
    setShowAnimals(false);
    setTransition("none");
  }, []);

  const handleStart = useCallback((selectedMode: AnimalMode) => {
    setMode(selectedMode);
    setStarted(true);
    startPhase(1, selectedMode);
    requestFullscreen();
  }, [startPhase]);

  const handleGoHome = useCallback(() => {
    setStarted(false);
    setMode(null);
    setGamePhase(1);
    setCurrentIndex(0);
    setRoundPhase("showing");
    setOptionStates(["idle", "idle", "idle"]);
    setShowAnimals(false);
    setTransition("none");
  }, []);

  // Show animals with pop sounds
  useEffect(() => {
    if (!started || transition !== "none") return;
    const timer = setTimeout(() => {
      setShowAnimals(true);
      for (let i = 0; i < round.count; i++) {
        playPopSound(i * 300);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [round, started, transition]);

  // Speak narration then transition to choosing
  useEffect(() => {
    if (!started || roundPhase !== "showing" || !showAnimals || transition !== "none") return;
    const speakDelay = setTimeout(() => {
      speak(narration, speechLang, () => setRoundPhase("choosing"));
      const fallback = setTimeout(() => setRoundPhase("choosing"), 4000);
      return () => clearTimeout(fallback);
    }, round.count * 300 + 400);
    return () => clearTimeout(speakDelay);
  }, [roundPhase, showAnimals, narration, round.count, started, speechLang, transition]);

  const handleChoice = useCallback((n: number) => {
    if (roundPhase !== "choosing" || !mode) return;
    playClickSound();

    if (n === round.count) {
      playCorrectSound();
      setOptionStates(round.options.map((o) => (o === n ? "correct" : "idle")));
      setRoundPhase("correct");

      setTimeout(() => {
        playCelebrateSound();
        speak(t.celebrationSpeech(round.count), speechLang);
      }, 300);

      setTimeout(() => {
        if (currentIndex >= 8) {
          // Last number in phase
          if (gamePhase === 1) {
            setTransition("phase-complete");
          } else {
            setTransition("game-complete");
          }
        } else {
          // Next round
          setRoundPhase("transition");
          const nextIdx = currentIndex + 1;
          setTimeout(() => {
            setShowAnimals(false);
            setCurrentIndex(nextIdx);
            setRound(generateRound(mode, phaseSequence[nextIdx], round.animal));
            setOptionStates(["idle", "idle", "idle"]);
            setRoundPhase("showing");
          }, 400);
        }
      }, 2500);
    } else {
      // Wrong answer - phase fails
      playWrongSound();
      const idx = round.options.indexOf(n);
      setOptionStates((prev) => prev.map((s, i) => (i === idx ? "wrong" : s)));
      speak(t.ui.tryAgain, speechLang);

      setTimeout(() => {
        setTransition("phase-fail");
      }, 1200);
    }
  }, [roundPhase, round, mode, t, speechLang, currentIndex, gamePhase, phaseSequence]);

  const handleTransitionDone = useCallback(() => {
    if (!mode) return;
    if (transition === "phase-complete") {
      startPhase(2, mode);
    } else if (transition === "phase-fail") {
      startPhase(gamePhase, mode);
    } else if (transition === "game-complete") {
      handleGoHome();
    }
  }, [transition, mode, gamePhase, startPhase, handleGoHome]);

  if (!started) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  const modeTitle =
    mode === "wild" ? t.ui.wildTitle :
    mode === "aquatic" ? t.ui.aquaticTitle :
    t.ui.domesticTitle;

  return (
    <div
      className="min-h-screen flex flex-col items-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/20" />

      <header className="relative z-10 w-full flex items-start pt-6 pb-2 px-4">
        <button
          onClick={handleGoHome}
          className="rounded-lg bg-muted px-3 py-2 text-lg transition-transform active:scale-95"
          title="Home"
        >
          🏠
        </button>
        <div className="flex-1 text-center">
          <h1
            className="text-2xl md:text-4xl font-extrabold text-primary-foreground drop-shadow-lg"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
          >
            {modeTitle}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2 justify-center">
            <span className="bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-foreground shadow">
              {t.ui.phaseLabel} {gamePhase} — {gamePhase === 1 ? t.ui.phase1Name : t.ui.phase2Name}
            </span>
            <span className="bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-foreground shadow">
              {t.ui.roundLabel} {phaseSequence[currentIndex]}/9
            </span>
          </div>
        </div>
        <LanguageSelector />
      </header>

      <main
        className={`relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-4 transition-opacity duration-400 ${
          roundPhase === "transition" ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="bg-card/95 backdrop-blur-sm rounded-3xl px-6 py-3 shadow-xl max-w-md text-center animate-bounce-in">
          <p className="text-lg md:text-2xl font-bold text-foreground">
            {roundPhase === "correct" ? t.celebrationText(round.count) : narration}
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

        {roundPhase === "correct" && (
          <div
            className="text-8xl md:text-9xl font-black text-farm-correct animate-celebrate drop-shadow-lg"
            style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.2)" }}
          >
            {round.count}
          </div>
        )}

        {(roundPhase === "choosing" || roundPhase === "correct") && (
          <div className="flex gap-4 md:gap-6">
            {round.options.map((n, i) => (
              <NumberOption
                key={n}
                number={n}
                onClick={handleChoice}
                state={optionStates[i]}
                disabled={roundPhase !== "choosing"}
                index={i}
              />
            ))}
          </div>
        )}

        {roundPhase === "showing" && (
          <p className="text-muted-foreground text-sm animate-pulse font-medium bg-card/80 backdrop-blur rounded-full px-4 py-2">
            {t.ui.countingHint}
          </p>
        )}
      </main>

      <div className="relative z-10 w-full h-8 bg-gradient-to-t from-farm-grass/40 to-transparent" />

      {/* Phase transition overlay */}
      {transition !== "none" && (
        <PhaseTransition
          type={transition as "phase-complete" | "phase-fail" | "game-complete"}
          mode={mode!}
          gamePhase={gamePhase}
          onDone={handleTransitionDone}
          bgImage={bgImage}
        />
      )}
    </div>
  );
};

export default FarmGame;
