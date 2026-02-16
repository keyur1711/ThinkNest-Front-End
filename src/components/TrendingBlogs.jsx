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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Articles</h2>
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
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Trending Articles</h2>
      
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
