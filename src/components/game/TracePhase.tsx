import { useState, useEffect, useCallback, useRef } from "react";
import { type AnimalMode } from "../AnimalEmoji";
import LanguageSelector from "../LanguageSelector";
import { useI18n } from "@/i18n";
import {
  playCorrectSound,
  playWrongSound,
  playCelebrateSound,
  playClickSound,
  speak,
} from "@/lib/sounds";

interface TracePhaseProps {
  mode: AnimalMode;
  onComplete: () => void;
  onGoHome: () => void;
  bgImage: string;
  fastMode?: boolean;
}

// SVG path data for numbers 1-9 as traceable outlines
const NUMBER_PATHS: Record<number, { path: string; viewBox: string }> = {
  1: {
    path: "M 50 20 L 50 80 M 35 80 L 65 80 M 35 25 L 50 20",
    viewBox: "0 0 100 100",
  },
  2: {
    path: "M 25 35 Q 25 15 50 15 Q 75 15 75 35 Q 75 50 50 60 L 25 80 L 75 80",
    viewBox: "0 0 100 100",
  },
  3: {
    path: "M 25 20 L 70 20 L 45 48 Q 72 48 72 63 Q 72 82 48 82 Q 25 82 25 72",
    viewBox: "0 0 100 100",
  },
  4: {
    path: "M 60 80 L 60 15 L 20 60 L 80 60",
    viewBox: "0 0 100 100",
  },
  5: {
    path: "M 70 15 L 30 15 L 25 48 Q 50 38 70 50 Q 80 60 65 78 Q 50 85 25 75",
    viewBox: "0 0 100 100",
  },
  6: {
    path: "M 65 20 Q 30 20 28 55 Q 28 82 50 82 Q 72 82 72 63 Q 72 45 50 45 Q 28 45 28 55",
    viewBox: "0 0 100 100",
  },
  7: {
    path: "M 25 20 L 75 20 L 45 82",
    viewBox: "0 0 100 100",
  },
  8: {
    path: "M 50 50 Q 25 50 25 35 Q 25 18 50 18 Q 75 18 75 35 Q 75 50 50 50 Q 22 50 22 67 Q 22 85 50 85 Q 78 85 78 67 Q 78 50 50 50",
    viewBox: "0 0 100 100",
  },
  9: {
    path: "M 35 80 Q 70 80 72 45 Q 72 18 50 18 Q 28 18 28 37 Q 28 55 50 55 Q 72 55 72 45",
    viewBox: "0 0 100 100",
  },
};

const SEQUENCE = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function getPathPoints(pathStr: string, numPoints: number): { x: number; y: number }[] {
  if (typeof document === "undefined") return [];
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathStr);
  svg.appendChild(path);
  document.body.appendChild(svg);
  const totalLen = path.getTotalLength();
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const pt = path.getPointAtLength((i / numPoints) * totalLen);
    points.push({ x: pt.x, y: pt.y });
  }
  document.body.removeChild(svg);
  return points;
}

const TracePhase = ({ mode, onComplete, onGoHome, bgImage, fastMode }: TracePhaseProps) => {
  const { t, speechLang } = useI18n();
  const [currentNumber, setCurrentNumber] = useState(1);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [phase, setPhase] = useState<"intro" | "tracing" | "correct" | "transition">("intro");
  const [traceProgress, setTraceProgress] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [userPath, setUserPath] = useState<{ x: number; y: number }[]>([]);
  const [targetPoints, setTargetPoints] = useState<{ x: number; y: number }[]>([]);
  const [nextPointIndex, setNextPointIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [instructionSpoken, setInstructionSpoken] = useState(false);

  // Generate target points for the current number
  useEffect(() => {
    const numData = NUMBER_PATHS[currentNumber];
    if (!numData) return;
    const points = getPathPoints(numData.path, 40);
    setTargetPoints(points);
    setNextPointIndex(0);
    setTraceProgress(0);
    setUserPath([]);
    setIsDrawing(false);
    setShowSuccess(false);
  }, [currentNumber]);

  // Intro narration
  useEffect(() => {
    if (phase !== "intro") return;
    if (fastMode) {
      const t2 = setTimeout(() => setPhase("tracing"), 100);
      return () => clearTimeout(t2);
    }
    const delay = setTimeout(() => {
      const text = !instructionSpoken
        ? t.ui.tracePrompt
        : `${currentNumber}`;
      speak(text, speechLang, () => setPhase("tracing"));
      if (!instructionSpoken) setInstructionSpoken(true);
      const fallback = setTimeout(() => setPhase("tracing"), 4000);
      return () => clearTimeout(fallback);
    }, 400);
    return () => clearTimeout(delay);
  }, [phase, fastMode, t, speechLang, currentNumber, instructionSpoken]);

  // Scale coordinates from SVG space (100x100) to canvas space
  const scalePoint = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return { x, y };
  }, []);

  const checkProximity = useCallback((point: { x: number; y: number }) => {
    if (nextPointIndex >= targetPoints.length) return;
    const target = targetPoints[nextPointIndex];
    const dist = Math.sqrt((point.x - target.x) ** 2 + (point.y - target.y) ** 2);
    const threshold = 12;

    if (dist < threshold) {
      const newIdx = nextPointIndex + 1;
      setNextPointIndex(newIdx);
      const progress = Math.min(100, (newIdx / targetPoints.length) * 100);
      setTraceProgress(progress);

      if (newIdx >= targetPoints.length) {
        // Completed!
        if (!fastMode) playCorrectSound();
        setHits((h) => h + 1);
        setShowSuccess(true);
        setPhase("correct");

        if (currentNumber < 9 && !fastMode) {
          setTimeout(() => {
            playCelebrateSound();
            speak(t.celebrationSpeech(currentNumber), speechLang);
          }, 300);
        }

        const nextDelay = fastMode ? 200 : 2500;
        setTimeout(() => {
          if (currentNumber >= 9) {
            onComplete();
          } else {
            setPhase("transition");
            setTimeout(() => {
              setCurrentNumber((n) => n + 1);
              setPhase("intro");
            }, fastMode ? 50 : 400);
          }
        }, nextDelay);
      }
    }
  }, [nextPointIndex, targetPoints, currentNumber, fastMode, t, speechLang, onComplete]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (phase !== "tracing") return;
    e.preventDefault();
    const pt = scalePoint(e.clientX, e.clientY);
    if (!pt) return;
    setIsDrawing(true);
    setUserPath([pt]);
    checkProximity(pt);
  }, [phase, scalePoint, checkProximity]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDrawing || phase !== "tracing") return;
    e.preventDefault();
    const pt = scalePoint(e.clientX, e.clientY);
    if (!pt) return;
    setUserPath((prev) => [...prev, pt]);
    checkProximity(pt);
  }, [isDrawing, phase, scalePoint, checkProximity]);

  const handlePointerUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Draw user path on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    if (userPath.length < 2) return;

    ctx.strokeStyle = "hsl(142, 71%, 45%)";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    const scaleX = rect.width / 100;
    const scaleY = rect.height / 100;
    ctx.moveTo(userPath[0].x * scaleX, userPath[0].y * scaleY);
    for (let i = 1; i < userPath.length; i++) {
      ctx.lineTo(userPath[i].x * scaleX, userPath[i].y * scaleY);
    }
    ctx.stroke();
  }, [userPath]);

  const numData = NUMBER_PATHS[currentNumber];

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
            ✏️ {t.ui.phase4Name}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2 justify-center">
            <span className="bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-foreground shadow">
              {t.ui.phaseLabel} 4 — {currentNumber}/9
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

      {/* Instruction */}
      <div className="relative z-10 mt-2">
        <div className="bg-card/95 backdrop-blur-sm rounded-3xl px-6 py-3 shadow-xl max-w-md text-center animate-bounce-in">
          <p className="text-lg md:text-2xl font-bold text-foreground">
            {showSuccess
              ? t.celebrationText(currentNumber)
              : t.ui.traceInstruction(currentNumber)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 w-full max-w-xs mt-3 px-4">
        <div className="h-3 bg-card/60 rounded-full overflow-hidden backdrop-blur">
          <div
            className="h-full bg-farm-correct rounded-full transition-all duration-200"
            style={{ width: `${traceProgress}%` }}
          />
        </div>
      </div>

      {/* Tracing area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 mt-4">
        <div
          ref={containerRef}
          className={`relative bg-card/95 backdrop-blur-sm rounded-3xl shadow-2xl touch-none select-none transition-opacity duration-400 ${
            phase === "transition" ? "opacity-0" : "opacity-100"
          }`}
          style={{ width: "280px", height: "280px" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Dotted number outline */}
          {numData && (
            <svg
              viewBox={numData.viewBox}
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: "none" }}
            >
              <path
                d={numData.path}
                fill="none"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="4"
                strokeDasharray="4 6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.5}
              />
              {/* Highlighted progress path */}
              {traceProgress > 0 && (
                <path
                  d={numData.path}
                  fill="none"
                  stroke="hsl(var(--farm-correct))"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={(() => {
                    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    p.setAttribute("d", numData.path);
                    svg.appendChild(p);
                    document.body.appendChild(svg);
                    const total = p.getTotalLength();
                    document.body.removeChild(svg);
                    const shown = (traceProgress / 100) * total;
                    return `${shown} ${total}`;
                  })()}
                />
              )}
              {/* Start point indicator */}
              {targetPoints.length > 0 && nextPointIndex < targetPoints.length && (
                <circle
                  cx={targetPoints[nextPointIndex].x}
                  cy={targetPoints[nextPointIndex].y}
                  r="5"
                  fill="hsl(var(--farm-correct))"
                  className="animate-pulse"
                />
              )}
            </svg>
          )}

          {/* Canvas for user drawing */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full rounded-3xl"
            style={{ pointerEvents: "none" }}
          />

          {/* Big number in center (faint) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="text-[120px] font-black opacity-[0.06] select-none"
              style={{ lineHeight: 1 }}
            >
              {currentNumber}
            </span>
          </div>

          {/* Success overlay */}
          {showSuccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-farm-correct/20 rounded-3xl">
              <span className="text-8xl font-black text-farm-correct animate-celebrate drop-shadow-lg">
                {currentNumber}
              </span>
            </div>
          )}
        </div>
      </main>

      <div className="relative z-10 w-full mt-auto h-8 bg-gradient-to-t from-farm-grass/40 to-transparent" />
    </div>
  );
};

export default TracePhase;
