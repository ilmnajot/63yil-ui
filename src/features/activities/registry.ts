/**
 * The list of activities a letter has, and how each one is shown.
 * To add a new activity: create its component, add its type to `ACTIVITY_TYPES`
 * in `src/types/letter.ts`, add its texts to `src/i18n/messages/*`, and add an entry here.
 * See `docs/ARCHITECTURE.md`.
 */
import type { ComponentType } from 'react'
import type { MessageKey } from '@/i18n/messages/uz'
import type { ActivityType } from '@/types/letter'
import { ListenActivity } from './listen/ListenActivity'
import { RepeatActivity } from './repeat/RepeatActivity'
import { TraceActivity } from './trace/TraceActivity'
import type { ActivityProps } from './types'
import { WriteActivity } from './write/WriteActivity'

export interface ActivityDefinition {
  /** Translation key of the activity name, e.g. "Chizish". */
  labelKey: MessageKey
  /** Translation key of the short line under the name on the activity tab. */
  descriptionKey: MessageKey
  icon: string
  component: ComponentType<ActivityProps>
}

export const ACTIVITIES: Record<ActivityType, ActivityDefinition> = {
  trace: {
    labelKey: 'activity.trace.label',
    descriptionKey: 'activity.trace.description',
    icon: '✏️',
    component: TraceActivity,
  },
  write: {
    labelKey: 'activity.write.label',
    descriptionKey: 'activity.write.description',
    icon: '🖍️',
    component: WriteActivity,
  },
  listen: {
    labelKey: 'activity.listen.label',
    descriptionKey: 'activity.listen.description',
    icon: '🔊',
    component: ListenActivity,
  },
  repeat: {
    labelKey: 'activity.repeat.label',
    descriptionKey: 'activity.repeat.description',
    icon: '🎤',
    component: RepeatActivity,
  },
}
