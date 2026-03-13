import { motion } from 'framer-motion';

const TOPICS = [
  'Artificial Intelligence', 'Healthy Living', 'Productivity Hacks', 'Web Development',
  'Mental Health', 'Nutrition Tips', 'Career Growth', 'Mindfulness', 'React & JavaScript',
  'Fitness Goals', 'Creative Writing', 'Cloud Computing', 'Digital Nomad', 'Self Improvement',
  'Cooking Recipes', 'Personal Finance', 'UI/UX Design', 'Travel Stories',
];

function MarqueeRow({ items, direction = 'left', speed = 30 }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden relative">
      <motion.div
        className="flex gap-3 whitespace-nowrap"
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ x: { duration: speed, repeat: Infinity, ease: 'linear' } }}
      >
        {doubled.map((topic, i) => (
          <span
            key={`${topic}-${i}`}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary-100/60 text-sm text-neutral-700 font-medium shadow-sm hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 hover:shadow-md transition-all duration-200 cursor-default select-none"
          >
            {topic}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function TopicMarquee() {
  const firstHalf = TOPICS.slice(0, Math.ceil(TOPICS.length / 2));
  const secondHalf = TOPICS.slice(Math.ceil(TOPICS.length / 2));

  return (
    <motion.section
      className="py-12 md:py-16 overflow-hidden bg-gradient-to-r from-primary-50/30 via-emerald-50/20 to-teal-50/30"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="tn-container mb-8 text-center">
        <div className="tn-label justify-center mb-3">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Explore Topics
        </div>
        <h2 className="tn-heading text-2xl md:text-3xl">What interests you?</h2>
      </div>
      <div className="space-y-3">
        <MarqueeRow items={firstHalf} direction="left" speed={35} />
        <MarqueeRow items={secondHalf} direction="right" speed={40} />
      </div>
    </motion.section>
  );
}
