import BlogCard from './BlogCard';
import { motion } from 'framer-motion';

export default function LatestBlogs({ blogs, loading }) {
  if (loading) {
    return (
      <section className="tn-container tn-section">
        <div className="tn-label mb-2">Latest Articles</div>
        <p className="text-neutral-400 text-sm mb-10">Fresh stories and ideas, just for you</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-white border border-neutral-100 overflow-hidden shadow-card">
              <div className="aspect-[16/10] bg-neutral-100 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-neutral-100 rounded-lg w-3/4 animate-pulse" />
                <div className="h-4 bg-neutral-50 rounded-lg w-full animate-pulse" />
                <div className="h-4 bg-neutral-50 rounded-lg w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!blogs?.length) return null;

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/40 via-orange-50/20 to-transparent pointer-events-none" />
      <div className="relative tn-container tn-section">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="tn-label mb-2">Latest Articles</div>
          <p className="text-neutral-500 text-sm mb-10">Fresh stories and ideas, just for you</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, i) => (
            <BlogCard key={blog._id} blog={blog} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
