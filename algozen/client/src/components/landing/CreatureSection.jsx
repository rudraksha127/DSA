import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'

const creatures = [
  { emoji: '🐉', name: 'Dragon Coder', level: 50, rarity: 'Legendary', color: 'from-red-500/20 to-orange-500/10 border-red-500/30' },
  { emoji: '🦅', name: 'Algorithm Eagle', level: 30, rarity: 'Rare', color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30' },
  { emoji: '🦊', name: 'Debug Fox', level: 15, rarity: 'Common', color: 'from-orange-500/20 to-yellow-500/10 border-orange-500/30' },
]

const rarityColor = {
  Legendary: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  Rare: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  Common: 'text-green-400 bg-green-400/10 border-green-400/30',
}

export default function CreatureSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
              Collect Creatures,{' '}
              <span className="bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
                Prove Your Power
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Every milestone you hit unlocks a unique creature companion. Show
              off your collection on your public profile and let your rank speak
              for itself.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Solve 10 problems → unlock your first creature',
                'Win a contest → earn a Legendary creature',
                'Maintain a 7-day streak → special reward',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-400 text-sm">
                  <span className="text-accent-400 mt-0.5">✦</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/sign-up" className="btn-primary inline-flex items-center gap-2">
              Start Collecting
            </Link>
          </div>

          {/* Right — Creature Cards */}
          <div
            className={`transition-all duration-600 delay-200 ${
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="space-y-4">
              {creatures.map(({ emoji, name, level, rarity, color }, i) => (
                <div
                  key={name}
                  className={`flex items-center gap-4 bg-gradient-to-r ${color} border rounded-2xl p-4 transition-all duration-500 hover:scale-[1.02]`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="text-5xl">{emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold">{name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${rarityColor[rarity]}`}>
                        {rarity}
                      </span>
                    </div>
                    <div className="text-slate-500 text-xs mb-2">Level {level}</div>
                    {/* XP Bar */}
                    <div className="w-full bg-dark-600 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-1.5 rounded-full"
                        style={{ width: `${(level / 50) * 100}%` }}
                      />
                    </div>
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
