import { useState, useCallback, useEffect, useMemo } from "react";
import AnimalEmoji, { getAnimalKeys, type AnimalMode } from "./AnimalEmoji";
import NumberOption from "./NumberOption";
import WelcomeScreen from "./game/WelcomeScreen";
import PhaseTransition from "./game/PhaseTransition";

import LanguageSelector from "./LanguageSelector";
import farmBg from "@/assets/farm-bg.jpg";
import jungleBg from "@/assets/jungle-bg.jpg";
import oceanBg from "@/assets/ocean-bg.jpg";
import easterBg from "@/assets/easter-bg.jpg";
import EasterNumberOption from "./EasterNumberOption";
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
import { useDebugMode } from "@/hooks/use-debug-mode";

type RoundPhase = "showing" | "choosing" | "correct" | "transition";
type TransitionType = "none" | "phase-complete" | "game-complete";
type OptionState = "idle" | "correct" | "wrong";

const MODE_BG: Record<AnimalMode, string> = {
  domestic: farmBg,
  wild: jungleBg,
  aquatic: oceanBg,
  easter: easterBg,
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

function generateRound(mode: AnimalMode, count: number, usedAnimals: Set<string>) {
  const keys = getAnimalKeys(mode);
  // Filter out already used animals
  let available = keys.filter((a) => !usedAnimals.has(a));
  // If all used, reset (shouldn't happen with 16 animals and 9 rounds)
  if (available.length === 0) available = keys;
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
  const { debug, fastMode, setFastMode } = useDebugMode();
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
  const [phaseHits, setPhaseHits] = useState(0);
  const [phaseMisses, setPhaseMisses] = useState(0);

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
    setPhaseHits(0);
    setPhaseMisses(0);
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
    setPhaseHits(0);
    setPhaseMisses(0);
  }, []);

  // Show animals with pop sounds
  useEffect(() => {
    if (!started || transition !== "none") return;
    const timer = setTimeout(() => {
      setShowAnimals(true);
      if (!fastMode) {
        for (let i = 0; i < round.count; i++) {
          playPopSound(i * 300);
        }
      }
    }, fastMode ? 50 : 300);
    return () => clearTimeout(timer);
  }, [round, started, transition, fastMode]);

  // Speak narration then transition to choosing
  useEffect(() => {
    if (!started || roundPhase !== "showing" || !showAnimals || transition !== "none") return;
    if (fastMode) {
      const timer = setTimeout(() => setRoundPhase("choosing"), 100);
      return () => clearTimeout(timer);
    }
    const speakDelay = setTimeout(() => {
      speak(narration, speechLang, () => setRoundPhase("choosing"));
      const fallback = setTimeout(() => setRoundPhase("choosing"), 4000);
      return () => clearTimeout(fallback);
    }, round.count * 300 + 400);
    return () => clearTimeout(speakDelay);
  }, [roundPhase, showAnimals, narration, round.count, started, speechLang, transition, fastMode]);

  const handleChoice = useCallback((n: number) => {
    if (roundPhase !== "choosing" || !mode) return;

    const clickedIdx = round.options.indexOf(n);

    if (n === round.count) {
      if (!fastMode) playClickSound();
      if (!fastMode) playCorrectSound();
      setPhaseHits((h) => h + 1);
      setOptionStates(round.options.map((o) => (o === n ? "correct" : "idle")));
      setRoundPhase("correct");

      // Skip individual celebration speech on last round to avoid overlapping with phase transition speech
      if (currentIndex < 8 && !fastMode) {
        setTimeout(() => {
          playCelebrateSound();
          speak(t.celebrationSpeech(round.count), speechLang);
        }, 300);
      }

      const nextDelay = fastMode ? 200 : 2500;
      setTimeout(() => {
        if (currentIndex >= 8) {
          // Both phase 1 and phase 2 transition to next phase
          setTransition("phase-complete");
        } else {
          setRoundPhase("transition");
          const nextIdx = currentIndex + 1;
          setTimeout(() => {
            setShowAnimals(false);
            setCurrentIndex(nextIdx);
            setRound(generateRound(mode, phaseSequence[nextIdx], round.animal));
            setOptionStates(["idle", "idle", "idle"]);
            setRoundPhase("showing");
          }, fastMode ? 50 : 400);
        }
      }, nextDelay);
    } else {
      if (optionStates[clickedIdx] === "wrong") return;
      if (!fastMode) playClickSound();
      if (!fastMode) playWrongSound();
      setPhaseMisses((m) => m + 1);
      setOptionStates((prev) => prev.map((s, i) => (i === clickedIdx ? "wrong" : s)));
      if (!fastMode) speak(t.ui.tryAgain, speechLang);
    }
  }, [roundPhase, round, mode, t, speechLang, currentIndex, gamePhase, phaseSequence, optionStates, fastMode]);

  const handleTransitionDone = useCallback(() => {
    if (!mode) return;
    if (transition === "phase-complete") {
      if (gamePhase === 1) {
        startPhase(2, mode);
      } else if (gamePhase === 2) {
        handleGoHome();
      }
    }
  }, [transition, mode, gamePhase, startPhase, handleGoHome]);

  if (!started) {
    return <WelcomeScreen onStart={handleStart} />;
  }


  const modeTitle =
    mode === "wild" ? t.ui.wildTitle :
    mode === "aquatic" ? t.ui.aquaticTitle :
    mode === "easter" ? t.ui.easterTitle :
    t.ui.domesticTitle;

  const NumberComponent = mode === "easter" ? EasterNumberOption : NumberOption;

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
            onClick={handleGoHome}
            className="rounded-lg bg-muted px-3 py-2 text-lg transition-transform active:scale-95"
            title="Home"
          >
            🏠
          </button>
          {debug && (
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
            className="text-2xl md:text-4xl font-extrabold text-primary-foreground drop-shadow-lg"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
          >
            {modeTitle}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2 justify-center">
            <span className="bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-foreground shadow">
              {t.ui.phaseLabel} {gamePhase} — {gamePhase === 1 ? t.ui.phase1Name : t.ui.phase2Name}
            </span>
            <span className="bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-farm-correct shadow">
              ✅ {phaseHits}
            </span>
            <span className="bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-farm-wrong shadow">
              ❌ {phaseMisses}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <LanguageSelector />
          <button
            onClick={() => {
              if (gamePhase === 1) startPhase(2, mode);
              else if (gamePhase === 2) handleGoHome();
            }}
            className="rounded-full bg-card/90 backdrop-blur px-3 py-1.5 text-sm font-bold text-foreground shadow transition-transform active:scale-95 hover:bg-card"
          >
            {t.ui.skipPhase}
          </button>
        </div>
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

        <div
          className={`flex flex-wrap justify-center items-center min-h-[120px] ${
            round.count <= 3 ? "gap-4 md:gap-6" : round.count <= 6 ? "gap-2 md:gap-4" : "gap-1 md:gap-3"
          }`}
          style={{ maxWidth: round.count <= 4 ? "500px" : "600px" }}
        >
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
              <NumberComponent
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
          type={transition as "phase-complete" | "game-complete"}
          mode={mode!}
          gamePhase={gamePhase}
          onDone={handleTransitionDone}
          bgImage={bgImage}
          fastMode={fastMode}
        />
      )}
    </div>
  );
};

export default FarmGame;
