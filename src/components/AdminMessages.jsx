import { useEffect, useState } from 'react';
import { getAllMessages, deleteMessage } from '../services/api';
import { motion } from 'framer-motion';
import AdminLayout from './AdminLayout';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getAllMessages();
        if (res?.success && Array.isArray(res?.data)) {
          setMessages(res.data);
        } else {
          setError(res?.message || 'Failed to load messages');
        }
      } catch (err) {
        setError(err?.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;
    const confirm = window.confirm('Are you sure you want to delete this message?');
    if (!confirm) return;

    setDeletingId(id);
    try {
      const res = await deleteMessage(id);
      if (res?.success) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
        if (expandedId === id) setExpandedId(null);
      } else {
        alert(res?.message || 'Failed to delete message');
      }
    } catch (err) {
      alert(err?.message || 'Failed to delete message');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 w-full bg-gray-50 py-10 px-4 sm:px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Messages</h1>
              <p className="mt-1 text-sm text-gray-500">
                Contact form submissions from visitors.
              </p>
            </div>
            {!loading && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-primary-100 text-primary-700 text-sm font-semibold">
                {messages.length} total
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
                  <th className="px-5 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Name</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Email</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Message</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Date</th>
                  <th className="px-5 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-center text-gray-500">
                      Loading messages…
                    </td>
                  </tr>
                ) : messages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-center text-gray-500">
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  messages.map((msg) => (
                    <tr
                      key={msg._id}
                      className="border-t border-gray-100 hover:bg-gray-50/60 transition"
                    >
                      <td className="px-5 py-3 align-top whitespace-nowrap">
                        <span className="font-semibold text-gray-900">{msg.name || '—'}</span>
                      </td>
                      <td className="px-5 py-3 align-top text-gray-600 whitespace-nowrap">
                        {msg.email || '—'}
                      </td>
                      <td className="px-5 py-3 align-top text-gray-700 max-w-sm">
                        <p
                          className={`${expandedId === msg._id ? '' : 'line-clamp-2'} cursor-pointer`}
                          onClick={() => setExpandedId(expandedId === msg._id ? null : msg._id)}
                          title="Click to expand/collapse"
                        >
                          {msg.message || '—'}
                        </p>
                      </td>
                      <td className="px-5 py-3 align-top text-gray-600 whitespace-nowrap">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-5 py-3 align-top text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(msg._id)}
                          disabled={deletingId === msg._id}
                          className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          {deletingId === msg._id ? 'Deleting…' : 'Delete'}
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
                Loading messages…
              </div>
            ) : messages.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm px-4 py-6 text-center text-gray-500">
                No messages found.
              </div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{msg.name || '—'}</p>
                      <p className="text-xs text-gray-500">{msg.email || '—'}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      disabled={deletingId === msg._id}
                      className="shrink-0 px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                      {deletingId === msg._id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>

                  <p
                    className={`text-sm text-gray-700 ${expandedId === msg._id ? '' : 'line-clamp-3'} cursor-pointer`}
                    onClick={() => setExpandedId(expandedId === msg._id ? null : msg._id)}
                  >
                    {msg.message || '—'}
                  </p>

                  <p className="text-xs text-gray-400">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '—'}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
