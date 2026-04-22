import { motion } from 'framer-motion';
import { UserPlus, Map, Code2, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your account in 30 seconds. No credit card required.',
    gradient: 'from-primary-500 to-accent-500',
  },
  {
    number: '02',
    icon: Map,
    title: 'Pick Your Track',
    description: 'Choose DSA Mastery or Real World challenges based on your goal.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    number: '03',
    icon: Code2,
    title: 'Solve & Earn XP',
    description: 'Code in Monaco editor, submit solutions, and earn XP on every accepted run.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    number: '04',
    icon: Sparkles,
    title: 'Level Up & Evolve',
    description: 'Watch your creature evolve with every level. Rise through the ranks to Legend.',
    gradient: 'from-orange-500 to-yellow-500',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-dark-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary-500/10 border border-primary-500/30 text-primary-400 mb-4">
            How It Works
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Four Steps to{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Legendary
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From zero to interview-ready in a structured, gamified path.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="relative"
        >
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-px">
            <div className="mx-auto max-w-4xl h-full bg-gradient-to-r from-primary-500/0 via-primary-500/40 to-primary-500/0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={stepVariants}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Connector dot on mobile/tablet */}
                  {i < steps.length - 1 && (
                    <div className="absolute right-0 top-14 w-full h-px lg:hidden">
                      <div className="absolute right-0 top-0 h-px w-1/2 bg-gradient-to-r from-primary-500/40 to-primary-500/0 hidden sm:block" />
                    </div>
                  )}

                  {/* Step circle */}
                  <div className="relative z-10 mb-6">
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg shadow-primary-500/20 mb-0`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-dark-900 border-2 border-primary-500/50 text-primary-400 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
