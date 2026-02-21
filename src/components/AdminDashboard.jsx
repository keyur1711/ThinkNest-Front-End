import { useEffect, useState } from 'react';
import { getBlogs, getCommentsByBlog } from '../services/api';
import { motion } from 'framer-motion';
import AdminLayout from './AdminLayout';

const cardsConfig = [
  { key: 'totalBlogs', label: 'Total Blogs', color: 'bg-primary-100 text-primary-700' },
  { key: 'totalViews', label: 'Total Views', color: 'bg-blue-100 text-blue-700' },
  { key: 'totalComments', label: 'Total Comments', color: 'bg-emerald-100 text-emerald-700' },
  { key: 'totalSubscribers', label: 'Total Subscribers', color: 'bg-amber-100 text-amber-700' },
  { key: 'totalMessages', label: 'Total Messages', color: 'bg-rose-100 text-rose-700' },
];

const iconForKey = (key) => {
  switch (key) {
    case 'totalBlogs':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      );
    case 'totalViews':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      );
    case 'totalComments':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-9 8l3-3h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14z" />
        </svg>
      );
    case 'totalSubscribers':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.5 21a4.5 4.5 0 119 0m-4.5-7a4 4 0 100-8 4 4 0 000 8zM19 8v6m-3-3h6" />
        </svg>
      );
    case 'totalMessages':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8m-8 4h5M4 6h16v8a2 2 0 01-2 2H7l-3 3V6z" />
        </svg>
      );
    default:
      return null;
  }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalViews: 0,
    totalComments: 0,
    totalSubscribers: null,
    totalMessages: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError('');

        const blogsRes = await getBlogs({ page: 1, limit: 100 });
        if (!blogsRes?.success || !Array.isArray(blogsRes?.data)) {
          throw new Error(blogsRes?.message || 'Failed to load blogs');
        }

        const blogs = blogsRes.data;
        const totalBlogs = typeof blogsRes.total === 'number' ? blogsRes.total : blogs.length;
        const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

        // Fetch comments count per blog (for small sites this is fine)
        let totalComments = 0;
        await Promise.all(
          blogs
            .map((b) => b._id)
            .filter(Boolean)
            .map(async (id) => {
              try {
                const res = await getCommentsByBlog(id);
                if (res?.success && Array.isArray(res?.data)) {
                  totalComments += res.data.length;
                }
              } catch {
                // ignore per-blog failures
              }
            }),
        );

        setStats((prev) => ({
          ...prev,
          totalBlogs,
          totalViews,
          totalComments,
        }));
      } catch (err) {
        setError(err?.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <AdminLayout>
    <div className="flex-1 w-full bg-gray-50 py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            Overview of content and engagement on ThinkNest.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
          {cardsConfig.map(({ key, label, color }) => {
            const value = stats[key];
            const display =
              value == null ? (
                <span className="text-xs text-gray-400">N/A</span>
              ) : (
                value.toLocaleString()
              );

            return (
              <motion.div
                key={key}
                className="rounded-2xl bg-white shadow-sm shadow-gray-200/80 border border-gray-100 px-4 py-4 sm:px-5 sm:py-5 flex flex-col justify-between"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                whileHover={{ y: -4, boxShadow: '0 18px 45px rgba(15,23,42,0.10)', scale: 1.01 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {label}
                  </p>
                  <div className={`inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-xs font-semibold ${color}`}>
                    {iconForKey(key)}
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-2">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {loading ? '…' : display}
                  </p>
                </div>
                {key === 'totalSubscribers' || key === 'totalMessages' ? (
                  <p className="mt-2 text-[11px] text-gray-400">
                    Backend does not yet expose this count.
                  </p>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}

