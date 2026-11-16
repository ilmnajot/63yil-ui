# 63yil UI: Arabic Letters

A web app for children to learn the 28 Arabic letters. Each letter has five steps:

| Activity   | What the child does |
|------------|---------------------|
| **Trace**  | Draws over a dotted model of the letter. The drawing is checked automatically. |
| **Write**  | Draws the letter from memory on an empty canvas. Checked automatically. |
| **Listen** | Hears the letter and taps it among four choices. |
| **Repeat** | Hears the letter, records themselves saying it and compares with the model. |
| **Birikma** | Joins the letter with earlier ones, fully vocalized like the Qaida (بَا، أَتَبَ، أَبْ، أَبَّ، بًا…, with zabar/zer/pesh, jazm, tashdid, tanvin, gʻunna): traces each, then writes it. |

There is also a **writing practice** (✍️ "Yozish mashqi" on the home page): the child picks a set of letters
(the ones they have written, all 28, or a range like 11–23) and how many (5, 10 or 20), then writes them one by one
from memory in random order. Each correct letter gives a little XP, and a summary shows how it went.
Inside each lesson, once the child has written the letter, a short **review of the earlier letters**
("🔁 Oldingi harflarni ham yozing": 5 letters mixed from letter 1 up to the current one) appears under the Write canvas.

Finished activities give XP and are saved in the browser. The backend lives in `../63yil-api`.

It works on **phones, tablets and laptops**, in portrait and landscape, with mouse, finger or stylus.

The app is in **Uzbek** (Latin script). All interface text is in `src/i18n/messages/uz.ts`.

## Requirements

- Node.js 20 or newer (`node -v`)

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173. By default the app uses built-in **mock data**, so no backend is needed.

## Connect the real backend

1. Start `63yil-api` on port 8080 with the endpoints described in [docs/API.md](docs/API.md).
2. Create a file `.env.local` (copy `.env.example`) containing:
   ```
   VITE_USE_MOCKS=false
   ```
3. Restart `npm run dev`. Calls to `/api/*` are forwarded to `http://localhost:8080` (see `vite.config.ts`).

## Scripts

| Command             | What it does |
|---------------------|--------------|
| `npm run dev`       | Start the dev server with live reload |
| `npm run dev:mock`  | Same, but with the built-in mock data on port 5180 (ignores `.env.local`) |
| `npm run build`     | Type-check, then build the production files into `dist/` |
| `npm run preview`   | Serve the production build locally |
| `npm test`          | Run the unit tests once |
| `npm run typecheck` | Check TypeScript types only |
| `npm run lint`      | Check the code with oxlint |
| `npm run audio:generate` | Create placeholder recordings for letters and drills that have none (macOS only) |
| `npm run seed:sql`  | Regenerate `docs/seed.sql` (default database rows) from the letter data |

## Documentation

- [docs/API.md](docs/API.md): the JSON the UI expects from the backend, field by field
- [docs/seed.sql](docs/seed.sql): default rows for the database (28 letters with all steps and Birikma drills)
- [docs/schema-joining.sql](docs/schema-joining.sql): the two tables for Birikma (run once)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): folder layout, texts, how lessons and scoring work, how to add an activity

## Letter recordings

The 28 files in `public/audio/letters/` (`01-alif.m4a` … `28-yo.m4a`) are **placeholders** made with the
macOS Arabic voice "Majed" (`npm run audio:generate`). They make sure every device plays a sound, but a
real reciter sounds much better.

To use a qari's recordings:

1. Record each letter name (about 1 second each; quiet room, no music).
2. Save each one **with exactly the same file name**, replacing the placeholder, e.g. `02-bo.m4a`.
   M4A (AAC) or MP3 both work. If you use `.mp3`, the database `audio_url` must end in `.mp3` too.
3. Done. The database already points at these paths, so no code or database change is needed for `.m4a`.

The database gets the paths from `docs/seed.sql`, which only fills `audio_url` where it is empty.

## Browser notes

- **Sound:** each letter has a recording in `public/audio/letters/` (see "Letter recordings" below).
  If a recording is missing or fails to load, the browser's built-in Arabic voice is used instead.
- **Microphone (Repeat):** the browser asks for permission. Recording only works on `localhost` or
  over `https://`. Recordings stay on the device and are never uploaded.
- **Fonts:** Nunito (interface) and Amiri (Arabic) are loaded from Google Fonts.
# 63yil-ui
