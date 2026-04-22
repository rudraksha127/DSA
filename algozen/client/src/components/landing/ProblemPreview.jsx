import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Zap } from 'lucide-react';

const problems = [
  {
    id: 1,
    title: 'Two Sum',
    topic: 'Arrays',
    difficulty: 'Rookie',
    xp: 50,
    acceptance: '78%',
    locked: false,
  },
  {
    id: 2,
    title: 'Valid Parentheses',
    topic: 'Stack',
    difficulty: 'Rookie',
    xp: 60,
    acceptance: '65%',
    locked: false,
  },
  {
    id: 3,
    title: 'Binary Tree Level Order',
    topic: 'Trees',
    difficulty: 'Warrior',
    xp: 150,
    acceptance: '45%',
    locked: true,
  },
  {
    id: 4,
    title: 'LRU Cache',
    topic: 'Design',
    difficulty: 'Warrior',
    xp: 200,
    acceptance: '38%',
    locked: true,
  },
  {
    id: 5,
    title: 'Word Break',
    topic: 'Dynamic Programming',
    difficulty: 'Legend',
    xp: 300,
    acceptance: '29%',
    locked: true,
  },
  {
    id: 6,
    title: 'N-Queens',
    topic: 'Backtracking',
    difficulty: 'Legend',
    xp: 400,
    acceptance: '18%',
    locked: true,
  },
];

const difficultyBadge = {
  Rookie: 'badge-rookie',
  Warrior: 'badge-warrior',
  Legend: 'badge-legend',
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function ProblemPreview() {
  return (
    <section id="problems" className="bg-dark-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary-500/10 border border-primary-500/30 text-primary-400 mb-4">
            Problem Library
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Get a{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Taste
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            150+ curated problems from Rookie to Legend. Sign in to unlock your full problem set.
          </p>
        </motion.div>

        {/* Problem cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
        >
          {problems.map((problem) => (
            <motion.div
              key={problem.id}
              variants={cardVariants}
              className="relative card group hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-500/40 transition-all duration-300 overflow-hidden"
            >
              {/* Locked overlay */}
              {problem.locked && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-dark-900/60 backdrop-blur-sm rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-dark-700 border border-dark-500 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>
                  <Link
                    to="/sign-in"
                    className="text-sm font-medium text-primary-400 hover:text-primary-300 underline underline-offset-2"
                  >
                    Sign in to unlock
                  </Link>
                </div>
              )}

              {/* Card content (blurred when locked) */}
              <div className={problem.locked ? 'blur-sm select-none' : ''}>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-semibold text-base leading-tight pr-2">
                    {problem.title}
                  </h3>
                  <span
                    className={`${difficultyBadge[problem.difficulty]} px-2.5 py-0.5 rounded-full text-xs font-bold flex-shrink-0`}
                  >
                    {problem.difficulty}
                  </span>
                </div>

                {/* Topic */}
                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-dark-700 text-slate-400 border border-dark-600 mb-4">
                  {problem.topic}
                </span>

                {/* Stats row */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="text-slate-500">Acceptance:</span>
                    <span className="font-semibold text-slate-300">{problem.acceptance}</span>
                  </div>
                  <div className="flex items-center gap-1 text-warning font-bold">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{problem.xp} XP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link
            to="/sign-up"
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold text-base transition-colors group"
          >
            View All 150+ Problems
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
