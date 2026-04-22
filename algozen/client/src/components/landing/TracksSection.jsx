import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Lock } from 'lucide-react'

const dsaTracks = [
  {
    emoji: '🗃️',
    title: 'Arrays & Strings',
    desc: 'Foundation patterns: sliding window, two pointers, prefix sums.',
    problems: 80,
    difficulty: 'Beginner',
    color: 'from-green-500/10 to-green-500/5 border-green-500/20 hover:border-green-500/50',
    badge: 'badge-rookie',
    locked: false,
    requiredLevel: 0,
  },
  {
    emoji: '🔗',
    title: 'Linked Lists',
    desc: 'Traversal, reversal, cycle detection and merge operations.',
    problems: 45,
    difficulty: 'Beginner',
    color: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/50',
    badge: 'badge-rookie',
    locked: false,
    requiredLevel: 0,
  },
  {
    emoji: '🌲',
    title: 'Trees & Graphs',
    desc: 'DFS, BFS, shortest path, topological sort and more.',
    problems: 100,
    difficulty: 'Intermediate',
    color: 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/50',
    badge: 'badge-warrior',
    locked: false,
    requiredLevel: 5,
  },
  {
    emoji: '💡',
    title: 'Dynamic Programming',
    desc: 'Memoization, tabulation, and classic DP problem patterns.',
    problems: 90,
    difficulty: 'Advanced',
    color: 'from-red-500/10 to-red-500/5 border-red-500/20 hover:border-red-500/50',
    badge: 'badge-legend',
    locked: true,
    requiredLevel: 15,
  },
  {
    emoji: '🔍',
    title: 'Binary Search',
    desc: 'Search on answer, rotated arrays, and bisect patterns.',
    problems: 50,
    difficulty: 'Intermediate',
    color: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:border-purple-500/50',
    badge: 'badge-warrior',
    locked: false,
    requiredLevel: 5,
  },
  {
    emoji: '📦',
    title: 'Stack & Queue',
    desc: 'Monotonic stacks, deques, expression evaluation.',
    problems: 40,
    difficulty: 'Beginner',
    color: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/50',
    badge: 'badge-rookie',
    locked: false,
    requiredLevel: 0,
  },
]

const realWorldTracks = [
  {
    emoji: '🏗️',
    title: 'System Design Patterns',
    desc: 'Rate limiting, LRU cache, consistent hashing — real interview problems.',
    problems: 30,
    difficulty: 'Advanced',
    color: 'from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/50',
    badge: 'badge-legend',
    locked: true,
    requiredLevel: 20,
  },
  {
    emoji: '💰',
    title: 'Financial Algorithms',
    desc: 'Trading simulations, arbitrage detection, portfolio optimisation.',
    problems: 25,
    difficulty: 'Advanced',
    color: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/50',
    badge: 'badge-legend',
    locked: true,
    requiredLevel: 25,
  },
  {
    emoji: '🔐',
    title: 'Security & Cryptography',
    desc: 'Hash functions, RSA basics, security protocol algorithms.',
    problems: 20,
    difficulty: 'Advanced',
    color: 'from-rose-500/10 to-rose-500/5 border-rose-500/20 hover:border-rose-500/50',
    badge: 'badge-legend',
    locked: true,
    requiredLevel: 30,
  },
]

function TrackCard({ emoji, title, desc, problems, difficulty, color, badge, locked, requiredLevel, inView, delay }) {
  return (
    <div
      className={`relative bg-gradient-to-br ${color} border rounded-2xl p-6 transition-all duration-500 group ${
        locked ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'
      } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Lock overlay */}
      {locked && (
        <div className="absolute inset-0 rounded-2xl bg-dark-900/40 flex flex-col items-center justify-center z-10 backdrop-blur-[1px]">
          <Lock className="w-7 h-7 text-slate-400 mb-1" />
          <span className="text-slate-400 text-xs font-semibold">Unlock at Level {requiredLevel}</span>
        </div>
      )}
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-4 leading-relaxed">{desc}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 text-xs">{problems} problems</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>
            {difficulty}
          </span>
        </div>
        {!locked && (
          <Link
            to="/sign-up"
            className="flex items-center gap-1 text-primary-400 text-xs font-semibold group-hover:gap-2 transition-all"
          >
            Start <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  )
}

export default function TracksSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="tracks" ref={ref} className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-600 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Learning Track
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Start from the basics or jump straight into advanced topics. Level up
            to unlock Real World tracks inspired by top-company interviews.
          </p>
        </div>

        {/* DSA Tracks */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-white font-bold text-lg">📚 DSA Fundamentals</span>
            <span className="text-xs text-slate-500 bg-dark-700 px-2 py-0.5 rounded-full">
              {dsaTracks.length} tracks
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dsaTracks.map(({ emoji, title, desc, problems, difficulty, color, badge, locked, requiredLevel }, i) => (
              <TrackCard
                key={title}
                emoji={emoji}
                title={title}
                desc={desc}
                problems={problems}
                difficulty={difficulty}
                color={color}
                badge={badge}
                locked={locked}
                requiredLevel={requiredLevel}
                inView={inView}
                delay={i * 80}
              />
            ))}
          </div>
        </div>

        {/* Real World Tracks */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-white font-bold text-lg">🌐 Real World Tracks</span>
            <span className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full font-semibold">
              Level-locked
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {realWorldTracks.map(({ emoji, title, desc, problems, difficulty, color, badge, locked, requiredLevel }, i) => (
              <TrackCard
                key={title}
                emoji={emoji}
                title={title}
                desc={desc}
                problems={problems}
                difficulty={difficulty}
                color={color}
                badge={badge}
                locked={locked}
                requiredLevel={requiredLevel}
                inView={inView}
                delay={(dsaTracks.length + i) * 80}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

