import { describe, expect, it } from 'vitest'
import { buildDrills, DAMMA, FATHA, FATHATAN, KASRA, SHADDA, SUKUN } from './drillsData'

const ALPHABET = [...'ابتثجحخدذرزسشصضطظعغفقكلمنهوي']
const MARKS = /[ً-ْ]/
const allLessons = ALPHABET.map((_, i) => ({ order: i + 1, letter: ALPHABET[i]!, drills: buildDrills(ALPHABET, i + 1) }))

/** Letters of a drill without marks or spaces; hamza carriers and alif madda count as alif. */
const lettersOf = (text: string) => [...text.replace(/[أإآ]/g, 'ا').replace(/[ً-ْ\s]/g, '')]

describe('Qaida drills', () => {
  it('is the same every time (so the database and the app agree)', () => {
    expect(buildDrills(ALPHABET, 12)).toEqual(buildDrills(ALPHABET, 12))
  })

  it('gives Alif only harakat and madd', () => {
    expect(buildDrills(ALPHABET, 1)).toEqual([
      { text: `أ${FATHA} إ${KASRA} أ${DAMMA}`, features: ['harakat'] },
      { text: 'آ', features: ['madd'] },
    ])
  })

  it('starts each later lesson with zabar, zer, pesh on its letter', () => {
    expect(buildDrills(ALPHABET, 2)[0]!.text).toBe(`ب${FATHA} ب${KASRA} ب${DAMMA}`)
  })

  it('uses only letters learned so far, and always the lesson letter', () => {
    for (const { order, letter, drills } of allLessons) {
      const learned = new Set(ALPHABET.slice(0, order))
      for (const drill of drills) {
        expect(lettersOf(drill.text).every((l) => learned.has(l)), `${order}: ${drill.text}`).toBe(true)
        expect(lettersOf(drill.text), `${order}: ${drill.text}`).toContain(letter)
      }
    }
  })

  it('never puts a vowel, jazm or tashdid on a bare alif', () => {
    for (const { drills } of allLessons) {
      for (const drill of drills) expect(drill.text, drill.text).not.toMatch(/ا[ً-ْ]/)
    }
  })

  it('only uses alif inside a word as a long vowel after zabar or ikki zabar', () => {
    for (const { drills } of allLessons) {
      for (const word of drills.flatMap((drill) => drill.text.split(' '))) {
        ;[...word].forEach((char, i) => {
          if (char === 'ا' && i > 0) expect([FATHA, FATHATAN], word).toContain(word[i - 1])
        })
      }
    }
  })

  it('never starts a word with a mark, jazm or tashdid', () => {
    for (const { drills } of allLessons) {
      for (const word of drills.flatMap((drill) => drill.text.split(' '))) {
        expect(word[0], word).not.toMatch(MARKS)
        expect(word.slice(0, 2), word).not.toMatch(new RegExp(`[${SUKUN}${SHADDA}]`))
      }
    }
  })

  it('covers every feature from lesson 2 on, gʻunna only once nun or mim is learned', () => {
    const mim = ALPHABET.indexOf('م') + 1
    for (const { order, drills } of allLessons.slice(1)) {
      const features = new Set(drills.flatMap((drill) => drill.features))
      for (const f of ['harakat', 'madd', 'sukun', 'shadda', 'tanwin'] as const) expect(features.has(f), `${order} ${f}`).toBe(true)
      expect(features.has('ghunna'), `lesson ${order}`).toBe(order >= mim)
    }
  })

  it('marks every nun or mim with tashdid as gʻunna', () => {
    for (const { drills } of allLessons) {
      for (const drill of drills) {
        if (new RegExp(`[نم]${SHADDA}`).test(drill.text)) expect(drill.features, drill.text).toContain('ghunna')
      }
    }
  })

  it('has no duplicate drills in a lesson', () => {
    for (const { drills } of allLessons) expect(new Set(drills.map((d) => d.text)).size).toBe(drills.length)
  })
})
