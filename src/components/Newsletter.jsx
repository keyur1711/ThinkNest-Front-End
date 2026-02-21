import { useState } from 'react';
import { subscribe } from '../services/api';
import { motion } from 'framer-motion';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setMessage('');
    try {
      const res = await subscribe(email.trim());
      if (res.success) {
        setStatus('success');
        setMessage('Thanks! You’re subscribed.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(res.message || 'Something went wrong.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Could not subscribe. Try again.');
    }
  };

  return (
    <motion.section
      data-newsletter
      className="w-full bg-gradient-to-br from-primary-50 to-primary-100/50 py-14 md:py-18"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Decorative dots */}
        <div className="absolute top-0 left-4 w-2 h-2 rounded-full bg-primary-300/40" />
        <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-primary-200/50" />
        <div className="absolute bottom-4 left-12 w-2.5 h-2.5 rounded-full bg-primary-300/30" />

        {/* Mail Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 mb-5">
          <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Stay Updated
        </h2>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-10">
          Get the latest articles delivered straight to your inbox
        </p>

        {/* Email Form — Card wrapper */}
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg shadow-primary-100/40 p-5 sm:p-6 border border-primary-100/50">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={status === 'loading'}
                className="flex-1 px-5 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-300 hover:border-primary-300 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-200/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </div>
          </form>

          {/* Success/Error Message */}
          {message && (
            <div className={`mt-4 px-4 py-3 rounded-xl transition-all duration-300 ${
              status === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
