import { Link } from 'react-router'
import { useI18n } from '@/i18n/useI18n'
import { ErrorMessage } from '@/shared/components/StatusMessage'

export function NotFoundPage() {
  const { t } = useI18n()
  return (
    <>
      <ErrorMessage title={t('notFound.title')} message={t('notFound.message')} />
      <p style={{ textAlign: 'center' }}>
        <Link to="/">{t('notFound.home')}</Link>
      </p>
    </>
  )
}
