# 63yil UI: Arabic Letters

A web app for children to learn the 28 Arabic letters. Each letter has four activities:

| Activity   | What the child does |
|------------|---------------------|
| **Trace**  | Draws over a dotted model of the letter. The drawing is checked automatically. |
| **Write**  | Draws the letter from memory on an empty canvas. Checked automatically. |
| **Listen** | Hears the letter and taps it among four choices. |
| **Repeat** | Hears the letter, records themselves saying it and compares with the model. |

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
| `npm run build`     | Type-check, then build the production files into `dist/` |
| `npm run preview`   | Serve the production build locally |
| `npm test`          | Run the unit tests once |
| `npm run typecheck` | Check TypeScript types only |
| `npm run lint`      | Check the code with oxlint |
| `npm run seed:sql`  | Regenerate `docs/seed.sql` (default database rows) from the letter data |

## Documentation

- [docs/API.md](docs/API.md): the JSON the UI expects from the backend, field by field
- [docs/seed.sql](docs/seed.sql): default rows for the database (28 letters with all activities)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): folder layout, texts, how lessons and scoring work, how to add an activity

## Browser notes

- **Sound:** when a letter has no `audioUrl`, the browser's built-in Arabic voice is used. Most modern
  browsers have one, but quality varies; recorded audio files are recommended.
- **Microphone (Repeat):** the browser asks for permission. Recording only works on `localhost` or
  over `https://`. Recordings stay on the device and are never uploaded.
- **Fonts:** Nunito (interface) and Amiri (Arabic) are loaded from Google Fonts.
# 63yil-ui
