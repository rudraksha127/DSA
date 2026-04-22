import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const AVATAR_COLORS = [
  'bg-primary-600',
  'bg-accent-600',
  'bg-blue-600',
  'bg-emerald-600',
  'bg-rose-600',
];
const AVATAR_INITIALS = ['AK', 'SR', 'PR', 'MK', 'VR'];

function getNextSunday() {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilSunday);
  next.setHours(20, 0, 0, 0);
  return next;
}

function formatCountdown(ms) {
  if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export default function CTASection() {
  const [timeLeft, setTimeLeft] = useState(() =>
    formatCountdown(getNextSunday().getTime() - Date.now())
  );

  useEffect(() => {
    const target = getNextSunday();
    const id = setInterval(() => {
      const diff = target.getTime() - Date.now();
      setTimeLeft(formatCountdown(diff));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section
      id="cta"
      className="relative py-24 overflow-hidden bg-gradient-to-br from-primary-600/20 via-dark-800 to-accent-600/15"
    >
      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-dark-700/80 backdrop-blur-sm border border-primary-500/20"
        >
          <span className="text-sm text-slate-400 font-medium">Next Contest:</span>
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold">
            <span className="text-white">{timeLeft.d}d</span>
            <span className="text-slate-500">·</span>
            <span className="text-white">{pad(timeLeft.h)}h</span>
            <span className="text-slate-500">·</span>
            <span className="text-white">{pad(timeLeft.m)}m</span>
            <span className="text-slate-500">·</span>
            <span className="text-primary-400">{pad(timeLeft.s)}s</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl lg:text-6xl font-extrabold text-white mb-4 leading-tight"
        >
          Ready to Become a{' '}
          <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            Legend?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-lg mb-10 max-w-xl mx-auto"
        >
          Join 5,000 warriors already grinding on AlgoZen. Your journey to legendary starts now.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <Link
            to="/sign-up"
            className="inline-flex items-center gap-3 btn-primary py-4 px-10 text-lg shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50"
          >
            <Zap className="w-5 h-5" />
            Start Free — No Credit Card
          </Link>
        </motion.div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-slate-500 text-sm mb-10"
        >
          Free forever on Rookie tier • Warrior plan from ₹199/month
        </motion.p>

        {/* Social proof avatars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="flex items-center">
            {AVATAR_INITIALS.map((initials, i) => (
              <div
                key={initials}
                className={`w-9 h-9 rounded-full border-2 border-dark-800 flex items-center justify-center text-xs font-bold text-white ${AVATAR_COLORS[i]}`}
                style={{ marginLeft: i > 0 ? '-10px' : 0, zIndex: 5 - i }}
              >
                {initials}
              </div>
            ))}
          </div>
          <span className="text-slate-400 text-sm">
            <span className="text-white font-semibold">+248 warriors</span> joined this week
          </span>
        </motion.div>
      </div>
    </section>
  );
}
