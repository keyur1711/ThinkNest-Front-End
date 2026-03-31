import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Technology',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Latest in AI, Gadgets, and Code.',
    color: 'from-blue-500/20 to-indigo-500/10',
    hoverColor: 'group-hover:text-blue-600',
  },
  {
    name: 'Health',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    description: 'Wellness, Nutrition, and Fitness.',
    color: 'from-emerald-500/20 to-teal-500/10',
    hoverColor: 'group-hover:text-emerald-600',
  },
  {
    name: 'Lifestyle',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707-.707" />
      </svg>
    ),
    description: 'Productivity, Travel, and Life.',
    color: 'from-orange-500/20 to-amber-500/10',
    hoverColor: 'group-hover:text-orange-600',
  },
  {
    name: 'Food',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    description: 'Recipes, Reviews, and Culture.',
    color: 'from-pink-500/20 to-rose-500/10',
    hoverColor: 'group-hover:text-pink-600',
  },
];

export default function CategoryGrid() {
  const handleClick = (name) => {
    window.location.hash = `#/category/${encodeURIComponent(name)}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="tn-section tn-container">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="tn-label mb-3">Browse by Category</div>
          <h2 className="tn-heading text-3xl md:text-4xl">Themes We Love</h2>
        </div>
        <p className="text-neutral-500 max-w-md text-sm sm:text-base">
          Dive deep into our most popular topics and discover curated insights tailored for your interests.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            onClick={() => handleClick(cat.name)}
            className="group cursor-pointer relative overflow-hidden rounded-3xl border border-neutral-100 bg-white p-8 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} rounded-bl-full opacity-50 blur-2xl group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className={`relative w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-600 ${cat.hoverColor} transition-colors duration-300 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
              {cat.icon}
            </div>
            
            <div className="relative">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">{cat.name}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                {cat.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary-600 group-hover:text-primary-700 transition-colors">
                Explore
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
