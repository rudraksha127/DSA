import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Trophy, CheckCircle } from 'lucide-react';

const TYPEWRITER_WORDS = ['Legendary', 'Interview-Ready', 'Contest-Winner', 'Unstoppable'];

const floatingOrbs = [
  { size: 300, top: '10%', left: '5%', color: 'primary-500' },
  { size: 200, top: '60%', left: '80%', color: 'accent-500' },
  { size: 150, top: '80%', left: '20%', color: 'primary-600' },
  { size: 100, top: '20%', left: '70%', color: 'accent-600' },
];

const fakeCode = [
  { type: 'keyword', text: 'function ' },
  { type: 'fn', text: 'twoSum' },
  { type: 'plain', text: '(nums, target) {' },
  { type: 'newline' },
  { type: 'indent', text: '  ' },
  { type: 'keyword', text: 'const ' },
  { type: 'var', text: 'map ' },
  { type: 'plain', text: '= ' },
  { type: 'keyword', text: 'new ' },
  { type: 'fn', text: 'Map' },
  { type: 'plain', text: '();' },
  { type: 'newline' },
  { type: 'indent', text: '  ' },
  { type: 'keyword', text: 'for ' },
  { type: 'plain', text: '(' },
  { type: 'keyword', text: 'let ' },
  { type: 'var', text: 'i ' },
  { type: 'plain', text: '= ' },
  { type: 'number', text: '0' },
  { type: 'plain', text: '; ' },
  { type: 'var', text: 'i ' },
  { type: 'plain', text: '< ' },
  { type: 'var', text: 'nums' },
  { type: 'plain', text: '.length; ' },
  { type: 'var', text: 'i' },
  { type: 'plain', text: '++) {' },
  { type: 'newline' },
  { type: 'indent', text: '    ' },
  { type: 'keyword', text: 'const ' },
  { type: 'var', text: 'comp ' },
  { type: 'plain', text: '= ' },
  { type: 'var', text: 'target ' },
  { type: 'plain', text: '- ' },
  { type: 'var', text: 'nums' },
  { type: 'plain', text: '[' },
  { type: 'var', text: 'i' },
  { type: 'plain', text: '];' },
  { type: 'newline' },
  { type: 'indent', text: '    ' },
  { type: 'keyword', text: 'if ' },
  { type: 'plain', text: '(' },
  { type: 'var', text: 'map' },
  { type: 'plain', text: '.has(' },
  { type: 'var', text: 'comp' },
  { type: 'plain', text: '))' },
  { type: 'newline' },
  { type: 'indent', text: '      ' },
  { type: 'keyword', text: 'return ' },
  { type: 'plain', text: '[' },
  { type: 'var', text: 'map' },
  { type: 'plain', text: '.get(' },
  { type: 'var', text: 'comp' },
  { type: 'plain', text: '), ' },
  { type: 'var', text: 'i' },
  { type: 'plain', text: '];' },
  { type: 'newline' },
  { type: 'indent', text: '    ' },
  { type: 'var', text: 'map' },
  { type: 'plain', text: '.set(' },
  { type: 'var', text: 'nums' },
  { type: 'plain', text: '[' },
  { type: 'var', text: 'i' },
  { type: 'plain', text: '], ' },
  { type: 'var', text: 'i' },
  { type: 'plain', text: ');' },
  { type: 'newline' },
  { type: 'plain', text: '  }' },
  { type: 'newline' },
  { type: 'plain', text: '}' },
];

function CodeToken({ type, text }) {
  const colorMap = {
    keyword: 'text-purple-400',
    fn: 'text-blue-400',
    var: 'text-sky-300',
    string: 'text-green-400',
    number: 'text-orange-400',
    plain: 'text-slate-300',
    indent: 'text-transparent select-none',
  };
  if (type === 'newline') return <br />;
  return <span className={colorMap[type] || 'text-slate-300'}>{text}</span>;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const word = TYPEWRITER_WORDS[wordIndex];
    let timeout;

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 90);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50);
    } else if (deleting && displayed.length === 0) {
      timeout = setTimeout(() => {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % TYPEWRITER_WORDS.length);
      }, 50);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-dark-900 pt-16"
    >
      {/* Floating orbs background */}
      {floatingOrbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-10 blur-3xl pointer-events-none animate-float"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: orb.color.includes('accent')
              ? '#8b5cf6'
              : '#6366f1',
            animationDelay: `${i * 0.7}s`,
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-primary-500/10 border border-primary-500/30 text-primary-400 mb-6">
                <Trophy className="w-4 h-4" />
                #1 Gamified DSA Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl lg:text-7xl font-extrabold leading-tight text-white mb-2"
            >
              Level Up Your DSA.
            </motion.h1>
            <motion.h1
              variants={itemVariants}
              className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6"
            >
              <span className="text-white">Become </span>
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                {displayed}
              </span>
              <span
                className="inline-block w-0.5 h-12 lg:h-16 bg-primary-400 ml-1 align-middle"
                style={{ opacity: cursorVisible ? 1 : 0, transition: 'opacity 0.1s' }}
              />
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed"
            >
              Join 5,000+ warriors mastering algorithms with AI guidance, real-time battles,
              and creature companions.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8">
              <Link
                to="/sign-up"
                className="btn-primary py-3 px-8 text-base flex items-center gap-2"
              >
                Start Your Journey →
              </Link>
              <button className="btn-secondary py-3 px-8 text-base flex items-center gap-2">
                <Play className="w-4 h-4 fill-current" />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-2 text-sm text-slate-400"
            >
              {['10K+ Problems Solved', '5K+ Warriors', '98% Interview Success'].map(
                (stat, i) => (
                  <span key={stat} className="flex items-center gap-2">
                    {i > 0 && <span className="w-1 h-1 rounded-full bg-slate-600" />}
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-slate-300 font-medium">{stat}</span>
                  </span>
                )
              )}
            </motion.div>
          </motion.div>

          {/* Right: Floating code window */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:flex flex-col gap-4"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="rounded-xl overflow-hidden border border-dark-600 shadow-2xl shadow-primary-500/10"
            >
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-dark-700 border-b border-dark-600">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-xs text-slate-500 font-mono">twoSum.js</span>
              </div>
              {/* Code */}
              <div className="bg-dark-800 px-6 py-5 font-mono text-sm leading-relaxed overflow-x-auto">
                {fakeCode.map((token, i) => (
                  <CodeToken key={i} {...token} />
                ))}
              </div>
              {/* Submission result */}
              <div className="bg-dark-700/80 border-t border-dark-600 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-success text-sm font-semibold">✓ Accepted</span>
                  <span className="text-slate-500 text-xs ml-2">Runtime: 4ms • Beats 97%</span>
                </div>
                <span className="text-sm font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  +150 XP ⚡
                </span>
              </div>
            </motion.div>

            {/* XP notification card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="flex items-center gap-4 bg-dark-800/80 backdrop-blur-sm border border-primary-500/20 rounded-xl px-5 py-4 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-lg flex-shrink-0">
                ⚡
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Level Up! You reached Level 5</p>
                <p className="text-slate-400 text-xs mt-0.5">Your creature evolved into Baby Coder 🐣</p>
              </div>
              <div className="ml-auto text-2xl">🎉</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
