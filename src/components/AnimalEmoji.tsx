interface AnimalEmojiProps {
  animal: string;
  index: number;
  total: number;
}

const DOMESTIC_ANIMALS: Record<string, { emoji: string; name: string }> = {
  galinha: { emoji: "🐔", name: "galinha" },
  vaca: { emoji: "🐄", name: "vaca" },
  porco: { emoji: "🐷", name: "porco" },
  ovelha: { emoji: "🐑", name: "ovelha" },
  cavalo: { emoji: "🐴", name: "cavalo" },
  pato: { emoji: "🦆", name: "pato" },
  coelho: { emoji: "🐰", name: "coelho" },
  gato: { emoji: "🐱", name: "gato" },
};

const WILD_ANIMALS: Record<string, { emoji: string; name: string }> = {
  leao: { emoji: "🦁", name: "leão" },
  elefante: { emoji: "🐘", name: "elefante" },
  girafa: { emoji: "🦒", name: "girafa" },
  macaco: { emoji: "🐒", name: "macaco" },
  zebra: { emoji: "🦓", name: "zebra" },
  urso: { emoji: "🐻", name: "urso" },
  tigre: { emoji: "🐯", name: "tigre" },
  cobra: { emoji: "🐍", name: "cobra" },
};

const ALL_ANIMALS: Record<string, { emoji: string; name: string }> = {
  ...DOMESTIC_ANIMALS,
  ...WILD_ANIMALS,
};

export type AnimalMode = "domestic" | "wild";

export const getAnimalData = (key: string) => ALL_ANIMALS[key];
export const DOMESTIC_KEYS = Object.keys(DOMESTIC_ANIMALS);
export const WILD_KEYS = Object.keys(WILD_ANIMALS);

export function getAnimalKeys(mode: AnimalMode) {
  return mode === "domestic" ? DOMESTIC_KEYS : WILD_KEYS;
}

const AnimalEmoji = ({ animal, index, total }: AnimalEmojiProps) => {
  const data = ALL_ANIMALS[animal];
  if (!data) return null;

  return (
    <span
      className="inline-block text-6xl md:text-8xl animate-pop-in cursor-default select-none hover:animate-wiggle"
      style={{ animationDelay: `${index * 300}ms`, opacity: 0 }}
      role="img"
      aria-label={`${data.name} ${index + 1} de ${total}`}
    >
      {data.emoji}
    </span>
  );
};

export default AnimalEmoji;
