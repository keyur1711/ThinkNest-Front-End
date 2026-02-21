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
        // Fetch blogs with limit 5, then sort by views on frontend
        const response = await getBlogs({ limit: 20 }); // Fetch more to ensure we get top 5 by views
        
        if (response.success && response.data) {
          // Sort by views (descending) and take top 5
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
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-7 rounded-full bg-orange-400" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            Trending Articles
            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" /></svg>
          </h2>
        </div>
        <p className="text-gray-500 text-sm md:text-base mb-8 ml-[19px]">Most viewed articles this week</p>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] animate-pulse">
              <div className="rounded-2xl bg-gray-200 aspect-video mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </motion.section>
    );
  }

  if (error || trendingBlogs.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-7 rounded-full bg-orange-400" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          Trending Articles
          <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" /></svg>
        </h2>
      </div>
      <p className="text-gray-500 text-sm md:text-base mb-8 ml-[19px]">Most viewed articles this week</p>

      {/* Desktop Grid Layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {trendingBlogs.map((blog) => (
          <BlogCard key={blog._id || blog.slug} blog={blog} />
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="md:hidden -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide">
          {trendingBlogs.map((blog) => (
            <div key={blog._id || blog.slug} className="flex-shrink-0 w-[280px] snap-start">
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
