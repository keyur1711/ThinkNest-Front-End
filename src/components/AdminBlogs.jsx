import { useEffect, useState } from 'react';
import { getBlogs, deleteBlog } from '../services/api';
import { motion } from 'framer-motion';
import AdminLayout from './AdminLayout';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getBlogs({ page: 1, limit: 100 });
        if (res?.success && Array.isArray(res?.data)) {
          setBlogs(res.data);
        } else {
          setError(res?.message || 'Failed to load blogs');
        }
      } catch (err) {
        setError(err?.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;
    const confirm = window.confirm('Are you sure you want to delete this blog? This cannot be undone.');
    if (!confirm) return;

    setDeletingId(id);
    try {
      const res = await deleteBlog(id);
      if (res?.success) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
      } else {
        alert(res?.message || 'Failed to delete blog');
      }
    } catch (err) {
      alert(err?.message || 'Failed to delete blog');
    } finally {
      setDeletingId(null);
    }
  };

  const goToCreate = () => {
    window.location.href = '/admin/create-blog';
  };

  const goToEdit = (id) => {
    window.location.href = `/admin/edit-blog/${id}`;
  };

  return (
    <AdminLayout>
    <div className="flex-1 w-full bg-gray-50 py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Blogs</h1>
            <p className="mt-1 text-sm text-gray-500">Manage all published blogs.</p>
          </div>
          <motion.button
            onClick={goToCreate}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-sm hover:shadow-lg transition-all"
          >
            + Create Blog
          </motion.button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Category</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">Views</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Created</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    Loading blogs…
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No blogs found.
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="border-t border-gray-100 hover:bg-gray-50/60 transition">
                    <td className="px-4 py-3 align-top max-w-xs">
                      <div className="font-semibold text-gray-900 line-clamp-2">{blog.title}</div>
                    </td>
                    <td className="px-4 py-3 align-top text-gray-600 whitespace-nowrap">
                      {blog.category || '—'}
                    </td>
                    <td className="px-4 py-3 align-top text-right text-gray-800 whitespace-nowrap">
                      {blog.views ?? 0}
                    </td>
                    <td className="px-4 py-3 align-top text-gray-600 whitespace-nowrap">
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 align-top text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => goToEdit(blog._id)}
                          className="px-2.5 py-1.5 rounded-lg border border-primary-200 text-primary-700 text-xs font-medium hover:bg-primary-50 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          disabled={deletingId === blog._id}
                          className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          {deletingId === blog._id ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}

