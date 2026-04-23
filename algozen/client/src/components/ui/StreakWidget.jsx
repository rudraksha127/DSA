import { Flame } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function StreakWidget({ streak = {} }) {
  const { current = 0, longest = 0, lastActive, freezeUsed } = streak

  // Build 7-day solved array
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const last = lastActive ? new Date(lastActive) : null
  if (last) last.setHours(0, 0, 0, 0)

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    const diff = last ? Math.round((last - d) / 86400000) : -999
    const solved = diff >= 0 && diff < current
    return { date: d, label: DAYS[d.getDay()], solved, isToday: i === 6 }
  })

  const lastActiveToday = last && last.getTime() === today.getTime()
  const lastActiveYesterday = last && (today - last) / 86400000 === 1

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-400" />
          <span className="font-semibold text-white">{current} day streak</span>
        </div>
        <span className="text-xs text-slate-500">Best: {longest}</span>
      </div>

      {!lastActiveToday && lastActiveYesterday && (
        <p className="text-xs text-danger mb-2">⚠️ Streak at risk! Solve today to keep it alive.</p>
      )}

      <div className="flex gap-1.5 justify-between">
        {days.map(({ date, label, solved, isToday }) => (
          <div key={date.toISOString()} className="flex flex-col items-center gap-1">
            <div
              className={[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm',
                solved ? 'bg-orange-500 text-white' : isToday ? 'border-2 border-dashed border-slate-600 text-slate-600' : 'bg-dark-600 text-slate-700',
              ].join(' ')}
            >
              {solved ? '🔥' : isToday ? '·' : ''}
            </div>
            <span className="text-[10px] text-slate-500">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        {freezeUsed ? (
          <span className="text-xs text-blue-400">🧊 Freeze used</span>
        ) : (
          <span className="text-xs text-slate-500 cursor-pointer hover:text-blue-400 transition-colors">🧊 Use Freeze?</span>
        )}
      </div>
    </div>
  )
}
