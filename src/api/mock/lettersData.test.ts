import { describe, expect, it } from 'vitest'
import { mockLetters } from './lettersData'

describe('mock letters (also the database seed)', () => {
  it('has all 28 letters in order', () => {
    expect(mockLetters).toHaveLength(28)
    expect(mockLetters.map((letter) => letter.order)).toEqual([...Array(28).keys()].map((i) => i + 1))
  })

  it('gives every Listen quiz 3 different wrong answers, never the letter itself', () => {
    for (const letter of mockLetters) {
      const ids = letter.activities.listen.distractors.map((item) => item?.id)
      expect(ids, letter.name).toHaveLength(3)
      expect(ids.every(Boolean), letter.name).toBe(true)
      expect(new Set(ids).size, letter.name).toBe(3)
      expect(ids, letter.name).not.toContain(letter.id)
    }
  })

  it('fits the column sizes of realdb.letters', () => {
    for (const l of mockLetters) {
      expect(l.arabic.length, l.name).toBeLessThanOrEqual(4)
      expect(l.arabicName.length, l.name).toBeLessThanOrEqual(20)
      expect(l.name.length, l.name).toBeLessThanOrEqual(30)
      expect(l.sound.length, l.name).toBeLessThanOrEqual(200)
      expect(l.makhraj.length, l.name).toBeLessThanOrEqual(200)
      for (const form of Object.values(l.forms)) expect(form.length, l.name).toBeLessThanOrEqual(8)
      expect(l.example.arabic.length, l.name).toBeLessThanOrEqual(50)
      expect(l.example.transliteration.length, l.name).toBeLessThanOrEqual(50)
      expect(l.example.meaning.length, l.name).toBeLessThanOrEqual(100)
      for (const activity of Object.values(l.activities)) expect(activity!.instructions.length, l.name).toBeLessThanOrEqual(300)
      for (const drill of l.activities.join!.drills) expect(drill.text.length, drill.text).toBeLessThanOrEqual(30)
    }
  })
})
