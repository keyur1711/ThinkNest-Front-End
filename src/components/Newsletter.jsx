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
      className="w-full tn-section"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="relative tn-container text-center">
        <div className="relative mx-auto max-w-5xl tn-card overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(700px_240px_at_10%_0%,rgba(99,102,241,0.20),transparent_60%),radial-gradient(700px_240px_at_90%_100%,rgba(129,140,248,0.16),transparent_60%)]" />
        {/* Decorative dots */}
          <div className="absolute top-8 left-10 w-2 h-2 rounded-full bg-primary-300/30" />
          <div className="absolute top-16 right-12 w-3 h-3 rounded-full bg-primary-200/40" />
          <div className="absolute bottom-10 left-16 w-2.5 h-2.5 rounded-full bg-primary-300/25" />

          <div className="relative p-8 sm:p-10 md:p-12">
            {/* Mail Icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/70 border border-slate-200/70 shadow-sm mb-5">
              <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Section Title */}
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
              Stay Updated
            </h2>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-slate-600 mb-8 md:mb-10">
              Get the latest articles delivered straight to your inbox.
            </p>

            {/* Email Form */}
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={status === 'loading'}
                  className="flex-1 tn-input"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="tn-btn-primary"
                >
                  {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
                </button>
              </form>
            </div>

            {/* Success/Error Message */}
            {message && (
              <div
                className={`mt-5 inline-flex items-center justify-center px-4 py-2 rounded-2xl text-sm font-medium border ${
                  status === 'success'
                    ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60'
                    : 'bg-red-50/80 text-red-700 border-red-200/60'
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
