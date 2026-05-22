import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})

const root = document.getElementById('root')

if (!root) {
  throw new Error('TeamPilot root element is missing.')
}

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ToastContainer
        autoClose={3200}
        closeOnClick
        newestOnTop
        position="top-right"
        theme="colored"
      />
    </QueryClientProvider>
  </StrictMode>,
)
