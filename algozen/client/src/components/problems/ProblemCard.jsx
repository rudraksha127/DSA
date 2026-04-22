import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import { Zap } from 'lucide-react'

export default function ProblemCard({ problem }) {
  return (
    <Link
      to={`/problems/${problem.slug}`}
      className="block p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-slate-100 hover:text-indigo-400">{problem.title}</h3>
        <Badge label={problem.difficulty} variant={problem.difficulty} />
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
        <span>{problem.topic}</span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-yellow-400" />
          {problem.xpReward} XP
        </span>
      </div>
    </Link>
  )
}
