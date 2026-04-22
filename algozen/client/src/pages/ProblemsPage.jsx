import { useState, useEffect } from 'react'
import api from '../lib/api'
import ProblemCard from '../components/problems/ProblemCard'
import FilterBar from '../components/problems/FilterBar'
import Spinner from '../components/ui/Spinner'

export default function ProblemsPage() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  useEffect(() => {
    setPage(1)
  }, [filters])

  useEffect(() => {
    setLoading(true)
    const params = { page, limit, ...filters }
    api.get('/api/problems', { params })
      .then(({ data }) => { setProblems(data.problems || []); setTotal(data.total || 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, filters])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Problems</h1>
      <FilterBar filters={filters} onChange={setFilters} />
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problems.map(p => <ProblemCard key={p._id} problem={p} />)}
          </div>
          {problems.length === 0 && (
            <p className="text-center text-slate-500 py-20">No problems found</p>
          )}
          {total > limit && (
            <div className="flex justify-center gap-3 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-slate-800 rounded-lg disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="px-4 py-2 text-slate-400">Page {page}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= total}
                className="px-4 py-2 bg-slate-800 rounded-lg disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
