import { useEffect, useState } from 'react';
import { getAllSubscribers, deleteSubscriber } from '../services/api';
import { motion } from 'framer-motion';
import AdminLayout from './AdminLayout';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getAllSubscribers();
        if (res?.success && Array.isArray(res?.data)) {
          setSubscribers(res.data);
        } else {
          setError(res?.message || 'Failed to load subscribers');
        }
      } catch (err) {
        setError(err?.message || 'Failed to load subscribers');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;
    const confirm = window.confirm('Are you sure you want to remove this subscriber?');
    if (!confirm) return;

    setDeletingId(id);
    try {
      const res = await deleteSubscriber(id);
      if (res?.success) {
        setSubscribers((prev) => prev.filter((s) => s._id !== id));
      } else {
        alert(res?.message || 'Failed to delete subscriber');
      }
    } catch (err) {
      alert(err?.message || 'Failed to delete subscriber');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 w-full bg-gray-50 py-10 px-4 sm:px-6 lg:px-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Subscribers</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage newsletter subscribers.
              </p>
            </div>
            {!loading && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-primary-100 text-primary-700 text-sm font-semibold">
                {subscribers.length} total
              </span>
            )}
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
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">#</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Subscription Date</th>
                  <th className="px-5 py-3 text-right font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-6 text-center text-gray-500">
                      Loading subscribers…
                    </td>
                  </tr>
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-6 text-center text-gray-500">
                      No subscribers found.
                    </td>
                  </tr>
                ) : (
                  subscribers.map((sub, idx) => (
                    <tr
                      key={sub._id}
                      className="border-t border-gray-100 hover:bg-gray-50/60 transition"
                    >
                      <td className="px-5 py-3 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{sub.email}</td>
                      <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                        {sub.createdAt
                          ? new Date(sub.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleDelete(sub._id)}
                          disabled={deletingId === sub._id}
                          className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          {deletingId === sub._id ? 'Deleting…' : 'Delete'}
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
                Loading subscribers…
              </div>
            ) : subscribers.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm px-4 py-6 text-center text-gray-500">
                No subscribers found.
              </div>
            ) : (
              subscribers.map((sub) => (
                <motion.div
                  key={sub._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{sub.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {sub.createdAt
                        ? new Date(sub.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(sub._id)}
                    disabled={deletingId === sub._id}
                    className="shrink-0 px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {deletingId === sub._id ? 'Deleting…' : 'Delete'}
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
