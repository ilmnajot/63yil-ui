import type { ActivityType } from '@/types/letter'

/** URL builders, so links are never written by hand across the app. */
export const lessonPath = (letterId: number, activity: ActivityType = 'trace') => `/letters/${letterId}/${activity}`
