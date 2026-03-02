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

  const isOnBlogPage = () => {
    const hash = window.location.hash || '';
    return hash.startsWith('#/blog/');
  };

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
        const contactSection = document.querySelector('[data-contact]');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
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
      const newsletterSection = document.querySelector('[data-newsletter]');
      if (newsletterSection) {
        newsletterSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileOpen && !e.target.closest('nav') && !e.target.closest('[data-mobile-menu]')) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-50 border-b border-white/30 bg-white/65 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)]"
      >
        <div className="tn-container">
          <div className="flex items-center justify-between h-16 md:h-[68px]">
            {/* Logo */}
            <motion.a
              href="/#/"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#/';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-200/40 ring-1 ring-white/40">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                ThinkNest
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 rounded-full px-1.5 py-1.5 bg-white/70 border border-slate-200/70 shadow-sm">
              {NAV_LINKS.map((link) => {
                const isActive = link.category !== null && (category || '') === (link.category || '');
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 bg-white rounded-full shadow-sm border border-slate-200/80"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span
                      className={`relative z-10 ${
                        isActive ? 'text-primary-700' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {link.label}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Search Icon */}
              <motion.button
                onClick={() => {
                  navigateHome(() => {
                    const searchInput = document.querySelector('input[type="search"]');
                    if (searchInput) {
                      searchInput.scrollIntoView({ behavior: 'smooth' });
                      setTimeout(() => searchInput.focus(), 400);
                    }
                  });
                }}
                className="p-2.5 rounded-2xl text-slate-500 hover:text-primary-600 hover:bg-primary-50/70 border border-transparent hover:border-primary-200/50 transition-colors duration-200"
                whileHover={{ scale: 1.1, rotate: 12 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.button>

              {/* Subscribe Button */}
              <motion.button
                onClick={handleSubscribe}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold shadow-md shadow-primary-200/40 hover:shadow-lg hover:shadow-primary-300/50 transition-shadow duration-300"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                Subscribe
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-2xl text-slate-600 hover:text-primary-600 hover:bg-primary-50/70 transition-colors duration-200"
              whileTap={{ scale: 0.9 }}
              aria-label="Menu"
            >
              <motion.svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: mobileOpen ? 90 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Slide-in */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            data-mobile-menu
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 z-50 w-80 max-w-[85vw] h-full bg-white/90 backdrop-blur-xl shadow-2xl lg:hidden border-l border-slate-200/60"
          >
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-200/40 ring-1 ring-white/40">
                    <span className="text-white font-bold text-sm">T</span>
                  </div>
                  <span className="text-lg font-extrabold tracking-tight text-slate-900">ThinkNest</span>
                </div>
                <motion.button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col gap-1 px-4 py-4">
                {NAV_LINKS.map((link, i) => {
                  const isActive = link.category !== null && (category || '') === (link.category || '');
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="mobile-active"
                          className="w-1 h-5 rounded-full bg-primary-500"
                          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        />
                      )}
                      <span>{link.label}</span>
                    </motion.a>
                  );
                })}
              </div>

              {/* Mobile Actions */}
              <div className="mt-auto px-4 pb-6 pt-4 border-t border-slate-200/70">
                <motion.button
                  onClick={() => {
                    setMobileOpen(false);
                    navigateHome(() => {
                      const searchInput = document.querySelector('input[type="search"]');
                      if (searchInput) {
                        searchInput.scrollIntoView({ behavior: 'smooth' });
                        setTimeout(() => searchInput.focus(), 400);
                      }
                    });
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3 mb-3 rounded-2xl text-slate-700 bg-white/70 border border-slate-200/80 hover:bg-white hover:text-slate-900 transition-colors duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="font-medium">Search</span>
                </motion.button>
                <motion.button
                  onClick={handleSubscribe}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="w-full px-4 py-3.5 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold shadow-md shadow-primary-200/30 hover:shadow-lg transition-shadow duration-300"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
