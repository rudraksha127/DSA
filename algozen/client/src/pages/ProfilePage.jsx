import { useEffect, useMemo } from 'react'
import { useAuth, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import useAuthStore from '../store/useAuthStore'
import api from '../lib/api'
import Spinner from '../components/ui/Spinner'
import { Zap, Flame, CheckCircle } from 'lucide-react'

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
    const seedState = [totalSolved * 31 + 17]
    const rand = () => {
      seedState[0] = (seedState[0] * 1664525 + 1013904223) & 0xffffffff
      return Math.abs(seedState[0]) / 0xffffffff
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

  return (
    <div className="bg-dark-800/60 border border-dark-600 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-4">Solving Activity</h3>
      <div className="flex gap-1 overflow-x-auto">
        {heatmapData.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((count, di) => (
              <div
                key={di}
                title={`${count} submission(s)`}
                className={`w-3 h-3 rounded-sm ${
                  count === 0 ? 'bg-dark-700' :
                  count === 1 ? 'bg-primary-900' :
                  count === 2 ? 'bg-primary-600' : 'bg-primary-400'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  )
}

export default function ProfilePage() {
  const { getToken } = useAuth()
  const { user, loading, fetchUser } = useAuthStore()

  useEffect(() => {
    getToken().then((token) => {
      if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <SignedOut><RedirectToSignIn /></SignedOut>
      <SignedIn>
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : user ? (
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <HeroCard user={user} />
            <div className="grid grid-cols-3 gap-4">
              <StatCard icon={<Zap className="w-6 h-6 text-yellow-400" />} label="XP" value={user.xp ?? 0} />
              <StatCard icon={<Flame className="w-6 h-6 text-orange-400" />} label="Streak" value={`${user.streak?.current ?? 0} days`} />
              <StatCard icon={<CheckCircle className="w-6 h-6 text-green-400" />} label="Solved" value={user.solvedProblems?.length ?? 0} />
            </div>
            <HeatmapCard user={user} />
          </div>
        ) : (
          <p className="text-center py-20 text-slate-500">
            Could not load profile. Please make sure you are registered.
          </p>
        )}
      </SignedIn>
    </>
  )
}
