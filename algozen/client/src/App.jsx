import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/shared/AppLayout'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import ProblemsPage from './pages/ProblemsPage'
import ProblemDetailPage from './pages/ProblemDetailPage'
import ProblemSolvePage from './pages/ProblemSolvePage'
import ProfilePage from './pages/ProfilePage'
import ContestsPage from './pages/ContestsPage'
import BattlePage from './pages/BattlePage'
import NotFoundPage from './pages/NotFoundPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'

export default function App() {
  return (
    <Routes>
      {/* Standalone pages (no shared layout) */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />

      {/* Full-screen code editor (has its own header) */}
      <Route path="/problems/:slug/solve" element={<ProblemSolvePage />} />

      {/* App layout with sidebar */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problems/:slug" element={<ProblemDetailPage />} />
        <Route path="/contests" element={<ContestsPage />} />
        <Route path="/battle" element={<BattlePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
