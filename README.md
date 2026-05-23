# O Mundo dos Números

Jogo educativo para crianças (3–7 anos): conta os animais e descobre o número!

**Acesse:** https://farm-number-fun.ksepisteme.com.br/

## Sobre o jogo

O Mundo dos Números é uma PWA interativa pensada para crianças em idade pré-escolar. A cada rodada, aparecem animais na tela e a criança deve contar quantos há e escolher o número correto entre três opções. O jogo abrange os números de 1 a 9 em duas fases: sequencial e aleatória.

**Modos de jogo:**
- 🐔 **Fazenda** — galinha, vaca, porco, ovelha, cavalo, pato, coelho, gato
- 🦁 **Selvagens** — leão, elefante, girafa, macaco, zebra, urso, tigre, cobra
- 🐠 **Aquáticos** — golfinho, polvos, tartaruga, tubarão, estrela-do-mar, caranguejo, baleia, peixe-palhaço
- 🐣 **Páscoa** — coelho, pintinho, ovo, cesta, borboleta, flor, patinho, cordeiro

**Funcionalidades:**
- Suporte a 6 idiomas (PT, EN, ES, FR, IT, DE) com detecção automática
- Narração em voz alta (Web Speech API) com formas plurais por gênero em português
- Efeitos sonoros sintetizados via Web Audio API — sem arquivos de áudio
- Animações de entrada dos animais e feedback visual de acerto/erro
- PWA — instalável em dispositivos móveis e desktop, funciona offline

## Tecnologias

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 5](https://vitejs.dev/) + [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (componentes Radix UI)
- [React Router v6](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query)
- [Cloudflare Workers](https://workers.cloudflare.com/) (deploy)

## Desenvolvimento

```bash
# Instalar dependências
bun install

# Iniciar servidor de desenvolvimento (http://localhost:8080)
bun run dev

# Build de produção
bun run build

# Pré-visualizar build local
bun run preview

# Lint
bun run lint

# Formatar código
bun run format
```

## Deploy

```bash
# Build + deploy para Cloudflare Workers
bun run deploy
```

Requer autenticação prévia: `bunx wrangler login`

## Testes

```bash
# Testes unitários (Vitest)
bun run test

# Testes unitários em modo watch
bun run test:watch

# Testes E2E (Playwright)
bunx playwright test
```

## Estrutura

```
src/
├── components/
│   ├── FarmGame.tsx              # Máquina de estados principal do jogo
│   ├── AnimalEmoji.tsx           # Mapeamento de animais para imagens
│   ├── game/
│   │   ├── WelcomeScreen.tsx     # Tela de seleção de modo
│   │   ├── PhaseTransition.tsx   # Overlay de fim de fase/jogo
│   │   ├── NumberOption.tsx      # Botões de resposta
│   │   └── EasterNumberOption.tsx
├── hooks/
│   └── use-debug-mode.ts         # Modo de depuração (?debug=1)
├── i18n/
│   ├── I18nContext.tsx           # Detecção de idioma + contexto
│   └── translations.ts           # Strings UI em 6 idiomas
├── lib/
│   ├── sounds.ts                 # Síntese de áudio + narração
│   └── utils.ts
└── pages/
    └── Index.tsx
public/
└── animals/
    ├── domestic/
    ├── wild/
    ├── aquatic/
    └── easter/
```
