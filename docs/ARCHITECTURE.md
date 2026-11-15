# How the UI is organised

This explains where things live and why, so you can find your way around without UI experience.

## Tech in one paragraph

**React** builds the screen out of small reusable pieces called *components* (functions that return
HTML-like JSX). **TypeScript** is JavaScript with types; it catches mistakes before the app runs,
much like Java's compiler. **Vite** is the dev server and build tool. **React Router** maps URLs to pages.
Styles are **CSS Modules**: each component has its own `.module.css` file, so class names never clash.

## Folder layout

```
src/
├── main.tsx                  Entry point: mounts the app, wraps it in the progress provider and router
├── app/                      App shell
│   ├── router.tsx            URL → page mapping
│   ├── paths.ts              URL builders (never hand-write "/letters/..." elsewhere)
│   ├── AppLayout.tsx         Header + page frame shared by every page
│   └── NotFoundPage.tsx
├── api/                      Talking to the backend (the only place that knows about HTTP)
│   ├── http.ts               fetch wrapper + ApiError
│   ├── lettersApi.ts         getLetters/getLetter; picks mock or real backend
│   └── mock/                 Mock data used while the backend is not ready
├── types/letter.ts           Data shapes shared by everything (mirrors docs/API.md)
├── config/env.ts             Reads environment variables
├── i18n/                     Interface texts
│   ├── messages/uz.ts        Every word the child sees, in Uzbek
│   └── useI18n.ts            `t('key')` function used by components
├── features/                 One folder per feature: its pages, components and logic together
│   ├── letters/              Home page: grid of letters
│   ├── lesson/               Lesson page: letter info + activity tabs + current activity
│   ├── activities/           The four activities
│   │   ├── registry.ts       List of activities (label, icon, component)
│   │   ├── drawing/          Shared engine for Trace + Write (canvas, scoring)
│   │   ├── trace/  write/  listen/  repeat/
│   │   └── shared/           Pieces used by several activities (sound buttons)
│   └── progress/             What the child has finished, XP, saved in the browser
├── shared/                   Generic building blocks with no app knowledge
│   ├── components/           Button, Card, Loading/Error messages, ErrorBoundary
│   ├── hooks/useAsync.ts     Load data with loading/error states
│   ├── audio/                Play letter sounds (audio file or speech voice)
│   └── storage/              localStorage wrapper that never crashes
└── styles/                   Design tokens (colors, spacing) and global CSS
```

**Rule of thumb:** `shared/` must not import from `features/`. Features may use `shared/`, `api/` and `types/`.

## How a lesson works

1. The URL `/letters/2/trace` opens `LessonPage`.
2. `LessonPage` loads letter 2 through `lettersApi` (mock or real backend) using `useAsync`.
3. `ActivityTabs` shows the four activities; `ActivityPanel` renders the one in the URL by looking it up in `activities/registry.ts`.
4. When the child succeeds, the activity calls `onComplete()`. `ActivityPanel` records it with `useProgress().markDone(...)`, which updates the XP in the header and saves it to `localStorage`.

## Texts (Uzbek)

The app is **Uzbek only** (Latin script). There are two kinds of text:

- **Interface text** (buttons, titles, hints) lives in one file: `src/i18n/messages/uz.ts`. Components never contain
  text directly; they call `t('key')`, e.g. `t('lesson.next', { name: 'Bo' })` → "Keyingi harf: Bo".
  To change a word, edit it there. A unit test checks that no text is empty and that the Uzbek apostrophes are used.
- **Letter content** (names, sound, makhraj, word meanings, activity instructions) comes from the backend (`docs/API.md`).

Uzbek apostrophes: use ʻ (U+02BB) in oʻ / gʻ and ʼ (U+02BC) for the tutuq belgisi, not ' or `.

## Screen sizes (phone, tablet, laptop)

The app is built for phones and laptops first, and works on tablets in both orientations.

| Screen | Width / height | What changes |
|--------|----------------|--------------|
| Phone (portrait) | below 600px wide | Letter card becomes one compact row; "Harf haqida" (letter details) starts folded; activity tabs are short 2×2 rows; instructions above the canvas, big Check button under it; 3 letters per row on the home page |
| Phone (sideways) | below 500px tall | Same compact card / folded details; all 4 tabs in one row; canvas sized to the screen height |
| Tablet | 600–1023px | Two columns from 700px; details open; canvas beside the instructions |
| Laptop | 1024px and wider | Full layout, content centered up to 1200px |

How it is done:

- **CSS first.** Layout changes live in each component's `.module.css` under `@media` rules. The breakpoints are listed in `styles/tokens.css`.
  JavaScript (`useMediaQuery`) is only used where behaviour differs: the details section starting folded.
- **Fluid sizes** with `clamp()` (fonts, letter circle), so sizes grow smoothly between breakpoints.
- **Touch friendly.** Buttons are at least 44px tall (`--tap-size`). Hover effects only apply on devices with a mouse
  (`@media (hover: hover)`), so nothing looks "stuck" after a tap. No double-tap zoom delay on buttons.
- **Drawing canvas** is as wide as its column but never taller than the visible screen (`100svh`), so it always fits,
  even on a sideways phone. While drawing, the page doesn't scroll or zoom (`touch-action: none`), and the iOS
  long-press menu is off. Strokes are stored in 0–1 coordinates, so rotating the device keeps the drawing.
- **iPhone notch / rounded corners**: content is padded with `env(safe-area-inset-*)`.
- **Scrolling**: opening another letter starts at the top. Switching activities keeps your place, and after
  "Keyingisi →" the new activity is scrolled into view (see `AppLayout.tsx` and `ActivityPanel.tsx`).

When you add a screen, test it at 360×740 (small Android), 390×844 (iPhone), 844×390 (sideways phone),
768×1024 (iPad) and 1366×768 (laptop). Chrome DevTools → "Toggle device toolbar" (Ctrl/Cmd+Shift+M) lets you switch between these.

## How Trace and Write are scored

No stroke data is needed from the backend, so it works for every letter and every letter form.

1. The letter is drawn from the Amiri Arabic font on a hidden 160×160 canvas, which gives a pixel mask of the letter.
2. The child's strokes are drawn on the same kind of hidden canvas.
3. Two numbers are computed (`drawing/scoring.ts`):
   - **coverage**: how much of the letter the child went over
   - **precision**: how much of the child's ink stayed on (or near) the letter
4. Both must be above a threshold. Trace is stricter than Write. Write first moves and scales the
   drawing onto the model letter, so the child can write anywhere on the canvas at any size.

The thresholds and line widths are named constants at the top of `scoring.ts` and `evaluateDrawing.ts`, if the game feels too easy or too hard.

## Adding a new activity (or a game later)

1. Add its name to `ACTIVITY_TYPES` in `src/types/letter.ts` and its data shape to `Letter['activities']`.
   Add its texts (`activity.<name>.label`, `activity.<name>.description`, …) to `src/i18n/messages/uz.ts`.
2. Create `src/features/activities/<name>/<Name>Activity.tsx`. It receives `{ letter, onComplete }` (see `activities/types.ts`).
3. Register it in `src/features/activities/registry.ts` with a label and icon.
4. Add its color pair (`--activity-<name>` and `--activity-<name>-soft`) in `styles/tokens.css`, and a class in `ActivityTabs.module.css`, `ActivityPanel.module.css` and `LetterTile.module.css`.
5. Add its data to the mock data and to `docs/API.md`.

Bigger games (not tied to one letter) should get their own folder under `features/` and their own route in `app/router.tsx`.

## Conventions

- One component per file, named like the file. Every exported function has a short doc comment.
- No text in components: every visible string goes through `t()`.
- Colors, spacing and radii come from `styles/tokens.css` and are never hard-coded in components.
- Anything tappable is at least `--tap-size` (44px); hover styles go inside `@media (hover: hover)`.
- Pure logic (scoring, progress) lives in plain `.ts` files with unit tests next to them (`*.test.ts`).
- Accessibility: real `<button>`/`<a>` elements, `aria-label` on icon-only controls, visible keyboard focus.
