import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Zap, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Tracks', href: '#tracks' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Problems', href: '#problems' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href) => {
    setMenuOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-900/95 backdrop-blur-md border-b border-dark-600/50 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center group-hover:animate-glow transition-all">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Algo<span className="text-primary-400">Zen</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ label, href }) => (
              <button
                key={label}
                onClick={() => handleNavClick(href)}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <Link
                to="/sign-in"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="btn-primary text-sm"
              >
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                to="/dashboard"
                className="btn-secondary text-sm"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white p-2"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark-800/98 border-b border-dark-600/50 backdrop-blur-md">
          <div className="px-4 py-4 flex flex-col gap-4">
            {navLinks.map(({ label, href }) => (
              <button
                key={label}
                onClick={() => handleNavClick(href)}
                className="text-slate-300 hover:text-white text-sm font-medium text-left transition-colors"
              >
                {label}
              </button>
            ))}
            <hr className="border-dark-600" />
            <SignedOut>
              <Link
                to="/sign-in"
                className="text-slate-300 hover:text-white text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="btn-primary text-sm text-center"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                to="/dashboard"
                className="btn-secondary text-sm text-center"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <UserButton afterSignOutUrl="/" />
                <span className="text-slate-400 text-sm">Account</span>
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  )
}
