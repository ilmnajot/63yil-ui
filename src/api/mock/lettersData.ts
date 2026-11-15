/**
 * Mock data for the 28 letters of the Arabic alphabet (Uzbek).
 * Used while the backend is not ready (`VITE_USE_MOCKS=true`).
 * The shape is exactly what `GET /letters/{id}` should return, see `docs/API.md`.
 *
 * The ROWS table follows the columns of `realdb.letters`, so it can also be used to seed the database.
 */
import type { Letter, LetterForms, LetterSummary } from '@/types/letter'

/** Tatweel: the connecting line used to show a letter's initial/medial/final forms. */
const TATWEEL = 'ـ'

/** These six letters never connect to the letter after them. */
const NON_CONNECTING = new Set(['ا', 'د', 'ذ', 'ر', 'ز', 'و'])

function buildForms(letter: string): LetterForms {
  const connectsForward = !NON_CONNECTING.has(letter)
  return {
    isolated: letter,
    initial: connectsForward ? `${letter}${TATWEEL}` : letter,
    medial: connectsForward ? `${TATWEEL}${letter}${TATWEEL}` : `${TATWEEL}${letter}`,
    final: `${TATWEEL}${letter}`,
  }
}

/** One row of `realdb.letters` (forms are computed by `buildForms`). */
type Row = [
  arabic: string,
  arabicName: string,
  name: string,
  sound: string,
  makhraj: string,
  example: [arabic: string, translit: string, meaning: string],
]

// prettier-ignore
const ROWS: Row[] = [
  ['ا', 'ألف', 'Alif',  'a, choʻziq ochiq "aa"',                            'Ogʻiz va tomoq boʻshligʻi',                              ['أَسَد', 'asad', 'sher']],
  ['ب', 'باء', 'Bo',    'b, "bola" soʻzidagi kabi',                          'Ikki lab bir-biriga tegib',                              ['بَاب', 'bāb', 'eshik']],
  ['ت', 'تاء', 'To',    't, "tosh" soʻzidagi kabi',                          'Til uchi yuqori old tishlar ildiziga tegib',             ['تُفَّاح', 'tuffāḥ', 'olmalar']],
  ['ث', 'ثاء', 'So',    's, til uchi tishlar orasida (inglizcha "think" kabi)', 'Til uchi yuqori old tishlar uchiga tegib',            ['ثَعْلَب', 'thaʿlab', 'tulki']],
  ['ج', 'جيم', 'Jim',   'j, "jon" soʻzidagi kabi',                           'Til oʻrtasi tanglayga tegib',                            ['جَمَل', 'jamal', 'tuya']],
  ['ح', 'حاء', 'Ho',    'ḥ, boʻgʻizdan chiqadigan nafasli "h"',              'Boʻgʻizning oʻrtasi',                                    ['حِصَان', 'ḥiṣān', 'ot']],
  ['خ', 'خاء', 'Xo',    'x, "xona" soʻzidagi kabi',                          'Boʻgʻizning yuqori qismi (ogʻizga yaqin)',               ['خُبْز', 'khubz', 'non']],
  ['د', 'دال', 'Dol',   'd, "dala" soʻzidagi kabi',                          'Til uchi yuqori old tishlar ildiziga tegib',             ['دُبّ', 'dubb', 'ayiq']],
  ['ذ', 'ذال', 'Zol',   'z, til uchi tishlar orasida (inglizcha "this" kabi)', 'Til uchi yuqori old tishlar uchiga tegib',             ['ذَهَب', 'dhahab', 'oltin']],
  ['ر', 'راء', 'Ro',    'r, "rang" soʻzidagi kabi',                          'Til uchi yuqori milkka yaqin',                           ['رُمَّان', 'rummān', 'anor']],
  ['ز', 'زاي', 'Zay',   'z, "zar" soʻzidagi kabi',                           'Til uchi pastki old tishlarga yaqin',                    ['زَيْتُون', 'zaytūn', 'zaytun']],
  ['س', 'سين', 'Sin',   's, "suv" soʻzidagi kabi',                           'Til uchi pastki old tishlarga yaqin',                    ['سَمَك', 'samak', 'baliq']],
  ['ش', 'شين', 'Shin',  'sh, "shamol" soʻzidagi kabi',                       'Til oʻrtasi tanglayga tegib',                            ['شَمْس', 'shams', 'quyosh']],
  ['ص', 'صاد', 'Sod',   'ṣ, yoʻgʻon "s"',                                    'Til uchi pastki old tishlarga yaqin, yoʻgʻon',           ['صَقْر', 'ṣaqr', 'lochin']],
  ['ض', 'ضاد', 'Zod',   'ḍ, yoʻgʻon "d"',                                    'Til yon tomoni yuqori oziq tishlarga tegib',             ['ضِفْدَع', 'ḍifdaʿ', 'qurbaqa']],
  ['ط', 'طاء', 'To',    'ṭ, yoʻgʻon "t"',                                    'Til uchi yuqori old tishlar ildiziga tegib, yoʻgʻon',    ['طَائِر', 'ṭāʾir', 'qush']],
  ['ظ', 'ظاء', 'Zo',    'ẓ, yoʻgʻon "z" (til uchi tishlar orasida)',         'Til uchi yuqori old tishlar uchiga tegib, yoʻgʻon',      ['ظَرْف', 'ẓarf', 'konvert']],
  ['ع', 'عين', 'Ayn',   'ʿ, boʻgʻiz oʻrtasidan chiqadigan chuqur tovush',    'Boʻgʻizning oʻrtasi',                                    ['عَيْن', 'ʿayn', 'koʻz']],
  ['غ', 'غين', 'Gʻayn', 'gʻ, "gʻoz" soʻzidagi kabi',                         'Boʻgʻizning yuqori qismi (ogʻizga yaqin)',               ['غَيْمَة', 'ghayma', 'bulut']],
  ['ف', 'فاء', 'Fo',    'f, "futbol" soʻzidagi kabi',                        'Yuqori old tishlar pastki labning ichki tomoniga tegib', ['فِيل', 'fīl', 'fil']],
  ['ق', 'قاف', 'Qof',   'q, "qalam" soʻzidagi kabi',                         'Til orqasi yumshoq tanglayga tegib',                     ['قَمَر', 'qamar', 'oy']],
  ['ك', 'كاف', 'Kof',   'k, "kitob" soʻzidagi kabi',                         'Til orqasi, Qofdan biroz oldinroq',                      ['كِتَاب', 'kitāb', 'kitob']],
  ['ل', 'لام', 'Lom',   'l, "lola" soʻzidagi kabi',                          'Til uchining chetlari yuqori milkka tegib',              ['لَيْمُون', 'laymūn', 'limon']],
  ['م', 'ميم', 'Mim',   'm, "mushuk" soʻzidagi kabi',                        'Ikki lab bir-biriga tegib',                              ['مَاء', 'māʾ', 'suv']],
  ['ن', 'نون', 'Nun',   'n, "non" soʻzidagi kabi',                           'Til uchi yuqori milkka tegib',                           ['نَجْمَة', 'najma', 'yulduz']],
  ['ه', 'هاء', 'Ha',    'h, "hovli" soʻzidagi kabi yengil "h"',              'Boʻgʻizning eng chuqur qismi',                           ['هِلَال', 'hilāl', 'hilol (yangi oy)']],
  ['و', 'واو', 'Vov',   'w, lablarni yumaloqlab aytiladi',                   'Ikki lab yumaloqlanib',                                  ['وَرْدَة', 'warda', 'atirgul']],
  ['ي', 'ياء', 'Yo',    'y, "yer" soʻzidagi kabi',                           'Til oʻrtasi tanglayga tegib',                            ['يَد', 'yad', 'qoʻl']],
]

/** Activity instructions, as they would be stored in the `instructions` column of each activity table. */
const INSTRUCTIONS = {
  trace: (name: string) => `${name} harfini nuqtali chiziqlar boʻylab chizing.`,
  write: (name: string) => `Endi ${name} harfini namunasiz, oʻzingiz yozing.`,
  listen: () => 'Diqqat bilan tinglang, soʻng eshitgan harfingizni bosing.',
  repeat: (name: string) => `${name} harfini tinglang, soʻng uni aytib, ovozingizni yozib oling.`,
}

/**
 * Wrong answers for the Listen quiz (rows of `listen_distractor`), by letter.
 * Chosen to look or sound alike (ب ت ث, ج ح خ, س ش ص …), so the child must really listen.
 */
// prettier-ignore
const DISTRACTORS: Record<string, [string, string, string]> = {
  'ا': ['ل', 'ر', 'د'], 'ب': ['ت', 'ث', 'ن'], 'ت': ['ب', 'ث', 'ط'], 'ث': ['ت', 'ب', 'ش'],
  'ج': ['ح', 'خ', 'غ'], 'ح': ['ج', 'خ', 'ه'], 'خ': ['ح', 'ج', 'غ'], 'د': ['ذ', 'ر', 'ض'],
  'ذ': ['د', 'ز', 'ظ'], 'ر': ['ز', 'د', 'و'], 'ز': ['ر', 'ذ', 'س'], 'س': ['ش', 'ص', 'ث'],
  'ش': ['س', 'ث', 'ص'], 'ص': ['س', 'ض', 'ط'], 'ض': ['ص', 'د', 'ظ'], 'ط': ['ت', 'ظ', 'ص'],
  'ظ': ['ط', 'ذ', 'ض'], 'ع': ['غ', 'ح', 'ه'], 'غ': ['ع', 'خ', 'ق'], 'ف': ['ق', 'ث', 'و'],
  'ق': ['ك', 'ف', 'غ'], 'ك': ['ق', 'ل', 'ت'], 'ل': ['ا', 'ك', 'ن'], 'م': ['ن', 'ب', 'و'],
  'ن': ['ب', 'ت', 'م'], 'ه': ['ح', 'ع', 'خ'], 'و': ['ر', 'ف', 'م'], 'ي': ['ب', 'ن', 'ت'],
}

export const mockLetterSummaries: LetterSummary[] = ROWS.map(([arabic, , name], index) => ({
  id: index + 1,
  order: index + 1,
  name,
  arabic,
}))

export const mockLetters: Letter[] = ROWS.map((row, index) => {
  const [arabic, arabicName, name, sound, makhraj, [exArabic, exTranslit, exMeaning]] = row
  return {
    ...mockLetterSummaries[index]!,
    arabicName,
    sound,
    makhraj,
    forms: buildForms(arabic),
    example: { arabic: exArabic, transliteration: exTranslit, meaning: exMeaning },
    activities: {
      trace: { instructions: INSTRUCTIONS.trace(name), form: 'isolated' },
      write: { instructions: INSTRUCTIONS.write(name), form: 'isolated' },
      listen: {
        instructions: INSTRUCTIONS.listen(),
        audioUrl: null,
        distractors: DISTRACTORS[arabic]!.map((char) => mockLetterSummaries.find((item) => item.arabic === char)!),
      },
      repeat: { instructions: INSTRUCTIONS.repeat(name), audioUrl: null },
    },
  }
})
