import { createBrowserRouter } from 'react-router'
import { LessonPage } from '@/features/lesson/LessonPage'
import { LettersPage } from '@/features/letters/LettersPage'
import { PracticePlayPage } from '@/features/practice/PracticePlayPage'
import { PracticeSetupPage } from '@/features/practice/PracticeSetupPage'
import { AppLayout } from './AppLayout'
import { NotFoundPage } from './NotFoundPage'

/**
 * All pages of the app.
 *   /                          -> list of letters
 *   /letters/:letterId/:activity -> one letter lesson (activity is optional, defaults to trace)
 *   /practice/write            -> writing practice: choose letters and how many
 *   /practice/write/play       -> writing practice session (settings in the query string)
 */
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <LettersPage /> },
      { path: 'letters/:letterId/:activity?', element: <LessonPage /> },
      { path: 'practice/write', element: <PracticeSetupPage /> },
      { path: 'practice/write/play', element: <PracticePlayPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
