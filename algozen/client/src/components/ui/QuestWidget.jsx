import { CheckCircle2, Circle } from 'lucide-react'

const QUESTS = [
  { id: 'solve1', label: 'Solve 1 problem today', xp: 50, check: (u) => (u?.solvedProblems?.length ?? 0) > 0 },
  { id: 'submit3', label: 'Submit 3 solutions', xp: 100, check: () => false },
  { id: 'streak', label: 'Keep your streak alive', xp: 75, check: (u) => (u?.streak?.current ?? 0) > 0 },
]

export default function QuestWidget({ user }) {
  const completed = QUESTS.filter(q => q.check(user)).length

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white">🎯 Daily Quests</h3>
        <span className="text-xs bg-primary-600/20 text-primary-400 border border-primary-500/30 rounded-full px-2 py-0.5">
          {completed}/{QUESTS.length}
        </span>
      </div>

      <div className="space-y-3">
        {QUESTS.map(q => {
          const done = q.check(user)
          return (
            <div key={q.id} className="flex items-center gap-3">
              {done
                ? <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                : <Circle className="h-4 w-4 text-slate-600 flex-shrink-0" />}
              <span className={`flex-1 text-sm ${done ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                {q.label}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${done ? 'bg-success/20 text-success' : 'bg-dark-600 text-slate-400'}`}>
                +{q.xp} XP
              </span>
            </div>
          )
        })}
      </div>

      <p className="mt-3 text-[10px] text-slate-600">Resets at midnight UTC</p>
    </div>
  )
}
