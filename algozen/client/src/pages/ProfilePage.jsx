import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import useUserStore from '@/stores/useUserStore'
import api from '@/lib/api'

const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000]
const CREATURE_EMOJIS = ['🥚', '🐣', '🦎', '🐉', '⚡']

const EVOLUTION_STAGES = [
  { stage: 0, emoji: '🥚', name: 'Egg',      label: 'Level 1'  },
  { stage: 1, emoji: '🐣', name: 'Hatchling', label: 'Level 5'  },
  { stage: 2, emoji: '🦎', name: 'Lizard',   label: 'Level 15' },
  { stage: 3, emoji: '🐉', name: 'Dragon',   label: 'Level 30' },
  { stage: 4, emoji: '⚡', name: 'Legend',   label: 'Level 50' },
]

const RANK_COLORS = {
  Rookie:  'bg-slate-700 text-slate-300',
  Warrior: 'bg-yellow-900/60 text-yellow-400',
  Legend:  'bg-red-900/60 text-red-400',
  Master:  'bg-purple-900/60 text-purple-400',
}

function getLevelProgress(xp, level) {
  const current = LEVEL_THRESHOLDS[level - 1] ?? 0
  const next    = LEVEL_THRESHOLDS[level]     ?? (LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 1000)
  const pct     = Math.max(0, Math.min(100, ((xp - current) / (next - current)) * 100))
  return { current, next, pct }
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function difficultyBadge(difficulty) {
  if (!difficulty) return <span className="text-slate-500">-</span>
  const map = {
    Easy:   'bg-green-900/50 text-green-400',
    Medium: 'bg-yellow-900/50 text-yellow-400',
    Hard:   'bg-red-900/50 text-red-400',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[difficulty] ?? 'bg-slate-700 text-slate-300'}`}>
      {difficulty}
    </span>
  )
}

function statusBadge(status) {
  const map = {
    Accepted:           'bg-green-900/50 text-green-400',
    WrongAnswer:        'bg-red-900/50 text-red-400',
    TimeLimitExceeded:  'bg-yellow-900/50 text-yellow-400',
    RuntimeError:       'bg-orange-900/50 text-orange-400',
    CompileError:       'bg-pink-900/50 text-pink-400',
  }
  const label = status?.replace(/([A-Z])/g, ' $1').trim() ?? 'Unknown'
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${map[status] ?? 'bg-slate-700 text-slate-300'}`}>
      {label}
    </span>
  )
}

// ─────────────────────────────────────────────
// Hero Profile Card
// ─────────────────────────────────────────────
function HeroCard({ user }) {
  const level    = user.level  ?? 1
  const xp       = user.xp    ?? 0
  const stage    = user.creature?.stage ?? 0
  const rank     = user.rank   ?? 'Rookie'
  const { pct }  = getLevelProgress(xp, level)
  const radius   = 45
  const circ     = 2 * Math.PI * radius
  const offset   = circ - (pct / 100) * circ

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-dark-800/60 backdrop-blur-sm border border-primary-500/20 rounded-2xl p-6"
    >
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left – Creature */}
        <div className="flex flex-col items-center justify-center gap-3 min-w-[140px]">
          <span className="text-6xl animate-float select-none">{CREATURE_EMOJIS[stage]}</span>
          <p className="text-white font-semibold text-sm">{user.creature?.name ?? 'Unnamed'}</p>
          <div className="flex gap-1.5 items-center">
            {EVOLUTION_STAGES.map((s) => (
              <span
                key={s.stage}
                className={`w-3 h-3 rounded-full ${s.stage <= stage ? 'bg-primary-500' : 'bg-dark-600'}`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">Stage {stage}/4</span>
        </div>

        {/* Center – XP ring + info */}
        <div className="flex flex-col items-center justify-center gap-3 flex-1">
          <p className="text-2xl font-bold text-white">{user.username ?? 'Unknown'}</p>
          <p className="text-sm text-slate-400">{user.email ?? ''}</p>

          <svg width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            {/* Background circle */}
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#1a1a27" strokeWidth="10" />
            {/* Progress circle */}
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke="url(#xpGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
            />
            <text x="60" y="65" textAnchor="middle" fontWeight="bold" fontSize="22" fill="white">
              {level}
            </text>
          </svg>

          <div className="flex gap-2 items-center flex-wrap justify-center">
            <span className="bg-primary-600/30 text-primary-400 text-xs font-semibold px-3 py-1 rounded-full">
              Level {level}
            </span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${RANK_COLORS[rank] ?? RANK_COLORS.Rookie}`}>
              {rank}
            </span>
          </div>
        </div>

        {/* Right – Stats grid */}
        <div className="grid grid-cols-2 gap-3 flex-1">
          {[
            { icon: '🔥', label: 'Current Streak', value: `${user.streak?.current ?? 0} days`              },
            { icon: '📅', label: 'Longest Streak', value: `${user.streak?.longest ?? 0} days`              },
            { icon: '✅', label: 'Problems Solved', value: `${user.solvedProblems?.length ?? 0}`            },
            { icon: '🏆', label: 'Total XP',        value: `${(user.xp ?? 0).toLocaleString()} XP`         },
          ].map((stat) => (
            <div key={stat.label} className="bg-dark-700 rounded-xl p-4 flex flex-col gap-1">
              <span className="text-xl">{stat.icon}</span>
              <p className="text-xs text-slate-400 leading-tight">{stat.label}</p>
              <p className="text-white font-bold text-sm">{stat.value}</p>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// Solving Activity Heatmap
// ─────────────────────────────────────────────
function HeatmapCard({ user }) {
  const WEEKS = 52
  const DAYS  = 7

  const heatmapData = useMemo(() => {
    const totalSolved = user?.solvedProblems?.length ?? 0
    const grid = Array(WEEKS).fill(null).map(() => Array(DAYS).fill(0))
    let seed = totalSolved * 31 + 17
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff
      return Math.abs(seed) / 0xffffffff
    }
    let remaining = totalSolved
    for (let attempt = 0; attempt < totalSolved * 3 && remaining > 0; attempt++) {
      const weekOffset = Math.floor(rand() * 20)
      const week = WEEKS - 1 - weekOffset
      const day  = Math.floor(rand() * DAYS)
      if (grid[week][day] < 3) { grid[week][day]++; remaining-- }
    }
    return grid
  }, [user?.solvedProblems?.length])

  // Compute date for cell (week, day) counting from today
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  function cellDate(weekIdx, dayIdx) {
    const weeksAgo = WEEKS - 1 - weekIdx
    const d = new Date(today)
    d.setDate(d.getDate() - weeksAgo * 7 - (DAYS - 1 - dayIdx))
    return d
  }

  // Last 6 month labels
  const monthLabels = useMemo(() => {
    const labels = []
    for (let m = 5; m >= 0; m--) {
      const d = new Date(today)
      d.setMonth(d.getMonth() - m, 1)
      labels.push({
        label: d.toLocaleString('default', { month: 'short' }),
        // approximate column index
        colIdx: Math.max(0, Math.floor(WEEKS - 1 - (m * 4.33))),
      })
    }
    return labels
  }, [today])

  const intensityClass = (val) => {
    if (val === 0) return 'bg-dark-700'
    if (val === 1) return 'bg-primary-500/30'
    if (val === 2) return 'bg-primary-500/60'
    return 'bg-primary-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-dark-800 border border-dark-600 rounded-2xl p-6"
    >
      <h2 className="text-lg font-bold text-white mb-4">Solving Activity 📊</h2>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Month labels */}
          <div className="flex mb-1" style={{ paddingLeft: '0px' }}>
            {monthLabels.map((m) => (
              <div
                key={m.label}
                className="text-xs text-slate-500"
                style={{ marginLeft: `${m.colIdx === 0 ? 0 : 2}px`, minWidth: `${Math.floor(WEEKS / 6) * 14}px` }}
              >
                {m.label}
              </div>
            ))}
          </div>

          {/* Grid: columns = weeks, rows = days */}
          <div className="flex gap-0.5">
            {heatmapData.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-0.5">
                {week.map((val, dIdx) => {
                  const date = cellDate(wIdx, dIdx)
                  const dateStr = date.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })
                  return (
                    <div
                      key={dIdx}
                      title={`${val} problem${val !== 1 ? 's' : ''} on ${dateStr}`}
                      className={`w-3 h-3 rounded-sm ${intensityClass(val)} cursor-default`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-xs text-slate-500">Less</span>
        {[0, 1, 2, 3].map((v) => (
          <div key={v} className={`w-3 h-3 rounded-sm ${intensityClass(v)}`} />
        ))}
        <span className="text-xs text-slate-500">More</span>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// Creature Evolution Card
// ─────────────────────────────────────────────
function EvolutionCard({ user }) {
  const currentStage = user?.creature?.stage ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-dark-800 border border-dark-600 rounded-2xl p-6"
    >
      <h2 className="text-lg font-bold text-white mb-4">Evolution Journey 🧬</h2>

      <div className="flex flex-col gap-0">
        {EVOLUTION_STAGES.map((s, idx) => {
          const isCurrent = s.stage === currentStage
          const isPast    = s.stage < currentStage
          const isNext    = s.stage === currentStage + 1

          return (
            <div key={s.stage} className="flex flex-col">
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isCurrent
                    ? 'bg-primary-600/20 border border-primary-500/40'
                    : 'border border-transparent'
                }`}
              >
                <span className={`text-2xl ${isPast ? 'opacity-50' : ''}`}>{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${isPast ? 'text-slate-500' : isCurrent ? 'text-white' : 'text-slate-400'}`}>
                    {s.name}
                  </p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  {isNext && (
                    <p className="text-xs text-primary-400 mt-0.5">Next evolution</p>
                  )}
                </div>
                {isPast && (
                  <span className="text-green-400 text-lg">✓</span>
                )}
                {isCurrent && (
                  <span className="text-xs bg-primary-600/30 text-primary-400 font-semibold px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </div>

              {/* Connector line between stages */}
              {idx < EVOLUTION_STAGES.length - 1 && (
                <div className="flex justify-center">
                  <div className={`w-0.5 h-4 ${isPast ? 'bg-primary-500/40' : 'bg-dark-600'}`} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// Submission History Table
// ─────────────────────────────────────────────
function SubmissionHistory() {
  const [submissions, setSubmissions] = useState([])
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchSubmissions() {
      try {
        const res = await api.get('/submissions/my?limit=20')
        if (!cancelled) setSubmissions(res.data?.submissions ?? res.data ?? [])
      } catch {
        if (!cancelled) setSubmissions([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchSubmissions()
    return () => { cancelled = true }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-dark-800 border border-dark-600 rounded-2xl p-6"
    >
      <h2 className="text-lg font-bold text-white mb-4">Submission History 📋</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-dark-600">
              {['#', 'Problem', 'Difficulty', 'Language', 'Status', 'Time', 'XP Earned'].map((h) => (
                <th key={h} className="pb-3 pr-4 text-xs font-semibold text-slate-400 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-dark-700/50">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="py-3 pr-4">
                        <div className="h-4 bg-dark-700 rounded animate-pulse" style={{ width: `${40 + (j * 13) % 60}px` }} />
                      </td>
                    ))}
                  </tr>
                ))
              : submissions.length === 0
              ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">
                      No submissions yet. Start solving problems!
                    </td>
                  </tr>
                )
              : submissions.map((sub, idx) => (
                  <tr
                    key={sub._id ?? idx}
                    className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors"
                  >
                    <td className="py-3 pr-4 text-slate-500 font-mono text-xs">{idx + 1}</td>
                    <td className="py-3 pr-4 text-white font-medium max-w-[180px] truncate">
                      {sub.problem?.title ?? 'Unknown'}
                    </td>
                    <td className="py-3 pr-4">{difficultyBadge(sub.problem?.difficulty)}</td>
                    <td className="py-3 pr-4">
                      <span className="bg-dark-700 text-slate-300 rounded px-2 py-0.5 text-xs font-mono">
                        {sub.language ?? '-'}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{statusBadge(sub.status)}</td>
                    <td className="py-3 pr-4 text-slate-400 text-xs whitespace-nowrap">
                      {sub.createdAt ? timeAgo(sub.createdAt) : '-'}
                    </td>
                    <td className="py-3 pr-4">
                      {sub.xpEarned != null
                        ? <span className="text-primary-400 font-semibold text-xs">+{sub.xpEarned}</span>
                        : <span className="text-slate-500">-</span>
                      }
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// Page root
// ─────────────────────────────────────────────
export default function ProfilePage() {
  const { user, loading, fetchUser } = useUserStore()

  useEffect(() => {
    if (!user) fetchUser()
  }, [user, fetchUser])

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 overflow-y-auto">
      <HeroCard user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HeatmapCard user={user} />
        </div>
        <div className="lg:col-span-1">
          <EvolutionCard user={user} />
        </div>
      </div>

      <SubmissionHistory />
    </div>
  )
}
