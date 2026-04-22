import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Zap } from 'lucide-react'

export default function CTASection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="py-24 bg-dark-800/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Glow */}
        <div className="relative">
          <div className="absolute -inset-20 bg-gradient-to-r from-primary-600/10 via-accent-600/15 to-primary-600/10 rounded-full blur-3xl" />

          <div
            className={`relative transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-8">
              <Zap className="w-4 h-4 text-primary-400" />
              <span className="text-primary-400 text-sm font-medium">Join 50,000+ developers</span>
            </div>

            <h2 className="text-5xl font-extrabold text-white mb-6">
              Ready to{' '}
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Level Up?
              </span>
            </h2>

            <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Start your DSA journey today. Solve your first problem, earn your
              first XP, and take the first step towards your dream job.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/sign-up"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30 active:scale-95 text-lg"
              >
                Get Started — It&apos;s Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <p className="mt-6 text-slate-600 text-sm">
              No credit card required · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
