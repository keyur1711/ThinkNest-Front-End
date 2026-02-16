import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Home', href: '/#/', category: '' },
  { label: 'Technology', href: '/#/', category: 'Technology' },
  { label: 'Health', href: '/#/', category: 'Health' },
  { label: 'Lifestyle', href: '/#/', category: 'Lifestyle' },
  { label: 'Food', href: '/#/', category: 'Food' },
  { label: 'Contact', href: '#contact', category: null },
];

export default function Navbar({ onCategory }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');

  const handleNavClick = (e, link) => {
    e.preventDefault();
    setMobileOpen(false);
    
    if (link.category === null) {
      // Handle Contact link - scroll to contact section
      const contactSection = document.querySelector('[data-contact]');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    
    setActiveCategory(link.category || '');
    if (onCategory) {
      onCategory(link.category || '');
    }
    
    // Scroll to top if not already there
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    // Scroll to newsletter section
    const newsletterSection = document.querySelector('[data-newsletter]');
    if (newsletterSection) {
      newsletterSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileOpen && !e.target.closest('nav')) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener('click', handleClickOutside);
      // Prevent body scroll when mobile menu is open
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
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-white/20 shadow-sm shadow-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <a 
              href="/#/" 
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory('');
                if (onCategory) onCategory('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent group-hover:from-primary-700 group-hover:to-primary-600 transition-all duration-300">
                ThinkNest
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeCategory === (link.category || '')
                      ? 'bg-white/60 text-primary-700 shadow-sm'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-white/40'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Search Icon */}
              <button
                onClick={() => {
                  const heroSection = document.querySelector('section');
                  if (heroSection) {
                    heroSection.scrollIntoView({ behavior: 'smooth' });
                    // Focus search input if it exists
                    setTimeout(() => {
                      const searchInput = document.querySelector('input[type="search"]');
                      if (searchInput) searchInput.focus();
                    }, 500);
                  }
                }}
                className="p-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-white/40 transition-all duration-300"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Subscribe Button */}
              <button
                onClick={handleSubscribe}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-200/50 transition-all duration-300"
              >
                Subscribe
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-white/40 transition-all duration-300"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Mobile Menu Slide-in */}
      <div
        className={`fixed top-16 right-0 z-50 w-80 max-w-[85vw] h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-md border-l border-white/20 shadow-xl lg:hidden transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6 overflow-y-auto">
          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-2 mb-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                  activeCategory === (link.category || '')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Actions */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setMobileOpen(false);
                const heroSection = document.querySelector('section');
                if (heroSection) {
                  heroSection.scrollIntoView({ behavior: 'smooth' });
                  setTimeout(() => {
                    const searchInput = document.querySelector('input[type="search"]');
                    if (searchInput) searchInput.focus();
                  }, 500);
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="font-medium">Search</span>
            </button>
            <button
              onClick={handleSubscribe}
              className="w-full px-4 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all duration-300"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
