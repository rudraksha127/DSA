import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Flame,
  Trophy,
  Zap,
  Check,
  Circle,
} from 'lucide-react'
import clsx from 'clsx'
import useUserStore from '@/stores/useUserStore'
import api from '@/lib/api'

const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000]
const CREATURE_EMOJIS = ['🥚', '🐣', '🦎', '🐉', '⚡']

const LEADERBOARD = [
  { rank: 1, username: 'CodeNinja', xp: 4250 },
  { rank: 2, username: 'ByteKing', xp: 3890 },
  { rank: 3, username: 'AlgoMaster', xp: 3450 },
  { rank: 4, username: 'DevStorm', xp: 2980 },
  { rank: 5, username: 'PixelCoder', xp: 2750 },
]

const RANK_MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' }

const AVATAR_COLORS = [
  'bg-indigo-600', 'bg-purple-600', 'bg-pink-600',
  'bg-cyan-600', 'bg-emerald-600', 'bg-orange-600',
]

function avatarColor(username) {
  let hash = 0
  for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function xpProgress(xp) {
  const level = LEVEL_THRESHOLDS.findIndex((t, i) => {
    const next = LEVEL_THRESHOLDS[i + 1]
    return next === undefined || xp < next
  })
  const safeLevel = Math.max(0, level)
  const current = LEVEL_THRESHOLDS[safeLevel] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  const next = LEVEL_THRESHOLDS[safeLevel + 1]
  if (!next) return { level: safeLevel, pct: 100, xpInLevel: xp - current, xpNeeded: 0 }
  const xpInLevel = xp - current
  const xpNeeded = next - current
  const pct = Math.min(100, Math.floor((xpInLevel / xpNeeded) * 100))
  return { level: safeLevel, pct, xpInLevel, xpNeeded }
}

function rankStyle(rank) {
  switch (rank) {
    case 'Rookie': return 'bg-slate-700 text-slate-200'
    case 'Warrior': return 'bg-yellow-900/60 text-yellow-300 border border-yellow-700/40'
    case 'Legend': return 'bg-red-900/60 text-red-300 border border-red-700/40'
    case 'Master': return 'bg-purple-900/60 text-purple-300 border border-purple-700/40'
    default: return 'bg-slate-700 text-slate-200'
  }
}

function difficultyStyle(difficulty) {
  switch (difficulty) {
    case 'Rookie': return 'bg-green-900/40 text-green-400 border border-green-700/30'
    case 'Warrior': return 'bg-yellow-900/40 text-yellow-400 border border-yellow-700/30'
    case 'Legend': return 'bg-red-900/40 text-red-400 border border-red-700/30'
    default: return 'bg-slate-700 text-slate-300'
  }
}

function statusStyle(status) {
  switch (status) {
    case 'Accepted': return 'text-green-400 bg-green-900/30 border border-green-700/30'
    case 'WrongAnswer': return 'text-red-400 bg-red-900/30 border border-red-700/30'
    case 'TimeLimitExceeded': return 'text-yellow-400 bg-yellow-900/30 border border-yellow-700/30'
    default: return 'text-orange-400 bg-orange-900/30 border border-orange-700/30'
  }
}

function statusLabel(status) {
  switch (status) {
    case 'Accepted': return 'Accepted'
    case 'WrongAnswer': return 'Wrong Answer'
    case 'TimeLimitExceeded': return 'TLE'
    case 'CompileError': return 'Compile Error'
    case 'RuntimeError': return 'Runtime Error'
    default: return status
  }
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function DashboardPage() {
  const { user, fetchUser } = useUserStore()
  const [submissions, setSubmissions] = useState([])
  const [submissionsLoading, setSubmissionsLoading] = useState(true)
  const [attemptedProblems, setAttemptedProblems] = useState([])

  useEffect(() => {
    if (!user) fetchUser()
  }, [user, fetchUser])

  useEffect(() => {
    async function loadSubmissions() {
      setSubmissionsLoading(true)
      try {
        const res = await api.get('/submissions/my?limit=5')
        setSubmissions(res.data?.submissions ?? res.data ?? [])
      } catch {
        setSubmissions([])
      } finally {
        setSubmissionsLoading(false)
      }
    }
    loadSubmissions()
  }, [])

  useEffect(() => {
    async function loadAttempted() {
      if (!user?.attemptedProblems?.length) return
      try {
        const ids = user.attemptedProblems.slice(-2).reverse()
        const results = await Promise.all(
          ids.map(id => api.get('/problems/' + id).then(r => r.data).catch(() => null))
        )
        setAttemptedProblems(results.filter(Boolean))
      } catch {
        setAttemptedProblems([])
      }
    }
    loadAttempted()
  }, [user])

  const xp = user?.xp ?? 0
  const { level, pct, xpInLevel, xpNeeded } = xpProgress(xp)
  const stage = user?.creature?.stage ?? 0
  const creatureEmoji = CREATURE_EMOJIS[Math.min(stage, 4)]
  const creatureName = user?.creature?.name ?? 'Hatchling'

  const todaySolved = submissions.filter(s => {
    const d = new Date(s.createdAt ?? s.submittedAt)
    const today = new Date()
    return (
      s.status === 'Accepted' &&
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    )
  }).length

  const dailyQuests = [
    {
      id: 1,
      label: 'Solve 1 Rookie problem',
      xpReward: 50,
      completed: (user?.solvedProblems?.length ?? 0) > 0,
    },
    {
      id: 2,
      label: 'Submit 3 solutions',
      xpReward: 100,
      completed: false,
      progress: '0/3',
    },
    {
      id: 3,
      label: 'Maintain a streak',
      xpReward: 75,
      completed: (user?.streak?.current ?? 0) > 0,
    },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-dark-800/60 backdrop-blur-sm border border-primary-500/20 rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Creature */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-5xl select-none">{creatureEmoji}</span>
            <div>
              <p className="text-white font-semibold font-mono text-lg leading-tight">{creatureName}</p>
              <span className="mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                Level {level}
              </span>
            </div>
          </div>

          {/* XP Bar */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400 font-medium">XP Progress</span>
              <span className="text-xs text-slate-400 font-mono">
                {xpInLevel.toLocaleString()} / {xpNeeded > 0 ? xpNeeded.toLocaleString() : '∞'} XP
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-dark-600 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Rank + Username */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className={clsx('text-xs font-bold px-2.5 py-1 rounded-full', rankStyle(user?.rank))}>
              {user?.rank ?? 'Rookie'}
            </span>
            <span className="text-slate-300 font-semibold text-sm">
              @{user?.username ?? '—'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: 'Solved Today',
            value: todaySolved,
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
            color: 'text-emerald-400',
          },
          {
            label: 'Current Streak',
            value: `${user?.streak?.current ?? 0} days`,
            icon: <Flame className="w-5 h-5 text-orange-400" />,
            color: 'text-orange-400',
          },
          {
            label: 'Rank',
            value: user?.rank ?? '—',
            icon: <Trophy className="w-5 h-5 text-yellow-400" />,
            color: 'text-yellow-400',
          },
          {
            label: 'Total XP',
            value: xp.toLocaleString(),
            icon: <Zap className="w-5 h-5 text-indigo-400" />,
            color: 'text-indigo-400',
          },
        ].map(stat => (
          <motion.div
            key={stat.label}
            variants={cardVariants}
            className="bg-dark-800 border border-dark-600 rounded-xl p-4 flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-dark-700">{stat.icon}</div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              <p className={clsx('text-lg font-bold font-mono', stat.color)}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Middle Row: Daily Quests + Continue Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Quests */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="bg-dark-800 border border-dark-600 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-base">Daily Quests 🎯</h2>
            <span className="text-xs text-slate-500">Resets at midnight</span>
          </div>
          <div className="space-y-3">
            {dailyQuests.map(quest => (
              <div
                key={quest.id}
                className={clsx(
                  'flex items-center gap-3 p-3 rounded-lg border',
                  quest.completed
                    ? 'bg-emerald-900/10 border-emerald-700/20'
                    : 'bg-dark-700 border-dark-500'
                )}
              >
                {quest.completed ? (
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={clsx('text-sm font-medium', quest.completed ? 'line-through text-slate-500' : 'text-slate-200')}>
                    {quest.label}
                  </p>
                  {quest.progress && !quest.completed && (
                    <p className="text-xs text-slate-500 mt-0.5">{quest.progress}</p>
                  )}
                </div>
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-900/30 border border-indigo-700/30 px-2 py-0.5 rounded-full flex-shrink-0">
                  +{quest.xpReward} XP
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Continue Learning */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className="bg-dark-800 border border-dark-600 rounded-xl p-5"
        >
          <h2 className="text-white font-semibold text-base mb-4">Continue Learning 📚</h2>
          {attemptedProblems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-28 text-center gap-2">
              <p className="text-slate-500 text-sm">No problems attempted yet.</p>
              <Link
                to="/problems"
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
              >
                Start your journey →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {attemptedProblems.map(problem => (
                <div
                  key={problem._id}
                  className="flex items-center gap-3 p-3 bg-dark-700 border border-dark-500 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{problem.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={clsx('text-xs font-semibold px-1.5 py-0.5 rounded', difficultyStyle(problem.difficulty))}>
                        {problem.difficulty}
                      </span>
                      <span className="text-xs text-indigo-400 flex items-center gap-0.5 font-mono">
                        <Zap className="w-3 h-3" />
                        {problem.xpReward} XP
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/problems/${problem.slug}`}
                    className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition-colors"
                  >
                    Continue
                  </Link>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Row: Submissions + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          className="lg:col-span-2 bg-dark-800 border border-dark-600 rounded-xl p-5"
        >
          <h2 className="text-white font-semibold text-base mb-4">Recent Submissions</h2>
          {submissionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-dark-700 rounded-lg h-14">
                  <div className="h-3 bg-dark-600 rounded w-1/3" />
                  <div className="h-3 bg-dark-600 rounded w-16 ml-auto" />
                </div>
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex items-center justify-center h-28">
              <p className="text-slate-500 text-sm">No submissions yet. Solve a problem to get started!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {submissions.map((sub, idx) => (
                <div
                  key={sub._id ?? idx}
                  className="flex flex-wrap items-center gap-2 p-3 bg-dark-700 border border-dark-500/50 rounded-lg"
                >
                  <span className="text-sm font-medium text-slate-200 flex-1 min-w-0 truncate">
                    {sub.problem?.title ?? sub.problemTitle ?? 'Problem'}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                    {sub.problem?.difficulty && (
                      <span className={clsx('text-xs font-semibold px-1.5 py-0.5 rounded', difficultyStyle(sub.problem.difficulty))}>
                        {sub.problem.difficulty}
                      </span>
                    )}
                    {sub.language && (
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-dark-600 text-slate-400 border border-dark-500">
                        {sub.language}
                      </span>
                    )}
                    <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', statusStyle(sub.status))}>
                      {statusLabel(sub.status)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {timeAgo(sub.createdAt ?? sub.submittedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Leaderboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35 }}
          className="lg:col-span-1 bg-dark-800 border border-dark-600 rounded-xl p-5 flex flex-col"
        >
          <h2 className="text-white font-semibold text-base mb-4">Top Warriors This Week 🏆</h2>
          <div className="space-y-2.5 flex-1">
            {LEADERBOARD.map(entry => (
              <div key={entry.rank} className="flex items-center gap-2.5">
                <span className="text-base w-6 text-center flex-shrink-0">
                  {RANK_MEDAL[entry.rank] ?? (
                    <span className="text-slate-500 font-mono text-sm">{entry.rank}</span>
                  )}
                </span>
                <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0', avatarColor(entry.username))}>
                  {entry.username.slice(0, 2).toUpperCase()}
                </div>
                <span className="flex-1 text-sm font-medium text-slate-200 truncate">{entry.username}</span>
                <span className="text-xs font-mono text-indigo-400 flex items-center gap-0.5 flex-shrink-0">
                  <Zap className="w-3 h-3" />
                  {entry.xp.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/contests"
            className="mt-4 block text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 border border-indigo-700/30 rounded-lg py-2 transition-colors"
          >
            View Full Leaderboard
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
