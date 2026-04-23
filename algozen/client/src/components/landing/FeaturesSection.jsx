import { motion } from 'framer-motion';
import { Code2, Brain, Swords, Flame, Sparkles, GraduationCap, Trophy, Star } from 'lucide-react';

const features = [
  {
    icon: Code2,
    title: 'Monaco Editor',
    description: 'Industry-grade code editor with IntelliSense, syntax highlighting & autocomplete.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Brain,
    title: 'AlgoGuru AI',
    description: 'Get hints, code review & step-by-step explanations from your personal AI mentor.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Swords,
    title: 'Battle Mode',
    description: '1v1 real-time coding battles against friends or random opponents. First AC wins.',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    icon: Flame,
    title: 'Daily Streaks',
    description: 'Build unbreakable consistency with daily challenges, streak rewards & reminders.',
    gradient: 'from-orange-500 to-yellow-500',
  },
  {
    icon: Sparkles,
    title: 'Creature Evolution',
    description: 'Your algo companion evolves with every level. Keep your streak or it sleeps.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: GraduationCap,
    title: 'Professor Dashboard',
    description: 'Powerful classroom tools for educators to assign, track, and grade students.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Trophy,
    title: 'Weekly Contests',
    description: 'Compete globally in timed competitions every Sunday. Climb the leaderboard.',
    gradient: 'from-yellow-500 to-amber-500',
  },
  {
    icon: Star,
    title: 'XP System',
    description: 'Earn XP for every submission, streak, and battle won. Level up your rank.',
    gradient: 'from-primary-500 to-accent-500',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-dark-800/50 py-20">
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
            Features
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Why{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              AlgoZen?
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need to master DSA, crush interviews, and become a legendary coder — all
            in one addictive platform.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                variants={cardVariants}
                className="card group hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/5 cursor-default"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
