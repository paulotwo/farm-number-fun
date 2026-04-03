export type Locale = "pt" | "en" | "es" | "fr" | "it" | "de";

export interface Translations {
  ui: {
    gameTitle: string;
    wildTitle: string;
    subtitle: string;
    chooseMode: string;
    domesticButton: string;
    wildButton: string;
    aquaticButton: string;
    aquaticTitle: string;
    scoreLabel: string;
    roundLabel: string;
    countingHint: string;
    tryAgain: string;
    languageLabel: string;
    pwaInstallMessage: string;
    pwaInstallIosMessage: string;
    pwaInstallButton: string;
  };
  animalNames: Record<string, string>;
  narrateText: (count: number, animalName: string) => string;
  celebrationText: (count: number) => string;
  celebrationSpeech: (count: number) => string;
}

export const translations: Record<Locale, Translations> = {
  pt: {
    ui: {
      gameTitle: "🌻 A Fazenda dos Números 🌻",
      wildTitle: "🌿 Animais Selvagens 🌿",
      aquaticTitle: "🌊 Animais Aquáticos 🌊",
      subtitle: "Conta os animais e descobre o número!",
      chooseMode: "Escolhe os teus animais:",
      domesticButton: "🐔 Animais da Fazenda",
      wildButton: "🦁 Animais Selvagens",
      aquaticButton: "🐬 Animais Aquáticos",
      scoreLabel: "⭐ Pontos:",
      roundLabel: "🎯 Rodada:",
      countingHint: "Contando os animais...",
      tryAgain: "Tenta de novo!",
      languageLabel: "Idioma",
      pwaInstallMessage: "Instala a app para jogar sem internet!",
      pwaInstallIosMessage: "Para instalar, toca em ⬆️ Compartilhar e depois em «Adicionar ao Ecrã de Início».",
      pwaInstallButton: "Instalar",
    },
    animalNames: {
      galinha: "galinha", vaca: "vaca", porco: "porco", ovelha: "ovelha",
      cavalo: "cavalo", pato: "pato", coelho: "coelho", gato: "gato",
      leao: "leão", elefante: "elefante", girafa: "girafa", macaco: "macaco",
      zebra: "zebra", urso: "urso", tigre: "tigre", cobra: "cobra",
      peixe: "peixe", golfinho: "golfinho", polvo: "polvo", caranguejo: "caranguejo",
      tartaruga: "tartaruga", baleia: "baleia", tubarao: "tubarão", lula: "lula",
    },
    narrateText: (count, animalName) => {
      const plurals: Record<string, string> = {
        galinha: "galinhas", vaca: "vacas", porco: "porcos", ovelha: "ovelhas",
        cavalo: "cavalos", pato: "patos", coelho: "coelhos", gato: "gatos",
        leao: "leões", elefante: "elefantes", girafa: "girafas", macaco: "macacos",
        zebra: "zebras", urso: "ursos", tigre: "tigres", cobra: "cobras",
        peixe: "peixes", golfinho: "golfinhos", polvo: "polvos", caranguejo: "caranguejos",
        tartaruga: "tartarugas", baleia: "baleias", tubarao: "tubarões", lula: "lulas",
      };
      const femAnimals = ["galinha", "vaca", "ovelha", "girafa", "zebra", "cobra", "tartaruga", "baleia", "lula"];
      const numWordF = ["", "uma", "duas", "três", "quatro", "cinco"][count] ?? String(count);
      const numWordM = ["", "um", "dois", "três", "quatro", "cinco"][count] ?? String(count);
      const word = femAnimals.includes(animalName) ? numWordF : numWordM;
      const name = count === 1 ? animalName : (plurals[animalName] ?? animalName + "s");
      return `Olha! Temos ${word} ${name}!`;
    },
    celebrationText: (count) =>
      count === 1 ? `🎉 Isso! É ${count}! Muito bem!` : `🎉 Isso! São ${count}! Muito bem!`,
    celebrationSpeech: (count) =>
      count === 1 ? `Isso! É ${count}! Muito bem!` : `Isso! São ${count}! Muito bem!`,
  },

  en: {
    ui: {
      gameTitle: "🌻 The Number Farm 🌻",
      wildTitle: "🌿 Wild Animals 🌿",
      aquaticTitle: "🌊 Aquatic Animals 🌊",
      subtitle: "Count the animals and find the number!",
      chooseMode: "Choose your animals:",
      domesticButton: "🐔 Farm Animals",
      wildButton: "🦁 Wild Animals",
      aquaticButton: "🐬 Aquatic Animals",
      scoreLabel: "⭐ Score:",
      roundLabel: "🎯 Round:",
      countingHint: "Counting the animals...",
      tryAgain: "Try again!",
      languageLabel: "Language",
      pwaInstallMessage: "Install the app to play offline!",
      pwaInstallIosMessage: "To install, tap ⬆️ Share and then «Add to Home Screen».",
      pwaInstallButton: "Install",
    },
    animalNames: {
      galinha: "chicken", vaca: "cow", porco: "pig", ovelha: "sheep",
      cavalo: "horse", pato: "duck", coelho: "rabbit", gato: "cat",
      leao: "lion", elefante: "elephant", girafa: "giraffe", macaco: "monkey",
      zebra: "zebra", urso: "bear", tigre: "tiger", cobra: "snake",
      peixe: "fish", golfinho: "dolphin", polvo: "octopus", caranguejo: "crab",
      tartaruga: "turtle", baleia: "whale", tubarao: "shark", lula: "squid",
    },
    narrateText: (count, animalName) => {
      const plurals: Record<string, string> = {
        galinha: "chickens", vaca: "cows", porco: "pigs", ovelha: "sheep",
        cavalo: "horses", pato: "ducks", coelho: "rabbits", gato: "cats",
        leao: "lions", elefante: "elephants", girafa: "giraffes", macaco: "monkeys",
        zebra: "zebras", urso: "bears", tigre: "tigers", cobra: "snakes",
        peixe: "fish", golfinho: "dolphins", polvo: "octopuses", caranguejo: "crabs",
        tartaruga: "turtles", baleia: "whales", tubarao: "sharks", lula: "squids",
      };
      const numWords = ["", "one", "two", "three", "four", "five"];
      const word = numWords[count] ?? String(count);
      const name = count === 1
        ? ({ galinha: "chicken", vaca: "cow", porco: "pig", ovelha: "sheep", cavalo: "horse", pato: "duck", coelho: "rabbit", gato: "cat", leao: "lion", elefante: "elephant", girafa: "giraffe", macaco: "monkey", zebra: "zebra", urso: "bear", tigre: "tiger", cobra: "snake", peixe: "fish", golfinho: "dolphin", polvo: "octopus", caranguejo: "crab", tartaruga: "turtle", baleia: "whale", tubarao: "shark", lula: "squid" }[animalName] ?? animalName)
        : (plurals[animalName] ?? animalName + "s");
      return `Look! We have ${word} ${name}!`;
    },
    celebrationText: (count) => `🎉 Yes! It's ${count}! Well done!`,
    celebrationSpeech: (count) => `Yes! It's ${count}! Well done!`,
  },

  es: {
    ui: {
      gameTitle: "🌻 La Granja de los Números 🌻",
      wildTitle: "🌿 Animales Salvajes 🌿",
      aquaticTitle: "🌊 Animales Acuáticos 🌊",
      subtitle: "¡Cuenta los animales y descubre el número!",
      chooseMode: "Elige tus animales:",
      domesticButton: "🐔 Animales de Granja",
      wildButton: "🦁 Animales Salvajes",
      aquaticButton: "🐬 Animales Acuáticos",
      scoreLabel: "⭐ Puntos:",
      roundLabel: "🎯 Ronda:",
      countingHint: "Contando los animales...",
      tryAgain: "¡Inténtalo de nuevo!",
      languageLabel: "Idioma",
      pwaInstallMessage: "¡Instala la app para jugar sin internet!",
      pwaInstallIosMessage: "Para instalar, toca ⬆️ Compartir y luego «Agregar a inicio».",
      pwaInstallButton: "Instalar",
    },
    animalNames: {
      galinha: "gallina", vaca: "vaca", porco: "cerdo", ovelha: "oveja",
      cavalo: "caballo", pato: "pato", coelho: "conejo", gato: "gato",
      leao: "león", elefante: "elefante", girafa: "jirafa", macaco: "mono",
      zebra: "cebra", urso: "oso", tigre: "tigre", cobra: "serpiente",
      peixe: "pez", golfinho: "delfín", polvo: "pulpo", caranguejo: "cangrejo",
      tartaruga: "tortuga", baleia: "ballena", tubarao: "tiburón", lula: "calamar",
    },
    narrateText: (count, animalName) => {
      const plurals: Record<string, string> = {
        galinha: "gallinas", vaca: "vacas", porco: "cerdos", ovelha: "ovejas",
        cavalo: "caballos", pato: "patos", coelho: "conejos", gato: "gatos",
        leao: "leones", elefante: "elefantes", girafa: "jirafas", macaco: "monos",
        zebra: "cebras", urso: "osos", tigre: "tigres", cobra: "serpientes",
        peixe: "peces", golfinho: "delfines", polvo: "pulpos", caranguejo: "cangrejos",
        tartaruga: "tortugas", baleia: "ballenas", tubarao: "tiburones", lula: "calamares",
      };
      const singulars: Record<string, string> = {
        galinha: "gallina", vaca: "vaca", porco: "cerdo", ovelha: "oveja",
        cavalo: "caballo", pato: "pato", coelho: "conejo", gato: "gato",
        leao: "león", elefante: "elefante", girafa: "jirafa", macaco: "mono",
        zebra: "cebra", urso: "oso", tigre: "tigre", cobra: "serpiente",
        peixe: "pez", golfinho: "delfín", polvo: "pulpo", caranguejo: "cangrejo",
        tartaruga: "tortuga", baleia: "ballena", tubarao: "tiburón", lula: "calamar",
      };
      const numWords = ["", "uno", "dos", "tres", "cuatro", "cinco"];
      const word = numWords[count] ?? String(count);
      const name = count === 1 ? (singulars[animalName] ?? animalName) : (plurals[animalName] ?? animalName + "s");
      return `¡Mira! ¡Tenemos ${word} ${name}!`;
    },
    celebrationText: (count) => `🎉 ¡Sí! ¡Es el ${count}! ¡Muy bien!`,
    celebrationSpeech: (count) => `¡Sí! ¡Es el ${count}! ¡Muy bien!`,
  },

  fr: {
    ui: {
      gameTitle: "🌻 La Ferme des Chiffres 🌻",
      wildTitle: "🌿 Animaux Sauvages 🌿",
      aquaticTitle: "🌊 Animaux Aquatiques 🌊",
      subtitle: "Compte les animaux et trouve le chiffre !",
      chooseMode: "Choisis tes animaux :",
      domesticButton: "🐔 Animaux de Ferme",
      wildButton: "🦁 Animaux Sauvages",
      aquaticButton: "🐬 Animaux Aquatiques",
      scoreLabel: "⭐ Points :",
      roundLabel: "🎯 Tour :",
      countingHint: "On compte les animaux...",
      tryAgain: "Essaie encore !",
      languageLabel: "Langue",
      pwaInstallMessage: "Installe l'appli pour jouer sans internet !",
      pwaInstallIosMessage: "Pour installer, appuie sur ⬆️ Partager puis «Sur l'écran d'accueil».",
      pwaInstallButton: "Installer",
    },
    animalNames: {
      galinha: "poule", vaca: "vache", porco: "cochon", ovelha: "mouton",
      cavalo: "cheval", pato: "canard", coelho: "lapin", gato: "chat",
      leao: "lion", elefante: "éléphant", girafa: "girafe", macaco: "singe",
      zebra: "zèbre", urso: "ours", tigre: "tigre", cobra: "serpent",
      peixe: "poisson", golfinho: "dauphin", polvo: "pieuvre", caranguejo: "crabe",
      tartaruga: "tortue", baleia: "baleine", tubarao: "requin", lula: "calmar",
    },
    narrateText: (count, animalName) => {
      const plurals: Record<string, string> = {
        galinha: "poules", vaca: "vaches", porco: "cochons", ovelha: "moutons",
        cavalo: "chevaux", pato: "canards", coelho: "lapins", gato: "chats",
        leao: "lions", elefante: "éléphants", girafa: "girafes", macaco: "singes",
        zebra: "zèbres", urso: "ours", tigre: "tigres", cobra: "serpents",
        peixe: "poissons", golfinho: "dauphins", polvo: "pieuvres", caranguejo: "crabes",
        tartaruga: "tortues", baleia: "baleines", tubarao: "requins", lula: "calmars",
      };
      const singulars: Record<string, string> = {
        galinha: "poule", vaca: "vache", porco: "cochon", ovelha: "mouton",
        cavalo: "cheval", pato: "canard", coelho: "lapin", gato: "chat",
        leao: "lion", elefante: "éléphant", girafa: "girafe", macaco: "singe",
        zebra: "zèbre", urso: "ours", tigre: "tigre", cobra: "serpent",
        peixe: "poisson", golfinho: "dauphin", polvo: "pieuvre", caranguejo: "crabe",
        tartaruga: "tortue", baleia: "baleine", tubarao: "requin", lula: "calmar",
      };
      const numWords = ["", "un", "deux", "trois", "quatre", "cinq"];
      const word = numWords[count] ?? String(count);
      const name = count === 1 ? (singulars[animalName] ?? animalName) : (plurals[animalName] ?? animalName + "s");
      return `Regarde ! On a ${word} ${name} !`;
    },
    celebrationText: (count) => `🎉 Oui ! C'est ${count} ! Bravo !`,
    celebrationSpeech: (count) => `Oui ! C'est ${count} ! Bravo !`,
  },

  it: {
    ui: {
      gameTitle: "🌻 La Fattoria dei Numeri 🌻",
      wildTitle: "🌿 Animali Selvatici 🌿",
      aquaticTitle: "🌊 Animali Acquatici 🌊",
      subtitle: "Conta gli animali e scopri il numero!",
      chooseMode: "Scegli i tuoi animali:",
      domesticButton: "🐔 Animali da Fattoria",
      wildButton: "🦁 Animali Selvatici",
      aquaticButton: "🐬 Animali Acquatici",
      scoreLabel: "⭐ Punti:",
      roundLabel: "🎯 Round:",
      countingHint: "Contiamo gli animali...",
      tryAgain: "Riprova!",
      languageLabel: "Lingua",
      pwaInstallMessage: "Installa l'app per giocare senza internet!",
      pwaInstallIosMessage: "Per installare, tocca ⬆️ Condividi e poi «Aggiungi alla schermata Home».",
      pwaInstallButton: "Installa",
    },
    animalNames: {
      galinha: "gallina", vaca: "mucca", porco: "maiale", ovelha: "pecora",
      cavalo: "cavallo", pato: "anatra", coelho: "coniglio", gato: "gatto",
      leao: "leone", elefante: "elefante", girafa: "giraffa", macaco: "scimmia",
      zebra: "zebra", urso: "orso", tigre: "tigre", cobra: "serpente",
      peixe: "pesce", golfinho: "delfino", polvo: "polpo", caranguejo: "granchio",
      tartaruga: "tartaruga", baleia: "balena", tubarao: "squalo", lula: "calamaro",
    },
    narrateText: (count, animalName) => {
      const plurals: Record<string, string> = {
        galinha: "galline", vaca: "mucche", porco: "maiali", ovelha: "pecore",
        cavalo: "cavalli", pato: "anatre", coelho: "conigli", gato: "gatti",
        leao: "leoni", elefante: "elefanti", girafa: "giraffe", macaco: "scimmie",
        zebra: "zebre", urso: "orsi", tigre: "tigri", cobra: "serpenti",
        peixe: "pesci", golfinho: "delfini", polvo: "polpi", caranguejo: "granchi",
        tartaruga: "tartarughe", baleia: "balene", tubarao: "squali", lula: "calamari",
      };
      const singulars: Record<string, string> = {
        galinha: "gallina", vaca: "mucca", porco: "maiale", ovelha: "pecora",
        cavalo: "cavallo", pato: "anatra", coelho: "coniglio", gato: "gatto",
        leao: "leone", elefante: "elefante", girafa: "giraffa", macaco: "scimmia",
        zebra: "zebra", urso: "orso", tigre: "tigre", cobra: "serpente",
        peixe: "pesce", golfinho: "delfino", polvo: "polpo", caranguejo: "granchio",
        tartaruga: "tartaruga", baleia: "balena", tubarao: "squalo", lula: "calamaro",
      };
      const numWords = ["", "uno", "due", "tre", "quattro", "cinque"];
      const word = numWords[count] ?? String(count);
      const name = count === 1 ? (singulars[animalName] ?? animalName) : (plurals[animalName] ?? animalName + "s");
      return `Guarda! Abbiamo ${word} ${name}!`;
    },
    celebrationText: (count) => `🎉 Sì! È ${count}! Bravo!`,
    celebrationSpeech: (count) => `Sì! È ${count}! Bravo!`,
  },

  de: {
    ui: {
      gameTitle: "🌻 Der Zahlenbauernhof 🌻",
      wildTitle: "🌿 Wilde Tiere 🌿",
      aquaticTitle: "🌊 Wassertiere 🌊",
      subtitle: "Zähle die Tiere und finde die Zahl!",
      chooseMode: "Wähle deine Tiere:",
      domesticButton: "🐔 Bauernhoftiere",
      wildButton: "🦁 Wilde Tiere",
      aquaticButton: "🐬 Wassertiere",
      scoreLabel: "⭐ Punkte:",
      roundLabel: "🎯 Runde:",
      countingHint: "Wir zählen die Tiere...",
      tryAgain: "Versuch es noch mal!",
      languageLabel: "Sprache",
      pwaInstallMessage: "Installiere die App, um offline zu spielen!",
      pwaInstallIosMessage: "Zum Installieren auf ⬆️ Teilen tippen und dann «Zum Home-Bildschirm».",
      pwaInstallButton: "Installieren",
    },
    animalNames: {
      galinha: "Huhn", vaca: "Kuh", porco: "Schwein", ovelha: "Schaf",
      cavalo: "Pferd", pato: "Ente", coelho: "Kaninchen", gato: "Katze",
      leao: "Löwe", elefante: "Elefant", girafa: "Giraffe", macaco: "Affe",
      zebra: "Zebra", urso: "Bär", tigre: "Tiger", cobra: "Schlange",
      peixe: "Fisch", golfinho: "Delphin", polvo: "Krake", caranguejo: "Krabbe",
      tartaruga: "Schildkröte", baleia: "Wal", tubarao: "Hai", lula: "Tintenfisch",
    },
    narrateText: (count, animalName) => {
      const plurals: Record<string, string> = {
        galinha: "Hühner", vaca: "Kühe", porco: "Schweine", ovelha: "Schafe",
        cavalo: "Pferde", pato: "Enten", coelho: "Kaninchen", gato: "Katzen",
        leao: "Löwen", elefante: "Elefanten", girafa: "Giraffen", macaco: "Affen",
        zebra: "Zebras", urso: "Bären", tigre: "Tiger", cobra: "Schlangen",
        peixe: "Fische", golfinho: "Delphine", polvo: "Kraken", caranguejo: "Krabben",
        tartaruga: "Schildkröten", baleia: "Wale", tubarao: "Haie", lula: "Tintenfische",
      };
      const singulars: Record<string, string> = {
        galinha: "ein Huhn", vaca: "eine Kuh", porco: "ein Schwein", ovelha: "ein Schaf",
        cavalo: "ein Pferd", pato: "eine Ente", coelho: "ein Kaninchen", gato: "eine Katze",
        leao: "einen Löwen", elefante: "einen Elefanten", girafa: "eine Giraffe", macaco: "einen Affen",
        zebra: "ein Zebra", urso: "einen Bären", tigre: "einen Tiger", cobra: "eine Schlange",
        peixe: "einen Fisch", golfinho: "einen Delphin", polvo: "einen Kraken", caranguejo: "eine Krabbe",
        tartaruga: "eine Schildkröte", baleia: "einen Wal", tubarao: "einen Hai", lula: "einen Tintenfisch",
      };
      const numWords = ["", "", "zwei", "drei", "vier", "fünf"];
      const word = numWords[count] ?? String(count);
      if (count === 1) {
        return `Schau! Wir haben ${singulars[animalName] ?? animalName}!`;
      }
      return `Schau! Wir haben ${word} ${plurals[animalName] ?? animalName + "s"}!`;
    },
    celebrationText: (count) => `🎉 Ja! Es ist die ${count}! Super!`,
    celebrationSpeech: (count) => `Ja! Es ist die ${count}! Super!`,
  },
};