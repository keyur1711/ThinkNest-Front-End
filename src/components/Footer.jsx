import { motion } from 'framer-motion';

export default function Footer() {
  const quickLinks = [
    { label: 'Home', href: '/#/', category: '' },
    { label: 'About Us', href: '#', category: null },
    { label: 'Technology', href: '/#/category/Technology', category: 'Technology' },
    { label: 'Health', href: '/#/category/Health', category: 'Health' },
    { label: 'Lifestyle', href: '/#/category/Lifestyle', category: 'Lifestyle' },
    { label: 'Food', href: '/#/category/Food', category: 'Food' },
    { label: 'Contact', href: '#contact', category: null },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Careers', href: '#' },
  ];

  const socials = [
    {
      label: 'Facebook', href: '#',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.25 0-1.64.77-1.64 1.56V12h2.79l-.45 2.89h-2.34v6.99A10 10 0 0022 12z" /></svg>,
    },
    {
      label: 'Instagram', href: '#',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M7.5 2h9A5.5 5.5 0 0122 7.5v9A5.5 5.5 0 0116.5 22h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm9 2h-9A3.5 3.5 0 004 7.5v9A3.5 3.5 0 007.5 20h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0016.5 4zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.25-2.1a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2z" /></svg>,
    },
    {
      label: 'LinkedIn', href: '#',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.67H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.86 3.37-1.86 3.6 0 4.27 2.37 4.27 5.45v6.3zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zM7.12 20.45H3.56V9h3.56v11.45z" /></svg>,
    },
    {
      label: 'Twitter', href: '#',
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.2 2H21l-6.1 7 7.2 13H16l-4.8-8.3L4.7 22H2l6.6-7.6L1.6 2h6.3l4.3 7.5L18.2 2zm-1 18h1.5L7.1 4H5.5l11.7 16z" /></svg>,
    },
  ];

  const scrollToContact = (e) => {
    e.preventDefault();
    const el = document.querySelector('[data-contact]');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const applyCategory = (cat) => (e) => {
    e.preventDefault();
    window.location.hash = cat ? `#/category/${encodeURIComponent(cat)}` : '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-neutral-900 text-neutral-300">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-emerald-400 to-teal-500" />

      <div className="tn-container py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Brand */}
          <div className="md:col-span-5">
            <a href="/#/" className="inline-flex items-center gap-2.5 group">
              <motion.div
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-neutral-900 to-neutral-700 flex items-center justify-center shadow-md"
                whileHover={{ rotate: -6, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="text-white font-bold text-xs font-serif">T</span>
              </motion.div>
              <span className="text-lg font-serif font-bold text-white">ThinkNest</span>
            </a>
            <p className="mt-4 text-sm text-neutral-400 max-w-sm leading-relaxed">
              Think better with stories, ideas, and insights about health, technology, and life.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                  className="p-2.5 rounded-xl text-neutral-400 hover:text-white bg-neutral-800 border border-neutral-700/60 hover:border-primary-500/50 hover:shadow-md hover:shadow-primary-500/10 transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Navigation</h3>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={l.category === null && l.label === 'Contact' ? scrollToContact : (l.category !== null ? applyCategory(l.category || '') : undefined)}
                    className="group inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    <span className="w-0 h-0.5 rounded bg-primary-500 group-hover:w-3 transition-all duration-300" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Company</h3>
            <ul className="space-y-3">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    <span className="w-0 h-0.5 rounded bg-primary-500 group-hover:w-3 transition-all duration-300" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter hint */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Stay Updated</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Subscribe to get the latest articles delivered to your inbox.
            </p>
            <motion.button
              onClick={() => {
                const el = document.querySelector('[data-newsletter]');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-5 tn-btn-accent text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </motion.button>
          </div>
        </motion.div>

        <div className="mt-14 pt-8 border-t border-neutral-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-neutral-500">&copy; 2026 ThinkNest. All rights reserved.</p>
          <p className="text-xs text-neutral-600">Built with React & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
