import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { lettersApi } from '@/api/lettersApi'
import { practiceSetupPath } from '@/app/paths'
import { useProgress } from '@/features/progress/ProgressContext'
import { writtenLetterIds } from '@/features/progress/progressState'
import { describeError } from '@/i18n/describeError'
import { useI18n } from '@/i18n/useI18n'
import { ErrorMessage, Loading } from '@/shared/components/StatusMessage'
import { useAsync } from '@/shared/hooks/useAsync'
import { PracticeSession } from './components/PracticeSession'
import { buildQueue, parseSettings, pickPool } from './practiceSettings'

/**
 * Writing practice, step 2: the session itself. URL: `/practice/write/play?set=range&from=11&to=23&count=10`.
 * Builds a random order of letters from the settings, then loads each letter's details (for its sound).
 */
export function PracticePlayPage() {
  const { t } = useI18n()
  const [params] = useSearchParams()
  const { progress } = useProgress()
  // Bumped by "Yana mashq qilish" to start a new random session with the same settings.
  const [round, setRound] = useState(0)

  const session = useAsync(
    async (signal) => {
      const letters = await lettersApi.list(signal)
      const settings = parseSettings(params, letters.length)
      // Progress is read when the session is built; XP earned during the session doesn't rebuild it.
      const queue = buildQueue(pickPool(letters, settings, writtenLetterIds(progress)), settings.count)
      const uniqueIds = [...new Set(queue.map((letter) => letter.id))]
      const details = await Promise.all(uniqueIds.map((id) => lettersApi.get(id, signal)))
      const byId = new Map(details.map((letter) => [letter.id, letter]))
      return { settings, items: queue.map((letter) => byId.get(letter.id)!) }
    },
    [params.toString(), round],
  )

  if (session.status === 'loading') return <Loading label={t('practice.loading')} />
  if (session.status === 'error') {
    return <ErrorMessage message={describeError(session.error, t)} onRetry={session.retry} />
  }
  if (session.data.items.length === 0) {
    return (
      <>
        <ErrorMessage title={t('practice.entryTitle')} message={t('practice.empty')} />
        <p style={{ textAlign: 'center' }}>
          <Link to={practiceSetupPath()}>{t('practice.change')}</Link>
        </p>
      </>
    )
  }

  return (
    <PracticeSession
      key={round}
      items={session.data.items}
      onAgain={() => setRound((n) => n + 1)}
      exit={<Link to={practiceSetupPath(session.data.settings)}>{t('practice.exit')}</Link>}
      summaryActions={
        <>
          <Link to={practiceSetupPath(session.data.settings)}>{t('practice.change')}</Link>
          <Link to="/">{t('practice.home')}</Link>
        </>
      }
    />
  )
}
