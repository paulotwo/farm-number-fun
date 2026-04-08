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
    phase3Name: string;
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
    shareButton: string;
    shareText: string;
    trainWagonIntro: string;
    trainCountPrompt: (count: number) => string;
    trainCorrectSpeech: (count: number) => string;
    trainNextWagon: string;
    trainAllDone: string;
    trainExitSpeech: string;
    skipPhase: string;
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
      phase3Name: "O Trem dos Números",
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
      shareButton: "Compartilhar 📤",
      shareText: "Venha aprender números com animais! 🐄🔢",
      trainWagonIntro: "Olha o trem! Conte os animais no vagão!",
      trainCountPrompt: (count) => count === 1 ? "Quantos animais tem no vagão? Tem um!" : `Quantos animais tem no vagão? Tem ${count}!`,
      trainCorrectSpeech: (count) => count === 1 ? "Isso mesmo! É o número um!" : `Isso mesmo! É o número ${count}!`,
      trainNextWagon: "Muito bem! Vamos ver o próximo vagão!",
      trainAllDone: "O trem está completo! Todos os vagões estão numerados!",
      trainExitSpeech: "Parabéns! Você completou o trem dos números! Você é demais!",
      skipPhase: "Pular ⏭",
    },
    animalNames: {
      galinha: "galinha", vaca: "vaca", porco: "porco", ovelha: "ovelha",
      cavalo: "cavalo", pato: "pato", coelho: "coelho", gato: "gato",
      cachorro: "cachorro", burro: "burro", peru: "peru", cabra: "cabra",
      ganso: "ganso", hamster: "hamster", papagaio: "papagaio", ponei: "pônei",
      leao: "leão", elefante: "elefante", girafa: "girafa", macaco: "macaco",
      zebra: "zebra", urso: "urso", tigre: "tigre", cobra: "cobra",
      panda: "panda", hipopotamo: "hipopótamo", canguru: "canguru", koala: "coala",
      preguica: "preguiça", raposa: "raposa", coruja: "coruja", camaleao: "camaleão",
      peixe: "peixe", golfinho: "golfinho", polvo: "polvo", caranguejo: "caranguejo",
      tartaruga: "tartaruga", baleia: "baleia", tubarao: "tubarão", lula: "lula",
      cavalo_marinho: "cavalo-marinho", foca: "foca", pinguim: "pinguim", arraia: "arraia",
      morsa: "morsa", lontra: "lontra", estrela_do_mar: "estrela-do-mar", lagosta: "lagosta",
      ovo: "ovo", coelhinho: "coelhinho", pintinho: "pintinho", cesta: "cesta",
      flor: "flor", borboleta: "borboleta", cenoura: "cenoura", chocolate: "chocolate",
    },
    narrateText: (count, animalName) => {
      const plurals: Record<string, string> = {
        galinha: "galinhas", vaca: "vacas", porco: "porcos", ovelha: "ovelhas",
        cavalo: "cavalos", pato: "patos", coelho: "coelhos", gato: "gatos",
        cachorro: "cachorros", burro: "burros", peru: "perus", cabra: "cabras",
        ganso: "gansos", hamster: "hamsters", papagaio: "papagaios", ponei: "pôneis",
        leao: "leões", elefante: "elefantes", girafa: "girafas", macaco: "macacos",
        zebra: "zebras", urso: "ursos", tigre: "tigres", cobra: "cobras",
        panda: "pandas", hipopotamo: "hipopótamos", canguru: "cangurus", koala: "coalas",
        preguica: "preguiças", raposa: "raposas", coruja: "corujas", camaleao: "camaleões",
        peixe: "peixes", golfinho: "golfinhos", polvo: "polvos", caranguejo: "caranguejos",
        tartaruga: "tartarugas", baleia: "baleias", tubarao: "tubarões", lula: "lulas",
        cavalo_marinho: "cavalos-marinhos", foca: "focas", pinguim: "pinguins", arraia: "arraias",
        morsa: "morsas", lontra: "lontras", estrela_do_mar: "estrelas-do-mar", lagosta: "lagostas",
        ovo: "ovos", coelhinho: "coelhinhos", pintinho: "pintinhos", cesta: "cestas",
        flor: "flores", borboleta: "borboletas", cenoura: "cenouras", chocolate: "chocolates",
      };
      const femAnimals = ["galinha", "vaca", "ovelha", "cabra", "girafa", "zebra", "cobra", "raposa", "coruja", "preguica", "tartaruga", "baleia", "lula", "foca", "arraia", "morsa", "lontra", "estrela_do_mar", "lagosta", "cesta", "flor", "borboleta", "cenoura"];
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
      phase3Name: "The Number Train",
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
      shareButton: "Share 📤",
      shareText: "Come learn numbers with animals! 🐄🔢",
      trainWagonIntro: "Look at the train! Count the animals in the wagon!",
      trainCountPrompt: (count) => `How many animals are in the wagon? There ${count === 1 ? "is one" : `are ${count}`}!`,
      trainCorrectSpeech: (count) => `That's right! It's number ${count}!`,
      trainNextWagon: "Great job! Let's see the next wagon!",
      trainAllDone: "The train is complete! All wagons are numbered!",
      trainExitSpeech: "Congratulations! You completed the number train! You're amazing!",
      skipPhase: "Skip ⏭",
    },
    animalNames: {
      galinha: "chicken", vaca: "cow", porco: "pig", ovelha: "sheep",
      cavalo: "horse", pato: "duck", coelho: "rabbit", gato: "cat",
      cachorro: "dog", burro: "donkey", peru: "turkey", cabra: "goat",
      ganso: "goose", hamster: "hamster", papagaio: "parrot", ponei: "pony",
      leao: "lion", elefante: "elephant", girafa: "giraffe", macaco: "monkey",
      zebra: "zebra", urso: "bear", tigre: "tiger", cobra: "snake",
      panda: "panda", hipopotamo: "hippo", canguru: "kangaroo", koala: "koala",
      preguica: "sloth", raposa: "fox", coruja: "owl", camaleao: "chameleon",
      peixe: "fish", golfinho: "dolphin", polvo: "octopus", caranguejo: "crab",
      tartaruga: "turtle", baleia: "whale", tubarao: "shark", lula: "squid",
      cavalo_marinho: "seahorse", foca: "seal", pinguim: "penguin", arraia: "stingray",
      morsa: "walrus", lontra: "otter", estrela_do_mar: "starfish", lagosta: "lobster",
      ovo: "egg", coelhinho: "bunny", pintinho: "chick", cesta: "basket",
      flor: "flower", borboleta: "butterfly", cenoura: "carrot", chocolate: "chocolate",
    },
    narrateText: (count, animalName) => {
      const plurals: Record<string, string> = {
        galinha: "chickens", vaca: "cows", porco: "pigs", ovelha: "sheep",
        cavalo: "horses", pato: "ducks", coelho: "rabbits", gato: "cats",
        cachorro: "dogs", burro: "donkeys", peru: "turkeys", cabra: "goats",
        ganso: "geese", hamster: "hamsters", papagaio: "parrots", ponei: "ponies",
        leao: "lions", elefante: "elephants", girafa: "giraffes", macaco: "monkeys",
        zebra: "zebras", urso: "bears", tigre: "tigers", cobra: "snakes",
        panda: "pandas", hipopotamo: "hippos", canguru: "kangaroos", koala: "koalas",
        preguica: "sloths", raposa: "foxes", coruja: "owls", camaleao: "chameleons",
        peixe: "fish", golfinho: "dolphins", polvo: "octopuses", caranguejo: "crabs",
        tartaruga: "turtles", baleia: "whales", tubarao: "sharks", lula: "squids",
        cavalo_marinho: "seahorses", foca: "seals", pinguim: "penguins", arraia: "stingrays",
        morsa: "walruses", lontra: "otters", estrela_do_mar: "starfish", lagosta: "lobsters",
        ovo: "eggs", coelhinho: "bunnies", pintinho: "chicks", cesta: "baskets",
        flor: "flowers", borboleta: "butterflies", cenoura: "carrots", chocolate: "chocolates",
      };
      const singulars: Record<string, string> = {
        galinha: "chicken", vaca: "cow", porco: "pig", ovelha: "sheep",
        cavalo: "horse", pato: "duck", coelho: "rabbit", gato: "cat",
        cachorro: "dog", burro: "donkey", peru: "turkey", cabra: "goat",
        ganso: "goose", hamster: "hamster", papagaio: "parrot", ponei: "pony",
        leao: "lion", elefante: "elephant", girafa: "giraffe", macaco: "monkey",
        zebra: "zebra", urso: "bear", tigre: "tiger", cobra: "snake",
        panda: "panda", hipopotamo: "hippo", canguru: "kangaroo", koala: "koala",
        preguica: "sloth", raposa: "fox", coruja: "owl", camaleao: "chameleon",
        peixe: "fish", golfinho: "dolphin", polvo: "octopus", caranguejo: "crab",
        tartaruga: "turtle", baleia: "whale", tubarao: "shark", lula: "squid",
        cavalo_marinho: "seahorse", foca: "seal", pinguim: "penguin", arraia: "stingray",
        morsa: "walrus", lontra: "otter", estrela_do_mar: "starfish", lagosta: "lobster",
        ovo: "egg", coelhinho: "bunny", pintinho: "chick", cesta: "basket",
        flor: "flower", borboleta: "butterfly", cenoura: "carrot", chocolate: "chocolate",
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
      phase3Name: "El Tren de los Números",
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
      shareButton: "Compartir 📤",
      shareText: "¡Ven a aprender números con animales! 🐄🔢",
      trainWagonIntro: "¡Mira el tren! ¡Cuenta los animales en el vagón!",
      trainCountPrompt: (count) => `¿Cuántos animales hay en el vagón? ¡Hay ${count}!`,
      trainCorrectSpeech: (count) => `¡Correcto! ¡Es el número ${count}!`,
      trainNextWagon: "¡Muy bien! ¡Veamos el siguiente vagón!",
      trainAllDone: "¡El tren está completo! ¡Todos los vagones tienen número!",
      trainExitSpeech: "¡Felicidades! ¡Completaste el tren de los números! ¡Eres increíble!",
      skipPhase: "Saltar ⏭",
    },
    animalNames: {
      galinha: "gallina", vaca: "vaca", porco: "cerdo", ovelha: "oveja",
      cavalo: "caballo", pato: "pato", coelho: "conejo", gato: "gato",
      cachorro: "perro", burro: "burro", peru: "pavo", cabra: "cabra",
      ganso: "ganso", hamster: "hámster", papagaio: "loro", ponei: "poni",
      leao: "león", elefante: "elefante", girafa: "jirafa", macaco: "mono",
      zebra: "cebra", urso: "oso", tigre: "tigre", cobra: "serpiente",
      panda: "panda", hipopotamo: "hipopótamo", canguru: "canguro", koala: "koala",
      preguica: "perezoso", raposa: "zorro", coruja: "búho", camaleao: "camaleón",
      peixe: "pez", golfinho: "delfín", polvo: "pulpo", caranguejo: "cangrejo",
      tartaruga: "tortuga", baleia: "ballena", tubarao: "tiburón", lula: "calamar",
      cavalo_marinho: "caballito de mar", foca: "foca", pinguim: "pingüino", arraia: "raya",
      morsa: "morsa", lontra: "nutria", estrela_do_mar: "estrella de mar", lagosta: "langosta",
      ovo: "huevo", coelhinho: "conejito", pintinho: "pollito", cesta: "cesta",
      flor: "flor", borboleta: "mariposa", cenoura: "zanahoria", chocolate: "chocolate",
    },
    narrateText: (count, animalName) => {
      const plurals: Record<string, string> = {
        galinha: "gallinas", vaca: "vacas", porco: "cerdos", ovelha: "ovejas",
        cavalo: "caballos", pato: "patos", coelho: "conejos", gato: "gatos",
        cachorro: "perros", burro: "burros", peru: "pavos", cabra: "cabras",
        ganso: "gansos", hamster: "hámsters", papagaio: "loros", ponei: "ponis",
        leao: "leones", elefante: "elefantes", girafa: "jirafas", macaco: "monos",
        zebra: "cebras", urso: "osos", tigre: "tigres", cobra: "serpientes",
        panda: "pandas", hipopotamo: "hipopótamos", canguru: "canguros", koala: "koalas",
        preguica: "perezosos", raposa: "zorros", coruja: "búhos", camaleao: "camaleones",
        peixe: "peces", golfinho: "delfines", polvo: "pulpos", caranguejo: "cangrejos",
        tartaruga: "tortugas", baleia: "ballenas", tubarao: "tiburones", lula: "calamares",
        cavalo_marinho: "caballitos de mar", foca: "focas", pinguim: "pingüinos", arraia: "rayas",
        morsa: "morsas", lontra: "nutrias", estrela_do_mar: "estrellas de mar", lagosta: "langostas",
        ovo: "huevos", coelhinho: "conejitos", pintinho: "pollitos", cesta: "cestas",
        flor: "flores", borboleta: "mariposas", cenoura: "zanahorias", chocolate: "chocolates",
      };
      const singulars: Record<string, string> = {
        galinha: "gallina", vaca: "vaca", porco: "cerdo", ovelha: "oveja",
        cavalo: "caballo", pato: "pato", coelho: "conejo", gato: "gato",
        cachorro: "perro", burro: "burro", peru: "pavo", cabra: "cabra",
        ganso: "ganso", hamster: "hámster", papagaio: "loro", ponei: "poni",
        leao: "león", elefante: "elefante", girafa: "jirafa", macaco: "mono",
        zebra: "cebra", urso: "oso", tigre: "tigre", cobra: "serpiente",
        panda: "panda", hipopotamo: "hipopótamo", canguru: "canguro", koala: "koala",
        preguica: "perezoso", raposa: "zorro", coruja: "búho", camaleao: "camaleón",
        peixe: "pez", golfinho: "delfín", polvo: "pulpo", caranguejo: "cangrejo",
        tartaruga: "tortuga", baleia: "ballena", tubarao: "tiburón", lula: "calamar",
        cavalo_marinho: "caballito de mar", foca: "foca", pinguim: "pingüino", arraia: "raya",
        morsa: "morsa", lontra: "nutria", estrela_do_mar: "estrella de mar", lagosta: "langosta",
        ovo: "huevo", coelhinho: "conejito", pintinho: "pollito", cesta: "cesta",
        flor: "flor", borboleta: "mariposa", cenoura: "zanahoria", chocolate: "chocolate",
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
      phase3Name: "Le Train des Chiffres",
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
      shareButton: "Partager 📤",
      shareText: "Viens apprendre les chiffres avec des animaux ! 🐄🔢",
      trainWagonIntro: "Regarde le train ! Compte les animaux dans le wagon !",
      trainCountPrompt: (count) => `Combien d'animaux dans le wagon ? Il y en a ${count} !`,
      trainCorrectSpeech: (count) => `C'est ça ! C'est le numéro ${count} !`,
      trainNextWagon: "Bravo ! Voyons le prochain wagon !",
      trainAllDone: "Le train est complet ! Tous les wagons ont un numéro !",
      trainExitSpeech: "Félicitations ! Tu as complété le train des chiffres ! Tu es super !",
      skipPhase: "Passer ⏭",
    },
    animalNames: {
      galinha: "poule", vaca: "vache", porco: "cochon", ovelha: "mouton",
      cavalo: "cheval", pato: "canard", coelho: "lapin", gato: "chat",
      cachorro: "chien", burro: "âne", peru: "dindon", cabra: "chèvre",
      ganso: "oie", hamster: "hamster", papagaio: "perroquet", ponei: "poney",
      leao: "lion", elefante: "éléphant", girafa: "girafe", macaco: "singe",
      zebra: "zèbre", urso: "ours", tigre: "tigre", cobra: "serpent",
      panda: "panda", hipopotamo: "hippopotame", canguru: "kangourou", koala: "koala",
      preguica: "paresseux", raposa: "renard", coruja: "hibou", camaleao: "caméléon",
      peixe: "poisson", golfinho: "dauphin", polvo: "pieuvre", caranguejo: "crabe",
      tartaruga: "tortue", baleia: "baleine", tubarao: "requin", lula: "calmar",
      cavalo_marinho: "hippocampe", foca: "phoque", pinguim: "pingouin", arraia: "raie",
      morsa: "morse", lontra: "loutre", estrela_do_mar: "étoile de mer", lagosta: "homard",
      ovo: "œuf", coelhinho: "lapin", pintinho: "poussin", cesta: "panier",
      flor: "fleur", borboleta: "papillon", cenoura: "carotte", chocolate: "chocolat",
    },
    narrateText: (count, animalName) => {
      const plurals: Record<string, string> = {
        galinha: "poules", vaca: "vaches", porco: "cochons", ovelha: "moutons",
        cavalo: "chevaux", pato: "canards", coelho: "lapins", gato: "chats",
        cachorro: "chiens", burro: "ânes", peru: "dindons", cabra: "chèvres",
        ganso: "oies", hamster: "hamsters", papagaio: "perroquets", ponei: "poneys",
        leao: "lions", elefante: "éléphants", girafa: "girafes", macaco: "singes",
        zebra: "zèbres", urso: "ours", tigre: "tigres", cobra: "serpents",
        panda: "pandas", hipopotamo: "hippopotames", canguru: "kangourous", koala: "koalas",
        preguica: "paresseux", raposa: "renards", coruja: "hiboux", camaleao: "caméléons",
        peixe: "poissons", golfinho: "dauphins", polvo: "pieuvres", caranguejo: "crabes",
        tartaruga: "tortues", baleia: "baleines", tubarao: "requins", lula: "calmars",
        cavalo_marinho: "hippocampes", foca: "phoques", pinguim: "pingouins", arraia: "raies",
        morsa: "morses", lontra: "loutres", estrela_do_mar: "étoiles de mer", lagosta: "homards",
        ovo: "œufs", coelhinho: "lapins", pintinho: "poussins", cesta: "paniers",
        flor: "fleurs", borboleta: "papillons", cenoura: "carottes", chocolate: "chocolats",
      };
      const singulars: Record<string, string> = {
        galinha: "poule", vaca: "vache", porco: "cochon", ovelha: "mouton",
        cavalo: "cheval", pato: "canard", coelho: "lapin", gato: "chat",
        cachorro: "chien", burro: "âne", peru: "dindon", cabra: "chèvre",
        ganso: "oie", hamster: "hamster", papagaio: "perroquet", ponei: "poney",
        leao: "lion", elefante: "éléphant", girafa: "girafe", macaco: "singe",
        zebra: "zèbre", urso: "ours", tigre: "tigre", cobra: "serpent",
        panda: "panda", hipopotamo: "hippopotame", canguru: "kangourou", koala: "koala",
        preguica: "paresseux", raposa: "renard", coruja: "hibou", camaleao: "caméléon",
        peixe: "poisson", golfinho: "dauphin", polvo: "pieuvre", caranguejo: "crabe",
        tartaruga: "tortue", baleia: "baleine", tubarao: "requin", lula: "calmar",
        cavalo_marinho: "hippocampe", foca: "phoque", pinguim: "pingouin", arraia: "raie",
        morsa: "morse", lontra: "loutre", estrela_do_mar: "étoile de mer", lagosta: "homard",
        ovo: "œuf", coelhinho: "lapin", pintinho: "poussin", cesta: "panier",
        flor: "fleur", borboleta: "papillon", cenoura: "carotte", chocolate: "chocolat",
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
      easterButton: "🐰 Speciale Pasqua",
      scoreLabel: "⭐ Punti:",
      roundLabel: "🎯 Numero:",
      phaseLabel: "📖 Fase:",
      phase1Name: "Numeri in Ordine",
      phase2Name: "Numeri Mescolati",
      phase3Name: "Il Treno dei Numeri",
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
      shareButton: "Condividi 📤",
      shareText: "Vieni a imparare i numeri con gli animali! 🐄🔢",
      trainWagonIntro: "Guarda il treno! Conta gli animali nel vagone!",
      trainCountPrompt: (count) => `Quanti animali ci sono nel vagone? Ce ne sono ${count}!`,
      trainCorrectSpeech: (count) => `Esatto! È il numero ${count}!`,
      trainNextWagon: "Bravo! Vediamo il prossimo vagone!",
      trainAllDone: "Il treno è completo! Tutti i vagoni hanno un numero!",
      trainExitSpeech: "Complimenti! Hai completato il treno dei numeri! Sei fantastico!",
      skipPhase: "Salta ⏭",
    },
    animalNames: {
      galinha: "gallina", vaca: "mucca", porco: "maiale", ovelha: "pecora",
      cavalo: "cavallo", pato: "anatra", coelho: "coniglio", gato: "gatto",
      cachorro: "cane", burro: "asino", peru: "tacchino", cabra: "capra",
      ganso: "oca", hamster: "criceto", papagaio: "pappagallo", ponei: "pony",
      leao: "leone", elefante: "elefante", girafa: "giraffa", macaco: "scimmia",
      zebra: "zebra", urso: "orso", tigre: "tigre", cobra: "serpente",
      panda: "panda", hipopotamo: "ippopotamo", canguru: "canguro", koala: "koala",
      preguica: "bradipo", raposa: "volpe", coruja: "gufo", camaleao: "camaleonte",
      peixe: "pesce", golfinho: "delfino", polvo: "polpo", caranguejo: "granchio",
      tartaruga: "tartaruga", baleia: "balena", tubarao: "squalo", lula: "calamaro",
      cavalo_marinho: "cavalluccio marino", foca: "foca", pinguim: "pinguino", arraia: "razza",
      morsa: "tricheco", lontra: "lontra", estrela_do_mar: "stella marina", lagosta: "aragosta",
      ovo: "uovo", coelhinho: "coniglietto", pintinho: "pulcino", cesta: "cestino",
      flor: "fiore", borboleta: "farfalla", cenoura: "carota", chocolate: "cioccolato",
    },
    narrateText: (count, animalName) => {
      const plurals: Record<string, string> = {
        galinha: "galline", vaca: "mucche", porco: "maiali", ovelha: "pecore",
        cavalo: "cavalli", pato: "anatre", coelho: "conigli", gato: "gatti",
        cachorro: "cani", burro: "asini", peru: "tacchini", cabra: "capre",
        ganso: "oche", hamster: "criceti", papagaio: "pappagalli", ponei: "pony",
        leao: "leoni", elefante: "elefanti", girafa: "giraffe", macaco: "scimmie",
        zebra: "zebre", urso: "orsi", tigre: "tigri", cobra: "serpenti",
        panda: "panda", hipopotamo: "ippopotami", canguru: "canguri", koala: "koala",
        preguica: "bradipi", raposa: "volpi", coruja: "gufi", camaleao: "camaleonti",
        peixe: "pesci", golfinho: "delfini", polvo: "polpi", caranguejo: "granchi",
        tartaruga: "tartarughe", baleia: "balene", tubarao: "squali", lula: "calamari",
        cavalo_marinho: "cavallucci marini", foca: "foche", pinguim: "pinguini", arraia: "razze",
        morsa: "trichechi", lontra: "lontre", estrela_do_mar: "stelle marine", lagosta: "aragoste",
        ovo: "uova", coelhinho: "coniglietti", pintinho: "pulcini", cesta: "cestini",
        flor: "fiori", borboleta: "farfalle", cenoura: "carote", chocolate: "cioccolati",
      };
      const singulars: Record<string, string> = {
        galinha: "gallina", vaca: "mucca", porco: "maiale", ovelha: "pecora",
        cavalo: "cavallo", pato: "anatra", coelho: "coniglio", gato: "gatto",
        cachorro: "cane", burro: "asino", peru: "tacchino", cabra: "capra",
        ganso: "oca", hamster: "criceto", papagaio: "pappagallo", ponei: "pony",
        leao: "leone", elefante: "elefante", girafa: "giraffa", macaco: "scimmia",
        zebra: "zebra", urso: "orso", tigre: "tigre", cobra: "serpente",
        panda: "panda", hipopotamo: "ippopotamo", canguru: "canguro", koala: "koala",
        preguica: "bradipo", raposa: "volpe", coruja: "gufo", camaleao: "camaleonte",
        peixe: "pesce", golfinho: "delfino", polvo: "polpo", caranguejo: "granchio",
        tartaruga: "tartaruga", baleia: "balena", tubarao: "squalo", lula: "calamaro",
        cavalo_marinho: "cavalluccio marino", foca: "foca", pinguim: "pinguino", arraia: "razza",
        morsa: "tricheco", lontra: "lontra", estrela_do_mar: "stella marina", lagosta: "aragosta",
        ovo: "uovo", coelhinho: "coniglietto", pintinho: "pulcino", cesta: "cestino",
        flor: "fiore", borboleta: "farfalla", cenoura: "carota", chocolate: "cioccolato",
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
      easterTitle: "🐰 Ostern der Zahlen 🐰",
      subtitle: "Zähle die Tiere und finde die Zahl!",
      chooseMode: "Wähle deine Tiere:",
      domesticButton: "🐔 Bauernhoftiere",
      wildButton: "🦁 Wilde Tiere",
      aquaticButton: "🐙 Wassertiere",
      easterButton: "🐰 Ostern Spezial",
      scoreLabel: "⭐ Punkte:",
      roundLabel: "🎯 Nummer:",
      phaseLabel: "📖 Phase:",
      phase1Name: "Zahlen der Reihe nach",
      phase2Name: "Gemischte Zahlen",
      phase3Name: "Der Zahlenzug",
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
      shareButton: "Teilen 📤",
      shareText: "Komm und lerne Zahlen mit Tieren! 🐄🔢",
      trainWagonIntro: "Schau dir den Zug an! Zähle die Tiere im Waggon!",
      trainCountPrompt: (count) => `Wie viele Tiere sind im Waggon? Es sind ${count}!`,
      trainCorrectSpeech: (count) => `Richtig! Es ist die Nummer ${count}!`,
      trainNextWagon: "Super! Schauen wir uns den nächsten Waggon an!",
      trainAllDone: "Der Zug ist komplett! Alle Waggons haben eine Nummer!",
      trainExitSpeech: "Herzlichen Glückwunsch! Du hast den Zahlenzug geschafft! Du bist toll!",
      skipPhase: "Weiter ⏭",
    },
    animalNames: {
      galinha: "Huhn", vaca: "Kuh", porco: "Schwein", ovelha: "Schaf",
      cavalo: "Pferd", pato: "Ente", coelho: "Kaninchen", gato: "Katze",
      leao: "Löwe", elefante: "Elefant", girafa: "Giraffe", macaco: "Affe",
      zebra: "Zebra", urso: "Bär", tigre: "Tiger", cobra: "Schlange",
      peixe: "Fisch", golfinho: "Delphin", polvo: "Krake", caranguejo: "Krabbe",
      tartaruga: "Schildkröte", baleia: "Wal", tubarao: "Hai", lula: "Tintenfisch",
      ovo: "Ei", coelhinho: "Häschen", pintinho: "Küken", cesta: "Korb",
      flor: "Blume", borboleta: "Schmetterling", cenoura: "Karotte", chocolate: "Schokolade",
    },
    narrateText: (count, animalName) => {
      const plurals: Record<string, string> = {
        galinha: "Hühner", vaca: "Kühe", porco: "Schweine", ovelha: "Schafe",
        cavalo: "Pferde", pato: "Enten", coelho: "Kaninchen", gato: "Katzen",
        leao: "Löwen", elefante: "Elefanten", girafa: "Giraffen", macaco: "Affen",
        zebra: "Zebras", urso: "Bären", tigre: "Tiger", cobra: "Schlangen",
        peixe: "Fische", golfinho: "Delphine", polvo: "Kraken", caranguejo: "Krabben",
        tartaruga: "Schildkröten", baleia: "Wale", tubarao: "Haie", lula: "Tintenfische",
        ovo: "Eier", coelhinho: "Häschen", pintinho: "Küken", cesta: "Körbe",
        flor: "Blumen", borboleta: "Schmetterlinge", cenoura: "Karotten", chocolate: "Schokoladen",
      };
      const singulars: Record<string, string> = {
        galinha: "ein Huhn", vaca: "eine Kuh", porco: "ein Schwein", ovelha: "ein Schaf",
        cavalo: "ein Pferd", pato: "eine Ente", coelho: "ein Kaninchen", gato: "eine Katze",
        leao: "einen Löwen", elefante: "einen Elefanten", girafa: "eine Giraffe", macaco: "einen Affen",
        zebra: "ein Zebra", urso: "einen Bären", tigre: "einen Tiger", cobra: "eine Schlange",
        peixe: "einen Fisch", golfinho: "einen Delphin", polvo: "einen Kraken", caranguejo: "eine Krabbe",
        tartaruga: "eine Schildkröte", baleia: "einen Wal", tubarao: "einen Hai", lula: "einen Tintenfisch",
        ovo: "ein Ei", coelhinho: "ein Häschen", pintinho: "ein Küken", cesta: "einen Korb",
        flor: "eine Blume", borboleta: "einen Schmetterling", cenoura: "eine Karotte", chocolate: "eine Schokolade",
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
