import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Problems', href: '#problems' },
  { label: 'Contests', href: '#cta' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-md bg-dark-900/95 border-b border-primary-500/20 shadow-lg shadow-dark-900/50'
          : 'backdrop-blur-md bg-dark-900/80 border-b border-primary-500/10'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            AlgoZen
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-primary-500/10 rounded-lg transition-all duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/sign-in"
            className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg border border-dark-500 hover:border-primary-500/50 hover:bg-primary-500/10 transition-all duration-200"
          >
            Sign In
          </Link>
          <Link to="/sign-up" className="btn-primary text-sm">
            Start Free
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-dark-700 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-dark-900/98 border-b border-primary-500/10"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-primary-500/10 rounded-lg transition-all"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-3 pt-3 border-t border-dark-600 flex flex-col gap-2">
                <Link
                  to="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="text-center text-sm font-medium text-slate-300 py-2.5 rounded-lg border border-dark-500 hover:border-primary-500/50 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary text-center text-sm"
                >
                  Start Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
