# API contract (UI ↔ 63yil-api)

This is what the UI expects from the backend. Until these endpoints exist, the UI serves the
same data from `src/api/mock/lettersData.ts` (`VITE_USE_MOCKS=true`). When an endpoint is ready, the
backend only has to return JSON in the shape below. No UI code changes are needed, just set
`VITE_USE_MOCKS=false`.

The TypeScript types for all of this are in [`src/types/letter.ts`](../src/types/letter.ts); they are the source of truth.

## Conventions

- Base path: `/api` (in development the Vite dev server forwards `/api/*` to `http://localhost:8080`).
- JSON field names are **camelCase** (Spring Boot / Jackson default).
- **Uzbek only.** All texts are stored and returned in Uzbek (Latin script). Use ʻ (U+02BB) in oʻ / gʻ and ʼ (U+02BC) for the tutuq belgisi.
- **Only active rows** (`is_active = 1`) are returned, in every table.
- Missing or inactive letter → `404`. Any other error → `5xx`. The UI shows a friendly message and a "Qayta urinish" button.
- Only `GET` endpoints for now. Progress is kept in the browser until user accounts exist.

---

## `GET /api/letters`

All active letters, sorted by `sort_order`. Used by the home page grid.

```json
[
  { "id": 1, "order": 1, "name": "Alif", "arabic": "ا" },
  { "id": 2, "order": 2, "name": "Bo",   "arabic": "ب" }
]
```

| JSON field | Column (`realdb.letters`) |
|------------|---------------------------|
| `id`       | `id`                      |
| `order`    | `sort_order`              |
| `name`     | `name`                    |
| `arabic`   | `arabic`                  |

---

## `GET /api/letters/{id}`

One letter with everything its lesson needs, including its five steps (activities).

```json
{
  "id": 2,
  "order": 2,
  "name": "Bo",
  "arabic": "ب",
  "arabicName": "باء",
  "sound": "b, \"bola\" soʻzidagi kabi",
  "makhraj": "Ikki lab bir-biriga tegib",
  "forms": { "isolated": "ب", "initial": "بـ", "medial": "ـبـ", "final": "ـب" },
  "example": { "arabic": "بَاب", "transliteration": "bāb", "meaning": "eshik" },
  "activities": {
    "trace":  { "instructions": "Bo harfini nuqtali chiziqlar boʻylab chizing.", "form": "isolated" },
    "write":  { "instructions": "Endi Bo harfini namunasiz, oʻzingiz yozing.", "form": "isolated" },
    "listen": {
      "instructions": "Diqqat bilan tinglang, soʻng eshitgan harfingizni bosing.",
      "audioUrl": "https://cdn.example.com/audio/ba.mp3",
      "distractors": [
        { "id": 9,  "order": 9,  "name": "Zol", "arabic": "ذ" },
        { "id": 15, "order": 15, "name": "Zod", "arabic": "ض" },
        { "id": 21, "order": 21, "name": "Qof", "arabic": "ق" }
      ]
    },
    "repeat": {
      "instructions": "Bo harfini tinglang, soʻng uni aytib, ovozingizni yozib oling.",
      "audioUrl": "https://cdn.example.com/audio/ba.mp3"
    },
    "join": {
      "instructions": "Bo harfini oldingi harflar bilan qoʻshib yozamiz. Avval nuqtalar boʻylab chizing, keyin oʻzingiz yozing.",
      "drills": [
        { "id": 3, "text": "بَ بِ بُ", "features": ["harakat"], "audioUrl": "/audio/drills/02-01.m4a" },
        { "id": 4, "text": "بَا",     "features": ["madd"],    "audioUrl": "/audio/drills/02-02.m4a" },
        { "id": 7, "text": "إِبْ",    "features": ["sukun"],   "audioUrl": "/audio/drills/02-05.m4a" },
        { "id": 8, "text": "إِبُّ",   "features": ["shadda"],  "audioUrl": "/audio/drills/02-06.m4a" }
      ]
    }
  }
}
```

(`join.drills` shortened here; Bo has 7.)

**Default data:** [`docs/seed.sql`](seed.sql) fills every `realdb` table with all 28 letters, their five steps,
the Listen quiz wrong answers and the 196 Birikma drills. It is generated from `src/api/mock/lettersData.ts` with `npm run seed:sql`, so the
mock data and the database always hold the same content. It is safe to run more than once (existing rows are skipped).

### Letter fields → `realdb.letters`

| JSON field                | Column             | Notes |
|---------------------------|--------------------|-------|
| `id`, `order`, `name`, `arabic` | `id`, `sort_order`, `name`, `arabic` | Same as the list |
| `arabicName`              | `arabic_name`      | The browser's speech voice reads it when there is no audio file |
| `sound`                   | `sound`            | |
| `makhraj`                 | `makhraj`          | |
| `forms.isolated`          | `form_isolated`    | Use the tatweel `ـ` (U+0640) to show joins |
| `forms.initial`           | `form_initial`     | |
| `forms.medial`            | `form_medial`      | |
| `forms.final`             | `form_final`       | |
| `example.arabic`          | `example_arabic`   | |
| `example.transliteration` | `example_translit` | |
| `example.meaning`         | `example_meaning`  | |

### Activities → one table each

`activities` is **not a table**: it is the JSON object that groups the letter's five steps.
The backend fills it from one row per table, matched by `letter_id`.

| JSON                       | Table                  | Columns used |
|----------------------------|------------------------|--------------|
| `activities.trace`         | `realdb.trace`         | `instructions`; `form` = `realdb.form.code` via `form_id` |
| `activities.write`         | `realdb.writing`       | `instructions`; `form` = `realdb.form.code` via `form_id` |
| `activities.listen`        | `realdb.listen`        | `instructions`, `audio_url` → `audioUrl` |
| `activities.listen.distractors` | `realdb.listen_distractor` + `realdb.letters` | the distractor letters' `id`, `sort_order`, `name`, `arabic` |
| `activities.repeat`        | `realdb.repeat`        | `instructions`, `audio_url` → `audioUrl` |
| `activities.join`          | `realdb.joining`       | `instructions` |
| `activities.join.drills`   | `realdb.drill` (via `joining_id`) | `id`, `text`, `features` (split the comma list into an array), `audio_url` → `audioUrl`; ordered by `sort_order` |

Rules:

- **trace, write, listen, repeat must always be present.** If a letter has no active row in one of those tables,
  return a default (e.g. a standard instruction text) rather than leaving it out.
- **`join` may be `null`** (or missing): the lesson then shows only the first four steps. Until the backend sends it,
  that is what happens. Return `null` too when a letter has no active drills.
- **`form`** must be one of `"isolated"`, `"initial"`, `"medial"`, `"final"`; it picks which shape the child draws.
  If `form_id` is `NULL`, return `"isolated"`.
- **`audioUrl`** points at a recording, normally a path served by the UI itself, e.g. `/audio/letters/02-bo.m4a`
  (files in `63yil-ui/public/audio/letters/`, see the README). A full URL to another server also works.
  `null` is allowed: the UI then uses the browser's built-in Arabic voice. It also falls back to that voice
  if a file can't be loaded. MP3 or M4A work in every browser.
- **Drawings are scored in the browser.** Trace/Write need no stroke data from the backend: the UI draws
  the letter from the Arabic font and compares the child's strokes with it.
- **`distractors`**: usually 3 letters. Look-alike or sound-alike letters (ب ت ث, ج ح خ, س ص) make the quiz more useful.
  Never include the letter itself.

### Birikma (`join`) in the backend

Tables: [`docs/schema-joining.sql`](schema-joining.sql) (run once), rows: re-run [`docs/seed.sql`](seed.sql).
`features` values, in this order: `harakat` (zabar/zer/pesh), `madd`, `sukun` (jazm), `shadda` (tashdid), `tanwin`, `ghunna` (gʻunna).

```xml
<!-- Instructions of the letter's Birikma step (null = no step) -->
<select id="getJoining" resultType="com.example._3yilapi.dto.JoiningRow">
    select j.id, j.instructions
    from realdb.joining j
    where j.letter_id = #{letterId} and j.is_active = 1
</select>

<!-- Its drills, in order -->
<select id="getDrills" resultType="com.example._3yilapi.dto.DrillRow">
    select d.id, d.text, d.features, d.audio_url as "audioUrl"
    from realdb.drill d
    where d.joining_id = #{joiningId} and d.is_active = 1
    order by d.sort_order
</select>
```

```java
public record JoiningRow(Long id, String instructions) {}
public record DrillRow(Long id, String text, String features, String audioUrl) {}

// In LetterDetail.Activities, add:  Join join
public record Join(String instructions, List<Drill> drills) {}
public record Drill(Long id, String text, List<String> features, String audioUrl) {}

// In the service, after building the other four:
JoiningRow joining = mapper.getJoining(id);
LetterDetail.Join join = null;
if (joining != null) {
    List<LetterDetail.Drill> drills = mapper.getDrills(joining.id()).stream()
            .map(d -> new LetterDetail.Drill(d.id(), d.text(), List.of(d.features().split(",")), d.audioUrl()))
            .toList();
    if (!drills.isEmpty()) join = new LetterDetail.Join(joining.instructions(), drills);
}
```

## Future endpoints (not used yet)

When user accounts arrive, progress can move to the backend. Only `src/features/progress/ProgressProvider.tsx` would change:

- `GET /api/me/progress` → `{ "completed": { "1": ["trace", "write"] } }`
- `POST /api/me/progress` body `{ "letterId": 1, "activity": "trace" }`
