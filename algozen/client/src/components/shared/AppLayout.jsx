import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/clerk-react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard,
  Code2,
  Trophy,
  Swords,
  User,
  Flame,
  Menu,
  X,
  Zap,
} from 'lucide-react'
import useUserStore from '@/stores/useUserStore'
import { clsx } from 'clsx'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/problems',  label: 'Problems',  icon: Code2 },
  { to: '/contests',  label: 'Contests',  icon: Trophy },
  { to: '/battle',    label: 'Battle',    icon: Swords },
  { to: '/profile',   label: 'Profile',   icon: User },
]

function NavItem({ to, label, Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium',
          isActive
            ? 'bg-primary-600/20 text-primary-400 border-l-2 border-primary-500'
            : 'text-slate-400 hover:text-white hover:bg-dark-700 border-l-2 border-transparent',
        )
      }
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {label}
    </NavLink>
  )
}

const XP_PER_LEVEL = 500

function SidebarXPBar() {
  const userState = useUserStore()
  const xp    = userState.user?.xp    ?? 0
  const level = userState.user?.level ?? 1
  const xpForNext = level * XP_PER_LEVEL
  const pct = Math.min(100, Math.round((xp % xpForNext) / xpForNext * 100))

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400">Level {level}</span>
        <span className="text-xs text-primary-400 font-semibold">{xp} XP</span>
      </div>
      <div className="h-2 w-full rounded-full bg-dark-600 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] text-slate-500">{pct}% to Level {level + 1}</p>
    </div>
  )
}

function Sidebar({ onClose }) {
  const { user: clerkUser } = useUser()
  const userState = useUserStore()
  const streak = userState.user?.streak ?? 0

  return (
    <aside className="flex h-full w-64 flex-col bg-dark-800 border-r border-dark-600">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5">
        <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent tracking-tight">
          AlgoZen
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:text-white hover:bg-dark-700 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-2">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <NavItem key={to} to={to} label={label} Icon={Icon} onClick={onClose} />
        ))}
      </nav>

      {/* Streak badge */}
      {streak > 0 && (
        <div className="mx-4 mb-3 flex items-center gap-2 rounded-lg bg-dark-700 px-3 py-2">
          <Flame className="h-4 w-4 text-orange-400" />
          <span className="text-sm font-semibold text-orange-300">{streak} day streak</span>
        </div>
      )}

      {/* XP bar */}
      <SidebarXPBar />

      {/* User row */}
      <div className="border-t border-dark-600 px-4 py-3 flex items-center gap-3">
        <UserButton afterSignOutUrl="/" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-200">
            {clerkUser?.firstName ?? clerkUser?.username ?? 'Coder'}
          </p>
          <p className="truncate text-xs text-slate-500">
            {clerkUser?.primaryEmailAddress?.emailAddress ?? ''}
          </p>
        </div>
      </div>
    </aside>
  )
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const userState  = useUserStore()
  const streak = userState.user?.streak ?? 0
  const xp     = userState.user?.xp     ?? 0

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Right column: topbar + content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-dark-600 bg-dark-800 px-4">
          {/* Left: hamburger (mobile) + logo text (mobile) */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-1.5 text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-base font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              AlgoZen
            </span>
          </div>

          {/* Spacer on desktop */}
          <div className="hidden lg:block" />

          {/* Right: streak + xp + user button */}
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div className="flex items-center gap-1.5 rounded-full bg-dark-700 px-3 py-1">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-semibold text-orange-300">{streak}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 rounded-full bg-primary-600/20 border border-primary-500/30 px-3 py-1">
              <Zap className="h-3.5 w-3.5 text-primary-400" />
              <span className="text-sm font-semibold text-primary-300">{xp} XP</span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-dark-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
