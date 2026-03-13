import { useState } from 'react';
import { subscribe } from '../services/api';
import { motion } from 'framer-motion';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
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
        setMessage('Thanks! You\u2019re subscribed.');
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
      className="tn-container tn-section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 animate-float-delay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="relative px-6 py-16 sm:px-12 sm:py-20 md:px-16 md:py-24 text-center">
          <motion.div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-400 mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Newsletter
          </motion.div>

          <motion.h2
            className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Stay in the loop
          </motion.h2>
          <motion.p
            className="mt-4 text-neutral-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Get the latest articles delivered straight to your inbox. No spam, ever.
          </motion.p>

          <motion.div
            className="mt-10 max-w-md mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={status === 'loading'}
                className="flex-1 rounded-xl border border-neutral-700/80 bg-neutral-800/80 backdrop-blur px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 focus:outline-none transition-all disabled:opacity-60"
              />
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-400 active:bg-primary-600 transition-all shadow-lg shadow-primary-500/25 disabled:opacity-60"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {status === 'loading' ? 'Subscribing\u2026' : 'Subscribe'}
              </motion.button>
            </form>
          </motion.div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-5 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                status === 'success'
                  ? 'bg-primary-900/50 text-primary-300 border border-primary-800/50'
                  : 'bg-red-900/50 text-red-300 border border-red-800/50'
              }`}
            >
              {status === 'success' && (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              )}
              {message}
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
