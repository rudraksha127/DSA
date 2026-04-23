import { cn } from '../../lib/utils'

export default function Button({ children, variant = 'primary', className, ...props }) {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
    ghost: 'hover:bg-slate-800 text-slate-300',
    danger: 'bg-red-700 hover:bg-red-600 text-white',
  }
  return (
    <button
      className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 inline-flex items-center', variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
}
