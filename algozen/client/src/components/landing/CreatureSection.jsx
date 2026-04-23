import { motion } from 'framer-motion';

const stages = [
  { emoji: '🥚', name: 'Algo Egg', level: 'Level 1', index: 0 },
  { emoji: '🐣', name: 'Baby Coder', level: 'Level 5', index: 1 },
  { emoji: '🦎', name: 'Code Lizard', level: 'Level 15', index: 2 },
  { emoji: '🐉', name: 'Algorithm Dragon', level: 'Level 30', index: 3 },
  { emoji: '⚡', name: 'Legend Beast', level: 'Level 50', index: 4 },
];

const CENTER = 2;

export default function CreatureSection() {
  return (
    <section id="creatures" className="bg-dark-800/30 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-accent-500/10 border border-accent-500/30 text-accent-400 mb-4">
            Creature Companions
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Your{' '}
            <span className="bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
              Algo Companion
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Your creature evolves as you master algorithms.{' '}
            <span className="text-danger font-medium">Don't let it die</span> — keep your streak
            alive.
          </p>
        </motion.div>

        {/* Evolution stages */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 lg:gap-6 mb-14"
        >
          {stages.map((stage, i) => {
            const isCenter = i === CENTER;
            const isUnlocked = i <= 1;
            return (
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300 cursor-default ${
                  isCenter
                    ? 'bg-gradient-to-b from-primary-500/20 to-accent-500/20 border-primary-500/50 shadow-xl shadow-primary-500/20'
                    : isUnlocked
                    ? 'bg-dark-800/80 border-primary-500/20 hover:border-primary-500/40'
                    : 'bg-dark-800/40 border-dark-600 opacity-60'
                }`}
                style={{ minWidth: 140 }}
              >
                {/* Glow for center */}
                {isCenter && (
                  <div className="absolute inset-0 rounded-2xl bg-primary-500/5 animate-pulse pointer-events-none" />
                )}

                {/* Emoji */}
                <span
                  className={`text-5xl ${
                    isCenter ? 'animate-float' : isUnlocked ? '' : 'grayscale opacity-50'
                  }`}
                >
                  {stage.emoji}
                </span>

                {/* Name + level */}
                <div className="text-center">
                  <p
                    className={`text-sm font-bold ${
                      isCenter
                        ? 'text-white'
                        : isUnlocked
                        ? 'text-slate-200'
                        : 'text-slate-500'
                    }`}
                  >
                    {stage.name}
                  </p>
                  <p
                    className={`text-xs mt-0.5 font-medium ${
                      isCenter
                        ? 'text-primary-400'
                        : isUnlocked
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {stage.level}
                  </p>
                </div>

                {/* Arrow connector (all but last) */}
                {i < stages.length - 1 && (
                  <div className="absolute -right-4 lg:-right-5 top-1/2 -translate-y-1/2 text-slate-600 text-xl font-bold hidden sm:block z-10">
                    →
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            {
              emoji: '🍖',
              title: 'Feed With Problems',
              text: 'Every solved problem feeds your creature and boosts its growth.',
            },
            {
              emoji: '🔥',
              title: '7-Day Streak = Wings',
              text: 'Maintain a 7-day streak and your creature gains special powers.',
            },
            {
              emoji: '💤',
              title: 'Miss a Day, It Sleeps',
              text: "Break your streak and your creature goes dormant. Don't disappoint it.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 bg-dark-800/60 backdrop-blur-sm border border-dark-600 rounded-xl p-5"
            >
              <span className="text-3xl">{item.emoji}</span>
              <div>
                <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
