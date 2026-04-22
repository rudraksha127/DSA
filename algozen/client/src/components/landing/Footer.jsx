import { Link } from 'react-router-dom'
import { Zap, ExternalLink } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'Tracks', href: '#tracks' },
    { label: 'Problems', href: '#problems' },
    { label: 'Contests', href: '#' },
    { label: 'Leaderboard', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-dark-800/50 border-t border-dark-600/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Algo<span className="text-primary-400">Zen</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Master Data Structures & Algorithms through gamified learning,
              AI mentorship, and live competitions.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-white transition-colors text-xs flex items-center gap-1"
                aria-label="GitHub"
              >
                <ExternalLink className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-white transition-colors text-xs flex items-center gap-1"
                aria-label="Twitter"
              >
                <ExternalLink className="w-4 h-4" />
                Twitter
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-white transition-colors text-xs flex items-center gap-1"
                aria-label="LinkedIn"
              >
                <ExternalLink className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Nav Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold text-sm mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-600/40 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} AlgoZen. All rights reserved.
          </p>
          <p className="text-slate-600 text-sm">
            Built with ❤️ for developers everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}
