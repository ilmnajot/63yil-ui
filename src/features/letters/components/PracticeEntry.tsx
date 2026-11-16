import { Link } from 'react-router'
import { practiceSetupPath } from '@/app/paths'
import { useI18n } from '@/i18n/useI18n'
import styles from './PracticeEntry.module.css'

/** Banner on the home page that opens the writing practice. */
export function PracticeEntry() {
  const { t } = useI18n()
  return (
    <Link to={practiceSetupPath()} className={styles.entry}>
      <span className={styles.icon} aria-hidden="true">
        ✍️
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{t('practice.entryTitle')}</span>
        <span className={styles.description}>{t('practice.entryText')}</span>
      </span>
      <span className={styles.cta}>{t('practice.entryButton')}</span>
    </Link>
  )
}
