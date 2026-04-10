import { useState, useEffect, useCallback, useRef } from "react";
import AnimalEmoji, { getAnimalKeys, type AnimalMode } from "../AnimalEmoji";
import { useI18n } from "@/i18n";
import {
  playCorrectSound,
  playWrongSound,
  playPopSound,
  playCelebrateSound,
  playClickSound,
  speak,
} from "@/lib/sounds";

interface BubblePhaseProps {
  mode: AnimalMode;
  onComplete: () => void;
  onGoHome: () => void;
  bgImage: string;
  fastMode?: boolean;
}

interface Bubble {
  id: number;
  number: number;
  x: number; // percentage 0-100
  startTime: number;
  popped: boolean;
  escaping?: "left" | "right"; // flies off screen when wrong
  popAnim?: boolean; // burst animation when correct
}

function generateBubbleRound(count: number, mode: AnimalMode, usedAnimals: Set<string>) {
  const keys = getAnimalKeys(mode);
  let available = keys.filter((a) => !usedAnimals.has(a));
  if (available.length === 0) available = keys;
  const animal = available[Math.floor(Math.random() * available.length)];
  return { count, animal };
}

const BUBBLE_DURATION_BASE = 6000; // ms for bubble to travel full height
const BUBBLE_SPAWN_INTERVAL = 1800; // ms between spawns
const SPEED_INCREASE = 400; // ms faster per completed number

const BubblePhase = ({ mode, onComplete, onGoHome, bgImage, fastMode }: BubblePhaseProps) => {
  const { t, speechLang } = useI18n();
  const [currentNumber, setCurrentNumber] = useState(1);
  const [round, setRound] = useState(() => generateBubbleRound(1, mode, new Set()));
  const [usedAnimals, setUsedAnimals] = useState<Set<string>>(new Set());
  const [showAnimals, setShowAnimals] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [narrating, setNarrating] = useState(true);
  const bubbleIdRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval>>();

  const bubbleDuration = Math.max(3000, BUBBLE_DURATION_BASE - (currentNumber - 1) * SPEED_INCREASE);

  // Generate options for bubbles: correct number + distractors
  const getOptions = useCallback((correct: number) => {
    const opts = new Set<number>([correct]);
    while (opts.size < 3) {
      const n = Math.max(1, Math.min(9, correct + Math.floor(Math.random() * 5) - 2));
      opts.add(n);
    }
    return Array.from(opts);
  }, []);

  // Show animals and narrate
  useEffect(() => {
    if (gameOver) return;
    setShowAnimals(false);
    setNarrating(true);
    setBubbles([]);

    const showTimer = setTimeout(() => {
      setShowAnimals(true);
      if (!fastMode) {
        for (let i = 0; i < round.count; i++) {
          playPopSound(i * 300);
        }
      }
    }, fastMode ? 50 : 300);

    const narrateTimer = setTimeout(() => {
      if (fastMode) {
        setNarrating(false);
        return;
      }
      const text = t.narrateText(round.count, round.animal);
      speak(text, speechLang, () => {
        setTimeout(() => {
          speak(t.ui.bubblePopPrompt, speechLang, () => setNarrating(false));
        }, 300);
      });
      setTimeout(() => setNarrating(false), 5000);
    }, fastMode ? 100 : round.count * 300 + 500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(narrateTimer);
    };
  }, [round, gameOver, fastMode, t, speechLang]);

  // Spawn bubbles
  useEffect(() => {
    if (narrating || showCorrect || gameOver) return;

    const options = getOptions(round.count);

    const spawn = () => {
      const num = options[Math.floor(Math.random() * options.length)];
      const id = ++bubbleIdRef.current;
      const x = 10 + Math.random() * 70; // 10% to 80%
      setBubbles((prev) => {
        // Limit max bubbles on screen
        const active = prev.filter((b) => !b.popped);
        if (active.length >= 6) return prev;
        return [...prev, { id, number: num, x, startTime: Date.now(), popped: false }];
      });
    };

    spawn(); // immediate first bubble
    const interval = fastMode ? 400 : BUBBLE_SPAWN_INTERVAL;
    spawnTimerRef.current = setInterval(spawn, interval);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [narrating, showCorrect, gameOver, round.count, getOptions, fastMode]);

  // Animation loop to remove expired bubbles
  useEffect(() => {
    if (narrating || gameOver) return;

    const tick = () => {
      const now = Date.now();
      setBubbles((prev) =>
        prev.filter((b) => b.popped || now - b.startTime < bubbleDuration)
      );
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [narrating, gameOver, bubbleDuration]);

  const handleBubblePop = useCallback((bubble: Bubble) => {
    if (showCorrect || gameOver || bubble.escaping || bubble.popAnim) return;

    if (bubble.number === round.count) {
      // Correct — pop burst animation
      if (!fastMode) playClickSound();
      if (!fastMode) playCorrectSound();
      setBubbles((prev) =>
        prev.map((b) => (b.id === bubble.id ? { ...b, popAnim: true } : b))
      );
      // Remove after animation
      setTimeout(() => {
        setBubbles((prev) =>
          prev.map((b) => (b.id === bubble.id ? { ...b, popped: true } : b))
        );
      }, 400);

      setHits((h) => h + 1);

      if (currentNumber < 9 && !fastMode) {
        setTimeout(() => {
          playCelebrateSound();
          speak(t.celebrationSpeech(round.count), speechLang);
        }, 300);
      }

      setTimeout(() => {
        setShowCorrect(true);
      }, fastMode ? 80 : 320);

      const nextDelay = fastMode ? 200 : 2500;
      setTimeout(() => {
        setShowCorrect(false);
        if (currentNumber >= 9) {
          setGameOver(true);
          if (!fastMode) {
            playCelebrateSound();
            speak(t.ui.gameCompleteSpeech, speechLang);
          }
        } else {
          const next = currentNumber + 1;
          setCurrentNumber(next);
          const newUsed = new Set(usedAnimals);
          const newRound = generateBubbleRound(next, mode, newUsed);
          newUsed.add(newRound.animal);
          setUsedAnimals(newUsed);
          setRound(newRound);
        }
      }, nextDelay);
    } else {
      // Wrong — bubble escapes to the side
      if (!fastMode) playClickSound();
      if (!fastMode) playWrongSound();
      const escapeDir = bubble.x > 50 ? "right" : "left";
      setBubbles((prev) =>
        prev.map((b) => (b.id === bubble.id ? { ...b, escaping: escapeDir } : b))
      );
      // Remove after escape animation
      setTimeout(() => {
        setBubbles((prev) =>
          prev.map((b) => (b.id === bubble.id ? { ...b, popped: true } : b))
        );
      }, 600);
      setMisses((m) => m + 1);
      if (!fastMode) speak(t.ui.tryAgain, speechLang);
    }
  }, [showCorrect, gameOver, round, currentNumber, mode, usedAnimals, fastMode, t, speechLang]);

  const now = Date.now();

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

      {/* Header */}
      <header className="relative z-20 w-full flex items-start pt-6 pb-2 px-4">
        <button
          onClick={onGoHome}
          className="rounded-lg bg-muted px-3 py-2 text-lg transition-transform active:scale-95"
          title="Home"
        >
          🏠
        </button>
        <div className="flex-1 text-center">
          <h1
            className="text-xl md:text-3xl font-extrabold text-primary-foreground drop-shadow-lg"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
          >
            🫧 {t.ui.phase3Name}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2 justify-center">
            <span className="bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-foreground shadow">
              {t.ui.phaseLabel} 3 — {currentNumber}/9
            </span>
            <span className="bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-farm-correct shadow">
              ✅ {hits}
            </span>
            <span className="bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-farm-wrong shadow">
              ❌ {misses}
            </span>
          </div>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Animals display */}
      <div className="relative z-10 mt-2">
        <div className="bg-card/95 backdrop-blur-sm rounded-3xl px-6 py-3 shadow-xl max-w-md text-center animate-bounce-in">
          <p className="text-lg md:text-2xl font-bold text-foreground">
            {showCorrect
              ? t.celebrationText(round.count)
              : narrating
                ? t.narrateText(round.count, round.animal)
                : t.ui.bubblePopPrompt}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap justify-center items-center mt-4 gap-2 px-4"
        style={{ maxWidth: "500px" }}
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

      {/* Correct number display */}
      {showCorrect && (
        <div
          className="relative z-10 text-8xl md:text-9xl font-black text-farm-correct animate-celebrate drop-shadow-lg mt-4"
          style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.2)" }}
        >
          {round.count}
        </div>
      )}

      {/* Bubbles area */}
      {!narrating && !showCorrect && !gameOver && (
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
          {bubbles
            .filter((b) => !b.popped)
            .map((bubble) => {
              const elapsed = now - bubble.startTime;
              const progress = Math.min(elapsed / bubbleDuration, 1);
              const top = 100 - progress * 110;
              const wobbleX = Math.sin(elapsed / 400) * 8;

              // Escape animation offset
              const escapeX = bubble.escaping === "left" ? -200 : bubble.escaping === "right" ? 200 : 0;
              const escapeRotate = bubble.escaping ? (bubble.escaping === "left" ? -45 : 45) : 0;
              const escapeOpacity = bubble.escaping ? 0 : 1;

              return (
                <button
                  key={bubble.id}
                  className={`absolute pointer-events-auto active:scale-90 ${bubble.popAnim ? "animate-bubble-pop" : ""}`}
                  style={{
                    left: `calc(${bubble.x}% + ${wobbleX}px)`,
                    top: `${top}%`,
                    transform: `translate(-50%, -50%) translateX(${escapeX}px) rotate(${escapeRotate}deg)`,
                    opacity: escapeOpacity,
                    transition: bubble.escaping ? "transform 0.5s ease-in, opacity 0.5s ease-in" : "none",
                  }}
                  onClick={() => handleBubblePop(bubble)}
                  disabled={!!bubble.escaping || !!bubble.popAnim}
                >
                  <div className={`relative ${bubble.popAnim ? "animate-bubble-pop" : ""}`}>
                    {/* Pop particles */}
                    {bubble.popAnim && (
                      <>
                        <div className="bubble-ring" />
                        {[
                          { x: -30, y: -30, color: "hsl(var(--farm-sun))" },
                          { x: 30, y: -30, color: "hsl(var(--farm-correct))" },
                          { x: -35, y: 10, color: "hsl(var(--farm-sun))" },
                          { x: 35, y: 10, color: "hsl(var(--accent))" },
                          { x: -20, y: 35, color: "hsl(var(--farm-correct))" },
                          { x: 20, y: 35, color: "hsl(var(--farm-sun))" },
                        ].map((p, i) => (
                          <div
                            key={i}
                            className="bubble-particle"
                            style={{
                              left: "50%",
                              top: "50%",
                              background: p.color,
                              ["--particle-x" as string]: `${p.x}px`,
                              ["--particle-y" as string]: `${p.y}px`,
                            }}
                          />
                        ))}
                      </>
                    )}
                    {/* Bubble */}
                    <div
                      className={`bubble-inner w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center
                        border-2 border-white/50 shadow-lg backdrop-blur-sm
                        bg-gradient-to-br from-sky-200/80 to-blue-400/60`}
                      style={{
                        boxShadow: "inset -4px -4px 8px rgba(255,255,255,0.4), 0 4px 12px rgba(0,100,200,0.3)",
                      }}
                    >
                      <span className="text-3xl md:text-4xl font-black text-foreground drop-shadow-sm">
                        {bubble.number}
                      </span>
                    </div>
                    {/* Shine */}
                    {!bubble.popAnim && (
                      <div className="absolute top-2 left-4 w-5 h-4 bg-white/50 rounded-full rotate-[-30deg]" />
                    )}
                  </div>
                </button>
              );
            })}
        </div>
      )}

      {/* Game over */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-foreground/40">
          <div className="flex flex-col items-center gap-6 px-4 max-w-lg">
            <div className="bg-card/95 backdrop-blur-sm rounded-3xl px-8 py-5 shadow-2xl animate-bounce-in">
              <h2 className="text-2xl md:text-4xl font-extrabold text-foreground text-center">
                {t.ui.gameCompleteText}
              </h2>
              <p className="text-center text-muted-foreground font-bold mt-2">
                ✅ {hits} &nbsp; ❌ {misses}
              </p>
            </div>
            <button
              onClick={onGoHome}
              className="px-8 py-4 text-xl md:text-2xl font-extrabold rounded-3xl shadow-2xl animate-bounce-in border-4 border-border transition-transform hover:scale-110 bg-secondary text-foreground"
            >
              {t.ui.playAgainButton}
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full mt-auto h-8 bg-gradient-to-t from-farm-grass/40 to-transparent" />
    </div>
  );
};

export default BubblePhase;
