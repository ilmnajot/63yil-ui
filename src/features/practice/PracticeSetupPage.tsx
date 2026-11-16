import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { lettersApi } from '@/api/lettersApi'
import { practicePlayPath } from '@/app/paths'
import { useProgress } from '@/features/progress/ProgressContext'
import { writtenLetterIds } from '@/features/progress/progressState'
import { describeError } from '@/i18n/describeError'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/shared/components/Button'
import { Card } from '@/shared/components/Card'
import { ErrorMessage, Loading } from '@/shared/components/StatusMessage'
import { useAsync } from '@/shared/hooks/useAsync'
import type { LetterSummary } from '@/types/letter'
import {
  MIN_LETTERS,
  parseSettings,
  PRACTICE_SIZES,
  type LetterSet,
  type PracticeSettings,
} from './practiceSettings'
import styles from './PracticeSetupPage.module.css'

/** Writing practice, step 1: choose which letters and how many. URL: `/practice/write`. */
export function PracticeSetupPage() {
  const { t } = useI18n()
  const letters = useAsync((signal) => lettersApi.list(signal), [])

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <h1>✍️ {t('practice.entryTitle')}</h1>
        <p>{t('practice.setupIntro')}</p>
      </header>

      {letters.status === 'loading' && <Loading />}
      {letters.status === 'error' && <ErrorMessage message={describeError(letters.error, t)} onRetry={letters.retry} />}
      {letters.status === 'success' && <SetupForm letters={letters.data} />}
    </div>
  )
}

function SetupForm({ letters }: { letters: LetterSummary[] }) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { progress } = useProgress()
  const written = writtenLetterIds(progress)
  const learnedAvailable = written.size >= MIN_LETTERS

  // Start from the URL (when coming back via "change settings"); otherwise prefer the child's own letters.
  const [settings, setSettings] = useState<PracticeSettings>(() => {
    const fromUrl = parseSettings(params, letters.length)
    if (params.has('set')) return fromUrl.set === 'learned' && !learnedAvailable ? { ...fromUrl, set: 'all' } : fromUrl
    return { ...fromUrl, set: learnedAvailable ? 'learned' : 'all' }
  })
  const update = (patch: Partial<PracticeSettings>) => setSettings((current) => ({ ...current, ...patch }))

  const options: { set: LetterSet; title: string; hint: string; disabled?: boolean }[] = [
    {
      set: 'learned',
      title: t('practice.set.learned'),
      hint: learnedAvailable
        ? t('practice.set.learnedHint', { count: written.size })
        : t('practice.set.learnedLocked', { min: MIN_LETTERS }),
      disabled: !learnedAvailable,
    },
    { set: 'all', title: t('practice.set.all'), hint: t('practice.set.allHint', { count: letters.length }) },
    { set: 'range', title: t('practice.set.range'), hint: t('practice.set.rangeHint') },
  ]

  const letterOptions = letters.map((letter) => (
    <option key={letter.id} value={letter.order}>
      {t('practice.option', { order: letter.order, name: letter.name })} {letter.arabic}
    </option>
  ))

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault()
        navigate(practicePlayPath(settings))
      }}
    >
      <Card>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>{t('practice.whichLetters')}</legend>
          <div className={styles.choices}>
            {options.map((option) => (
              <label
                key={option.set}
                className={[styles.choice, settings.set === option.set && styles.selected, option.disabled && styles.disabled]
                  .filter(Boolean)
                  .join(' ')}
              >
                <input
                  type="radio"
                  name="set"
                  value={option.set}
                  checked={settings.set === option.set}
                  disabled={option.disabled}
                  onChange={() => update({ set: option.set })}
                />
                <span className={styles.choiceTitle}>{option.title}</span>
                <span className={styles.choiceHint}>{option.hint}</span>
              </label>
            ))}
          </div>

          {settings.set === 'range' && (
            <div className={styles.range}>
              <label className={styles.select}>
                <span>{t('practice.from')}</span>
                <select
                  value={settings.from}
                  onChange={(event) => {
                    const from = Number(event.target.value)
                    update({ from, to: Math.max(from, settings.to) })
                  }}
                >
                  {letterOptions}
                </select>
              </label>
              <label className={styles.select}>
                <span>{t('practice.to')}</span>
                <select
                  value={settings.to}
                  onChange={(event) => {
                    const to = Number(event.target.value)
                    update({ to, from: Math.min(to, settings.from) })
                  }}
                >
                  {letterOptions}
                </select>
              </label>
            </div>
          )}
        </fieldset>
      </Card>

      <Card>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>{t('practice.howMany')}</legend>
          <div className={styles.sizes}>
            {PRACTICE_SIZES.map((size) => (
              <label key={size} className={[styles.size, settings.count === size && styles.selected].filter(Boolean).join(' ')}>
                <input
                  type="radio"
                  name="count"
                  value={size}
                  checked={settings.count === size}
                  onChange={() => update({ count: size })}
                />
                {size}
              </label>
            ))}
          </div>
        </fieldset>
      </Card>

      <Button type="submit" size="lg" className={styles.start}>
        {t('practice.start')} →
      </Button>
    </form>
  )
}
