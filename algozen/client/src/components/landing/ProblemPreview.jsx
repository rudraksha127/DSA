import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { CheckCircle2, Clock, Tag } from 'lucide-react'

const problems = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Map'],
    acceptance: '49%',
    solved: true,
  },
  {
    id: 2,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'String'],
    acceptance: '34%',
    solved: false,
  },
  {
    id: 3,
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    tags: ['Linked List', 'Heap'],
    acceptance: '51%',
    solved: false,
  },
  {
    id: 4,
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    tags: ['Array', 'DP'],
    acceptance: '50%',
    solved: true,
  },
  {
    id: 5,
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    tags: ['BFS', 'Tree'],
    acceptance: '66%',
    solved: false,
  },
  {
    id: 6,
    title: 'Find Median from Data Stream',
    difficulty: 'Hard',
    tags: ['Heap', 'Design'],
    acceptance: '52%',
    solved: false,
  },
]

const difficultyColor = {
  Easy: 'text-green-400',
  Medium: 'text-yellow-400',
  Hard: 'text-red-400',
}

export default function ProblemPreview() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="problems" ref={ref} className="py-24 bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-600 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Explore{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Problems
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            500+ handpicked problems across every difficulty, with real-world
            contexts to keep you engaged.
          </p>
        </div>

        {/* Problem Table */}
        <div
          className={`card p-0 overflow-hidden transition-all duration-600 delay-200 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-600 bg-dark-700/50">
                  <th className="text-left px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                    Difficulty
                  </th>
                  <th className="text-left px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                    Tags
                  </th>
                  <th className="text-left px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">
                    Acceptance
                  </th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, i) => (
                  <tr
                    key={problem.id}
                    className={`border-b border-dark-600/50 last:border-0 hover:bg-dark-700/30 transition-colors cursor-pointer ${
                      inView ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ transitionDelay: `${(i + 2) * 80}ms` }}
                  >
                    <td className="px-6 py-4">
                      {problem.solved ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-white text-sm font-medium hover:text-primary-400 transition-colors">
                      {problem.id}. {problem.title}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className={`text-sm font-medium ${difficultyColor[problem.difficulty]}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {problem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 bg-dark-600 text-slate-400 text-xs px-2 py-0.5 rounded"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-slate-400 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {problem.acceptance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View All CTA */}
          <div className="px-6 py-4 bg-dark-700/30 border-t border-dark-600/50 text-center">
            <Link
              to="/sign-up"
              className="text-primary-400 hover:text-primary-300 text-sm font-semibold transition-colors"
            >
              Sign up to unlock all 500+ problems →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
