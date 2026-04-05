export type Locale = "pt" | "en" | "es" | "fr" | "it" | "de";

export interface Translations {
  ui: {
    gameTitle: string;
    wildTitle: string;
    aquaticTitle: string;
    domesticTitle: string;
    easterTitle: string;
    subtitle: string;
    chooseMode: string;
    domesticButton: string;
    wildButton: string;
    aquaticButton: string;
    easterButton: string;
    scoreLabel: string;
    roundLabel: string;
    phaseLabel: string;
    phase1Name: string;
    phase2Name: string;
    countingHint: string;
    tryAgain: string;
    languageLabel: string;
    pwaInstallMessage: string;
    pwaInstallIosMessage: string;
    pwaInstallButton: string;
    phaseCompleteSpeech: string;
    phaseFailSpeech: string;
    gameCompleteSpeech: string;
    phaseCompleteText: string;
    phaseFailText: string;
    gameCompleteText: string;
    continueButton: string;
    playAgainButton: string;
  };
  animalNames: Record<string, string>;
  narrateText: (count: number, animalName: string) => string;
  celebrationText: (count: number) => string;
  celebrationSpeech: (count: number) => string;
}

export const translations: Record<Locale, Translations> = {
  pt: {
    ui: {
      gameTitle: "🔢 O Mundo dos Números 🌍",
      domesticTitle: "🌻 A Fazenda dos Números 🌻",
      wildTitle: "🌿 Selva dos Números 🌿",
      aquaticTitle: "🌊 Oceano dos Números 🌊",
      easterTitle: "🐰 Páscoa dos Números 🐰",
      subtitle: "Conte os animais e descubra o número!",
      chooseMode: "Escolha os seus animais:",
      domesticButton: "🐔 Animais da Fazenda",
      wildButton: "🦁 Animais Selvagens",
      aquaticButton: "🐙 Animais Aquáticos",
      easterButton: "🐰 Especial de Páscoa",
      scoreLabel: "⭐ Pontos:",
      roundLabel: "🎯 Número:",
      phaseLabel: "📖 Fase:",
      phase1Name: "Números em Ordem",
      phase2Name: "Números Misturados",
      countingHint: "Contando os animais...",
      tryAgain: "Tente de novo!",
      languageLabel: "Idioma",
      pwaInstallMessage: "Instale o app para jogar sem internet!",
      pwaInstallIosMessage: "Para instalar, toque em ⬆️ Compartilhar e depois em «Adicionar à Tela Inicial».",
      pwaInstallButton: "Instalar",
      phaseCompleteSpeech: "Muito bem! Você passou a fase! Vamos para a próxima!",
      phaseFailSpeech: "Ops! Não faz mal, vamos tentar de novo desde o início!",
      gameCompleteSpeech: "Parabéns! Você completou tudo! Você é um gênio dos números!",
      phaseCompleteText: "🎉 Fase completa! 🎉",
      phaseFailText: "😊 Vamos tentar de novo!",
      gameCompleteText: "🏆 Parabéns! Você completou tudo! 🏆",
      continueButton: "Próxima fase ➡️",
      playAgainButton: "Jogar de novo 🔄",
    },
    animalNames: {
      galinha: "galinha", vaca: "vaca", porco: "porco", ovelha: "ovelha",
      cavalo: "cavalo", pato: "pato", coelho: "coelho", gato: "gato",
      leao: "leão", elefante: "elefante", girafa: "girafa", macaco: "macaco",
      zebra: "zebra", urso: "urso", tigre: "tigre", cobra: "cobra",
      peixe: "peixe", golfinho: "golfinho", polvo: "polvo", caranguejo: "caranguejo",
      tartaruga: "tartaruga", baleia: "baleia", tubarao: "tubarão", lula: "lula",
      ovo: "ovo", coelhinho: "coelhinho", pintinho: "pintinho", cesta: "cesta",
      flor: "flor", borboleta: "borboleta", cenoura: "cenoura", chocolate: "chocolate",
    },
    narrateText: (count, animalName) => {
      const plurals: Record<string, string> = {
        galinha: "galinhas", vaca: "vacas", porco: "porcos", ovelha: "ovelhas",
        cavalo: "cavalos", pato: "patos", coelho: "coelhos", gato: "gatos",
        leao: "leões", elefante: "elefantes", girafa: "girafas", macaco: "macacos",
        zebra: "zebras", urso: "ursos", tigre: "tigres", cobra: "cobras",
        peixe: "peixes", golfinho: "golfinhos", polvo: "polvos", caranguejo: "caranguejos",
        tartaruga: "tartarugas", baleia: "baleias", tubarao: "tubarões", lula: "lulas",
        ovo: "ovos", coelhinho: "coelhinhos", pintinho: "pintinhos", cesta: "cestas",
        flor: "flores", borboleta: "borboletas", cenoura: "cenouras", chocolate: "chocolates",
      };
      const femAnimals = ["galinha", "vaca", "ovelha", "girafa", "zebra", "cobra", "tartaruga", "baleia", "lula", "cesta", "flor", "borboleta", "cenoura"];
      const numWordF = ["", "uma", "duas", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
      const numWordM = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
      const word = femAnimals.includes(animalName) ? (numWordF[count] ?? String(count)) : (numWordM[count] ?? String(count));
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
      gameTitle: "🔢 The Number World 🌍",
      domesticTitle: "🌻 The Number Farm 🌻",
      wildTitle: "🌿 Jungle Numbers 🌿",
      aquaticTitle: "🌊 Ocean Numbers 🌊",
      easterTitle: "🐰 Easter Numbers 🐰",
      subtitle: "Count the animals and find the number!",
      chooseMode: "Choose your animals:",
      domesticButton: "🐔 Farm Animals",
      wildButton: "🦁 Wild Animals",
      aquaticButton: "🐙 Aquatic Animals",
      easterButton: "🐰 Easter Special",
      scoreLabel: "⭐ Score:",
      roundLabel: "🎯 Number:",
      phaseLabel: "📖 Phase:",
      phase1Name: "Numbers in Order",
      phase2Name: "Mixed Numbers",
      countingHint: "Counting the animals...",
      tryAgain: "Try again!",
      languageLabel: "Language",
      pwaInstallMessage: "Install the app to play offline!",
      pwaInstallIosMessage: "To install, tap ⬆️ Share and then «Add to Home Screen».",
      pwaInstallButton: "Install",
      phaseCompleteSpeech: "Well done! You passed the phase! Let's go to the next one!",
      phaseFailSpeech: "Oops! That's okay, let's try again from the start!",
      gameCompleteSpeech: "Congratulations! You completed everything! You're a number genius!",
      phaseCompleteText: "🎉 Phase complete! 🎉",
      phaseFailText: "😊 Let's try again!",
      gameCompleteText: "🏆 Congratulations! You did it! 🏆",
      continueButton: "Next phase ➡️",
      playAgainButton: "Play again 🔄",
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
      const singulars: Record<string, string> = {
        galinha: "chicken", vaca: "cow", porco: "pig", ovelha: "sheep",
        cavalo: "horse", pato: "duck", coelho: "rabbit", gato: "cat",
        leao: "lion", elefante: "elephant", girafa: "giraffe", macaco: "monkey",
        zebra: "zebra", urso: "bear", tigre: "tiger", cobra: "snake",
        peixe: "fish", golfinho: "dolphin", polvo: "octopus", caranguejo: "crab",
        tartaruga: "turtle", baleia: "whale", tubarao: "shark", lula: "squid",
      };
      const numWords = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
      const word = numWords[count] ?? String(count);
      const name = count === 1 ? (singulars[animalName] ?? animalName) : (plurals[animalName] ?? animalName + "s");
      return `Look! We have ${word} ${name}!`;
    },
    celebrationText: (count) => `🎉 Yes! It's ${count}! Well done!`,
    celebrationSpeech: (count) => `Yes! It's ${count}! Well done!`,
  },

  es: {
    ui: {
      gameTitle: "🔢 El Mundo de los Números 🌍",
      domesticTitle: "🌻 La Granja de los Números 🌻",
      wildTitle: "🌿 Selva de los Números 🌿",
      aquaticTitle: "🌊 Océano de los Números 🌊",
      easterTitle: "🐰 Pascua de los Números 🐰",
      subtitle: "¡Cuenta los animales y descubre el número!",
      chooseMode: "Elige tus animales:",
      domesticButton: "🐔 Animales de Granja",
      wildButton: "🦁 Animales Salvajes",
      aquaticButton: "🐙 Animales Acuáticos",
      easterButton: "🐰 Especial de Pascua",
      scoreLabel: "⭐ Puntos:",
      roundLabel: "🎯 Número:",
      phaseLabel: "📖 Fase:",
      phase1Name: "Números en Orden",
      phase2Name: "Números Mezclados",
      countingHint: "Contando los animales...",
      tryAgain: "¡Inténtalo de nuevo!",
      languageLabel: "Idioma",
      pwaInstallMessage: "¡Instala la app para jugar sin internet!",
      pwaInstallIosMessage: "Para instalar, toca ⬆️ Compartir y luego «Agregar a inicio».",
      pwaInstallButton: "Instalar",
      phaseCompleteSpeech: "¡Muy bien! ¡Pasaste la fase! ¡Vamos a la siguiente!",
      phaseFailSpeech: "¡Ups! ¡No pasa nada, intentemos de nuevo desde el inicio!",
      gameCompleteSpeech: "¡Felicidades! ¡Completaste todo! ¡Eres un genio de los números!",
      phaseCompleteText: "🎉 ¡Fase completa! 🎉",
      phaseFailText: "😊 ¡Intentemos de nuevo!",
      gameCompleteText: "🏆 ¡Felicidades! ¡Lo lograste! 🏆",
      continueButton: "Siguiente fase ➡️",
      playAgainButton: "Jugar de nuevo 🔄",
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
      const numWords = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
      const word = numWords[count] ?? String(count);
      const name = count === 1 ? (singulars[animalName] ?? animalName) : (plurals[animalName] ?? animalName + "s");
      return `¡Mira! ¡Tenemos ${word} ${name}!`;
    },
    celebrationText: (count) => `🎉 ¡Sí! ¡Es el ${count}! ¡Muy bien!`,
    celebrationSpeech: (count) => `¡Sí! ¡Es el ${count}! ¡Muy bien!`,
  },

  fr: {
    ui: {
      gameTitle: "🔢 Le Monde des Chiffres 🌍",
      domesticTitle: "🌻 La Ferme des Chiffres 🌻",
      wildTitle: "🌿 Jungle des Chiffres 🌿",
      aquaticTitle: "🌊 Océan des Chiffres 🌊",
      easterTitle: "🐰 Pâques des Chiffres 🐰",
      subtitle: "Compte les animaux et trouve le chiffre !",
      chooseMode: "Choisis tes animaux :",
      domesticButton: "🐔 Animaux de Ferme",
      wildButton: "🦁 Animaux Sauvages",
      aquaticButton: "🐙 Animaux Aquatiques",
      easterButton: "🐰 Spécial Pâques",
      scoreLabel: "⭐ Points :",
      roundLabel: "🎯 Numéro :",
      phaseLabel: "📖 Phase :",
      phase1Name: "Chiffres en Ordre",
      phase2Name: "Chiffres Mélangés",
      countingHint: "On compte les animaux...",
      tryAgain: "Essaie encore !",
      languageLabel: "Langue",
      pwaInstallMessage: "Installe l'appli pour jouer sans internet !",
      pwaInstallIosMessage: "Pour installer, appuie sur ⬆️ Partager puis «Sur l'écran d'accueil».",
      pwaInstallButton: "Installer",
      phaseCompleteSpeech: "Bravo ! Tu as réussi la phase ! Passons à la suivante !",
      phaseFailSpeech: "Oups ! Ce n'est pas grave, recommençons depuis le début !",
      gameCompleteSpeech: "Félicitations ! Tu as tout réussi ! Tu es un génie des chiffres !",
      phaseCompleteText: "🎉 Phase réussie ! 🎉",
      phaseFailText: "😊 On recommence !",
      gameCompleteText: "🏆 Félicitations ! Tu as réussi ! 🏆",
      continueButton: "Phase suivante ➡️",
      playAgainButton: "Rejouer 🔄",
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
      const numWords = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
      const word = numWords[count] ?? String(count);
      const name = count === 1 ? (singulars[animalName] ?? animalName) : (plurals[animalName] ?? animalName + "s");
      return `Regarde ! On a ${word} ${name} !`;
    },
    celebrationText: (count) => `🎉 Oui ! C'est ${count} ! Bravo !`,
    celebrationSpeech: (count) => `Oui ! C'est ${count} ! Bravo !`,
  },

  it: {
    ui: {
      gameTitle: "🔢 Il Mondo dei Numeri 🌍",
      domesticTitle: "🌻 La Fattoria dei Numeri 🌻",
      wildTitle: "🌿 Giungla dei Numeri 🌿",
      aquaticTitle: "🌊 Oceano dei Numeri 🌊",
      easterTitle: "🐰 Pasqua dei Numeri 🐰",
      subtitle: "Conta gli animali e scopri il numero!",
      chooseMode: "Scegli i tuoi animali:",
      domesticButton: "🐔 Animali da Fattoria",
      wildButton: "🦁 Animali Selvatici",
      aquaticButton: "🐙 Animali Acquatici",
      scoreLabel: "⭐ Punti:",
      roundLabel: "🎯 Numero:",
      phaseLabel: "📖 Fase:",
      phase1Name: "Numeri in Ordine",
      phase2Name: "Numeri Mescolati",
      countingHint: "Contiamo gli animali...",
      tryAgain: "Riprova!",
      languageLabel: "Lingua",
      pwaInstallMessage: "Installa l'app per giocare senza internet!",
      pwaInstallIosMessage: "Per installare, tocca ⬆️ Condividi e poi «Aggiungi alla schermata Home».",
      pwaInstallButton: "Installa",
      phaseCompleteSpeech: "Bravo! Hai superato la fase! Passiamo alla prossima!",
      phaseFailSpeech: "Ops! Non fa niente, riproviamo dall'inizio!",
      gameCompleteSpeech: "Complimenti! Hai completato tutto! Sei un genio dei numeri!",
      phaseCompleteText: "🎉 Fase completata! 🎉",
      phaseFailText: "😊 Riproviamo!",
      gameCompleteText: "🏆 Complimenti! Ce l'hai fatta! 🏆",
      continueButton: "Fase successiva ➡️",
      playAgainButton: "Gioca ancora 🔄",
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
      const numWords = ["", "uno", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove"];
      const word = numWords[count] ?? String(count);
      const name = count === 1 ? (singulars[animalName] ?? animalName) : (plurals[animalName] ?? animalName + "s");
      return `Guarda! Abbiamo ${word} ${name}!`;
    },
    celebrationText: (count) => `🎉 Sì! È ${count}! Bravo!`,
    celebrationSpeech: (count) => `Sì! È ${count}! Bravo!`,
  },

  de: {
    ui: {
      gameTitle: "🔢 Die Welt der Zahlen 🌍",
      domesticTitle: "🌻 Der Zahlenbauernhof 🌻",
      wildTitle: "🌿 Dschungel der Zahlen 🌿",
      aquaticTitle: "🌊 Ozean der Zahlen 🌊",
      subtitle: "Zähle die Tiere und finde die Zahl!",
      chooseMode: "Wähle deine Tiere:",
      domesticButton: "🐔 Bauernhoftiere",
      wildButton: "🦁 Wilde Tiere",
      aquaticButton: "🐙 Wassertiere",
      scoreLabel: "⭐ Punkte:",
      roundLabel: "🎯 Nummer:",
      phaseLabel: "📖 Phase:",
      phase1Name: "Zahlen der Reihe nach",
      phase2Name: "Gemischte Zahlen",
      countingHint: "Wir zählen die Tiere...",
      tryAgain: "Versuch es noch mal!",
      languageLabel: "Sprache",
      pwaInstallMessage: "Installiere die App, um offline zu spielen!",
      pwaInstallIosMessage: "Zum Installieren auf ⬆️ Teilen tippen und dann «Zum Home-Bildschirm».",
      pwaInstallButton: "Installieren",
      phaseCompleteSpeech: "Super! Du hast die Phase geschafft! Weiter zur nächsten!",
      phaseFailSpeech: "Ups! Macht nichts, versuchen wir es nochmal von vorne!",
      gameCompleteSpeech: "Herzlichen Glückwunsch! Du hast alles geschafft! Du bist ein Zahlengenie!",
      phaseCompleteText: "🎉 Phase geschafft! 🎉",
      phaseFailText: "😊 Nochmal versuchen!",
      gameCompleteText: "🏆 Herzlichen Glückwunsch! Geschafft! 🏆",
      continueButton: "Nächste Phase ➡️",
      playAgainButton: "Nochmal spielen 🔄",
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
      const numWords = ["", "", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"];
      if (count === 1) {
        return `Schau! Wir haben ${singulars[animalName] ?? animalName}!`;
      }
      const word = numWords[count] ?? String(count);
      return `Schau! Wir haben ${word} ${plurals[animalName] ?? animalName + "s"}!`;
    },
    celebrationText: (count) => `🎉 Ja! Es ist die ${count}! Super!`,
    celebrationSpeech: (count) => `Ja! Es ist die ${count}! Super!`,
  },
};
