import { useState, useCallback, useEffect, useMemo } from "react";
import AnimalEmoji, { ANIMAL_KEYS, getAnimalData } from "./AnimalEmoji";
import NumberOption from "./NumberOption";
import farmBg from "@/assets/farm-bg.jpg";
import {
  playCorrectSound,
  playWrongSound,
  playPopSound,
  playCelebrateSound,
  playClickSound,
  speak,
  preloadVoices,
} from "@/lib/sounds";

type Phase = "showing" | "choosing" | "correct" | "transition";
type OptionState = "idle" | "correct" | "wrong";

function generateRound(prevAnimal?: string) {
  const count = Math.floor(Math.random() * 5) + 1;
  const available = ANIMAL_KEYS.filter((a) => a !== prevAnimal);
  const animal = available[Math.floor(Math.random() * available.length)];

  const options = new Set<number>([count]);
  while (options.size < 3) {
    const opt = Math.max(1, count + Math.floor(Math.random() * 5) - 2);
    if (opt <= 9) options.add(opt);
  }
  const shuffled = Array.from(options).sort(() => Math.random() - 0.5);

  return { count, animal, options: shuffled };
}

const PLURAL: Record<string, string> = {
  galinha: "galinhas", vaca: "vacas", porco: "porcos",
  ovelha: "ovelhas", cavalo: "cavalos", pato: "patos",
  coelho: "coelhos", gato: "gatos",
};

function narrateText(count: number, animal: string) {
  const data = getAnimalData(animal);
  if (!data) return "";
  const name = count === 1 ? data.name : (PLURAL[animal] || data.name + "s");
  const numWord = ["", "uma", "duas", "três", "quatro", "cinco"][count] || String(count);
  const femAnimals = ["galinha", "vaca", "ovelha"];
  const numWordM = ["", "um", "dois", "três", "quatro", "cinco"][count] || String(count);
  const word = femAnimals.includes(animal) ? numWord : numWordM;
  return `Olha! Temos ${word} ${name}!`;
}

const FarmGame = () => {
  const [round, setRound] = useState(() => generateRound());
  const [phase, setPhase] = useState<Phase>("showing");
  const [optionStates, setOptionStates] = useState<OptionState[]>(["idle", "idle", "idle"]);
  const [score, setScore] = useState(0);
  const [roundNum, setRoundNum] = useState(1);
  const [showAnimals, setShowAnimals] = useState(false);
  const [started, setStarted] = useState(false);

  // Preload speech voices on mount
  useEffect(() => {
    preloadVoices();
  }, []);

  const narration = useMemo(() => narrateText(round.count, round.animal), [round]);

  // Start game on first interaction (needed for AudioContext)
  const handleStart = useCallback(() => {
    setStarted(true);
  }, []);

  // Show animals with pop sounds
  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => {
      setShowAnimals(true);
      // Play pop sounds for each animal appearing
      for (let i = 0; i < round.count; i++) {
        playPopSound(i * 300);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [round, started]);

  // Speak the narration when animals are shown, then transition to choosing
  useEffect(() => {
    if (!started || phase !== "showing" || !showAnimals) return;

    const speakDelay = setTimeout(() => {
      speak(narration, () => {
        // After speech ends, go to choosing phase
        setPhase("choosing");
      });
      // Fallback: if speech doesn't fire onEnd, transition after a timeout
      const fallback = setTimeout(() => setPhase("choosing"), 4000);
      return () => clearTimeout(fallback);
    }, round.count * 300 + 400);

    return () => clearTimeout(speakDelay);
  }, [phase, showAnimals, narration, round.count, started]);

  const handleChoice = useCallback((n: number) => {
    if (phase !== "choosing") return;
    playClickSound();

    if (n === round.count) {
      // Correct!
      playCorrectSound();
      setOptionStates(round.options.map((o) => (o === n ? "correct" : "idle")));
      setPhase("correct");
      setScore((s) => s + 1);

      // Speak celebration after a short delay
      setTimeout(() => {
        playCelebrateSound();
        speak(`Isso! São ${round.count}! Muito bem!`);
      }, 300);

      setTimeout(() => {
        setPhase("transition");
        setTimeout(() => {
          setShowAnimals(false);
          setRound(generateRound(round.animal));
          setOptionStates(["idle", "idle", "idle"]);
          setPhase("showing");
          setRoundNum((r) => r + 1);
        }, 400);
      }, 2500);
    } else {
      // Wrong
      playWrongSound();
      const idx = round.options.indexOf(n);
      setOptionStates((prev) => prev.map((s, i) => (i === idx ? "wrong" : s)));
      speak("Tenta de novo!");
      setTimeout(() => {
        setOptionStates((prev) => prev.map((s, i) => (i === idx ? "idle" : s)));
      }, 600);
    }
  }, [phase, round]);

  // Welcome screen — needed to unlock AudioContext
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
        <div className="relative z-10 text-center flex flex-col items-center gap-6">
          <h1
            className="text-4xl md:text-6xl font-extrabold text-primary-foreground drop-shadow-lg"
            style={{ textShadow: "2px 3px 8px rgba(0,0,0,0.5)" }}
          >
            🌻 A Fazenda dos Números 🌻
          </h1>
          <p
            className="text-lg md:text-2xl text-primary-foreground font-bold"
            style={{ textShadow: "1px 2px 4px rgba(0,0,0,0.5)" }}
          >
            Conta os animais e descobre o número!
          </p>
          <button
            onClick={handleStart}
            className="mt-4 px-10 py-5 bg-secondary text-foreground text-2xl md:text-3xl font-extrabold rounded-3xl shadow-2xl hover:scale-110 transition-transform animate-float border-4 border-border"
          >
            🚜 Começar!
          </button>
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

      <header className="relative z-10 text-center pt-6 pb-2">
        <h1
          className="text-3xl md:text-5xl font-extrabold text-primary-foreground drop-shadow-lg"
          style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
        >
          🌻 A Fazenda dos Números 🌻
        </h1>
        <div className="mt-2 flex gap-4 justify-center">
          <span className="bg-card/90 backdrop-blur px-4 py-1 rounded-full text-sm font-bold text-foreground shadow">
            ⭐ Pontos: {score}
          </span>
          <span className="bg-card/90 backdrop-blur px-4 py-1 rounded-full text-sm font-bold text-foreground shadow">
            🎯 Rodada: {roundNum}
          </span>
        </div>
      </header>

      <main
        className={`relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-4 transition-opacity duration-400 ${
          phase === "transition" ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="bg-card/95 backdrop-blur-sm rounded-3xl px-6 py-3 shadow-xl max-w-md text-center animate-bounce-in">
          <p className="text-lg md:text-2xl font-bold text-foreground">
            {phase === "correct"
              ? `🎉 Isso! São ${round.count}! Muito bem!`
              : narration}
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
            Contando os animais...
          </p>
        )}
      </main>

      <div className="relative z-10 w-full h-8 bg-gradient-to-t from-farm-grass/40 to-transparent" />
    </div>
  );
};

export default FarmGame;
