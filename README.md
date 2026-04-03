# 🌻 A Fazenda dos Números

Jogo educativo para crianças: conta os animais e descobre o número!

## Sobre o jogo

A Fazenda dos Números é uma aplicação web interativa pensada para crianças em idade pré-escolar. A cada rodada, aparecem animais na tela e a criança deve contar quantos há e escolher o número correto entre três opções.

**Modos de jogo:**
- 🐔 **Animais da Fazenda** — galinha, vaca, porco, ovelha, cavalo, pato, coelho, gato
- 🦁 **Animais Selvagens** — leão, elefante, girafa, macaco, zebra, urso, tigre, cobra

**Funcionalidades:**
- Narração em voz alta em português (Web Speech API)
- Efeitos sonoros para acerto, erro e celebração
- Animações de entrada dos animais
- Placar de pontos e contador de rodadas
- Modo ecrã cheio automático ao iniciar
- PWA — instalável em dispositivos móveis e desktop

## Tecnologias

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (componentes Radix UI)
- [React Router v6](https://reactrouter.com/)

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Pré-visualizar build
npm run preview
```

## Testes

```bash
# Testes unitários (Vitest)
bun run test

# Testes e2e (Playwright)
bunx playwright test
```

## Estrutura

```
src/
├── components/
│   ├── FarmGame.tsx       # Componente principal do jogo
│   ├── AnimalEmoji.tsx    # Animais e seus dados (emoji + nome)
│   └── NumberOption.tsx   # Botões de resposta
├── lib/
│   ├── sounds.ts          # Efeitos sonoros e narração
│   └── fullscreen.ts      # Utilitário de ecrã cheio
└── pages/
    └── Index.tsx          # Página de entrada
```