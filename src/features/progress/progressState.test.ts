import { describe, expect, it } from 'vitest'
import {
  completeActivity,
  emptyProgress,
  isActivityDone,
  isLetterDone,
  lettersDoneCount,
  parseProgress,
  totalXp,
  XP_PER_ACTIVITY,
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

  it('marks a letter done only after all four activities', () => {
    let state = emptyProgress
    for (const activity of ['trace', 'write', 'listen'] as const) state = completeActivity(state, 2, activity)
    expect(isLetterDone(state, 2)).toBe(false)
    state = completeActivity(state, 2, 'repeat')
    expect(isLetterDone(state, 2)).toBe(true)
    expect(lettersDoneCount(state)).toBe(1)
  })

  it('ignores broken or unknown data from storage', () => {
    expect(parseProgress(null)).toEqual(emptyProgress)
    expect(parseProgress('nonsense')).toEqual(emptyProgress)
    expect(parseProgress({ completed: { 3: ['trace', 'dance', 'trace'], 4: 'oops' } })).toEqual({
      completed: { 3: ['trace'] },
    })
  })
})
