import type { ComponentPropsWithRef } from 'react'
import styles from './Card.module.css'

/** White rounded panel used for every block of content. */
export function Card({ className, ...rest }: ComponentPropsWithRef<'section'>) {
  return <section className={[styles.card, className].filter(Boolean).join(' ')} {...rest} />
}
