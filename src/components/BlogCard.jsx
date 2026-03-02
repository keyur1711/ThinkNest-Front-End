// Calculate reading time based on content length (average 200 words per minute)
const calculateReadingTime = (content) => {
  if (!content) return null;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return minutes;
};

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function BlogCard({ blog, size = 'default', className = '' }) {
  const isLarge = size === 'large';
  const slug = blog?.slug || blog?._id;
  const readingTime = calculateReadingTime(blog?.content);

  const handleClick = (e) => {
    e.preventDefault();
    if (slug) {
      window.location.hash = `#/blog/${slug}`;
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <motion.a
      href={slug ? `/#/blog/${slug}` : '#'}
      onClick={handleClick}
      className={`block group cursor-pointer overflow-hidden tn-card tn-card-hover ${className}`}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className={`relative bg-slate-100 overflow-hidden ${isLarge ? 'aspect-[16/9]' : 'aspect-video'}`}>
        {blog?.featuredImage ? (
          <img
            src={blog.featuredImage}
            alt={blog?.title || 'Blog image'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-white">
            <span className="text-4xl text-primary-300 font-extrabold">T</span>
          </div>
        )}
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-3 left-3 tn-badge shadow-sm bg-white/80 backdrop-blur">
          {blog?.category || 'Blog'}
        </span>
      </div>
      <div className={`p-5 ${isLarge ? 'sm:p-6' : 'sm:p-5'}`}>
        <h3
          className={`font-extrabold tracking-tight text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-2 leading-tight ${
            isLarge ? 'text-xl sm:text-2xl mb-2' : 'text-lg mb-2'
          }`}
        >
          {blog?.title}
        </h3>
        <p className={`text-slate-600 line-clamp-2 leading-relaxed ${isLarge ? 'text-base mb-4' : 'text-sm mb-3'}`}>
          {blog?.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          {blog?.views != null && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="font-medium">{blog.views}</span>
            </div>
          )}
          {readingTime && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{readingTime} min read</span>
            </div>
          )}
          {blog?.createdAt && (
            <span className="ml-auto text-slate-400">
              {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </motion.a>
  );
}
