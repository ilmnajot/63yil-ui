import { Link, Outlet, ScrollRestoration, type Location } from 'react-router'
import { useProgress } from '@/features/progress/ProgressContext'
import { lettersDoneCount, totalXp } from '@/features/progress/progressState'
import { useI18n } from '@/i18n/useI18n'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import styles from './AppLayout.module.css'

/**
 * Scroll position is remembered per *letter*, not per activity:
 * opening another letter starts at the top, but switching between its activities keeps your place.
 */
function scrollKey(location: Location): string {
  return location.pathname.replace(/\/(trace|write|listen|repeat)$/, '')
}

/** Frame around every page: header with the logo and the child's stats, then the page itself. */
export function AppLayout() {
  const { progress } = useProgress()
  const { t } = useI18n()

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            <span className={`arabic ${styles.logo}`} aria-hidden="true">
              أ ب
            </span>
            <span className={styles.brandName}>{t('app.brand')}</span>
          </Link>
          <div className={styles.right}>
            <ul className={styles.stats} aria-label={t('header.progress')}>
              <li className={styles.stat}>
                <span aria-hidden="true">⭐</span>
                <strong>{totalXp(progress)}</strong> {t('header.xp')}
              </li>
              <li className={styles.stat}>
                <span aria-hidden="true">🏅</span>
                {t('header.lettersDone', { count: lettersDoneCount(progress) })}
              </li>
            </ul>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <ScrollRestoration getKey={scrollKey} />
    </div>
  )
}
