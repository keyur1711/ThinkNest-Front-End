import { useEffect, useMemo, useRef, useState } from 'react';
import { addComment, getBlogBySlug, getCommentsByBlog, getBlogs } from '../services/api';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import BlogCard from './BlogCard';

const calculateReadingTime = (content) => {
  if (!content) return null;
  const words = String(content).trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const isHtmlContent = (str) => /<(p|h[1-6]|div|ul|ol|li|img|blockquote|pre|figure)\b/i.test(str);

const plainTextToHtml = (text) => {
  if (!text) return '';
  const cleaned = text.replace(/\r\n/g, '\n');
  const lines = cleaned.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  let html = '';
  for (const line of lines) {
    if (/^\d+[.)]\s+/.test(line)) {
      html += `<h2>${line.replace(/^\d+[.)]\s+/, '')}</h2>\n`;
    } else if (line.length < 60 && !line.endsWith('.') && !line.endsWith(':') && /^[A-Z][A-Za-z\s]+$/.test(line)) {
      html += `<h2>${line}</h2>\n`;
    } else if (/^[-\u2013\u2014\u2022*]\s+/.test(line)) {
      html += `<li>${line.replace(/^[-\u2013\u2014\u2022*]\s+/, '')}</li>\n`;
    } else {
      html += `<p>${line}</p>\n`;
    }
  }
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>\n$1</ul>\n');
  return html;
};

const processContentCaptions = (html) => {
  if (!html) return '';
  return html.replace(
    /<p>\s*(<img\s[^>]*>)\s*<\/p>\s*<p>\s*<em>([^<]+)<\/em>\s*<\/p>/gi,
    '<figure>$1<figcaption>$2</figcaption></figure>'
  );
};

const processContent = (content) => {
  if (!content) return '';
  let html = isHtmlContent(content) ? content : plainTextToHtml(content);
  html = processContentCaptions(html);
  return html;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export default function BlogDetailsPage({ slug, onBack }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentStatus, setCommentStatus] = useState('idle');
  const [commentMessage, setCommentMessage] = useState('');
  const [commentForm, setCommentForm] = useState({ name: '', email: '', comment: '' });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const contentRef = useRef(null);

  const readingTime = useMemo(() => calculateReadingTime(blog?.content), [blog?.content]);
  const shareUrl = useMemo(() => window.location.href, [slug]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    setBlog(null);
    getBlogBySlug(slug)
      .then((res) => {
        if (!alive) return;
        if (res?.success && res?.data) setBlog(res.data);
        else setError(res?.message || 'Failed to load blog');
      })
      .catch((err) => alive && setError(err?.message || 'Failed to load blog'))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [slug]);

  useEffect(() => {
    if (!blog?._id) return;
    let alive = true;
    setCommentsLoading(true);
    getCommentsByBlog(blog._id)
      .then((res) => {
        if (!alive) return;
        if (res?.success && Array.isArray(res?.data)) setComments(res.data);
        else setComments([]);
      })
      .catch(() => alive && setComments([]))
      .finally(() => alive && setCommentsLoading(false));
    return () => { alive = false; };
  }, [blog?._id]);

  useEffect(() => {
    if (!blog?.category) return;
    let alive = true;
    setRelatedLoading(true);
    getBlogs({ category: blog.category, limit: 4 })
      .then((res) => {
        if (alive && res?.success && Array.isArray(res?.data)) {
          setRelatedBlogs(res.data.filter(b => b._id !== blog._id).slice(0, 3));
        }
      })
      .finally(() => alive && setRelatedLoading(false));
    return () => { alive = false; };
  }, [blog?._id, blog?.category]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const el = contentRef.current;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 0;
      const total = Math.max(el.offsetHeight - vh, 0);
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      if (total <= 0) { setScrollProgress(rect.top < 0 ? 100 : 0); return; }
      setScrollProgress((scrolled / total) * 100);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [blog?._id]);

  const handleShare = async (type) => {
    const title = blog?.title || 'ThinkNest';
    const url = shareUrl;
    if (type === 'native' && navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
      return;
    }
    if (type === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCommentMessage('Link copied!');
        setCommentStatus('success');
        setTimeout(() => { setCommentStatus('idle'); setCommentMessage(''); }, 1500);
      } catch {}
      return;
    }
    const shareLinks = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    window.open(shareLinks[type], '_blank', 'noopener,noreferrer');
  };

  const onCommentChange = (e) => {
    const { name, value } = e.target;
    setCommentForm((p) => ({ ...p, [name]: value }));
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!blog?._id) return;
    if (!commentForm.name.trim() || !commentForm.email.trim() || !commentForm.comment.trim()) return;
    setCommentStatus('loading');
    setCommentMessage('');
    try {
      const res = await addComment({
        name: commentForm.name.trim(),
        email: commentForm.email.trim(),
        comment: commentForm.comment.trim(),
        blogId: blog._id,
      });
      if (res?.success) {
        setCommentStatus('success');
        setCommentMessage('Comment added!');
        setCommentForm({ name: '', email: '', comment: '' });
        const refresh = await getCommentsByBlog(blog._id);
        if (refresh?.success && Array.isArray(refresh?.data)) setComments(refresh.data);
      } else {
        setCommentStatus('error');
        setCommentMessage(res?.message || 'Failed to add comment');
      }
    } catch (err) {
      setCommentStatus('error');
      setCommentMessage(err?.message || 'Failed to add comment');
    }
  };

  const avatarColors = ['bg-primary-100 text-primary-700', 'bg-blue-100 text-blue-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700', 'bg-purple-100 text-purple-700'];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{blog?.title ? `${blog.title} - ThinkNest` : 'ThinkNest'}</title>
        <meta name="description" content={blog?.description || 'Discover blogs about health, technology, lifestyle and food.'} />
        <meta name="keywords" content={Array.isArray(blog?.tags) && blog.tags.length ? blog.tags.join(', ') : ['ThinkNest', blog?.category, 'blog', 'articles'].filter(Boolean).join(', ')} />
        {blog?.title && <link rel="canonical" href={shareUrl} />}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog?.title || 'ThinkNest'} />
        <meta property="og:description" content={blog?.description || 'Discover blogs about health, technology, lifestyle and food.'} />
        <meta property="og:url" content={shareUrl} />
        {blog?.featuredImage && <meta property="og:image" content={blog.featuredImage} />}
        <meta property="og:site_name" content="ThinkNest" />
        {blog?.createdAt && <meta property="article:published_time" content={new Date(blog.createdAt).toISOString()} />}
        {blog?.category && <meta property="article:section" content={blog.category} />}
        {Array.isArray(blog?.tags) && blog.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <meta name="twitter:card" content={blog?.featuredImage ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={blog?.title || 'ThinkNest'} />
        <meta name="twitter:description" content={blog?.description || 'Discover blogs about health, technology, lifestyle and food.'} />
        {blog?.featuredImage && <meta name="twitter:image" content={blog.featuredImage} />}
      </Helmet>

      {/* Reading progress */}
      {!loading && !error && blog && (
        <div className="fixed inset-x-0 top-16 z-40 h-0.5 bg-neutral-100 pointer-events-none">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-400 to-emerald-400"
            style={{ width: `${scrollProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-8 md:py-12" ref={contentRef}>
        {/* Top bar */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </motion.button>

          <div className="flex items-center gap-1.5">
            {navigator.share && (
              <motion.button
                onClick={() => handleShare('native')}
                className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Share" title="Share"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </motion.button>
            )}
            <motion.button
              onClick={() => handleShare('copy')}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Copy link" title="Copy link"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </motion.button>
          </div>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-6">
            <div className="aspect-[16/9] bg-neutral-100 rounded-2xl animate-pulse" />
            <div className="space-y-3">
              <div className="h-5 bg-neutral-100 rounded-lg w-1/4 animate-pulse" />
              <div className="h-10 bg-neutral-100 rounded-lg w-3/4 animate-pulse" />
              <div className="h-4 bg-neutral-50 rounded-lg w-full animate-pulse" />
              <div className="h-4 bg-neutral-50 rounded-lg w-5/6 animate-pulse" />
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Blog content */}
        {!loading && !error && blog && (
          <>
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Featured image */}
              <div className="relative overflow-hidden rounded-2xl bg-neutral-100 mb-8 shadow-card">
                <div className="aspect-[16/9]">
                  {blog?.featuredImage ? (
                    <img
                      src={blog.featuredImage}
                      alt={blog?.title || 'Blog image'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
                      <span className="text-5xl text-neutral-200 font-serif font-bold">T</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category + Meta */}
              <motion.div
                className="flex flex-wrap items-center gap-3 mb-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <span className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-100/50">
                  {blog?.category || 'Blog'}
                </span>
                <div className="flex items-center gap-4 text-xs text-neutral-400">
                  {blog?.createdAt && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {formatDate(blog.createdAt)}
                    </span>
                  )}
                  {readingTime && <span>{readingTime} min read</span>}
                  {blog?.views != null && <span>{blog.views} views</span>}
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                className="tn-heading text-3xl sm:text-4xl md:text-5xl leading-tight mb-6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {blog?.title}
              </motion.h1>

              {/* Share */}
              <motion.div
                className="flex items-center gap-2 mb-8 pb-8 border-b border-neutral-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-xs font-medium text-neutral-400 mr-1">Share</span>
                {['twitter', 'linkedin'].map((platform) => (
                  <motion.button
                    key={platform}
                    onClick={() => handleShare(platform)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 bg-neutral-50 border border-neutral-100 hover:bg-white hover:border-neutral-200 hover:shadow-sm transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {platform === 'twitter' ? 'X / Twitter' : 'LinkedIn'}
                  </motion.button>
                ))}
              </motion.div>

              {/* Content */}
              <motion.div
                className="blog-content prose-sm sm:prose-base lg:prose-lg max-w-none prose-neutral prose-headings:text-neutral-900 prose-a:text-primary-600 hover:prose-a:text-primary-700 prose-blockquote:border-primary-500 prose-img:rounded-xl prose-img:mx-auto"
                dangerouslySetInnerHTML={{ __html: processContent(blog?.content) }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              />

              {/* Ad Placeholder Bottom */}
              <motion.div
                className="mt-12 p-6 rounded-2xl bg-neutral-50 border border-dashed border-neutral-200 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 block">Advertisement</span>
                <div className="h-24 flex items-center justify-center text-sm text-neutral-400 font-medium">
                  Sponsored Content Placement
                </div>
              </motion.div>

              {/* Author Card */}
              <motion.div
                className="mt-16 p-8 rounded-3xl bg-neutral-900 text-white relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-bl-[100px] blur-2xl" />
                <div className="relative flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-emerald-500 flex items-center justify-center text-white text-2xl font-serif font-bold shadow-lg">
                    TN
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary-400 mb-1 block">Author</span>
                    <h3 className="text-xl font-bold mb-2">ThinkNest Editorial Team</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed max-w-lg">
                      Professional writers and industry experts dedicated to bringing you the most thoughtful insights on technology, health, and modern living.
                    </p>
                    <div className="mt-4 flex items-center justify-center sm:justify-start gap-3">
                      {['Twitter', 'LinkedIn'].map(s => (
                        <a key={s} href="#" className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors">{s}</a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.article>

            {/* Related Posts */}
            {!relatedLoading && relatedBlogs.length > 0 && (
              <section className="mt-20 pt-10 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="tn-heading text-2xl">Related Articles</h2>
                  <motion.button
                    onClick={onBack}
                    className="text-xs font-bold uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    View All
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedBlogs.map((b, i) => (
                    <BlogCard key={b._id} blog={b} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* Comments */}
            <motion.section
              className="mt-16 pt-10 border-t border-neutral-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between gap-4 mb-8">
                <h2 className="tn-heading text-xl sm:text-2xl">Comments</h2>
                <span className="text-xs text-neutral-400 font-medium bg-neutral-50 px-2.5 py-1 rounded-lg">{comments.length} total</span>
              </div>

              <form onSubmit={submitComment} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="name" value={commentForm.name} onChange={onCommentChange} placeholder="Your name" className="tn-input" disabled={commentStatus === 'loading'} required />
                <input name="email" type="email" value={commentForm.email} onChange={onCommentChange} placeholder="you@example.com" className="tn-input" disabled={commentStatus === 'loading'} required />
                <textarea name="comment" value={commentForm.comment} onChange={onCommentChange} placeholder="Write a comment..." rows={4} className="sm:col-span-2 tn-textarea" disabled={commentStatus === 'loading'} required />
                <div className="sm:col-span-2 flex items-center gap-3">
                  <motion.button
                    type="submit" disabled={commentStatus === 'loading'}
                    className="tn-btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {commentStatus === 'loading' ? 'Posting\u2026' : 'Post Comment'}
                  </motion.button>
                  <AnimatePresence>
                    {commentMessage && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className={`text-sm font-medium ${commentStatus === 'error' ? 'text-red-600' : 'text-primary-600'}`}
                      >
                        {commentMessage}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </form>

              <div className="mt-8 space-y-4">
                {commentsLoading && <div className="text-sm text-neutral-400">Loading comments\u2026</div>}
                {!commentsLoading && comments.length === 0 && (
                  <div className="text-sm text-neutral-400 text-center py-8">No comments yet. Be the first to comment.</div>
                )}
                {comments.map((c, i) => (
                  <motion.div
                    key={c._id}
                    className="p-5 rounded-xl bg-neutral-50/70 border border-neutral-100 hover:border-neutral-200 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${avatarColors[i % avatarColors.length]}`}>
                          {(c.name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm text-neutral-800">{c.name || 'Anonymous'}</span>
                      </div>
                      {c.createdAt && (
                        <span className="text-xs text-neutral-400">
                          {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed whitespace-pre-line">{c.comment}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Explore more CTA */}
            <motion.div
              className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-neutral-50 to-primary-50/30 border border-neutral-100 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="tn-heading text-xl mb-2">Enjoyed this article?</h3>
              <p className="text-sm text-neutral-500 mb-5 max-w-sm mx-auto">Discover more stories and insights on ThinkNest.</p>
              <motion.button
                onClick={onBack}
                className="tn-btn-primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Explore More Articles
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
