import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function Root() {
  if (!PUBLISHABLE_KEY) {
    // Dev-only warning — allows the app to render without crashing
    console.warn(
      '[AlgoZen] VITE_CLERK_PUBLISHABLE_KEY is not set. Auth features are disabled. ' +
      'Copy .env.example → .env and fill in your Clerk key.'
    )
    return <App />
  }
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
