import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home', href: '/#/', category: '' },
  { label: 'Technology', href: '/#/category/Technology', category: 'Technology' },
  { label: 'Health', href: '/#/category/Health', category: 'Health' },
  { label: 'Lifestyle', href: '/#/category/Lifestyle', category: 'Lifestyle' },
  { label: 'Food', href: '/#/category/Food', category: 'Food' },
  { label: 'Contact', href: '#contact', category: null },
];

export default function Navbar({ category }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isOnBlogPage = () => (window.location.hash || '').startsWith('#/blog/');

  const navigateHome = (callback) => {
    if (isOnBlogPage()) {
      window.location.hash = '#/';
      if (callback) setTimeout(callback, 100);
    } else {
      if (callback) callback();
    }
  };

  const handleNavClick = (e, link) => {
    e.preventDefault();
    setMobileOpen(false);
    if (link.category === null) {
      navigateHome(() => {
        const el = document.querySelector('[data-contact]');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
      return;
    }
    if (link.category) {
      window.location.hash = `#/category/${encodeURIComponent(link.category)}`;
    } else {
      window.location.hash = '#/';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    navigateHome(() => {
      const el = document.querySelector('[data-newsletter]');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-neutral-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            : 'bg-white/50 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="tn-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.a
              href="/#/"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#/';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-neutral-900 to-neutral-700 flex items-center justify-center shadow-md"
                whileHover={{ rotate: -6 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="text-white font-bold text-sm font-serif">T</span>
              </motion.div>
              <span className="text-lg font-serif font-bold text-neutral-900">
                ThinkNest
              </span>
            </motion.a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5 bg-neutral-50/80 rounded-full px-1.5 py-1 border border-neutral-100">
              {NAV_LINKS.map((link) => {
                const isActive = link.category !== null && (category || '') === (link.category || '');
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className="relative px-4 py-1.5 text-sm font-medium transition-colors duration-200"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-white rounded-full shadow-sm border border-neutral-200/60"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'}`}>
                      {link.label}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex items-center gap-2">
              <motion.button
                onClick={() => {
                  navigateHome(() => {
                    const input = document.querySelector('input[type="search"]');
                    if (input) {
                      input.scrollIntoView({ behavior: 'smooth' });
                      setTimeout(() => input.focus(), 400);
                    }
                  });
                }}
                className="p-2.5 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100/80 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Search"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.button>
              <motion.button
                onClick={handleSubscribe}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>

            {/* Mobile Hamburger */}
            <motion.button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Slide-in */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            data-mobile-menu
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 z-50 w-72 max-w-[80vw] h-full bg-white/95 backdrop-blur-xl shadow-2xl lg:hidden border-l border-neutral-100"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
                <span className="text-base font-serif font-bold text-neutral-900">Menu</span>
                <motion.button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors"
                  whileTap={{ scale: 0.85, rotate: 90 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                {NAV_LINKS.map((link, i) => {
                  const isActive = link.category !== null && (category || '') === (link.category || '');
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link)}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all ${
                        isActive
                          ? 'text-neutral-900 bg-primary-50/50'
                          : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                      }`}
                    >
                      {isActive && <span className="w-1 h-4 rounded-full bg-primary-500" />}
                      <span>{link.label}</span>
                    </motion.a>
                  );
                })}
              </div>

              <motion.div
                className="p-5 border-t border-neutral-100 space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigateHome(() => {
                      const input = document.querySelector('input[type="search"]');
                      if (input) {
                        input.scrollIntoView({ behavior: 'smooth' });
                        setTimeout(() => input.focus(), 400);
                      }
                    });
                  }}
                  className="w-full tn-btn-secondary text-xs"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
                <button onClick={handleSubscribe} className="w-full tn-btn-primary text-xs">Subscribe</button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
