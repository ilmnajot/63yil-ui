import { describe, expect, it } from 'vitest'
import {
  addPracticeXp,
  completeActivity,
  emptyProgress,
  isActivityDone,
  isLetterDone,
  lettersDoneCount,
  parseProgress,
  totalXp,
  writtenLetterIds,
  XP_PER_ACTIVITY,
  XP_PER_PRACTICE_LETTER,
} from './progressState'

describe('progressState', () => {
  it('records a finished activity', () => {
    const state = completeActivity(emptyProgress, 1, 'trace')
    expect(isActivityDone(state, 1, 'trace')).toBe(true)
    expect(isActivityDone(state, 1, 'write')).toBe(false)
  })

  it('does not count the same activity twice', () => {
    const once = completeActivity(emptyProgress, 1, 'trace')
    expect(completeActivity(once, 1, 'trace')).toBe(once)
    expect(totalXp(once)).toBe(XP_PER_ACTIVITY)
  })

  it('marks a letter done only after all five steps, Birikma included', () => {
    let state = emptyProgress
    for (const activity of ['trace', 'write', 'listen', 'repeat'] as const) state = completeActivity(state, 2, activity)
    expect(isLetterDone(state, 2)).toBe(false)
    state = completeActivity(state, 2, 'join')
    expect(isLetterDone(state, 2)).toBe(true)
    expect(lettersDoneCount(state)).toBe(1)
  })

  it('adds practice XP to the total', () => {
    const state = addPracticeXp(completeActivity(emptyProgress, 1, 'trace'), 3 * XP_PER_PRACTICE_LETTER)
    expect(totalXp(state)).toBe(XP_PER_ACTIVITY + 3 * XP_PER_PRACTICE_LETTER)
    expect(completeActivity(state, 1, 'write').practiceXp).toBe(6)
  })

  it('lists letters already written in a lesson', () => {
    const state = completeActivity(completeActivity(emptyProgress, 4, 'write'), 7, 'trace')
    expect([...writtenLetterIds(state)]).toEqual([4])
  })

  it('reads progress saved before practice XP existed', () => {
    expect(parseProgress({ completed: { 1: ['trace'] } })).toEqual({ completed: { 1: ['trace'] }, practiceXp: 0 })
  })

  it('ignores broken or unknown data from storage', () => {
    expect(parseProgress(null)).toEqual(emptyProgress)
    expect(parseProgress('nonsense')).toEqual(emptyProgress)
    expect(parseProgress({ completed: { 3: ['trace', 'dance', 'trace'], 4: 'oops' }, practiceXp: -5 })).toEqual({
      completed: { 3: ['trace'] },
      practiceXp: 0,
    })
  })
})
