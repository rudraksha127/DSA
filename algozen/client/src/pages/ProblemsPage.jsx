import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, Check, Lock } from 'lucide-react'
import clsx from 'clsx'
import FilterBar from '../components/problems/FilterBar'
import Spinner from '../components/ui/Spinner'
import useProblemStore from '../stores/useProblemStore'
import useUserStore from '../stores/useUserStore'

const DIFFICULTY_STYLES = {
  Rookie: 'text-green-400 bg-green-900/30 border border-green-700/30',
  Warrior: 'text-yellow-400 bg-yellow-900/30 border border-yellow-700/30',
  Legend: 'text-red-400 bg-red-900/30 border border-red-700/30',
}

function DifficultyBadge({ difficulty }) {
  return (
    <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded', DIFFICULTY_STYLES[difficulty])}>
      {difficulty}
    </span>
  )
}

function FilterSidebar({ statusFilter, setStatusFilter, onClose }) {
  const { filters, setFilters } = useProblemStore()

  const hasActiveFilters =
    filters.difficulty || filters.track || filters.topic || filters.search || statusFilter !== 'All'

  const clearAll = () => {
    setFilters({ difficulty: '', track: '', topic: '', search: '' })
    setStatusFilter('All')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Filters</h2>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg leading-none">
            ✕
          </button>
        )}
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {/* Status filter */}
      <div className="space-y-1">
        {['All', 'Solved', 'Unsolved'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={clsx(
              'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
              statusFilter === s
                ? 'bg-primary-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-dark-700',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Clear Filters */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            onClick={clearAll}
            className="w-full py-2 rounded-lg border border-dark-600 text-slate-400 text-sm hover:text-white hover:border-slate-500 transition-colors"
          >
            Clear Filters
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProblemCard({ problem, isSolved, isLocked }) {
  const acceptanceRate =
    problem.totalSubmissions > 0
      ? Math.round((problem.totalAccepted / problem.totalSubmissions) * 100)
      : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="bg-dark-800 border border-dark-600 rounded-xl p-4 hover:border-primary-500/40 transition-all cursor-pointer"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link
          to={`/problems/${problem.slug}`}
          className="text-sm font-semibold text-white hover:text-primary-400 transition-colors leading-snug"
        >
          {problem.title}
        </Link>
        {isLocked && (
          <div
            title={`Reach Level ${problem.levelRequired}`}
            className="shrink-0 flex items-center gap-1 text-xs text-slate-500 cursor-default"
          >
            <Lock size={13} className="text-slate-500" />
          </div>
        )}
      </div>

      {/* Second row: badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <DifficultyBadge difficulty={problem.difficulty} />
        {problem.topic && (
          <span className="text-slate-400 bg-dark-700 rounded px-2 py-0.5 text-xs">
            {problem.topic}
          </span>
        )}
        <span className="text-xs font-medium text-indigo-300 bg-indigo-900/30 border border-indigo-700/30 rounded px-2 py-0.5">
          +{problem.xpReward} XP
        </span>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {acceptanceRate !== null ? `${acceptanceRate}% acceptance` : 'No submissions yet'}
        </span>
        {isSolved && (
          <span className="flex items-center gap-1 text-green-400 font-medium">
            <Check size={13} />
            Solved
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default function ProblemsPage() {
  const { problems, loading, filters, totalPages, setFilters, setPage, fetchProblems } = useProblemStore()
  const { user, fetchUser } = useUserStore()

  const [statusFilter, setStatusFilter] = useState('All')
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  // Fetch on filter changes
  useEffect(() => {
    fetchProblems()
  }, [filters.track, filters.difficulty, filters.topic, filters.search, filters.page])

  // Fetch user on mount if not loaded
  useEffect(() => {
    if (!user) {
      fetchUser()
    }
  }, [])

  const solvedSet = new Set(user?.solvedProblems ?? [])

  // Client-side status filter
  const visibleProblems = problems.filter((p) => {
    if (statusFilter === 'Solved') return solvedSet.has(p._id)
    if (statusFilter === 'Unsolved') return !solvedSet.has(p._id)
    return true
  })

  const potd = problems.find((p) => p.isPOTD)

  const sidebarProps = { statusFilter, setStatusFilter }

  return (
    <div className="flex h-full">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-full overflow-y-auto bg-dark-800 border-r border-dark-600 p-4 space-y-6">
        <FilterSidebar {...sidebarProps} />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-72 bg-dark-800 border-r border-dark-600 p-4 z-50 overflow-y-auto lg:hidden"
            >
              <FilterSidebar {...sidebarProps} onClose={() => setMobileDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Mobile header row */}
        <div className="flex items-center justify-between lg:hidden">
          <h1 className="text-xl font-bold text-white">Problems</h1>
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800 border border-dark-600 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>
        </div>

        {/* POTD */}
        <AnimatePresence>
          {potd && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.3 }}
              className="border border-primary-500/50 bg-gradient-to-r from-primary-900/20 to-accent-900/20 rounded-2xl p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    🔥 Problem of the Day
                  </span>
                  <h2 className="text-lg font-bold text-white leading-snug">{potd.title}</h2>
                  <div className="flex items-center gap-2">
                    <DifficultyBadge difficulty={potd.difficulty} />
                    <span className="text-xs font-medium text-indigo-300 bg-indigo-900/30 border border-indigo-700/30 rounded px-2 py-0.5">
                      +{potd.xpReward} XP
                    </span>
                  </div>
                </div>
                <Link
                  to={`/problems/${potd.slug}`}
                  className="shrink-0 inline-flex items-center gap-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Solve Now →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Problem Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleProblems.map((p) => (
                <ProblemCard
                  key={p._id}
                  problem={p}
                  isSolved={solvedSet.has(p._id)}
                  isLocked={false}
                />
              ))}
            </div>
            {visibleProblems.length === 0 && (
              <p className="text-center text-slate-500 py-20">No problems found</p>
            )}
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, filters.page - 1))}
                  disabled={filters.page === 1}
                  className="px-4 py-2 bg-slate-800 rounded-lg disabled:opacity-40"
                >
                  ← Prev
                </button>
                <span className="px-4 py-2 text-slate-400">
                  Page {filters.page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(filters.page + 1)}
                  disabled={filters.page >= totalPages}
                  className="px-4 py-2 bg-slate-800 rounded-lg disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

