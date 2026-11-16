import type { PracticeSettings } from '@/features/practice/practiceSettings'
import { settingsToParams } from '@/features/practice/practiceSettings'
import type { ActivityType } from '@/types/letter'

/** URL builders, so links are never written by hand across the app. */
export const lessonPath = (letterId: number, activity: ActivityType = 'trace') => `/letters/${letterId}/${activity}`

/** Writing practice: the settings screen, optionally pre-filled. */
export const practiceSetupPath = (settings?: PracticeSettings) =>
  settings ? `/practice/write?${settingsToParams(settings)}` : '/practice/write'

/** Writing practice: a session with these settings. */
export const practicePlayPath = (settings: PracticeSettings) => `/practice/write/play?${settingsToParams(settings)}`
