import { createContext, useContext } from 'react'
import type { ActivityType } from '@/types/letter'
import type { ProgressState } from './progressState'

export interface ProgressContextValue {
  progress: ProgressState
  markDone: (letterId: number, activity: ActivityType) => void
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)

/** The child's progress and a function to record a finished activity. */
export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('useProgress must be used inside <ProgressProvider>.')
  return context
}
