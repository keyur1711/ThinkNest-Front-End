import { useState } from 'react';
import { sendContact } from '../services/api';
import { motion } from 'framer-motion';

const infoCards = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Email Us',
    detail: 'contact@thinknest.com',
    color: 'from-primary-500/10 to-emerald-500/10',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Location',
    detail: 'Remote \u2014 Worldwide',
    color: 'from-blue-500/10 to-indigo-500/10',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Follow Us',
    detail: '@thinknest on social media',
    color: 'from-amber-500/10 to-orange-500/10',
  },
];

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setMessage('Please fill in all fields.');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      const res = await sendContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });
      if (res.success) {
        setStatus('success');
        setMessage(res.message || 'Your message has been sent successfully');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setMessage(res.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Could not send message. Please try again.');
    }
  };

  return (
    <motion.section
      data-contact
      className="relative overflow-hidden tn-section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 via-neutral-50/40 to-white pointer-events-none" />
      <div className="relative tn-container">
      <div className="text-center mb-14">
        <motion.div
          className="tn-label mb-3 justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Get in Touch
        </motion.div>
        <motion.h2
          className="tn-heading text-3xl md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          We'd love to hear from you
        </motion.h2>
        <motion.p
          className="mt-4 text-neutral-500 text-sm sm:text-base max-w-md mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Have a question or want to collaborate? Drop us a message.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 max-w-5xl mx-auto">
        {/* Info Cards */}
        <div className="lg:col-span-2 space-y-4">
          {infoCards.map((item, i) => (
            <motion.div
              key={item.title}
              className="group flex items-start gap-4 p-5 rounded-2xl bg-white border border-neutral-100 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
            >
              <div className={`shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-neutral-700 group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">{item.title}</h4>
                <p className="text-sm text-neutral-500 mt-0.5">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <motion.div
          className="lg:col-span-3 rounded-2xl border border-neutral-100 bg-white p-6 sm:p-8 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">Name</label>
              <input
                type="text" id="name" name="name"
                value={formData.name} onChange={handleChange}
                placeholder="Your name" required disabled={status === 'loading'}
                className="tn-input"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
              <input
                type="email" id="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="your.email@example.com" required disabled={status === 'loading'}
                className="tn-input"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1.5">Message</label>
              <textarea
                id="message" name="message"
                value={formData.message} onChange={handleChange}
                placeholder="Your message..." rows={5} required disabled={status === 'loading'}
                className="tn-textarea"
              />
            </div>
            <motion.button
              type="submit" disabled={status === 'loading'}
              className="w-full tn-btn-primary py-3"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Sending...
                </span>
              ) : 'Send Message'}
            </motion.button>
          </form>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-5 px-4 py-3 rounded-xl text-sm font-medium text-center flex items-center justify-center gap-2 ${
                status === 'success'
                  ? 'bg-primary-50 text-primary-700 border border-primary-100'
                  : 'bg-red-50 text-red-600 border border-red-100'
              }`}
            >
              {status === 'success' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              )}
              {message}
            </motion.div>
          )}
        </motion.div>
      </div>
      </div>
    </motion.section>
  );
}
