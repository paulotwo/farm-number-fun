# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev        # Start dev server at http://localhost:8080
bun run build      # Production build
bun run lint       # ESLint
bun run test       # Run unit tests once (Vitest)
bun run test:watch # Vitest in watch mode
bunx playwright test # E2E tests
```

## Architecture

**farm-number-fun** is a Portuguese-first educational PWA ("O Mundo dos Números") that teaches children (ages 3–7) to count 1–9 by clicking the correct number after watching animated animals appear.

### Component hierarchy

```
App.tsx
├── I18nProvider          ← locale detection + context (src/i18n/I18nContext.tsx)
├── QueryClientProvider
├── PwaInstallBanner
└── BrowserRouter
    └── / → Index → FarmGame   ← all game logic lives here
```

### Game state machine (`src/components/FarmGame.tsx`)

The entire game is a single stateful component with these key state variables:

- `mode` — animal theme: `domestic | wild | aquatic | easter`
- `gamePhase` — `1` (sequential 1–9) or `2` (randomized 1–9)
- `roundPhase` — `showing | choosing | correct | transition`
- `phaseSequence` — array of numbers 1–9 for current phase
- `currentIndex` — position in phaseSequence
- `optionStates` — per-button state: `idle | correct | wrong`
- `transition` — overlay: `none | phase-complete | game-complete`

Round flow: animals appear → pop sounds play → narration spoken → options shown → child clicks → correct/wrong feedback → next round after 2.5s.

Phase 1 is sequential (1,2,3…9), phase 2 is shuffled. After 9 correct answers in each phase, a `PhaseTransition` overlay appears.

### Key files

| File | Purpose |
|---|---|
| `src/components/FarmGame.tsx` | Main game state machine (~700 lines) |
| `src/i18n/I18nContext.tsx` | Language detection + context provider |
| `src/i18n/translations.ts` | All UI strings for 6 languages (PT, EN, ES, FR, IT, DE) |
| `src/lib/sounds.ts` | Web Audio API synthesis + Web Speech API narration |
| `src/components/game/WelcomeScreen.tsx` | Mode selection screen |
| `src/components/game/PhaseTransition.tsx` | Phase/game-complete overlay |

### Audio system (`src/lib/sounds.ts`)

All sounds are synthesized via Web Audio API — no audio files. Speech uses the Web Speech API with language-mapped voices. Portuguese narration uses gender-aware plural forms.

### Internationalization

Language is auto-detected from browser or persisted to `localStorage`. Locale context from `src/i18n/I18nContext.tsx` is consumed with `useI18n()`. Add new strings to `src/i18n/translations.ts` under all 6 language keys.

### Styling

- Tailwind CSS with custom colors: `farm-sky`, `farm-grass`, `farm-barn`, `farm-sun`, `farm-correct`, `farm-wrong`
- Custom keyframe animations in `tailwind.config.ts`: `pop-in`, `bounce-in`, `celebrate`, `wiggle`, `float`, `shake`
- shadcn/ui components live in `src/components/ui/` — prefer editing over replacing

### Animal modes

Each mode has exactly 8 animals. Animal images live in `public/animals/` under subdirectories `domestic/`, `wild/`, `aquatic/`, `easter/`. The `AnimalEmoji` component maps animal names to image paths. Easter mode uses `EasterNumberOption` instead of `NumberOption`.

### TypeScript config

`noImplicitAny: false` and `strictNullChecks: false` — the project uses loose type checking intentionally.
