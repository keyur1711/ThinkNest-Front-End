import { motion } from 'framer-motion';

const calculateReadingTime = (content) => {
  if (!content) return null;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
};

export default function BlogCard({ blog, index = 0, className = '' }) {
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
      className={`block group cursor-pointer tn-card tn-card-hover overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        {blog?.featuredImage ? (
          <img
            src={blog.featuredImage}
            alt={blog?.title || 'Blog image'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
            <span className="text-3xl text-neutral-200 font-serif font-bold">T</span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-neutral-700 shadow-sm border border-white/50">
            {blog?.category || 'Blog'}
          </span>
        </div>
        {/* Read more arrow on hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md text-neutral-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif font-bold text-lg text-neutral-900 group-hover:text-primary-700 transition-colors duration-300 leading-snug line-clamp-2">
          {blog?.title}
        </h3>
        <p className="mt-2.5 text-sm text-neutral-500 leading-relaxed line-clamp-2">
          {blog?.description}
        </p>

        {/* Meta row */}
        <div className="mt-4 pt-4 border-t border-neutral-100/80 flex items-center gap-3 text-xs text-neutral-400">
          {blog?.createdAt && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
          {readingTime && (
            <span>{readingTime} min read</span>
          )}
          {blog?.views != null && (
            <span className="ml-auto">{blog.views} views</span>
          )}
        </div>
      </div>
    </motion.a>
  );
}
