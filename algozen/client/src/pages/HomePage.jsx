import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code2, Zap, Trophy, Brain } from 'lucide-react'
import Button from '../components/ui/Button'

const features = [
  { icon: Code2, title: 'DSA Problems', desc: 'Hundreds of curated problems from Rookie to Legend' },
  { icon: Zap, title: 'XP & Levels', desc: 'Earn XP, level up, and evolve your AlgoZen creature' },
  { icon: Trophy, title: 'Contests', desc: 'Compete in live coding contests and climb the leaderboard' },
  { icon: Brain, title: 'AI Hints', desc: 'Get smart hints from our Groq-powered AI tutor' },
]

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <motion.section
        className="text-center py-20 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Master DSA.<br />Level Up.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          AlgoZen is your gamified DSA practice platform. Solve problems, earn XP, compete in contests, and grow as an engineer.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/problems">
            <Button variant="primary" className="text-base px-8 py-3">Start Solving →</Button>
          </Link>
          <Link to="/contests">
            <Button variant="secondary" className="text-base px-8 py-3">View Contests</Button>
          </Link>
        </div>
      </motion.section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(({ icon: Icon, title, desc }) => (
          <motion.div
            key={title}
            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-indigo-500 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            <Icon className="w-8 h-8 text-indigo-400 mb-3" />
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-slate-400 text-sm">{desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  )
}
