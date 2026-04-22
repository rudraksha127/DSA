import { motion, AnimatePresence } from 'framer-motion'

const confetti = ['🎊', '🎉', '🎊', '🎉', '🎊']

export default function LevelUpModal({ isOpen, onClose, prevLevel = 1, newLevel = 2, xpGained = 0, evolved = false, creatureName = '', rank = null }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-dark-800 border border-primary-500/40 rounded-3xl p-8 max-w-md w-full mx-4 text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-2xl font-black text-primary-500 mb-2 tracking-widest">⬆️ LEVEL UP!</div>
            <div className="flex justify-center gap-1 mb-6">
              {confetti.map((c, i) => (
                <motion.span
                  key={i}
                  className="text-2xl"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                >
                  {c}
                </motion.span>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-5xl font-black text-slate-400">{prevLevel}</div>
              <motion.div
                className="text-3xl text-primary-500"
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >→</motion.div>
              <motion.div
                className="text-6xl font-black text-primary-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
              >{newLevel}</motion.div>
            </div>

            <div className="inline-block bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              +{xpGained} XP
            </div>

            {evolved && (
              <div className="bg-dark-700 rounded-2xl p-4 mb-4">
                <div className="text-yellow-400 font-bold mb-1">✨ Evolution!</div>
                <div className="text-lg">🐣 → 🐉</div>
                <div className="text-slate-300 text-sm mt-1">{creatureName}</div>
              </div>
            )}

            {rank && (
              <div className="inline-block bg-dark-700 border border-yellow-500/40 text-yellow-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                🏅 Rank: {rank}
              </div>
            )}

            <button
              onClick={onClose}
              className="mt-4 w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Continue Coding 🚀
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
