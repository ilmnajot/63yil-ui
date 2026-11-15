import { DrawingActivity } from '../drawing/DrawingActivity'
import type { ActivityProps } from '../types'

/** Write: draw the letter from memory on an empty canvas. */
export function WriteActivity(props: ActivityProps) {
  return <DrawingActivity {...props} mode="write" />
}
