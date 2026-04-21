import { useInView } from 'react-intersection-observer'
import { Users, Code2, Trophy, Star } from 'lucide-react'

const stats = [
  { icon: Users, value: '50,000+', label: 'Active Learners', color: 'text-primary-400' },
  { icon: Code2, value: '500+', label: 'Problems', color: 'text-accent-400' },
  { icon: Trophy, value: '12,000+', label: 'Contests Won', color: 'text-warning' },
  { icon: Star, value: '4.9 / 5', label: 'Average Rating', color: 'text-success' },
]

export default function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="py-16 border-y border-dark-600/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ icon, value, label, color }, i) => {
            const Icon = icon
            return (
            <div
              key={label}
              className={`text-center transition-all duration-500 ${
                inView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`flex justify-center mb-3`}>
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <p className="text-3xl font-extrabold text-white mb-1">{value}</p>
              <p className="text-slate-500 text-sm">{label}</p>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
