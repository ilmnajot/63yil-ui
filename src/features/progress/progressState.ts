/**
 * Pure progress logic (no React, no storage), so it is easy to unit-test.
 * Progress = which activities the child has finished for each letter, plus XP earned in practice.
 */
import { ACTIVITY_TYPES, type ActivityType } from '@/types/letter'

/** XP awarded for finishing one activity. */
export const XP_PER_ACTIVITY = 10

/** XP awarded for each letter written correctly in a writing practice session. */
export const XP_PER_PRACTICE_LETTER = 2

export interface ProgressState {
  /** Finished activities, keyed by letter id. */
  completed: Record<number, ActivityType[]>
  /** XP earned in writing practice (can be earned again and again, unlike activities). */
  practiceXp: number
}

export const emptyProgress: ProgressState = { completed: {}, practiceXp: 0 }

/** Marks an activity as done. Returns the same object if nothing changed. */
export function completeActivity(state: ProgressState, letterId: number, activity: ActivityType): ProgressState {
  const done = state.completed[letterId] ?? []
  if (done.includes(activity)) return state
  return { ...state, completed: { ...state.completed, [letterId]: [...done, activity] } }
}

export function isActivityDone(state: ProgressState, letterId: number, activity: ActivityType): boolean {
  return state.completed[letterId]?.includes(activity) ?? false
}

export function isLetterDone(state: ProgressState, letterId: number): boolean {
  return ACTIVITY_TYPES.every((activity) => isActivityDone(state, letterId, activity))
}

export function addPracticeXp(state: ProgressState, amount: number): ProgressState {
  return amount > 0 ? { ...state, practiceXp: state.practiceXp + amount } : state
}

export function totalXp(state: ProgressState): number {
  const fromActivities = Object.values(state.completed).reduce((sum, done) => sum + done.length * XP_PER_ACTIVITY, 0)
  return fromActivities + state.practiceXp
}

/** Letters the child has already written in a lesson: the pool for "my letters" in writing practice. */
export function writtenLetterIds(state: ProgressState): Set<number> {
  return new Set(
    Object.entries(state.completed)
      .filter(([, done]) => done.includes('write'))
      .map(([id]) => Number(id)),
  )
}

export function lettersDoneCount(state: ProgressState): number {
  return Object.keys(state.completed).filter((id) => isLetterDone(state, Number(id))).length
}

/** Validates data read from storage; anything unexpected becomes empty progress. */
export function parseProgress(value: unknown): ProgressState {
  if (typeof value !== 'object' || value === null || !('completed' in value)) return emptyProgress
  const { completed, practiceXp } = value as { completed: unknown; practiceXp?: unknown }
  if (typeof completed !== 'object' || completed === null) return emptyProgress

  const clean: Record<number, ActivityType[]> = {}
  for (const [id, list] of Object.entries(completed)) {
    if (!Array.isArray(list)) continue
    const valid = list.filter((item): item is ActivityType => ACTIVITY_TYPES.includes(item))
    if (valid.length > 0) clean[Number(id)] = [...new Set(valid)]
  }
  // Saved before practice existed → no practiceXp yet: start from 0.
  const xp = typeof practiceXp === 'number' && Number.isFinite(practiceXp) && practiceXp > 0 ? Math.floor(practiceXp) : 0
  return { completed: clean, practiceXp: xp }
}
