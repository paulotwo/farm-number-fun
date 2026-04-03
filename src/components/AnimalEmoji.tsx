interface AnimalEmojiProps {
  animal: string;
  index: number;
  total: number;
}

const ANIMAL_MAP: Record<string, { emoji: string; name: string }> = {
  galinha: { emoji: "🐔", name: "galinha" },
  vaca: { emoji: "🐄", name: "vaca" },
  porco: { emoji: "🐷", name: "porco" },
  ovelha: { emoji: "🐑", name: "ovelha" },
  cavalo: { emoji: "🐴", name: "cavalo" },
  pato: { emoji: "🦆", name: "pato" },
  coelho: { emoji: "🐰", name: "coelho" },
  gato: { emoji: "🐱", name: "gato" },
};

export const getAnimalData = (key: string) => ANIMAL_MAP[key];
export const ANIMAL_KEYS = Object.keys(ANIMAL_MAP);

const AnimalEmoji = ({ animal, index, total }: AnimalEmojiProps) => {
  const data = ANIMAL_MAP[animal];
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
