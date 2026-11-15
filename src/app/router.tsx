import { createBrowserRouter } from 'react-router'
import { LessonPage } from '@/features/lesson/LessonPage'
import { LettersPage } from '@/features/letters/LettersPage'
import { AppLayout } from './AppLayout'
import { NotFoundPage } from './NotFoundPage'

/**
 * All pages of the app.
 *   /                          -> list of letters
 *   /letters/:letterId/:activity -> one letter lesson (activity is optional, defaults to trace)
 */
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <LettersPage /> },
      { path: 'letters/:letterId/:activity?', element: <LessonPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
