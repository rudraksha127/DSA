import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="text-center py-20 space-y-4">
      <h1 className="text-6xl font-bold text-indigo-400">404</h1>
      <p className="text-xl text-slate-400">Page not found</p>
      <Link to="/" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg">
        Go Home
      </Link>
    </div>
  )
}
