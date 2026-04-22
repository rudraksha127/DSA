import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable. Add it to your .env file.')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111118',
              color: '#f1f5f9',
              border: '1px solid #22223a',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#111118' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#111118' },
            },
          }}
        />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
