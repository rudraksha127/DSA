import { Link, NavLink } from 'react-router-dom'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Code2 } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-400">
          <Code2 className="w-6 h-6" />
          AlgoZen
        </Link>
        <div className="flex items-center gap-6">
          <NavLink to="/problems" className={({ isActive }) => isActive ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}>
            Problems
          </NavLink>
          <NavLink to="/contests" className={({ isActive }) => isActive ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}>
            Contests
          </NavLink>
          <SignedIn>
            <NavLink to="/profile" className={({ isActive }) => isActive ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}>
              Profile
            </NavLink>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  )
}
