import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { ArrowRight } from 'lucide-react'

const tracks = [
  {
    emoji: '🗃️',
    title: 'Arrays & Strings',
    desc: 'Foundation patterns: sliding window, two pointers, prefix sums.',
    problems: 80,
    difficulty: 'Beginner',
    color: 'from-green-500/10 to-green-500/5 border-green-500/20 hover:border-green-500/50',
    badge: 'badge-rookie',
  },
  {
    emoji: '🔗',
    title: 'Linked Lists',
    desc: 'Traversal, reversal, cycle detection and merge operations.',
    problems: 45,
    difficulty: 'Beginner',
    color: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/50',
    badge: 'badge-rookie',
  },
  {
    emoji: '🌲',
    title: 'Trees & Graphs',
    desc: 'DFS, BFS, shortest path, topological sort and more.',
    problems: 100,
    difficulty: 'Intermediate',
    color: 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/50',
    badge: 'badge-warrior',
  },
  {
    emoji: '💡',
    title: 'Dynamic Programming',
    desc: 'Memoization, tabulation, and classic DP problem patterns.',
    problems: 90,
    difficulty: 'Advanced',
    color: 'from-red-500/10 to-red-500/5 border-red-500/20 hover:border-red-500/50',
    badge: 'badge-legend',
  },
  {
    emoji: '🔍',
    title: 'Binary Search',
    desc: 'Search on answer, rotated arrays, and bisect patterns.',
    problems: 50,
    difficulty: 'Intermediate',
    color: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:border-purple-500/50',
    badge: 'badge-warrior',
  },
  {
    emoji: '📦',
    title: 'Stack & Queue',
    desc: 'Monotonic stacks, deques, expression evaluation.',
    problems: 40,
    difficulty: 'Beginner',
    color: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/50',
    badge: 'badge-rookie',
  },
]

export default function TracksSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

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
            Start from the basics or jump straight into advanced topics. Every
            track is carefully crafted to build lasting intuition.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map(({ emoji, title, desc, problems, difficulty, color, badge }, i) => (
            <div
              key={title}
              className={`bg-gradient-to-br ${color} border rounded-2xl p-6 transition-all duration-500 cursor-pointer group ${
                inView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
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
                <Link
                  to="/sign-up"
                  className="flex items-center gap-1 text-primary-400 text-xs font-semibold group-hover:gap-2 transition-all"
                >
                  Start <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
