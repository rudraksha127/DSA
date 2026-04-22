import { motion } from 'framer-motion';
import { Code2, Globe, Lock, CheckSquare, Square } from 'lucide-react';

const dsaTopics = [
  { label: 'Arrays & Hashing', done: true },
  { label: 'Dynamic Programming', done: true },
  { label: 'Graphs & BFS/DFS', done: false },
  { label: 'Trees & Tries', done: false },
];

const realTopics = [
  { label: 'System Design', done: false },
  { label: 'Database Optimization', done: false },
  { label: 'API Design & REST', done: false },
  { label: 'Distributed Architecture', done: false },
];

const levels = [1, 2, 3, 4, 5];

export default function TracksSection() {
  return (
    <section id="tracks" className="bg-dark-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Track
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Two specialized learning paths designed to take you from beginner to legend.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* DSA Track */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden border border-primary-500/20 bg-dark-800 hover:border-primary-500/40 transition-all duration-300 group"
          >
            {/* Card header */}
            <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 text-xs font-bold bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">
                  150+ Problems
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-2">DSA Mastery Track</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                From Arrays to Graphs. Master 15+ topics with guided problem sets and AI-powered hints.
              </p>
            </div>

            {/* Card body */}
            <div className="p-6">
              {/* Level path */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Level Progress Path
                </p>
                <div className="flex items-center gap-2">
                  {levels.map((lvl) => (
                    <div key={lvl} className="flex items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                          lvl <= 2
                            ? 'bg-gradient-to-br from-primary-500 to-accent-500 border-primary-400 text-white shadow-lg shadow-primary-500/30'
                            : 'bg-dark-700 border-dark-500 text-slate-500'
                        }`}
                      >
                        {lvl <= 2 ? lvl : <Lock className="w-3.5 h-3.5" />}
                      </div>
                      {lvl < 5 && (
                        <div
                          className={`h-0.5 w-4 ${lvl < 2 ? 'bg-primary-500' : 'bg-dark-600'}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div className="space-y-2 mb-6">
                {dsaTopics.map((topic) => (
                  <div key={topic.label} className="flex items-center gap-3 py-1">
                    {topic.done ? (
                      <CheckSquare className="w-4 h-4 text-success flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${topic.done ? 'text-white font-medium' : 'text-slate-400'}`}
                    >
                      {topic.label}
                    </span>
                  </div>
                ))}
              </div>

              <button className="btn-primary w-full justify-center">Start Track</button>
            </div>
          </motion.div>

          {/* Real World Track */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden border border-emerald-500/20 bg-dark-800 hover:border-emerald-500/40 transition-all duration-300 group"
          >
            {/* Card header */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 text-xs font-bold bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">
                  50+ Challenges
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-2">Real World Track</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                System Design, API patterns, Scalable code. Build production-grade engineering skills.
              </p>
            </div>

            {/* Card body */}
            <div className="p-6">
              {/* Coming soon banner */}
              <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-warning/10 border border-warning/30 rounded-lg">
                <Lock className="w-4 h-4 text-warning flex-shrink-0" />
                <span className="text-warning text-sm font-medium">
                  Requires Level 10 • Unlock by mastering DSA Track
                </span>
              </div>

              {/* Topics */}
              <div className="space-y-2 mb-6">
                {realTopics.map((topic) => (
                  <div key={topic.label} className="flex items-center gap-3 py-1">
                    <Lock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <span className="text-sm text-slate-500">{topic.label}</span>
                  </div>
                ))}
              </div>

              <div className="relative group/btn">
                <button
                  disabled
                  className="btn-secondary w-full justify-center opacity-60 cursor-not-allowed flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Explore Track
                </button>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-dark-600 border border-dark-500 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Coming Soon — Reach Level 10 first
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
