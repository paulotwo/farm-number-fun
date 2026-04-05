import { cn } from "@/lib/utils";

interface EasterNumberOptionProps {
  number: number;
  onClick: (n: number) => void;
  state: "idle" | "correct" | "wrong";
  disabled: boolean;
  index: number;
}

const EASTER_DECORATIONS = [
  "🥚", "🐣", "🌷", "🐰", "🦋", "🌸", "🎀", "✨", "🌼",
];

const EasterNumberOption = ({ number, onClick, state, disabled, index }: EasterNumberOptionProps) => {
  const topDeco = EASTER_DECORATIONS[(number + index) % EASTER_DECORATIONS.length];
  const bottomDeco = EASTER_DECORATIONS[(number + index + 3) % EASTER_DECORATIONS.length];

  return (
    <button
      onClick={() => onClick(number)}
      disabled={disabled}
      className={cn(
        "relative w-20 h-20 md:w-28 md:h-28 rounded-2xl text-3xl md:text-5xl font-extrabold",
        "transition-all duration-200 animate-bounce-in border-4",
        "focus:outline-none focus:ring-4 focus:ring-ring/50",
        state === "idle" && "border-pink-300 hover:scale-110 hover:border-pink-400 shadow-lg",
        state === "correct" && "bg-farm-correct border-farm-correct text-primary-foreground animate-celebrate shadow-2xl scale-110",
        state === "wrong" && "bg-farm-wrong border-farm-wrong text-destructive-foreground animate-shake opacity-60",
      )}
      style={{
        animationDelay: `${index * 100}ms`,
        ...(state === "idle" ? {
          background: "linear-gradient(135deg, hsl(330 80% 92%), hsl(280 60% 90%), hsl(200 70% 90%))",
        } : {}),
      }}
    >
      <span className="absolute -top-3 -right-1 text-lg md:text-xl animate-float" style={{ animationDelay: `${index * 200}ms` }}>
        {topDeco}
      </span>
      <span className="absolute -bottom-3 -left-1 text-lg md:text-xl animate-float" style={{ animationDelay: `${index * 200 + 500}ms` }}>
        {bottomDeco}
      </span>
      <span className="relative z-10" style={state === "idle" ? {
        background: "linear-gradient(135deg, hsl(330 70% 45%), hsl(280 60% 50%))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      } : {}}>
        {number}
      </span>
    </button>
  );
};

export default EasterNumberOption;
