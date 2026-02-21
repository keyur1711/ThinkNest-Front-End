import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Blogs', href: '/admin/blogs' },
  { label: 'Comments', href: '/admin/comments' },
  { label: 'Subscribers', href: '/admin/subscribers' },
  { label: 'Messages', href: '/admin/messages' },
];

export default function AdminLayout({ children }) {
  const currentPath = window.location.pathname;

  const handleLogout = () => {
    try {
      localStorage.removeItem('thinknest_admin_token');
    } catch {
      // ignore
    }
    window.location.replace('/#/admin/login');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <span className="text-base font-bold text-primary-600 tracking-tight select-none">
            ThinkNest <span className="text-gray-400 font-normal text-xs ml-1">Admin</span>
          </span>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = currentPath.startsWith(href);
              return (
                <a
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            Logout
          </motion.button>
        </div>

        {/* Mobile nav */}
        <div className="sm:hidden flex items-center gap-1 px-4 pb-2">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = currentPath.startsWith(href);
            return (
              <a
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {label}
              </a>
            );
          })}
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
