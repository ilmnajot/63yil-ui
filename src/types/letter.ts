/**
 * Domain types shared by the whole app.
 * They mirror the JSON returned by the backend; see `docs/API.md` for the full contract.
 */

/** The five practice steps of every letter lesson, in the order the child does them. */
export const ACTIVITY_TYPES = ['trace', 'write', 'listen', 'repeat', 'join'] as const
export type ActivityType = (typeof ACTIVITY_TYPES)[number]

export function isActivityType(value: unknown): value is ActivityType {
  return typeof value === 'string' && (ACTIVITY_TYPES as readonly string[]).includes(value)
}

/** The steps this letter actually has, in order (Birikma is missing if the backend sends no drills). */
export function availableActivities(letter: Letter): ActivityType[] {
  return ACTIVITY_TYPES.filter((type) => letter.activities[type] != null)
}

/** How a letter looks depending on its position in a word. */
export interface LetterForms {
  isolated: string
  initial: string
  medial: string
  final: string
}
export type LetterFormName = keyof LetterForms

/** Minimal letter info, used in lists (the home page grid). */
export interface LetterSummary {
  id: number
  /** Position in the alphabet, starting at 1. */
  order: number
  /** Latin name, e.g. "Alif". */
  name: string
  /** The letter itself, e.g. "ا". */
  arabic: string
}

export interface ExampleWord {
  arabic: string
  transliteration: string
  meaning: string
}

/** Trace: the child draws over a dotted outline of the letter. */
export interface TraceActivity {
  instructions: string
  /** Which form of the letter to trace. */
  form: LetterFormName
}

/** Write: the child draws the letter from memory on an empty canvas. */
export interface WriteActivity {
  instructions: string
  form: LetterFormName
}

/** Listen: the child hears the letter and picks it out of a few choices. */
export interface ListenActivity {
  instructions: string
  /** Recorded pronunciation. `null` = not recorded yet, the browser's speech voice is used instead. */
  audioUrl: string | null
  /** Wrong answers shown next to the correct letter. */
  distractors: LetterSummary[]
}

/** Repeat: the child hears the letter, records themselves saying it and compares. */
export interface RepeatActivity {
  instructions: string
  audioUrl: string | null
}

/**
 * What a drill practises, shown as small labels (and used to give a tip):
 * - `harakat`: zabar / zer / pesh (fatha, kasra, damma)
 * - `madd`: a long vowel (بَا)
 * - `sukun`: jazm, a letter without a vowel (أَبْ)
 * - `shadda`: tashdid, a doubled letter (أَبَّ)
 * - `tanwin`: ikki zabar / zer / pesh at the end (بًا بٍ بٌ)
 * - `ghunna`: gʻunna, the nasal sound of نّ and مّ
 */
export const DRILL_FEATURES = ['harakat', 'madd', 'sukun', 'shadda', 'tanwin', 'ghunna'] as const
export type DrillFeature = (typeof DRILL_FEATURES)[number]

/** One Qaida-style exercise: a short vocalized syllable or word to trace and then write. */
export interface Drill {
  id: number
  /** Fully vocalized Arabic, e.g. "أَتَبَ". */
  text: string
  features: DrillFeature[]
  /** Recording of the drill read aloud. `null` = the browser's speech voice reads `text`. */
  audioUrl: string | null
}

/** Join ("Birikma"): the lesson's letter joined with earlier letters, with harakat, traced then written. */
export interface JoinActivity {
  instructions: string
  /** In order, simple → harder. */
  drills: Drill[]
}

/** Everything needed to run one letter lesson. */
export interface Letter extends LetterSummary {
  /** Arabic spelling of the name, e.g. "ألف". Also what the speech voice reads aloud. */
  arabicName: string
  /** How it sounds, e.g. "th, as in 'think'". */
  sound: string
  /** Where the sound comes from (makhraj). */
  makhraj: string
  forms: LetterForms
  example: ExampleWord
  activities: {
    trace: TraceActivity
    write: WriteActivity
    listen: ListenActivity
    repeat: RepeatActivity
    /** Can be `null` while the backend does not provide drills yet; the step is then hidden. */
    join: JoinActivity | null
  }
}
