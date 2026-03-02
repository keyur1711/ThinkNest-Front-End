import { useState } from 'react';

const CATEGORIES = ['Technology', 'Health', 'Lifestyle', 'Food', 'Education'];

export default function Hero({ onSearch, category }) {
  const [query, setQuery] = useState('');

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
    <section className="relative w-full overflow-hidden">
      {/* Decorative blurred blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(1100px_500px_at_20%_0%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(900px_500px_at_90%_10%,rgba(129,140,248,0.12),transparent_60%)]" />
      <div className="absolute top-0 -left-10 w-56 h-56 md:w-80 md:h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-blob" />
      <div className="absolute top-8 -right-10 w-56 h-56 md:w-80 md:h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-56 h-56 md:w-80 md:h-80 bg-slate-200 rounded-full mix-blend-multiply filter blur-2xl opacity-18 animate-blob animation-delay-4000" />

      <div className="relative tn-container tn-section text-center">
        {/* Welcome Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-slate-200/70 shadow-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-700">
            Welcome to <span className="font-semibold text-slate-900">ThinkNest</span>
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-slate-900">
          Think Better.{' '}
          <span className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 bg-clip-text text-transparent">
            Live Smarter.
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Discover ideas about health, technology, productivity and life.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="mt-8 sm:mt-10 md:mt-12 max-w-2xl mx-auto">
          <div className="relative tn-card tn-card-hover overflow-hidden">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-4 sm:py-5 rounded-3xl bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </form>

        {/* Category Pills */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 border ${
                category === cat
                  ? 'bg-primary-600 text-white border-primary-500 shadow-md shadow-primary-200/40'
                  : 'bg-white/70 text-slate-700 border-slate-200/70 hover:bg-white hover:text-slate-900 hover:border-primary-200/60 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    </section>
  );
}
