import { useState, useEffect, useCallback } from "react";
import { getAnimalKeys, getAnimalData, type AnimalMode } from "../AnimalEmoji";
import LanguageSelector from "../LanguageSelector";
import { useI18n } from "@/i18n";
import {
  playCorrectSound,
  playWrongSound,
  playPopSound,
  playCelebrateSound,
  playClickSound,
  speak,
} from "@/lib/sounds";

interface MatchPhaseProps {
  mode: AnimalMode;
  onComplete: () => void;
  onGoHome: () => void;
  bgImage: string;
  fastMode?: boolean;
}

const SEQUENCE = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function shuffleArray<T>(arr: T[]): T[] {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

function generateGroups(
  correctCount: number,
  mode: AnimalMode,
  usedAnimals: Set<string>
) {
  const keys = getAnimalKeys(mode);
  const available = keys.filter((a) => !usedAnimals.has(a));
  const pool = available.length >= 3 ? available : keys;

  const picked = shuffleArray(pool).slice(0, 3);

  const counts = new Set<number>([correctCount]);
  while (counts.size < 3) {
    const c = Math.max(1, Math.min(9, correctCount + Math.floor(Math.random() * 5) - 2));
    counts.add(c);
  }
  const countsArr = shuffleArray(Array.from(counts));

  const groups = countsArr.map((count, i) => ({
    animal: picked[i],
    count,
  }));

  return { groups, correctCount, newAnimal: picked[countsArr.indexOf(correctCount)] };
}

type GroupState = "idle" | "correct" | "wrong";

const MatchPhase = ({ mode, onComplete, onGoHome, bgImage, fastMode }: MatchPhaseProps) => {
  const { t, speechLang } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [usedAnimals, setUsedAnimals] = useState<Set<string>>(new Set());
  const [round, setRound] = useState(() => generateGroups(SEQUENCE[0], mode, new Set()));
  const [groupStates, setGroupStates] = useState<GroupState[]>(["idle", "idle", "idle"]);
  const [phase, setPhase] = useState<"showing" | "choosing" | "correct" | "transition">("showing");
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [showAnimals, setShowAnimals] = useState(false);
  const [instructionSpoken, setInstructionSpoken] = useState(false);

  // Show animals with pop sounds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimals(true);
      if (!fastMode) {
        const totalAnimals = round.groups.reduce((s, g) => s + g.count, 0);
        for (let i = 0; i < Math.min(totalAnimals, 9); i++) {
          playPopSound(i * 150);
        }
      }
    }, fastMode ? 50 : 400);
    return () => clearTimeout(timer);
  }, [round, fastMode]);

  // Speak instruction then go to choosing
  useEffect(() => {
    if (phase !== "showing" || !showAnimals) return;
    if (fastMode) {
      const t2 = setTimeout(() => setPhase("choosing"), 100);
      return () => clearTimeout(t2);
    }

    const delay = setTimeout(() => {
      const instruction = !instructionSpoken
        ? t.ui.matchPrompt
        : `${round.correctCount}`;
      speak(instruction, speechLang, () => setPhase("choosing"));
      if (!instructionSpoken) setInstructionSpoken(true);
      const fallback = setTimeout(() => setPhase("choosing"), 4000);
      return () => clearTimeout(fallback);
    }, 600);
    return () => clearTimeout(delay);
  }, [phase, showAnimals, fastMode, round, t, speechLang, instructionSpoken]);

  const handleGroupClick = useCallback((groupIndex: number) => {
    if (phase !== "choosing") return;

    const group = round.groups[groupIndex];

    if (group.count === round.correctCount) {
      if (!fastMode) playClickSound();
      if (!fastMode) playCorrectSound();
      setHits((h) => h + 1);
      setGroupStates(round.groups.map((_, i) => (i === groupIndex ? "correct" : "idle")));
      setPhase("correct");

      if (currentIndex < 8 && !fastMode) {
        setTimeout(() => {
          playCelebrateSound();
          speak(t.celebrationSpeech(round.correctCount), speechLang);
        }, 300);
      }

      const nextDelay = fastMode ? 200 : 2200;
      setTimeout(() => {
        if (currentIndex >= 8) {
          onComplete();
        } else {
          setPhase("transition");
          const nextIdx = currentIndex + 1;
          setTimeout(() => {
            setShowAnimals(false);
            setCurrentIndex(nextIdx);
            const newRound = generateGroups(SEQUENCE[nextIdx], mode, usedAnimals);
            setUsedAnimals((prev) => new Set(prev).add(newRound.newAnimal));
            setRound(newRound);
            setGroupStates(["idle", "idle", "idle"]);
            setPhase("showing");
          }, fastMode ? 50 : 400);
        }
      }, nextDelay);
    } else {
      if (groupStates[groupIndex] === "wrong") return;
      if (!fastMode) playClickSound();
      if (!fastMode) playWrongSound();
      setMisses((m) => m + 1);
      setGroupStates((prev) => prev.map((s, i) => (i === groupIndex ? "wrong" : s)));
      if (!fastMode) speak(t.ui.tryAgain, speechLang);
    }
  }, [phase, round, currentIndex, mode, t, speechLang, fastMode, usedAnimals, groupStates, onComplete]);

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

      {/* Header — same pattern as phase 1 */}
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
            🔍 {t.ui.phase3Name}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2 justify-center">
            <span className="bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-foreground shadow">
              {t.ui.phaseLabel} 3 — {currentIndex + 1}/9
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

      {/* Main content */}
      <main
        className={`relative z-10 flex-1 flex flex-col items-center justify-center gap-5 px-4 transition-opacity duration-400 ${
          phase === "transition" ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Big number prompt */}
        <div className="bg-card/95 backdrop-blur-sm rounded-3xl px-8 py-4 shadow-xl animate-bounce-in">
          <p className="text-lg md:text-2xl font-bold text-foreground text-center">
            {phase === "correct"
              ? t.celebrationText(round.correctCount)
              : t.ui.matchInstruction(round.correctCount)}
          </p>
        </div>

        {/* The big target number */}
        <div
          className={`text-7xl md:text-8xl font-black drop-shadow-lg animate-bounce-in ${
            phase === "correct" ? "text-farm-correct animate-celebrate" : "text-primary-foreground"
          }`}
          style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.3)" }}
        >
          {round.correctCount}
        </div>

        {/* Animal groups */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center items-center">
          {round.groups.map((group, gi) => {
            const size =
              group.count <= 2 ? "w-12 h-12" :
              group.count <= 4 ? "w-9 h-9" :
              group.count <= 6 ? "w-7 h-7" : "w-6 h-6";
            return (
              <button
                key={`${group.animal}-${group.count}-${gi}`}
                onClick={() => handleGroupClick(gi)}
                disabled={phase !== "choosing"}
                className={`relative flex flex-wrap justify-center content-center items-center gap-1 p-2 rounded-2xl border-4 transition-all duration-300 ${
                  groupStates[gi] === "correct"
                    ? "border-farm-correct bg-farm-correct/20 scale-110 shadow-lg"
                    : groupStates[gi] === "wrong"
                    ? "border-farm-wrong bg-farm-wrong/20 animate-shake"
                    : "border-card/80 bg-card/70 backdrop-blur hover:scale-105 hover:border-primary/50 active:scale-95"
                } ${phase === "choosing" ? "cursor-pointer" : "cursor-default"}`}
                style={{ width: "150px", height: "120px" }}
              >
                {showAnimals &&
                  Array.from({ length: group.count }).map((_, ai) => (
                    <div
                      key={`${group.animal}-${ai}`}
                      className={`${size} flex-shrink-0`}
                    >
                      <img
                        src={getAnimalData(group.animal)?.image ?? ""}
                        alt=""
                        className="w-full h-full object-contain animate-pop-in"
                        style={{ animationDelay: `${ai * 100}ms`, opacity: 0 }}
                        draggable={false}
                      />
                    </div>
                  ))}
              </button>
            );
          })}
        </div>

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

export default MatchPhase;
