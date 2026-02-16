import { useState } from 'react';
import { sendContact } from '../services/api';
import { motion } from 'framer-motion';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
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
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: '',
        });
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
      className="w-full bg-gradient-to-br from-gray-50 to-primary-50/30 py-14 md:py-18"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Contact Us
        </h2>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              disabled={status === 'loading'}
              className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:border-primary-300 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
              disabled={status === 'loading'}
              className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:border-primary-300 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Message Textarea */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message..."
              rows={6}
              required
              disabled={status === 'loading'}
              className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:border-primary-300 disabled:opacity-60 disabled:cursor-not-allowed resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <motion.button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-6 py-3.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-200/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </motion.button>
          </div>
        </form>

        {/* Success/Error Message */}
        {message && (
          <div className={`mt-6 px-4 py-3 rounded-xl transition-all duration-300 ${
            status === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <p className="text-sm font-medium text-center">{message}</p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
