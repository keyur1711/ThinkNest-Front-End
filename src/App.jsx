import { useState, useEffect, useMemo } from 'react';
import { getBlogs } from './services/api';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedBlog from './components/FeaturedBlog';
import LatestBlogs from './components/LatestBlogs';
import TrendingBlogs from './components/TrendingBlogs';
import Newsletter from './components/Newsletter';
import ContactSection from './components/ContactSection';
import BlogDetailsPage from './components/BlogDetailsPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminBlogs from './components/AdminBlogs';
import AdminCreateBlog from './components/AdminCreateBlog';
import AdminComments from './components/AdminComments';
import AdminSubscribers from './components/AdminSubscribers';
import AdminMessages from './components/AdminMessages';
import Footer from './components/Footer';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [route, setRoute] = useState({ name: 'home' });

  useEffect(() => {
    const getToken = () => {
      try {
        return localStorage.getItem('thinknest_admin_token');
      } catch {
        return null;
      }
    };

    const requireAuth = () => {
      if (!getToken()) {
        window.location.replace('/#/admin/login');
        return false;
      }
      return true;
    };

    const parseHash = () => {
      const hash = window.location.hash || '#/';
      const blogMatch = hash.match(/^#\/blog\/(.+)$/);

      const path = window.location.pathname || '/';
      if (path.startsWith('/admin/dashboard')) {
        if (!requireAuth()) return;
        setRoute({ name: 'adminDashboard' });
        return;
      }
      if (path.startsWith('/admin/create-blog')) {
        if (!requireAuth()) return;
        setRoute({ name: 'adminCreateBlog' });
        return;
      }
      if (path.startsWith('/admin/comments')) {
        if (!requireAuth()) return;
        setRoute({ name: 'adminComments' });
        return;
      }
      if (path.startsWith('/admin/subscribers')) {
        if (!requireAuth()) return;
        setRoute({ name: 'adminSubscribers' });
        return;
      }
      if (path.startsWith('/admin/messages')) {
        if (!requireAuth()) return;
        setRoute({ name: 'adminMessages' });
        return;
      }
      if (path.startsWith('/admin/blogs')) {
        if (!requireAuth()) return;
        setRoute({ name: 'adminBlogs' });
        return;
      }
      if (hash === '#/admin/login') {
        // Already logged in → go straight to dashboard
        if (getToken()) {
          window.location.replace('/admin/dashboard');
          return;
        }
        setRoute({ name: 'adminLogin' });
        return;
      }
      if (blogMatch) {
        const slug = decodeURIComponent(blogMatch[1]);
        setRoute({ name: 'blog', slug });
        return;
      }
      const categoryMatch = hash.match(/^#\/category\/(.+)$/);
      if (categoryMatch) {
        setCategory(decodeURIComponent(categoryMatch[1]));
        setRoute({ name: 'home' });
        return;
      }
      setCategory('');
      setRoute({ name: 'home' });
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const params = useMemo(() => {
    const p = { page: 1, limit: 20 };
    if (search) p.search = search;
    if (category) p.category = category;
    return p;
  }, [search, category]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getBlogs(params)
      .then((res) => {
        if (res.success && res.data) setBlogs(res.data);
        else setError(res.message || 'Failed to load');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params]);

  const featured = blogs[0] || null;
  const latest = blogs.slice(featured ? 1 : 0, featured ? 7 : 6);
  const latestForTrending = blogs;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {route.name !== 'blog' && (
        <Helmet>
          <title>ThinkNest - Think Better. Live Smarter</title>
          <meta
            name="description"
            content="Discover blogs about health, technology, lifestyle and food."
          />
          <meta
            name="keywords"
            content="ThinkNest, health, technology, lifestyle, food, productivity, education, blogs"
          />
        </Helmet>
      )}
      {!route.name.startsWith('admin') && <Navbar category={category} />}
      <AnimatePresence mode="wait">
        <motion.div
          key={
            route.name === 'blog'
              ? `blog:${route.slug}`
              : route.name === 'adminLogin'
              ? 'adminLogin'
              : route.name === 'adminDashboard'
              ? 'adminDashboard'
              : route.name === 'adminBlogs'
              ? 'adminBlogs'
              : route.name === 'adminCreateBlog'
              ? 'adminCreateBlog'
              : route.name === 'adminComments'
              ? 'adminComments'
              : route.name === 'adminSubscribers'
              ? 'adminSubscribers'
              : route.name === 'adminMessages'
              ? 'adminMessages'
              : 'home'
          }
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {route.name === 'blog' ? (
            <BlogDetailsPage
              slug={route.slug}
              onBack={() => {
                window.location.hash = '#/';
              }}
            />
          ) : route.name === 'adminLogin' ? (
            <AdminLogin />
          ) : route.name === 'adminDashboard' ? (
            <AdminDashboard />
          ) : route.name === 'adminBlogs' ? (
            <AdminBlogs />
          ) : route.name === 'adminCreateBlog' ? (
            <AdminCreateBlog />
          ) : route.name === 'adminComments' ? (
            <AdminComments />
          ) : route.name === 'adminSubscribers' ? (
            <AdminSubscribers />
          ) : route.name === 'adminMessages' ? (
            <AdminMessages />
          ) : (
            <>
              <Hero onSearch={setSearch} category={category} />
              {error && (
                <div className="max-w-7xl mx-auto px-4 py-4 w-full">
                  <p className="text-red-600 bg-red-50 rounded-xl px-4 py-2 text-sm">{error}</p>
                </div>
              )}
              <FeaturedBlog blog={featured} />
              <LatestBlogs blogs={latest} loading={loading} />
              <TrendingBlogs />
              <Newsletter />
              <ContactSection />
            </>
          )}
        </motion.div>
      </AnimatePresence>
      {!route.name.startsWith('admin') && <Footer />}
    </div>
  );
}

export default App;
