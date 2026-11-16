import { createContext, useContext } from 'react'
import type { ActivityType } from '@/types/letter'
import type { ProgressState } from './progressState'

export interface ProgressContextValue {
  progress: ProgressState
  markDone: (letterId: number, activity: ActivityType) => void
  /** Adds XP earned in writing practice. */
  earnPracticeXp: (amount: number) => void
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)

/** The child's progress and functions to record finished activities and practice XP. */
export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('useProgress must be used inside <ProgressProvider>.')
  return context
}
