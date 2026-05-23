# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev        # Start dev server at http://localhost:8080
bun run build      # Production build
bun run preview    # Preview production build locally
bun run lint       # ESLint
bun run format     # Prettier
bun run deploy     # vite build + wrangler deploy → Cloudflare Workers
bun run test       # Run unit tests once (Vitest)
bun run test:watch # Vitest in watch mode
bunx playwright test               # E2E tests (all)
bunx playwright test --grep "name" # Run a single E2E test by name
```

## Architecture

**farm-number-fun** is a Portuguese-first educational PWA ("O Mundo dos Números") deployed at https://farm-number-fun.ksepisteme.com.br/ that teaches children (ages 3–7) to count 1–9 by clicking the correct number after watching animated animals appear.

### Component hierarchy

```
App.tsx
├── I18nProvider          ← locale detection + context (src/i18n/I18nContext.tsx)
├── QueryClientProvider
├── TooltipProvider
├── PwaInstallBanner
└── BrowserRouter
    ├── / → Index → FarmGame   ← all game logic lives here
    └── * → NotFound
```

### Game state machine (`src/components/FarmGame.tsx`)

The entire game is a single stateful component. It has **5 sequential phases**:

| Phase | Type | Description |
|---|---|---|
| 1 | Count | Animals appear → pick the correct number (sequential 1–9) |
| 2 | Count | Same as phase 1 but sequence is shuffled |
| 3 | Bubble | — |
| 4 | Match | — |
| 5 | Trace / Sum | — |

Key state variables:
- `mode` — animal theme: `domestic | wild | aquatic | easter`
- `gamePhase` — `1 | 2 | 3 | 4 | 5`
- `roundPhase` — `showing | choosing | correct | transition | bubble`
- `phaseSequence` — array of numbers 1–9 for current phase
- `currentIndex` — position in `phaseSequence`
- `optionStates` — per-button state: `idle | correct | wrong`
- `transition` — overlay: `none | phase-complete | game-complete`
- `phaseHits / phaseMisses` — score within current phase
- `streak` — consecutive correct answers (displayed when ≥ 3)
- `usedAnimals` — `Set<string>` preventing repeats within a phase

Round flow (phases 1–2): animals appear → pop sounds play → narration spoken → options shown → child clicks → correct/wrong feedback → next round after 2.5 s. After 9 correct answers a `PhaseTransition` overlay appears before advancing.

Phase transitions: `handleTransitionDone` → `handleBubbleComplete` → `handleMatchComplete` → `handleTraceComplete` → `handleSumComplete` → home.

### Key files

| File | Purpose |
|---|---|
| `src/components/FarmGame.tsx` | Main game state machine (~700 lines) |
| `src/i18n/I18nContext.tsx` | Language detection + context provider |
| `src/i18n/translations.ts` | All UI strings + `narrateText()` / `celebrationText()` for 6 languages |
| `src/lib/sounds.ts` | Web Audio API synthesis + Web Speech API narration |
| `src/components/AnimalEmoji.tsx` | Maps animal keys to `public/animals/<mode>/<key>.png` + size classes |
| `src/components/game/WelcomeScreen.tsx` | Mode selection screen |
| `src/components/game/PhaseTransition.tsx` | Phase/game-complete overlay |
| `wrangler.jsonc` | Cloudflare Workers config (assets-only SPA, `not_found_handling: single-page-application`) |

### Audio system (`src/lib/sounds.ts`)

All sounds are synthesized via Web Audio API — no audio files. Exports: `playCorrectSound`, `playWrongSound`, `playPopSound(delayMs)`, `playCelebrateSound`, `playClickSound`, `speak(text, lang?, onEnd?)`, `preloadVoices`. `speak()` cancels any ongoing speech before starting; rate 0.85, pitch 1.3. Portuguese narration uses gender-aware plural forms defined in `translations.ts`.

### Internationalization

Language auto-detected from browser `navigator.language`, prefix-matched to one of `pt | en | es | fr | it | de`, then persisted to `localStorage` key `"farm-game-locale"`. Consumed via `useI18n()` which returns `{ locale, t, setLocale, speechLang }`. Add new strings to `src/i18n/translations.ts` under all 6 language keys, including the `narrateText()` and `celebrationText()` functions.

### Styling

- Tailwind CSS 3 with custom colors: `farm-sky`, `farm-grass`, `farm-barn`, `farm-sun`, `farm-correct`, `farm-wrong` (all HSL CSS variables)
- Custom keyframe animations in `tailwind.config.ts`: `pop-in`, `bounce-in`, `celebrate`, `wiggle`, `float`, `shake`, `train-chug`, `number-fly`
- shadcn/ui components in `src/components/ui/` — prefer editing over replacing

### Animal modes

Each mode has exactly 8 animals. Images live in `public/animals/{domestic,wild,aquatic,easter}/`. `AnimalEmoji` maps animal keys to paths; size class is determined by total count (`w-48` for 1 down to `w-14` for 9). Easter mode uses `EasterNumberOption` instead of `NumberOption`.

### Debug mode

`src/hooks/use-debug-mode.ts` — debug is ON when `?debug=1` is in the URL **or** when the hostname is not `farm-number-fun.ksepisteme.com.br` (i.e., always on in local dev). Sets `document.documentElement.classList` `"debug"` class.

### TypeScript config

`noImplicitAny: false` and `strictNullChecks: false` — the project uses loose type checking intentionally.
