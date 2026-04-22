import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import LandingPage from '@/pages/LandingPage'
import SignInPage from '@/pages/SignInPage'
import SignUpPage from '@/pages/SignUpPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                {/* Dashboard will be implemented in a future phase */}
                <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                  <p className="text-white text-xl">Dashboard — coming soon</p>
                </div>
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
