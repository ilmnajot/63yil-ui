import type { Letter } from '@/types/letter'

/** Props every activity component receives from the lesson page. */
export interface ActivityProps {
  letter: Letter
  /** Called once the child has finished the activity successfully. */
  onComplete: () => void
}
