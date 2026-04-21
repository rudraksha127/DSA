import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Play, Code2, Zap } from 'lucide-react'

const codeSnippet = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}`

export default function HeroSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-600/10 rounded-full blur-3xl" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div
            className={`transition-all duration-700 ${
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-4 h-4 text-primary-400" />
              <span className="text-primary-400 text-sm font-medium">
                Learn DSA Like a Game
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Master{' '}
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Algorithms
              </span>{' '}
              <br />
              Level Up Your{' '}
              <span className="bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
                Career
              </span>
            </h1>

            <p className="text-slate-400 text-lg mb-8 max-w-lg leading-relaxed">
              AlgoZen turns competitive programming into an epic adventure. Earn
              XP, unlock creatures, and climb leaderboards as you conquer data
              structures and algorithms.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/sign-up"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/30 active:scale-95"
              >
                Start for Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="inline-flex items-center gap-2 bg-dark-700 hover:bg-dark-600 text-slate-200 font-semibold py-3 px-6 rounded-xl border border-dark-500 hover:border-primary-500/30 transition-all duration-200">
                <Play className="w-4 h-4 text-primary-400" />
                Watch Demo
              </button>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-success" />
                Free to start
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-success" />
                No credit card
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-success" />
                500+ problems
              </div>
            </div>
          </div>

          {/* Right Content — Code Preview */}
          <div
            className={`transition-all duration-700 delay-200 ${
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/30 to-accent-600/30 rounded-2xl blur-xl" />

              {/* Code Card */}
              <div className="relative bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden shadow-2xl">
                {/* Window Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-dark-700 border-b border-dark-600">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <div className="flex items-center gap-2 ml-3">
                    <Code2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-400 text-xs font-mono">
                      twoSum.js
                    </span>
                  </div>
                </div>

                {/* Code */}
                <pre className="p-6 text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed">
                  <code>{codeSnippet}</code>
                </pre>

                {/* Result Bar */}
                <div className="px-6 py-3 bg-dark-700/50 border-t border-dark-600 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">
                    Runtime: 68 ms · Memory: 44.1 MB
                  </span>
                  <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded">
                    ✓ Accepted
                  </span>
                </div>
              </div>

              {/* XP Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl px-3 py-2 shadow-lg animate-float">
                <div className="text-center">
                  <p className="text-white text-xs font-bold">+150 XP</p>
                  <p className="text-primary-100 text-[10px]">Level Up!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
