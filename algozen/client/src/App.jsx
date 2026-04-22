import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ProblemsPage from './pages/ProblemsPage'
import ProblemDetailPage from './pages/ProblemDetailPage'
import ProfilePage from './pages/ProfilePage'
import ContestsPage from './pages/ContestsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="problems" element={<ProblemsPage />} />
        <Route path="problems/:slug" element={<ProblemDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="contests" element={<ContestsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
