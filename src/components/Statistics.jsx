import { motion } from 'framer-motion';

const stats = [
  { label: 'Published Articles', value: '500+', sub: 'Expertly crafted stories' },
  { label: 'Monthly Readers', value: '10k+', sub: 'Growing community' },
  { label: 'Categories covered', value: '18', sub: 'Diverse topics' },
  { label: 'Expert Authors', value: '25+', sub: 'Verified insights' },
];

export default function Statistics() {
  return (
    <section className="relative py-20 overflow-hidden bg-neutral-900 border-y border-white/5">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />
      
      <div className="tn-container relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center lg:text-left">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent text-4xl md:text-5xl font-serif font-bold tracking-tight mb-2">
                {s.value}
              </div>
              <div className="text-white text-sm font-semibold uppercase tracking-widest mb-1.5 opacity-90">
                {s.label}
              </div>
              <div className="text-neutral-500 text-xs sm:text-sm font-medium">
                {s.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
