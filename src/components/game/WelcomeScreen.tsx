import { type AnimalMode } from "../AnimalEmoji";
import LanguageSelector from "../LanguageSelector";
import welcomeBg from "@/assets/welcome-bg.jpg";
import { useI18n } from "@/i18n";

interface WelcomeScreenProps {
  onStart: (mode: AnimalMode) => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const { t } = useI18n();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${welcomeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <div className="absolute inset-0 bg-foreground/30" />
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>
      <div className="relative z-10 text-center flex flex-col items-center gap-6 px-4">
        <h1
          className="text-4xl md:text-6xl font-extrabold text-primary-foreground drop-shadow-lg"
          style={{ textShadow: "2px 3px 8px rgba(0,0,0,0.6)" }}
        >
          {t.ui.gameTitle}
        </h1>
        <p
          className="text-lg md:text-2xl text-primary-foreground font-bold"
          style={{ textShadow: "1px 2px 4px rgba(0,0,0,0.6)" }}
        >
          {t.ui.subtitle}
        </p>
        <p
          className="text-base md:text-xl text-primary-foreground font-semibold"
          style={{ textShadow: "1px 2px 4px rgba(0,0,0,0.6)" }}
        >
          {t.ui.chooseMode}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onStart("domestic")}
            className="px-8 py-5 bg-secondary text-foreground text-xl md:text-2xl font-extrabold rounded-3xl shadow-2xl hover:scale-110 transition-transform animate-float border-4 border-border"
          >
            {t.ui.domesticButton}
          </button>
          <button
            onClick={() => onStart("wild")}
            className="px-8 py-5 text-white text-xl md:text-2xl font-extrabold rounded-3xl shadow-2xl hover:scale-110 transition-transform animate-float border-4 border-border"
            style={{ animationDelay: "0.3s", backgroundColor: "hsl(130 45% 35%)" }}
          >
            {t.ui.wildButton}
          </button>
          <button
            onClick={() => onStart("aquatic")}
            className="px-8 py-5 bg-accent text-accent-foreground text-xl md:text-2xl font-extrabold rounded-3xl shadow-2xl hover:scale-110 transition-transform animate-float border-4 border-border"
            style={{ animationDelay: "0.6s" }}
          >
            {t.ui.aquaticButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
