import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Users, Code2, Trophy, Star } from 'lucide-react'

const stats = [
  { icon: Users, value: 50000, suffix: '+', label: 'Active Learners', color: 'text-primary-400' },
  { icon: Code2, value: 500, suffix: '+', label: 'Problems', color: 'text-accent-400' },
  { icon: Trophy, value: 12000, suffix: '+', label: 'Contests Won', color: 'text-warning' },
  { icon: Star, value: 4.9, suffix: ' / 5', label: 'Average Rating', color: 'text-success', decimals: 1 },
]

function useCountUp(target, duration = 1800, decimals = 0, active = false) {
  const [current, setCurrent] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(parseFloat((target * eased).toFixed(decimals)))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [active, target, duration, decimals])

  return current
}

function StatCard({ icon, value, suffix, label, color, decimals = 0, active, delay }) {
  const count = useCountUp(value, 1800, decimals, active)
  const Icon = icon
  const display = decimals > 0
    ? count.toFixed(decimals)
    : count >= 1000
      ? `${Math.round(count / 1000)}K`
      : String(Math.round(count))

  return (
    <div
      className={`text-center transition-all duration-500 ${
        active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex justify-center mb-3">
        <Icon className={`w-7 h-7 ${color}`} />
      </div>
      <p className="text-3xl font-extrabold text-white mb-1 tabular-nums">
        {display}{suffix}
      </p>
      <p className="text-slate-500 text-sm">{label}</p>
    </div>
  )
}

export default function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="py-16 border-y border-dark-600/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ icon, value, suffix, label, color, decimals }, i) => (
            <StatCard
              key={label}
              icon={icon}
              value={value}
              suffix={suffix}
              label={label}
              color={color}
              decimals={decimals}
              active={inView}
              delay={i * 100}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

