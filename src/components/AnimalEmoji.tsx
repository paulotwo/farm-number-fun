import { useI18n } from "@/i18n";

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

const AQUATIC_ANIMALS: Record<string, { emoji: string; name: string }> = {
  peixe: { emoji: "🐟", name: "peixe" },
  golfinho: { emoji: "🐬", name: "golfinho" },
  polvo: { emoji: "🐙", name: "polvo" },
  caranguejo: { emoji: "🦀", name: "caranguejo" },
  tartaruga: { emoji: "🐢", name: "tartaruga" },
  baleia: { emoji: "🐳", name: "baleia" },
  tubarao: { emoji: "🦈", name: "tubarão" },
  lula: { emoji: "🦑", name: "lula" },
};

const ALL_ANIMALS: Record<string, { emoji: string; name: string }> = {
  ...DOMESTIC_ANIMALS,
  ...WILD_ANIMALS,
  ...AQUATIC_ANIMALS,
};

export type AnimalMode = "domestic" | "wild" | "aquatic";

export const getAnimalData = (key: string) => ALL_ANIMALS[key];
export const DOMESTIC_KEYS = Object.keys(DOMESTIC_ANIMALS);
export const WILD_KEYS = Object.keys(WILD_ANIMALS);
export const AQUATIC_KEYS = Object.keys(AQUATIC_ANIMALS);

export function getAnimalKeys(mode: AnimalMode) {
  if (mode === "domestic") return DOMESTIC_KEYS;
  if (mode === "wild") return WILD_KEYS;
  return AQUATIC_KEYS;
}

const AnimalEmoji = ({ animal, index, total }: AnimalEmojiProps) => {
  const data = ALL_ANIMALS[animal];
  const { t } = useI18n();
  if (!data) return null;

  const translatedName = t.animalNames[animal] ?? data.name;

  return (
    <span
      className="inline-block text-6xl md:text-8xl animate-pop-in cursor-default select-none"
      style={{ animationDelay: `${index * 300}ms`, opacity: 0 }}
      role="img"
      aria-label={`${translatedName} ${index + 1}`}
    >
      {data.emoji}
    </span>
  );
};

export default AnimalEmoji;
