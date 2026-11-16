import { useProgress } from '@/features/progress/ProgressContext'
import { isActivityDone } from '@/features/progress/progressState'
import { LessonReview } from '@/features/practice/LessonReview'
import { DrawingActivity } from '../drawing/DrawingActivity'
import type { ActivityProps } from '../types'

/**
 * Write: draw the letter from memory on an empty canvas.
 * Once it's done, a short optional review of the earlier letters appears below.
 */
export function WriteActivity(props: ActivityProps) {
  const { progress } = useProgress()
  const written = isActivityDone(progress, props.letter.id, 'write')

  return (
    <>
      <DrawingActivity {...props} mode="write" />
      {written && <LessonReview letter={props.letter} alphabet={props.alphabet} />}
    </>
  )
}
