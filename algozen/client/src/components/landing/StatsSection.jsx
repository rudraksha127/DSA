import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Users, Target, Brain } from 'lucide-react';

const stats = [
  {
    icon: TrendingUp,
    value: 10000,
    suffix: '+',
    label: 'Problems Solved',
    display: '10,000+',
  },
  {
    icon: Users,
    value: 5000,
    suffix: '+',
    label: 'Warriors',
    display: '5,000+',
  },
  {
    icon: Target,
    value: 98,
    suffix: '%',
    label: 'Interview Success',
    display: '98%',
  },
  {
    icon: Brain,
    value: 24,
    suffix: '/7',
    label: 'AI Mentor Available',
    display: '24/7',
  },
];

function AnimatedCounter({ target, suffix, display, inView }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const isSimple = target <= 100;
    const duration = 1800;
    const steps = isSimple ? target : 60;
    const stepTime = duration / steps;
    let current = 0;

    const id = setInterval(() => {
      current += 1;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (current >= steps) {
        clearInterval(id);
        setCount(target);
      }
    }, stepTime);

    return () => clearInterval(id);
  }, [inView, target]);

  if (target >= 1000) {
    const formatted = count.toLocaleString('en-IN');
    return <span>{formatted}{suffix}</span>;
  }
  return <span>{count}{suffix}</span>;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="stats" className="bg-dark-900 py-16" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-dark-800/60 backdrop-blur-sm border border-primary-500/20 rounded-2xl p-6 flex flex-col gap-4 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      display={stat.display}
                      inView={inView}
                    />
                  </div>
                  <div className="text-sm text-slate-400 mt-1 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
