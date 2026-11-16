import type { Letter, LetterSummary } from '@/types/letter'

/** Props every activity component receives from the lesson page. */
export interface ActivityProps {
  letter: Letter
  /** All letters of the alphabet, in order (e.g. for reviewing the letters before this one). */
  alphabet: LetterSummary[]
  /** Called once the child has finished the activity successfully. */
  onComplete: () => void
}
