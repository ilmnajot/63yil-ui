/**
 * Pure progress logic (no React, no storage), so it is easy to unit-test.
 * Progress = which activities the child has finished for each letter.
 */
import { ACTIVITY_TYPES, type ActivityType } from '@/types/letter'

/** XP awarded for finishing one activity. */
export const XP_PER_ACTIVITY = 10

export interface ProgressState {
  /** Finished activities, keyed by letter id. */
  completed: Record<number, ActivityType[]>
}

export const emptyProgress: ProgressState = { completed: {} }

/** Marks an activity as done. Returns the same object if nothing changed. */
export function completeActivity(state: ProgressState, letterId: number, activity: ActivityType): ProgressState {
  const done = state.completed[letterId] ?? []
  if (done.includes(activity)) return state
  return { completed: { ...state.completed, [letterId]: [...done, activity] } }
}

export function isActivityDone(state: ProgressState, letterId: number, activity: ActivityType): boolean {
  return state.completed[letterId]?.includes(activity) ?? false
}

export function isLetterDone(state: ProgressState, letterId: number): boolean {
  return ACTIVITY_TYPES.every((activity) => isActivityDone(state, letterId, activity))
}

export function totalXp(state: ProgressState): number {
  return Object.values(state.completed).reduce((sum, done) => sum + done.length * XP_PER_ACTIVITY, 0)
}

export function lettersDoneCount(state: ProgressState): number {
  return Object.keys(state.completed).filter((id) => isLetterDone(state, Number(id))).length
}

/** Validates data read from storage; anything unexpected becomes empty progress. */
export function parseProgress(value: unknown): ProgressState {
  if (typeof value !== 'object' || value === null || !('completed' in value)) return emptyProgress
  const completed = (value as { completed: unknown }).completed
  if (typeof completed !== 'object' || completed === null) return emptyProgress

  const clean: Record<number, ActivityType[]> = {}
  for (const [id, list] of Object.entries(completed)) {
    if (!Array.isArray(list)) continue
    const valid = list.filter((item): item is ActivityType => ACTIVITY_TYPES.includes(item))
    if (valid.length > 0) clean[Number(id)] = [...new Set(valid)]
  }
  return { completed: clean }
}
