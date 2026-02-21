import { useEffect, useState } from 'react';
import { getBlogs, getCommentsByBlog, deleteComment } from '../services/api';
import { motion } from 'framer-motion';
import AdminLayout from './AdminLayout';

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadAllComments = async () => {
      try {
        setLoading(true);
        setError('');

        // Step 1: fetch all blogs to get their IDs
        const blogsRes = await getBlogs({ page: 1, limit: 100 });
        if (!blogsRes?.success || !Array.isArray(blogsRes?.data)) {
          throw new Error(blogsRes?.message || 'Failed to load blogs');
        }

        // Step 2: fetch comments for each blog and merge
        const all = [];
        await Promise.all(
          blogsRes.data
            .filter((b) => b._id)
            .map(async (blog) => {
              try {
                const res = await getCommentsByBlog(blog._id);
                if (res?.success && Array.isArray(res?.data)) {
                  res.data.forEach((c) => {
                    all.push({
                      ...c,
                      blogId: c.blogId || c.blog || blog._id,
                      blogTitle: blog.title || '',
                    });
                  });
                }
              } catch {
                // skip per-blog failures
              }
            }),
        );

        // Sort newest first
        all.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setComments(all);
      } catch (err) {
        setError(err?.message || 'Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    loadAllComments();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;
    const confirm = window.confirm('Are you sure you want to delete this comment?');
    if (!confirm) return;

    setDeletingId(id);
    try {
      const res = await deleteComment(id);
      if (res?.success) {
        setComments((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert(res?.message || 'Failed to delete comment');
      }
    } catch (err) {
      alert(err?.message || 'Failed to delete comment');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 w-full bg-gray-50 py-10 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Comments</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage all comments across your blogs.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Desktop Table */}
          <div className="hidden md:block mt-4 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap max-w-xs">Comment</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Blog</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      Loading comments…
                    </td>
                  </tr>
                ) : comments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      No comments found.
                    </td>
                  </tr>
                ) : (
                  comments.map((comment) => (
                    <tr
                      key={comment._id}
                      className="border-t border-gray-100 hover:bg-gray-50/60 transition"
                    >
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        <span className="font-semibold text-gray-900">{comment.name || '—'}</span>
                      </td>
                      <td className="px-4 py-3 align-top text-gray-600 whitespace-nowrap">
                        {comment.email || '—'}
                      </td>
                      <td className="px-4 py-3 align-top text-gray-700 max-w-xs">
                        <p className="line-clamp-2">{comment.comment || comment.text || '—'}</p>
                      </td>
                      <td className="px-4 py-3 align-top text-gray-500 max-w-[180px]">
                        <p className="text-xs line-clamp-1">{comment.blogTitle || comment.blogId || '—'}</p>
                      </td>
                      <td className="px-4 py-3 align-top text-gray-600 whitespace-nowrap">
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-4 py-3 align-top text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(comment._id)}
                          disabled={deletingId === comment._id}
                          className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          {deletingId === comment._id ? 'Deleting…' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden mt-4 space-y-3">
            {loading ? (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm px-4 py-6 text-center text-gray-500">
                Loading comments…
              </div>
            ) : comments.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm px-4 py-6 text-center text-gray-500">
                No comments found.
              </div>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{comment.name || '—'}</p>
                      <p className="text-xs text-gray-500">{comment.email || '—'}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(comment._id)}
                      disabled={deletingId === comment._id}
                      className="shrink-0 px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                      {deletingId === comment._id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-3">
                    {comment.comment || comment.text || '—'}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="truncate max-w-[140px]">
                      {comment.blogTitle || comment.blogId || '—'}
                    </span>
                    <span>
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
