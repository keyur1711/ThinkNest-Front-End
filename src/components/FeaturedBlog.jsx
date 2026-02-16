import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Calculate reading time based on content length (average 200 words per minute)
const calculateReadingTime = (content) => {
  if (!content) return null;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return minutes;
};

export default function FeaturedBlog({ blog }) {
  if (!blog) return null;

  const slug = blog?.slug || blog?._id;
  const readingTime = calculateReadingTime(blog?.content);
  const [imageOk, setImageOk] = useState(true);

  // Reset image state when blog changes
  useEffect(() => {
    setImageOk(true);
  }, [blog?._id, blog?.slug, blog?.featuredImage]);

  return (
    <motion.section
      className="w-full max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-8 py-10 md:py-14"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured</h2>
      <motion.a
        href={slug ? `/#/blog/${slug}` : '#'}
        className="group block relative w-full min-w-full rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ease-out"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Background Image Container */}
        <div className="relative w-full min-w-full overflow-hidden bg-gray-100 h-[360px] sm:h-[460px] md:h-[540px] lg:h-[600px]">
          {blog?.featuredImage && imageOk ? (
            <img
              src={blog.featuredImage}
              alt={blog?.title || 'Featured blog image'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              onError={() => setImageOk(false)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
              <span className="text-6xl text-white/30 font-bold">T</span>
            </div>
          )}
          
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-black/85 group-hover:via-black/55 group-hover:to-black/35 transition-all duration-500 ease-out"></div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-start justify-end p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="w-full max-w-3xl">
              {/* Category Badge */}
              <span className="inline-block px-3 py-1.5 mb-3 sm:mb-4 rounded-lg bg-white/95 backdrop-blur-sm text-xs font-semibold text-primary-700 shadow-sm">
                {blog?.category || 'Blog'}
              </span>
              
              {/* Title */}
              <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight tracking-tight break-words group-hover:text-primary-200 transition-colors duration-300">
                {blog?.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                {blog?.description}
              </p>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base text-gray-300">
                {blog?.views != null && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="font-medium">{blog.views}</span>
                  </div>
                )}
                {readingTime && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{readingTime} min read</span>
                  </div>
                )}
                {blog?.createdAt && (
                  <span className="text-gray-400">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>
              
              {/* Read More Button */}
              <button className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-xl bg-primary-600 text-white text-sm sm:text-base font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:translate-x-1">
                <span>Read More</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.a>
    </motion.section>
  );
}
