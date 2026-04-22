import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { Loader2 } from 'lucide-react'
import AppLayout from '@/components/shared/AppLayout'

const LandingPage     = React.lazy(() => import('@/pages/LandingPage'))
const SignInPage      = React.lazy(() => import('@/pages/SignInPage'))
const SignUpPage      = React.lazy(() => import('@/pages/SignUpPage'))
const DashboardPage   = React.lazy(() => import('@/pages/DashboardPage'))
const ProblemsPage    = React.lazy(() => import('@/pages/ProblemsPage'))
const ProblemSolvePage = React.lazy(() => import('@/pages/ProblemSolvePage'))
const ProfilePage     = React.lazy(() => import('@/pages/ProfilePage'))
const ContestsPage    = React.lazy(() => import('@/pages/ContestsPage'))
const BattlePage      = React.lazy(() => import('@/pages/BattlePage'))

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-900">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
        <span className="text-sm text-slate-400">Loading…</span>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return <PageLoader />
  if (!isSignedIn) return <Navigate to="/sign-in" replace />
  return children
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard"        element={<DashboardPage />} />
          <Route path="/problems"         element={<ProblemsPage />} />
          <Route path="/problems/:slug"   element={<ProblemSolvePage />} />
          <Route path="/profile"          element={<ProfilePage />} />
          <Route path="/contests"         element={<ContestsPage />} />
          <Route path="/battle"           element={<BattlePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
