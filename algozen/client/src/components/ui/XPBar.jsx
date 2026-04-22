const THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000, 5000, 6200, 7600, 9200, 11000]

export default function XPBar({ xp = 0, level = 1, className = '' }) {
  const currentThreshold = THRESHOLDS[Math.min(level - 1, THRESHOLDS.length - 1)] ?? 0
  const nextThreshold = THRESHOLDS[Math.min(level, THRESHOLDS.length - 1)] ?? currentThreshold + 500
  const xpInLevel = xp - currentThreshold
  const xpNeeded = nextThreshold - currentThreshold
  const pct = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100))
  const toNext = nextThreshold - xp

  return (
    <div className={`group ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400 font-medium">Level {level}</span>
        <span className="text-xs text-primary-400 font-semibold">{xp.toLocaleString()} XP</span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-dark-600 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors">
        {toNext.toLocaleString()} XP to Level {level + 1}
      </p>
    </div>
  )
}
