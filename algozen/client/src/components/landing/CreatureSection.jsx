import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Lock } from 'lucide-react'

const evolutionChains = [
  {
    name: 'Code Wanderer',
    stages: [
      { emoji: '🥚', stageName: 'Egg', level: 0, unlocked: true },
      { emoji: '🐣', stageName: 'Hatchling', level: 5, unlocked: true },
      { emoji: '🦊', stageName: 'Debug Fox', level: 15, unlocked: false },
      { emoji: '🐉', stageName: 'Dragon Coder', level: 50, unlocked: false },
    ],
    rarity: 'Common',
    rarityStyle: 'text-green-400 bg-green-400/10 border-green-400/30',
  },
  {
    name: 'Sky Solver',
    stages: [
      { emoji: '🪺', stageName: 'Nest', level: 0, unlocked: true },
      { emoji: '🐦', stageName: 'Sparrow', level: 10, unlocked: true },
      { emoji: '🦅', stageName: 'Eagle', level: 30, unlocked: false },
      { emoji: '🌟', stageName: 'Starbird', level: 60, unlocked: false },
    ],
    rarity: 'Rare',
    rarityStyle: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  },
]

export default function CreatureSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Text */}
          <div
            className={`transition-all duration-600 ${
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-accent-500/10 border border-accent-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-accent-400 text-sm font-medium">🎮 Gamification</span>
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Collect &amp; Evolve Your{' '}
              <span className="bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
                Creatures
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Every creature evolves through 4 stages as you level up. Solve more
              problems, win contests, and maintain streaks to unlock epic final
              forms. Show off your rarest companions on your public profile.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Solve 10 problems → hatch your first egg',
                'Reach Level 15 → first evolution unlocks',
                'Win a contest → earn a Legendary creature',
                'Maintain a 7-day streak → bonus evolution XP',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-400 text-sm">
                  <span className="text-accent-400 mt-0.5">✦</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/sign-up" className="btn-primary inline-flex items-center gap-2">
              Start Collecting
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right — Evolution Chains */}
          <div
            className={`transition-all duration-600 delay-200 ${
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="space-y-6">
              {evolutionChains.map(({ name, stages, rarity, rarityStyle }) => (
                <div
                  key={name}
                  className="bg-dark-800 border border-dark-600 rounded-2xl p-5 hover:border-primary-500/30 transition-colors"
                >
                  {/* Chain Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-semibold text-sm">{name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${rarityStyle}`}>
                      {rarity}
                    </span>
                  </div>

                  {/* Evolution Steps */}
                  <div className="flex items-center gap-1">
                    {stages.map(({ emoji, stageName, level, unlocked }, i) => (
                      <div key={stageName} className="flex items-center gap-1 flex-1">
                        {/* Stage Node */}
                        <div className="flex flex-col items-center flex-1">
                          <div
                            className={`relative w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all ${
                              unlocked
                                ? 'bg-dark-700 border-2 border-primary-500/40'
                                : 'bg-dark-700/50 border-2 border-dark-600 grayscale'
                            }`}
                          >
                            {emoji}
                            {!unlocked && (
                              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-dark-900/60">
                                <Lock className="w-3.5 h-3.5 text-slate-500" />
                              </div>
                            )}
                          </div>
                          <span className={`text-[10px] mt-1 font-medium ${unlocked ? 'text-slate-300' : 'text-slate-600'}`}>
                            {stageName}
                          </span>
                          <span className={`text-[9px] ${unlocked ? 'text-primary-400' : 'text-slate-700'}`}>
                            {level === 0 ? 'Start' : `Lv ${level}`}
                          </span>
                        </div>

                        {/* Arrow between stages */}
                        {i < stages.length - 1 && (
                          <ArrowRight className={`w-3 h-3 flex-shrink-0 ${unlocked ? 'text-primary-500' : 'text-dark-500'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

