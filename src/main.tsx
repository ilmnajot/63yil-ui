import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './app/router'
import { ProgressProvider } from './features/progress/ProgressProvider'
import './styles/global.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing <div id="root"> in index.html')

createRoot(root).render(
  <StrictMode>
    <ProgressProvider>
      <RouterProvider router={router} />
    </ProgressProvider>
  </StrictMode>,
)
