import { Navigate, useParams } from 'react-router'
import { ApiError } from '@/api/http'
import { lettersApi } from '@/api/lettersApi'
import { lessonPath } from '@/app/paths'
import { describeError } from '@/i18n/describeError'
import { useI18n } from '@/i18n/useI18n'
import { useAsync } from '@/shared/hooks/useAsync'
import { ErrorMessage, Loading } from '@/shared/components/StatusMessage'
import { availableActivities, isActivityType } from '@/types/letter'
import { ActivityPanel } from './components/ActivityPanel'
import { ActivityTabs } from './components/ActivityTabs'
import { LessonNav } from './components/LessonNav'
import { LetterHero } from './components/LetterHero'
import { LetterInfo } from './components/LetterInfo'
import styles from './LessonPage.module.css'

/**
 * One letter lesson. URL: `/letters/:letterId/:activity`, e.g. `/letters/1/trace`.
 * The activity lives in the URL so each one can be linked to, and the browser Back button works.
 */
export function LessonPage() {
  const params = useParams()
  const { t } = useI18n()
  const letterId = Number(params.letterId)
  const validId = Number.isInteger(letterId) && letterId > 0

  const lesson = useAsync(
    async (signal) => {
      if (!validId) throw new ApiError('notFound', 404, `Invalid letter id "${params.letterId}"`)
      const [letter, all] = await Promise.all([lettersApi.get(letterId, signal), lettersApi.list(signal)])
      return { letter, all }
    },
    [letterId],
  )

  if (validId && !isActivityType(params.activity)) {
    return <Navigate to={lessonPath(letterId)} replace />
  }
  if (lesson.status === 'loading') return <Loading label={t('lesson.loading')} />
  if (lesson.status === 'error') {
    return <ErrorMessage message={describeError(lesson.error, t)} onRetry={validId ? lesson.retry : undefined} />
  }

  const { letter, all } = lesson.data
  const steps = availableActivities(letter)
  const activity = isActivityType(params.activity) ? params.activity : 'trace'
  // e.g. /letters/2/join while the backend has no drills yet: go to the first step instead.
  if (!steps.includes(activity)) return <Navigate to={lessonPath(letter.id)} replace />
  const index = all.findIndex((item) => item.id === letter.id)

  return (
    <div className={styles.page}>
      <LessonNav letter={letter} previous={all[index - 1]} next={all[index + 1]} total={all.length} />

      <div className={styles.top}>
        <LetterHero letter={letter} />
        <LetterInfo letter={letter} />
      </div>

      <ActivityTabs letterId={letter.id} current={activity} available={steps} />
      <ActivityPanel letter={letter} activity={activity} alphabet={all} next={all[index + 1]} />
    </div>
  )
}
