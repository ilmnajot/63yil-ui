import { DrawingActivity } from '../drawing/DrawingActivity'
import type { ActivityProps } from '../types'

/** Trace: draw over the dotted model letter. */
export function TraceActivity(props: ActivityProps) {
  return <DrawingActivity {...props} mode="trace" />
}
