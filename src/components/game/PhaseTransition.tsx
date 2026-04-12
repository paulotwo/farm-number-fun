import { useEffect, useState } from "react";
import { getAnimalKeys, getAnimalData, type AnimalMode } from "../AnimalEmoji";
import { useI18n } from "@/i18n";
import { speak, playCelebrateSound } from "@/lib/sounds";

type TransitionType = "phase-complete" | "phase-fail" | "game-complete";

interface PhaseTransitionProps {
  type: TransitionType;
  mode: AnimalMode;
  gamePhase: number;
  onDone: () => void;
  bgImage: string;
  fastMode?: boolean;
}

const PhaseTransition = ({ type, mode, gamePhase, onDone, bgImage, fastMode }: PhaseTransitionProps) => {
  const { t, speechLang } = useI18n();
  const [visible, setVisible] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const isSuccess = type === "phase-complete" || type === "game-complete";
  const animals = getAnimalKeys(mode).slice(0, 6);
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  useEffect(() => {
    if (fastMode) {
      setVisible(true);
      setShowButton(true);
      return;
    }

    requestAnimationFrame(() => setVisible(true));

    const speechText =
      type === "phase-complete" ? t.ui.phaseCompleteSpeech :
      type === "phase-fail" ? t.ui.phaseFailSpeech :
      t.ui.gameCompleteSpeech;

    if (isSuccess) playCelebrateSound();

    const timer = setTimeout(() => {
      speak(speechText, speechLang, () => setShowButton(true));
      setTimeout(() => setShowButton(true), 4000);
    }, 600);

    return () => clearTimeout(timer);
  }, [type, t, speechLang, isSuccess, fastMode]);

  const handleClick = () => {
    setVisible(false);
    setTimeout(onDone, 400);
  };

  const titleText =
    type === "phase-complete" ? t.ui.phaseCompleteText :
    type === "phase-fail" ? t.ui.phaseFailText :
    t.ui.gameCompleteText;

  const buttonText =
    type === "game-complete" ? t.ui.playAgainButton :
    type === "phase-fail" ? `${t.ui.playAgainButton}` :
    t.ui.continueButton;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={`absolute inset-0 ${isSuccess ? "bg-foreground/40" : "bg-foreground/50"}`} />

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 max-w-lg">
        {/* Animated animals */}
        <div className="flex flex-wrap gap-2 justify-center">
          {animals.map((key, i) => {
            const data = getAnimalData(key);
            if (!data) return null;
            return (
              <img
                key={key}
                src={data.image}
                alt={data.name}
                className={`w-12 h-12 md:w-16 md:h-16 object-contain animate-pop-in ${isSuccess ? "animate-float" : ""}`}
                style={{
                  animationDelay: `${i * 150}ms`,
                  opacity: 0,
                  animationFillMode: "forwards",
                  ...(isSuccess ? {} : { filter: "grayscale(0.3)" }),
                }}
              />
            );
          })}
        </div>

        {/* Title */}
        <div className="bg-card/95 backdrop-blur-sm rounded-3xl px-8 py-5 shadow-2xl animate-bounce-in">
          <h2
            className="text-2xl md:text-4xl font-extrabold text-foreground text-center"
          >
            {titleText}
          </h2>
          {type === "phase-complete" && (
            <p className="text-center text-muted-foreground font-bold mt-2">
              {t.ui.phase1Name} ✓ → 🫧 {t.ui.phase2Name}
            </p>
          )}
        </div>

        {/* Numbers parade for success */}
        {isSuccess && (
          <div className="flex flex-wrap gap-2 justify-center">
            {numbers.map((n, i) => (
              <span
                key={n}
                className="text-4xl md:text-5xl font-black text-farm-correct animate-pop-in drop-shadow-lg"
                style={{
                  animationDelay: `${(animals.length * 150) + i * 100}ms`,
                  opacity: 0,
                  animationFillMode: "forwards",
                  textShadow: "2px 2px 0 rgba(0,0,0,0.2)",
                }}
              >
                {n}
              </span>
            ))}
          </div>
        )}

        {/* Button */}
        {showButton && (
          <button
            onClick={handleClick}
            className={`px-8 py-4 text-xl md:text-2xl font-extrabold rounded-3xl shadow-2xl animate-bounce-in border-4 border-border transition-transform hover:scale-110 ${
              isSuccess
                ? "bg-secondary text-foreground"
                : "bg-card text-foreground"
            }`}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default PhaseTransition;
