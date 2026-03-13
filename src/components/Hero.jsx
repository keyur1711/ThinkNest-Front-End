import { useState } from 'react';
import { motion } from 'framer-motion';

const CATEGORIES = ['Technology', 'Health', 'Lifestyle', 'Food', 'Education'];

const CATEGORY_ICONS = {
  Technology: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  ),
  Health: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
  ),
  Lifestyle: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  ),
  Food: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  Education: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
  ),
};

export default function Hero({ onSearch, category }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query.trim());
  };

  const handleCategoryClick = (cat) => {
    if (category === cat) {
      window.location.hash = '#/';
    } else {
      window.location.hash = `#/category/${encodeURIComponent(cat)}`;
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/80 via-primary-50/50 to-amber-50/30" />

      {/* Floating orbs */}
      <div className="absolute top-10 left-[10%] w-72 h-72 bg-primary-300/30 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-20 right-[15%] w-56 h-56 bg-amber-200/25 rounded-full blur-3xl animate-float-delay" />
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-40 bg-emerald-200/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-[5%] w-40 h-40 bg-rose-200/20 rounded-full blur-3xl animate-float" />

      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative tn-container py-20 sm:py-24 md:py-32 lg:py-36 text-center">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 justify-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-primary-200 shadow-md text-xs font-semibold text-primary-700 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse-soft" />
            Welcome to ThinkNest
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="tn-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Think Better.{' '}
          <span className="relative">
            <span className="bg-gradient-to-r from-primary-600 via-emerald-500 to-primary-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Live Smarter.
            </span>
            <motion.svg
              className="absolute -bottom-2 left-0 w-full h-3 text-primary-300/60"
              viewBox="0 0 200 8"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
            >
              <motion.path
                d="M2 5.5C30 2 60 2 100 4.5C140 7 170 3 198 5"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
              />
            </motion.svg>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-6 text-base sm:text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          Discover ideas about health, technology, productivity and life.
        </motion.p>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSubmit}
          className="mt-10 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <motion.div
            className={`relative rounded-2xl transition-all duration-300 ${
              focused
                ? 'shadow-[0_0_0_3px_rgba(34,197,94,0.12),0_8px_25px_rgba(0,0,0,0.06)]'
                : 'shadow-soft'
            }`}
            animate={focused ? { scale: 1.01 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
              <svg className="w-[18px] h-[18px] text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-neutral-200/80 text-sm text-neutral-800 placeholder-neutral-400 focus:border-primary-400 focus:outline-none transition-all"
            />
          </motion.div>
        </motion.form>

        {/* Category Pills */}
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                category === cat
                  ? 'bg-neutral-900 text-white shadow-lg shadow-neutral-900/20'
                  : 'bg-white text-neutral-600 border border-neutral-200/80 hover:border-neutral-300 hover:text-neutral-900 hover:shadow-md'
              }`}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.06, duration: 0.3 }}
            >
              <span className={category === cat ? 'text-white/80' : 'text-neutral-400 group-hover:text-neutral-600'}>
                {CATEGORY_ICONS[cat]}
              </span>
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="mt-14 flex items-center justify-center gap-8 sm:gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {[
            { label: 'Articles', value: '100+', color: 'text-primary-600' },
            { label: 'Readers', value: '10K+', color: 'text-emerald-600' },
            { label: 'Categories', value: '5+', color: 'text-amber-600' },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className={`text-lg sm:text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-neutral-500 mt-0.5 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
    </section>
  );
}
