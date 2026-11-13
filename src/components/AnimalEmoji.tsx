import { useI18n } from "@/i18n";

interface AnimalEmojiProps {
  animal: string;
  index: number;
  total: number;
}

const DOMESTIC_ANIMALS: Record<string, { name: string; image: string }> = {
  galinha:   { name: "galinha",   image: "/animals/domestic/galinha.webp" },
  vaca:      { name: "vaca",      image: "/animals/domestic/vaca.webp" },
  porco:     { name: "porco",     image: "/animals/domestic/porco.webp" },
  ovelha:    { name: "ovelha",    image: "/animals/domestic/ovelha.webp" },
  cavalo:    { name: "cavalo",    image: "/animals/domestic/cavalo.webp" },
  pato:      { name: "pato",      image: "/animals/domestic/pato.webp" },
  coelho:    { name: "coelho",    image: "/animals/domestic/coelho.webp" },
  gato:      { name: "gato",      image: "/animals/domestic/gato.webp" },
  cachorro:  { name: "cachorro",  image: "/animals/domestic/cachorro.webp" },
  burro:     { name: "burro",     image: "/animals/domestic/burro.webp" },
  peru:      { name: "peru",      image: "/animals/domestic/peru.webp" },
  cabra:     { name: "cabra",     image: "/animals/domestic/cabra.webp" },
  ganso:     { name: "ganso",     image: "/animals/domestic/ganso.webp" },
  hamster:   { name: "hamster",   image: "/animals/domestic/hamster.webp" },
  papagaio:  { name: "papagaio",  image: "/animals/domestic/papagaio.webp" },
  ponei:     { name: "pônei",     image: "/animals/domestic/ponei.webp" },
};

const WILD_ANIMALS: Record<string, { name: string; image: string }> = {
  leao:       { name: "leão",       image: "/animals/wild/leao.webp" },
  elefante:   { name: "elefante",   image: "/animals/wild/elefante.webp" },
  girafa:     { name: "girafa",     image: "/animals/wild/girafa.webp" },
  macaco:     { name: "macaco",     image: "/animals/wild/macaco.webp" },
  zebra:      { name: "zebra",      image: "/animals/wild/zebra.webp" },
  urso:       { name: "urso",       image: "/animals/wild/urso.webp" },
  tigre:      { name: "tigre",      image: "/animals/wild/tigre.webp" },
  cobra:      { name: "cobra",      image: "/animals/wild/cobra.webp" },
  panda:      { name: "panda",      image: "/animals/wild/panda.webp" },
  hipopotamo: { name: "hipopótamo", image: "/animals/wild/hipopotamo.webp" },
  canguru:    { name: "canguru",    image: "/animals/wild/canguru.webp" },
  koala:      { name: "coala",      image: "/animals/wild/koala.webp" },
  preguica:   { name: "preguiça",   image: "/animals/wild/preguica.webp" },
  raposa:     { name: "raposa",     image: "/animals/wild/raposa.webp" },
  coruja:     { name: "coruja",     image: "/animals/wild/coruja.webp" },
  camaleao:   { name: "camaleão",   image: "/animals/wild/camaleao.webp" },
};

const AQUATIC_ANIMALS: Record<string, { name: string; image: string }> = {
  peixe:         { name: "peixe",         image: "/animals/aquatic/peixe.webp" },
  golfinho:      { name: "golfinho",      image: "/animals/aquatic/golfinho.webp" },
  polvo:         { name: "polvo",         image: "/animals/aquatic/polvo.webp" },
  caranguejo:    { name: "caranguejo",    image: "/animals/aquatic/caranguejo.webp" },
  tartaruga:     { name: "tartaruga",     image: "/animals/aquatic/tartaruga.webp" },
  baleia:        { name: "baleia",        image: "/animals/aquatic/baleia.webp" },
  tubarao:       { name: "tubarão",       image: "/animals/aquatic/tubarao.webp" },
  lula:          { name: "lula",          image: "/animals/aquatic/lula.webp" },
  cavalo_marinho: { name: "cavalo-marinho", image: "/animals/aquatic/cavalo_marinho.webp" },
  foca:          { name: "foca",          image: "/animals/aquatic/foca.webp" },
  pinguim:       { name: "pinguim",       image: "/animals/aquatic/pinguim.webp" },
  arraia:        { name: "arraia",        image: "/animals/aquatic/arraia.webp" },
  morsa:         { name: "morsa",         image: "/animals/aquatic/morsa.webp" },
  lontra:        { name: "lontra",        image: "/animals/aquatic/lontra.webp" },
  estrela_do_mar: { name: "estrela-do-mar", image: "/animals/aquatic/estrela_do_mar.webp" },
  lagosta:       { name: "lagosta",       image: "/animals/aquatic/lagosta.webp" },
};

const EASTER_ITEMS: Record<string, { name: string; image: string }> = {
  ovo:        { name: "ovo",        image: "/animals/easter/ovo.webp" },
  coelhinho:  { name: "coelhinho",  image: "/animals/easter/coelhinho.webp" },
  pintinho:   { name: "pintinho",   image: "/animals/easter/pintinho.webp" },
  cesta:      { name: "cesta",      image: "/animals/easter/cesta.webp" },
  flor:       { name: "flor",       image: "/animals/easter/flor.webp" },
  borboleta:  { name: "borboleta",  image: "/animals/easter/borboleta.webp" },
  cenoura:    { name: "cenoura",    image: "/animals/easter/cenoura.webp" },
  chocolate:  { name: "chocolate",  image: "/animals/easter/chocolate.webp" },
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
  if (total === 4) return "w-32 h-32 md:w-48 md:h-48";
  if (total === 5) return "w-28 h-28 md:w-44 md:h-44";
  if (total === 6) return "w-24 h-24 md:w-36 md:h-36";
  if (total === 7) return "w-20 h-20 md:w-32 md:h-32";
  if (total === 8) return "w-16 h-16 md:w-28 md:h-28";
  return "w-14 h-14 md:w-24 md:h-24";
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
