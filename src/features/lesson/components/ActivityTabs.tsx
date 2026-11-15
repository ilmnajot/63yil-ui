import { Link } from 'react-router'
import { lessonPath } from '@/app/paths'
import { ACTIVITIES } from '@/features/activities/registry'
import { useProgress } from '@/features/progress/ProgressContext'
import { isActivityDone } from '@/features/progress/progressState'
import { useI18n } from '@/i18n/useI18n'
import { ACTIVITY_TYPES, type ActivityType } from '@/types/letter'
import styles from './ActivityTabs.module.css'

interface ActivityTabsProps {
  letterId: number
  current: ActivityType
}

/** The four activity buttons (Trace, Write, Listen, Repeat) with a check mark when done. */
export function ActivityTabs({ letterId, current }: ActivityTabsProps) {
  const { progress } = useProgress()
  const { t } = useI18n()

  return (
    <nav aria-label={t('activities.nav')}>
      <ul className={styles.tabs}>
        {ACTIVITY_TYPES.map((type) => {
          const { labelKey, descriptionKey, icon } = ACTIVITIES[type]
          const done = isActivityDone(progress, letterId, type)
          const active = type === current
          return (
            <li key={type}>
              <Link
                to={lessonPath(letterId, type)}
                className={[styles.tab, styles[type], active && styles.active].filter(Boolean).join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                <span className={styles.icon} aria-hidden="true">
                  {icon}
                </span>
                <span className={styles.label}>{t(labelKey)}</span>
                <span className={styles.description}>{t(descriptionKey)}</span>
                {done && (
                  <span className={styles.check} aria-label={t('activities.done')}>
                    ✓
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
