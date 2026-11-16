import { lettersApi } from '@/api/lettersApi'
import { describeError } from '@/i18n/describeError'
import { useI18n } from '@/i18n/useI18n'
import { useAsync } from '@/shared/hooks/useAsync'
import { ErrorMessage, Loading } from '@/shared/components/StatusMessage'
import { LetterTile } from './components/LetterTile'
import { PracticeEntry } from './components/PracticeEntry'
import styles from './LettersPage.module.css'

/** Home page: every letter of the alphabet, with the child's progress on each. */
export function LettersPage() {
  const { t } = useI18n()
  const letters = useAsync((signal) => lettersApi.list(signal), [])

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <h1>{t('letters.title')}</h1>
        <p>{t('letters.intro')}</p>
      </header>

      <PracticeEntry />

      {letters.status === 'loading' && <Loading label={t('letters.loading')} />}
      {letters.status === 'error' && (
        <ErrorMessage message={describeError(letters.error, t)} onRetry={letters.retry} />
      )}
      {letters.status === 'success' && (
        // The alphabet reads right to left, so the grid does too.
        <ol className={styles.grid} dir="rtl">
          {letters.data.map((letter) => (
            <li key={letter.id} dir="ltr">
              <LetterTile letter={letter} />
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
