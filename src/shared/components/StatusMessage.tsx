import { useI18n } from '@/i18n/useI18n'
import { Button } from './Button'
import styles from './StatusMessage.module.css'

interface LoadingProps {
  label?: string
}

/** Shown while data is loading. */
export function Loading({ label }: LoadingProps) {
  const { t } = useI18n()
  return (
    <div className={styles.status} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <p>{label ?? t('status.loading')}</p>
    </div>
  )
}

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
}

/** Shown when something failed, with an optional "Try again" button. */
export function ErrorMessage({ title, message, onRetry }: ErrorMessageProps) {
  const { t } = useI18n()
  return (
    <div className={styles.status} role="alert">
      <p className={styles.title}>{title ?? t('status.errorTitle')}</p>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          {t('status.retry')}
        </Button>
      )}
    </div>
  )
}
