import { useI18n } from "@/i18n";

interface AnimalEmojiProps {
  animal: string;
  index: number;
  total: number;
}

const DOMESTIC_ANIMALS: Record<string, { name: string; image: string }> = {
  galinha:   { name: "galinha",   image: "/animals/domestic/galinha.png" },
  vaca:      { name: "vaca",      image: "/animals/domestic/vaca.png" },
  porco:     { name: "porco",     image: "/animals/domestic/porco.png" },
  ovelha:    { name: "ovelha",    image: "/animals/domestic/ovelha.png" },
  cavalo:    { name: "cavalo",    image: "/animals/domestic/cavalo.png" },
  pato:      { name: "pato",      image: "/animals/domestic/pato.png" },
  coelho:    { name: "coelho",    image: "/animals/domestic/coelho.png" },
  gato:      { name: "gato",      image: "/animals/domestic/gato.png" },
};

const WILD_ANIMALS: Record<string, { name: string; image: string }> = {
  leao:      { name: "leão",      image: "/animals/wild/leao.png" },
  elefante:  { name: "elefante",  image: "/animals/wild/elefante.png" },
  girafa:    { name: "girafa",    image: "/animals/wild/girafa.png" },
  macaco:    { name: "macaco",    image: "/animals/wild/macaco.png" },
  zebra:     { name: "zebra",     image: "/animals/wild/zebra.png" },
  urso:      { name: "urso",      image: "/animals/wild/urso.png" },
  tigre:     { name: "tigre",     image: "/animals/wild/tigre.png" },
  cobra:     { name: "cobra",     image: "/animals/wild/cobra.png" },
};

const AQUATIC_ANIMALS: Record<string, { name: string; image: string }> = {
  peixe:      { name: "peixe",      image: "/animals/aquatic/peixe.png" },
  golfinho:   { name: "golfinho",   image: "/animals/aquatic/golfinho.png" },
  polvo:      { name: "polvo",      image: "/animals/aquatic/polvo.png" },
  caranguejo: { name: "caranguejo", image: "/animals/aquatic/caranguejo.png" },
  tartaruga:  { name: "tartaruga",  image: "/animals/aquatic/tartaruga.png" },
  baleia:     { name: "baleia",     image: "/animals/aquatic/baleia.png" },
  tubarao:    { name: "tubarão",    image: "/animals/aquatic/tubarao.png" },
  lula:       { name: "lula",       image: "/animals/aquatic/lula.png" },
};

const EASTER_ITEMS: Record<string, { name: string; image: string }> = {
  ovo:        { name: "ovo",        image: "/animals/easter/ovo.png" },
  coelhinho:  { name: "coelhinho",  image: "/animals/easter/coelhinho.png" },
  pintinho:   { name: "pintinho",   image: "/animals/easter/pintinho.png" },
  cesta:      { name: "cesta",      image: "/animals/easter/cesta.png" },
  flor:       { name: "flor",       image: "/animals/easter/flor.png" },
  borboleta:  { name: "borboleta",  image: "/animals/easter/borboleta.png" },
  cenoura:    { name: "cenoura",    image: "/animals/easter/cenoura.png" },
  chocolate:  { name: "chocolate",  image: "/animals/easter/chocolate.png" },
};

const ALL_ANIMALS: Record<string, { name: string; image: string }> = {
  ...DOMESTIC_ANIMALS,
  ...WILD_ANIMALS,
  ...AQUATIC_ANIMALS,
  ...EASTER_ITEMS,
};

export type AnimalMode = "domestic" | "wild" | "aquatic" | "easter";

export const getAnimalData = (key: string) => ALL_ANIMALS[key];
export const DOMESTIC_KEYS = Object.keys(DOMESTIC_ANIMALS);
export const WILD_KEYS = Object.keys(WILD_ANIMALS);
export const AQUATIC_KEYS = Object.keys(AQUATIC_ANIMALS);
export const EASTER_KEYS = Object.keys(EASTER_ITEMS);

export function getAnimalKeys(mode: AnimalMode) {
  if (mode === "domestic") return DOMESTIC_KEYS;
  if (mode === "wild") return WILD_KEYS;
  if (mode === "easter") return EASTER_KEYS;
  return AQUATIC_KEYS;
}

function getImageSizeClass(total: number): string {
  if (total === 1) return "w-48 h-48 md:w-64 md:h-64";
  if (total === 2) return "w-40 h-40 md:w-56 md:h-56";
  if (total === 3) return "w-36 h-36 md:w-48 md:h-48";
  if (total === 4) return "w-28 h-28 md:w-44 md:h-44";
  if (total === 5) return "w-24 h-24 md:w-36 md:h-36";
  if (total === 6) return "w-20 h-20 md:w-32 md:h-32";
  if (total === 7) return "w-16 h-16 md:w-28 md:h-28";
  if (total === 8) return "w-14 h-14 md:w-24 md:h-24";
  return "w-12 h-12 md:w-20 md:h-20";
}

const AnimalEmoji = ({ animal, index, total }: AnimalEmojiProps) => {
  const data = ALL_ANIMALS[animal];
  const { t } = useI18n();
  if (!data) return null;

  const translatedName = t.animalNames[animal] ?? data.name;

  return (
    <div
      className="inline-block animate-pop-in cursor-default select-none"
      style={{ animationDelay: `${index * 300}ms`, opacity: 0 }}
      role="img"
      aria-label={`${translatedName} ${index + 1}`}
    >
      <img
        src={data.image}
        alt={translatedName}
        className={`${getImageSizeClass(total)} object-contain drop-shadow-md`}
        draggable={false}
      />
    </div>
  );
};

export default AnimalEmoji;
