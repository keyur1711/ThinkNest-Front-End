import { motion } from 'framer-motion';

const authors = [
  {
    name: 'Sarah Drasner',
    role: 'Editorial Lead',
    bio: 'Award-winning journalist with a passion for sustainable technology and future living.',
    image: 'SD',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    name: 'Marcus Thorne',
    role: 'Health Expert',
    bio: 'Certified nutritionist and fitness coach helping you optimize your daily performance.',
    image: 'MT',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    name: 'Elena Vance',
    role: 'Productivity Guru',
    bio: 'Software engineer and author of "Deep Work for Modern Teams". Exploring the edge of AI.',
    image: 'EV',
    color: 'from-orange-400 to-amber-500',
  },
];

export default function AuthorHighlight() {
  return (
    <section className="tn-section tn-container">
      <div className="text-center mb-16">
        <div className="tn-label justify-center mb-3">Meet the Team</div>
        <h2 className="tn-heading text-3xl md:text-4xl">Voices of ThinkNest</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {authors.map((author, i) => (
          <motion.div
            key={author.name}
            className="group relative bg-white rounded-3xl border border-neutral-100 p-8 shadow-card hover:shadow-elevated transition-all duration-300"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${author.color} flex items-center justify-center text-white text-2xl font-serif font-bold shadow-lg mb-6 group-hover:rotate-6 transition-transform`}>
              {author.image}
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-1">{author.name}</h3>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-4 block">{author.role}</span>
            <p className="text-sm text-neutral-500 leading-relaxed italic border-l-2 border-neutral-100 pl-4">
              "{author.bio}"
            </p>
            
            <div className="mt-8 flex items-center gap-3">
              {['Twitter', 'LinkedIn'].map(s => (
                <a key={s} href="#" className="text-xs font-medium text-neutral-400 hover:text-primary-600 transition-colors uppercase tracking-wider">{s}</a>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
