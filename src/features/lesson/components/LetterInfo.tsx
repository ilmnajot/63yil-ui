import { useState } from 'react'
import { useI18n } from '@/i18n/useI18n'
import type { MessageKey } from '@/i18n/messages/uz'
import { Card } from '@/shared/components/Card'
import { COMPACT_QUERY, useMediaQuery } from '@/shared/hooks/useMediaQuery'
import type { Letter, LetterFormName } from '@/types/letter'
import styles from './LetterInfo.module.css'

const FORM_LABELS: Record<LetterFormName, MessageKey> = {
  isolated: 'info.form.isolated',
  initial: 'info.form.initial',
  medial: 'info.form.medial',
  final: 'info.form.final',
}

/**
 * How the letter sounds, where it comes from, its four shapes and an example word.
 * Collapsible: closed by default on phones (and short screens) so the activity is reachable without long scrolling,
 * open by default on tablets and laptops where there is room.
 */
export function LetterInfo({ letter }: { letter: Letter }) {
  const { t } = useI18n()
  const isCompact = useMediaQuery(COMPACT_QUERY)
  // `null` = the child hasn't toggled it yet, so follow the screen size.
  const [userOpen, setUserOpen] = useState<boolean | null>(null)
  const open = userOpen ?? !isCompact

  return (
    <Card className={styles.info}>
      <details
        open={open}
        onToggle={(event) => {
          const nowOpen = event.currentTarget.open
          if (nowOpen !== open) setUserOpen(nowOpen)
        }}
      >
        <summary className={styles.summary}>
          <span>{t('info.title')}</span>
          <span className={styles.chevron} aria-hidden="true">
            ⌄
          </span>
        </summary>

        <div className={styles.body}>
          <dl className={styles.facts}>
            <div>
              <dt>{t('info.sound')}</dt>
              <dd>{letter.sound}</dd>
            </div>
            <div>
              <dt>{t('info.makhraj')}</dt>
              <dd>{letter.makhraj}</dd>
            </div>
          </dl>

          <div>
            <h2 className={styles.heading}>{t('info.forms')}</h2>
            {/* Shown right to left, like Arabic is read. */}
            <ul className={styles.forms} dir="rtl">
              {(Object.keys(FORM_LABELS) as LetterFormName[]).map((form) => (
                <li key={form} className={styles.form}>
                  <span className={`arabic ${styles.formGlyph}`}>{letter.forms[form]}</span>
                  <span className={styles.formLabel} dir="ltr">
                    {t(FORM_LABELS[form])}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className={styles.example}>
            <span className={`arabic ${styles.exampleWord}`}>{letter.example.arabic}</span>
            <span>{t('info.example', { word: letter.example.transliteration, meaning: letter.example.meaning })}</span>
          </p>
        </div>
      </details>
    </Card>
  )
}
