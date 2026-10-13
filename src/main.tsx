import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import App from './App.tsx'
import { queryClient } from './lib/queryClient'
import { ModeToggle } from './ModeToggle'
import { readSiteMode } from './siteMode'
import { router as multipageRouter } from './multipage/router'

const mode = readSiteMode()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ModeToggle mode={mode} />
      {mode === 'landing' ? <App /> : <RouterProvider router={multipageRouter} />}
    </QueryClientProvider>
  </StrictMode>,
)
