import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const calculateReadingTime = (content) => {
  if (!content) return null;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
};

export default function FeaturedBlog({ blog }) {
  if (!blog) return null;

  const slug = blog?.slug || blog?._id;
  const readingTime = calculateReadingTime(blog?.content);
  const [imageOk, setImageOk] = useState(true);

  useEffect(() => {
    setImageOk(true);
  }, [blog?._id, blog?.slug, blog?.featuredImage]);

  return (
    <section className="tn-container pt-16 md:pt-24">
      <motion.div
        className="tn-label mb-4"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        Featured Article
      </motion.div>

      <motion.a
        href={slug ? `/#/blog/${slug}` : '#'}
        onClick={(e) => {
          e.preventDefault();
          if (slug) {
            window.location.hash = `#/blog/${slug}`;
            window.scrollTo({ top: 0 });
          }
        }}
        className="group block"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-3xl border border-primary-100/60 shadow-card hover:shadow-[0_8px_30px_rgba(34,197,94,0.12)] transition-all duration-500 bg-gradient-to-br from-white via-white to-primary-50/40">
          {/* Image */}
          <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-neutral-100">
            {blog?.featuredImage && imageOk ? (
              <motion.img
                src={blog.featuredImage}
                alt={blog?.title || 'Featured blog image'}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                onError={() => setImageOk(false)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
                <span className="text-5xl text-neutral-200 font-serif font-bold">T</span>
              </div>
            )}
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-12 bg-white relative overflow-hidden">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50/50 rounded-bl-[80px] -translate-y-1/2 translate-x-1/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <motion.span
              className="inline-block w-fit px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-xs font-semibold mb-5 border border-primary-100/50"
              whileHover={{ scale: 1.05 }}
            >
              {blog?.category || 'Blog'}
            </motion.span>

            <h3 className="tn-heading text-2xl sm:text-3xl lg:text-4xl leading-tight group-hover:text-primary-700 transition-colors duration-300">
              {blog?.title}
            </h3>

            <p className="mt-4 text-neutral-500 text-sm sm:text-base leading-relaxed line-clamp-3">
              {blog?.description}
            </p>

            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
              {blog?.createdAt && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
              {blog?.views != null && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  {blog.views} views
                </span>
              )}
              {readingTime && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {readingTime} min read
                </span>
              )}
            </div>

            <div className="mt-7">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-semibold group-hover:bg-primary-600 group-hover:shadow-lg group-hover:shadow-primary-500/25 transition-all duration-300">
                Read Article
                <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </motion.a>
    </section>
  );
}
