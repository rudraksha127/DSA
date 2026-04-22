import { useInView } from 'react-intersection-observer'
import { UserPlus, BookOpen, Code2, TrendingUp } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Create Your Account',
    desc: 'Sign up for free in seconds. No credit card required.',
    color: 'text-primary-400',
    bg: 'bg-primary-400/10',
  },
  {
    icon: BookOpen,
    step: '02',
    title: 'Pick a Learning Track',
    desc: 'Choose a topic that matches your skill level and goals.',
    color: 'text-accent-400',
    bg: 'bg-accent-400/10',
  },
  {
    icon: Code2,
    step: '03',
    title: 'Solve Problems',
    desc: 'Write, test and submit solutions in our in-browser IDE.',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    icon: TrendingUp,
    step: '04',
    title: 'Level Up & Compete',
    desc: 'Earn XP, unlock badges and climb global leaderboards.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
]

export default function HowItWorks() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="how-it-works" ref={ref} className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-600 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl font-extrabold text-white mb-4">
            How{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              AlgoZen Works
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            From zero to hired — a clear, structured path to mastering DSA.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ icon, step, title, desc, color, bg }, i) => {
            const Icon = icon
            return (
            <div
              key={step}
              className={`relative text-center transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Connector Line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[58%] w-full h-px bg-gradient-to-r from-dark-500 to-transparent" />
              )}

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${bg} mb-4`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>

              {/* Step Number */}
              <div className="text-xs font-bold text-slate-600 mb-2 font-mono">{step}</div>

              <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
