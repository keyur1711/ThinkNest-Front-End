import { useState, useEffect } from 'react';
import { getBlogs } from '../services/api';
import BlogCard from './BlogCard';
import { motion } from 'framer-motion';

export default function TrendingBlogs() {
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getBlogs({ limit: 20 });
        if (response.success && response.data) {
          const sorted = [...response.data]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);
          setTrendingBlogs(sorted);
        } else {
          setError(response.message || 'Failed to load trending blogs');
        }
      } catch (err) {
        setError(err.message || 'Error loading trending blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingBlogs();
  }, []);

  if (loading) {
    return (
      <section className="tn-container tn-section">
        <div className="tn-label mb-2">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" /></svg>
          Trending
        </div>
        <p className="text-neutral-400 text-sm mb-10">Most viewed articles this week</p>
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-64 rounded-2xl bg-white border border-neutral-100 overflow-hidden shadow-card">
              <div className="aspect-[16/10] bg-neutral-100 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-neutral-100 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-neutral-50 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || trendingBlogs.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      {/* Colored background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-primary-50/50 to-teal-50/40" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-200/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="relative tn-container tn-section">
      <motion.div
        className="relative"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="tn-label mb-2">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" /></svg>
          Trending
        </div>
        <p className="text-neutral-400 text-sm mb-10">Most viewed articles this week</p>
      </motion.div>

      {/* Desktop Grid */}
      <div className="relative hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {trendingBlogs.map((blog, i) => (
          <BlogCard key={blog._id || blog.slug} blog={blog} index={i} />
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="relative md:hidden -mx-5 sm:-mx-6 px-5 sm:px-6">
        <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide">
          {trendingBlogs.map((blog, i) => (
            <div key={blog._id || blog.slug} className="flex-shrink-0 w-72 snap-start">
              <BlogCard blog={blog} index={i} />
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
