import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { safeStorage } from '@/shared/storage/safeStorage'
import type { ActivityType } from '@/types/letter'
import { ProgressContext } from './ProgressContext'
import { addPracticeXp, completeActivity, emptyProgress, parseProgress, type ProgressState } from './progressState'

/** Bump the version if the stored shape ever changes, so old data is ignored. */
const STORAGE_KEY = '63yil.progress.v1'

/**
 * Holds the child's progress for the whole app and saves it in the browser.
 * When user accounts arrive, only this file needs to change to save progress on the backend.
 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() =>
    parseProgress(safeStorage.read(STORAGE_KEY, emptyProgress)),
  )

  useEffect(() => safeStorage.write(STORAGE_KEY, progress), [progress])

  const markDone = useCallback((letterId: number, activity: ActivityType) => {
    setProgress((current) => completeActivity(current, letterId, activity))
  }, [])

  const earnPracticeXp = useCallback((amount: number) => {
    setProgress((current) => addPracticeXp(current, amount))
  }, [])

  const value = useMemo(() => ({ progress, markDone, earnPracticeXp }), [progress, markDone, earnPracticeXp])
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
