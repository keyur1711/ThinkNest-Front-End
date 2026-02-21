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
    <section className="relative w-full bg-gradient-to-br from-primary-50 via-white to-primary-50/50 py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Decorative blurred blobs */}
      <div className="absolute top-0 -left-4 w-48 h-48 md:w-72 md:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-48 h-48 md:w-72 md:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-48 md:w-72 md:h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Welcome Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100/80 border border-primary-200/60 mb-6">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
          <span className="text-sm font-medium text-primary-700">Welcome to ThinkNest</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-tight">
          Think Better. <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Live Smarter.</span>
        </h1>
        
        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover ideas about health, technology, productivity and life.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="mt-8 sm:mt-10 md:mt-12 max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-4 sm:py-5 rounded-2xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-lg shadow-primary-100/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-100/40"
            />
          </div>
        </form>

        {/* Category Pills */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                category === cat
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200/50 scale-105'
                  : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-700 border border-gray-200 hover:border-primary-200 shadow-sm hover:shadow-md'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
    </section>
  );
}
