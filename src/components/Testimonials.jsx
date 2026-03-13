import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Product Designer',
    text: 'ThinkNest has become my go-to for morning reads. The articles are well-written and always leave me with something actionable.',
    avatar: 'S',
    color: 'bg-primary-100 text-primary-700',
  },
  {
    name: 'Michael Chen',
    role: 'Software Engineer',
    text: 'The technology articles here are genuinely insightful. Not just surface-level takes, but deep dives that help me grow as an engineer.',
    avatar: 'M',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Health Coach',
    text: 'I recommend ThinkNest to all my clients. The health and wellness content is evidence-based and beautifully presented.',
    avatar: 'E',
    color: 'bg-amber-100 text-amber-700',
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-rose-50/20" />
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-amber-200/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-56 h-56 bg-rose-200/15 rounded-full blur-3xl" />
      <div className="relative tn-container tn-section">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="tn-label justify-center mb-3">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Reader Stories
        </div>
        <h2 className="tn-heading text-3xl md:text-4xl">What our readers say</h2>
        <p className="mt-4 text-neutral-500 text-sm sm:text-base max-w-md mx-auto">
          Trusted by thousands of curious minds around the world.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="group relative p-6 rounded-2xl bg-white border border-neutral-100 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
          >
            {/* Quote mark */}
            <svg className="w-8 h-8 text-neutral-100 mb-4 group-hover:text-primary-100 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
            </svg>

            <p className="text-sm text-neutral-600 leading-relaxed mb-6">{t.text}</p>

            <div className="flex items-center gap-3 pt-4 border-t border-neutral-50">
              <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-sm font-bold`}>
                {t.avatar}
              </div>
              <div>
                <div className="text-sm font-semibold text-neutral-900">{t.name}</div>
                <div className="text-xs text-neutral-400">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
}
