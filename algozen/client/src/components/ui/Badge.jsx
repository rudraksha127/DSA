import { cn } from '../../lib/utils'

const variants = {
  Rookie: 'bg-green-900/50 text-green-400 border border-green-700',
  Warrior: 'bg-yellow-900/50 text-yellow-400 border border-yellow-700',
  Legend: 'bg-red-900/50 text-red-400 border border-red-700',
  default: 'bg-slate-800 text-slate-300 border border-slate-600',
}

export default function Badge({ label, variant }) {
  return (
    <span className={cn('px-2 py-0.5 rounded text-xs font-medium', variants[variant] || variants.default)}>
      {label}
    </span>
  )
}
