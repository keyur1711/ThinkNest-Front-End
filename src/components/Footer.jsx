export default function Footer() {
  const quickLinks = [
    { label: 'Home', href: '/#/', category: '' },
    { label: 'Technology', href: '/#/', category: 'Technology' },
    { label: 'Health', href: '/#/', category: 'Health' },
    { label: 'Lifestyle', href: '/#/', category: 'Lifestyle' },
    { label: 'Food', href: '/#/', category: 'Food' },
    { label: 'Contact', href: '#contact', category: null },
  ];

  const socials = [
    {
      label: 'Facebook',
      href: '#',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
          <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.25 0-1.64.77-1.64 1.56V12h2.79l-.45 2.89h-2.34v6.99A10 10 0 0022 12z" />
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: '#',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
          <path d="M7.5 2h9A5.5 5.5 0 0122 7.5v9A5.5 5.5 0 0116.5 22h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm9 2h-9A3.5 3.5 0 004 7.5v9A3.5 3.5 0 007.5 20h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0016.5 4zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.25-2.1a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: '#',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.67H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.86 3.37-1.86 3.6 0 4.27 2.37 4.27 5.45v6.3zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zM7.12 20.45H3.56V9h3.56v11.45z" />
        </svg>
      ),
    },
    {
      label: 'Twitter',
      href: '#',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
          <path d="M18.2 2H21l-6.1 7 7.2 13H16l-4.8-8.3L4.7 22H2l6.6-7.6L1.6 2h6.3l4.3 7.5L18.2 2zm-1 18h1.5L7.1 4H5.5l11.7 16z" />
        </svg>
      ),
    },
  ];

  const scrollToContact = (e) => {
    e.preventDefault();
    const el = document.querySelector('[data-contact]');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const applyCategory = (category) => (e) => {
    e.preventDefault();
    // If we are on a blog details page, go home first.
    if (window.location.hash && window.location.hash.startsWith('#/blog/')) {
      window.location.hash = '#/';
      setTimeout(() => {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }, 0);
    }

    // Let Navbar/App handle category via hash-less approach? We reuse localStorage as simple bridge.
    // Navbar already supports category filtering via onCategory; home page will read it via UI interactions.
    // Here we simply navigate home + scroll to top.
    window.location.hash = '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (category) {
      // optional: store preferred category for later enhancement
      try {
        localStorage.setItem('thinknest_category', category);
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem('thinknest_category');
      } catch {
        // ignore
      }
    }
  };

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <a href="/#/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                ThinkNest
              </span>
            </a>
            <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-md leading-relaxed">
              Think better with stories, ideas, and insights about health, technology, and life.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold text-white tracking-wide">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={
                      l.category === null
                        ? scrollToContact
                        : applyCategory(l.category || '')
                    }
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-all duration-300 group"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-400/60 group-hover:bg-primary-300 transition" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter hint */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-white tracking-wide">Stay Updated</h3>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Subscribe to get the latest articles delivered to your inbox.
            </p>
            <button
              onClick={() => {
                const el = document.querySelector('[data-newsletter]');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-5 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300"
            >
              Subscribe
            </button>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2026 ThinkNest. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Built with React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
