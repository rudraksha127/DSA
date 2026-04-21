import { useInView } from 'react-intersection-observer'
import { Brain, Sword, Trophy, Bot, Users, BarChart3, Flame, Lock } from 'lucide-react'

const features = [
  {
    icon: Sword,
    title: 'Gamified XP System',
    desc: 'Earn experience points for every solved problem. Level up your profile and unlock exclusive badges.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  {
    icon: Bot,
    title: 'AI Mentor',
    desc: 'Stuck? Get instant hints and step-by-step explanations powered by Llama 3.3 70B — without spoiling the solution.',
    color: 'text-primary-400',
    bg: 'bg-primary-400/10',
  },
  {
    icon: Trophy,
    title: 'Live Contests',
    desc: 'Compete in real-time contests against thousands of developers. Weekly rounds with exciting prizes.',
    color: 'text-accent-400',
    bg: 'bg-accent-400/10',
  },
  {
    icon: Brain,
    title: 'Smart Recommendations',
    desc: 'Adaptive problem recommendations based on your strengths and weak spots.',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    icon: Users,
    title: 'Community & Guilds',
    desc: 'Form guilds with friends, solve problems together and climb the guild leaderboard.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    desc: 'Detailed visualisations of your submission history, topic distribution, and time complexity growth.',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
  {
    icon: Flame,
    title: 'Daily Streaks',
    desc: 'Keep your momentum alive with daily challenges. Maintain streaks to earn bonus XP multipliers.',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
  },
  {
    icon: Lock,
    title: 'Interview Prep Mode',
    desc: 'Timed mock interviews with curated problem sets from top tech companies. Get hired faster.',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
  },
]

export default function FeaturesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="features" ref={ref} className="py-24 bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-600 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Go Further
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            AlgoZen combines the best of interactive coding, gamification, and AI
            mentorship into one powerful platform.
          </p>
        </div>

        {/* Features Grid — 2 cols on sm, 4 cols on lg */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon, title, desc, color, bg }, i) => {
            const Icon = icon
            return (
            <div
              key={title}
              className={`card group hover:scale-[1.02] transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${bg} mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
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
