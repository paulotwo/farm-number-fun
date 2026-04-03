import { cn } from "@/lib/utils";

interface NumberOptionProps {
  number: number;
  onClick: (n: number) => void;
  state: "idle" | "correct" | "wrong";
  disabled: boolean;
  index: number;
}

const NumberOption = ({ number, onClick, state, disabled, index }: NumberOptionProps) => {
  return (
    <button
      onClick={() => onClick(number)}
      disabled={disabled}
      className={cn(
        "w-20 h-20 md:w-28 md:h-28 rounded-2xl text-3xl md:text-5xl font-extrabold",
        "transition-all duration-200 animate-bounce-in border-4",
        "focus:outline-none focus:ring-4 focus:ring-ring/50",
        state === "idle" && "bg-card border-border text-foreground hover:scale-110 hover:border-primary shadow-lg",
        state === "correct" && "bg-farm-correct border-farm-correct text-primary-foreground animate-celebrate shadow-2xl scale-110",
        state === "wrong" && "bg-farm-wrong border-farm-wrong text-destructive-foreground animate-shake opacity-60",
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {number}
    </button>
  );
};

export default NumberOption;
