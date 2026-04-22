import { Link } from 'react-router-dom';
import { Zap, GitBranch, Share2, MessageCircle } from 'lucide-react';

const productLinks = [
  { label: 'Problems', to: '/problems' },
  { label: 'Contests', to: '/contests' },
  { label: 'Battle Mode', to: '/battle' },
  { label: 'Dashboard', to: '/dashboard' },
];

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
];

const socials = [
  { icon: GitBranch, label: 'GitHub', href: 'https://github.com' },
  { icon: Share2, label: 'Twitter', href: 'https://twitter.com' },
  { icon: MessageCircle, label: 'Discord', href: 'https://discord.com' },
];

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Logo + tagline */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                AlgoZen
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Master DSA. Become Legendary.
              <br />
              The gamified DSA platform for serious coders.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg bg-dark-700 border border-dark-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500/50 hover:bg-dark-600 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Stay Updated
            </h4>
            <p className="text-slate-400 text-sm mb-4">
              Get weekly contest reminders and DSA tips.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 min-w-0 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 transition-colors"
              />
              <button className="btn-primary text-sm px-3 py-2">Go</button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-dark-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <span>© 2025 AlgoZen. Built with ❤️ for problem solvers.</span>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
