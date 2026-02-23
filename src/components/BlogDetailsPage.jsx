import { useEffect, useMemo, useState } from 'react';
import { addComment, getBlogBySlug, getCommentsByBlog } from '../services/api';
import { Helmet } from 'react-helmet-async';

const calculateReadingTime = (content) => {
  if (!content) return null;
  const words = String(content).trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

/**
 * Detect whether a string contains meaningful HTML tags (not just plain text).
 */
const isHtmlContent = (str) => /<(p|h[1-6]|div|ul|ol|li|img|blockquote|pre|figure)\b/i.test(str);

/**
 * Convert plain text blog content into structured HTML.
 * Handles numbered headings, emoji separators, bullet-like lines, and paragraphs.
 */
const plainTextToHtml = (text) => {
  if (!text) return '';

  // Normalize line breaks
  const cleaned = text.replace(/\r\n/g, '\n');

  // Split into blocks by double-newlines or single newlines
  const lines = cleaned.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  let html = '';

  for (const line of lines) {
    // Numbered heading: "1. Title Text" or "1) Title Text" at the start
    if (/^\d+[.)]\s+/.test(line)) {
      const heading = line.replace(/^\d+[.)]\s+/, '');
      html += `<h2>${heading}</h2>\n`;
    }
    // Standalone title-like words: single short line, all words capitalized
    else if (
      line.length < 60 &&
      !line.endsWith('.') &&
      !line.endsWith(':') &&
      /^[A-Z][A-Za-z\s]+$/.test(line)
    ) {
      html += `<h2>${line}</h2>\n`;
    }
    // Lines starting with bullet markers
    else if (/^[-–—•*]\s+/.test(line)) {
      html += `<li>${line.replace(/^[-–—•*]\s+/, '')}</li>\n`;
    }
    // Regular paragraph
    else {
      html += `<p>${line}</p>\n`;
    }
  }

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>\n$1</ul>\n');

  return html;
};

/**
 * Convert Quill image-then-italic pattern into <figure>/<figcaption>.
 * Matches: <p><img …></p> immediately followed by <p><em>caption</em></p>
 */
const processContentCaptions = (html) => {
  if (!html) return '';
  return html.replace(
    /<p>\s*(<img\s[^>]*>)\s*<\/p>\s*<p>\s*<em>([^<]+)<\/em>\s*<\/p>/gi,
    '<figure>$1<figcaption>$2</figcaption></figure>'
  );
};

/**
 * Full content processing pipeline:
 * 1. Convert plain text to HTML if needed
 * 2. Process image captions
 */
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
  const [commentStatus, setCommentStatus] = useState('idle'); // idle | loading | success | error
  const [commentMessage, setCommentMessage] = useState('');
  const [commentForm, setCommentForm] = useState({ name: '', email: '', comment: '' });

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

    return () => {
      alive = false;
    };
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
    return () => {
      alive = false;
    };
  }, [blog?._id]);

  const handleShare = async (type) => {
    const title = blog?.title || 'ThinkNest';
    const url = shareUrl;

    if (type === 'native' && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled
      }
      return;
    }

    if (type === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCommentMessage('Link copied!');
        setCommentStatus('success');
        setTimeout(() => {
          setCommentStatus('idle');
          setCommentMessage('');
        }, 1500);
      } catch {
        // ignore
      }
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
        // refresh comments
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

  return (
    <div className="w-full bg-gradient-to-b from-primary-50/40 to-white">
      <Helmet>
        <title>{blog?.title ? `${blog.title} - ThinkNest` : 'ThinkNest'}</title>
        <meta
          name="description"
          content={blog?.description || 'Discover blogs about health, technology, lifestyle and food.'}
        />
        <meta
          name="keywords"
          content={
            Array.isArray(blog?.tags) && blog.tags.length
              ? blog.tags.join(', ')
              : ['ThinkNest', blog?.category, 'blog', 'articles'].filter(Boolean).join(', ')
          }
        />
        {blog?.title && <link rel="canonical" href={shareUrl} />}

        {/* Open Graph */}
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

        {/* Twitter Card */}
        <meta name="twitter:card" content={blog?.featuredImage ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={blog?.title || 'ThinkNest'} />
        <meta name="twitter:description" content={blog?.description || 'Discover blogs about health, technology, lifestyle and food.'} />
        {blog?.featuredImage && <meta name="twitter:image" content={blog.featuredImage} />}
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary-700 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="flex items-center gap-2">
            {navigator.share && (
              <button
                onClick={() => handleShare('native')}
                className="p-2 rounded-lg bg-white/80 border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-200 transition"
                aria-label="Share"
                title="Share"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8a3 3 0 10-6 0m6 0a3 3 0 01-6 0m6 0l5 3m-11-3L4 11m11 0a3 3 0 10-6 0m6 0a3 3 0 01-6 0m6 0l5 3m-11-3L4 14" />
                </svg>
              </button>
            )}
            <button
              onClick={() => handleShare('copy')}
              className="p-2 rounded-lg bg-white/80 border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-200 transition"
              aria-label="Copy link"
              title="Copy link"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8m-6 8h6a2 2 0 002-2V8a2 2 0 00-2-2h-6m-2 0H8a2 2 0 00-2 2v10a2 2 0 002 2h2" />
              </svg>
            </button>
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white shadow-lg shadow-black/5 border border-gray-100 overflow-hidden">
            <div className="aspect-[16/9] bg-gray-200 animate-pulse" />
            <div className="p-6 sm:p-8">
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse mb-4" />
              <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse mb-4" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && blog && (
          <>
            <article className="rounded-3xl bg-white shadow-xl shadow-black/5 border border-gray-100">
              {/* Featured image */}
              <div className="relative bg-gray-100 overflow-hidden rounded-t-3xl">
                <div className="aspect-[16/9]">
                  {blog?.featuredImage ? (
                    <img
                      src={blog.featuredImage}
                      alt={blog?.title || 'Blog image'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50">
                      <span className="text-6xl text-primary-300 font-bold">T</span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary-700 shadow-sm">
                  {blog?.category || 'Blog'}
                </span>
              </div>

              {/* Header */}
              <div className="p-6 sm:p-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {blog?.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
                  {blog?.createdAt && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  )}
                  {blog?.views != null && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{blog.views} views</span>
                    </div>
                  )}
                  {readingTime && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{readingTime} min read</span>
                    </div>
                  )}
                </div>

                {/* Share icons */}
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 mr-2">Share</span>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:bg-white hover:border-primary-200 hover:text-primary-700 transition shadow-sm"
                  >
                    X / Twitter
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:bg-white hover:border-primary-200 hover:text-primary-700 transition shadow-sm"
                  >
                    LinkedIn
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 sm:px-8 pb-8">
                <div className="h-px bg-gray-100 mb-8" />
                <div
                  className="blog-content prose lg:prose-xl max-w-none prose-gray prose-headings:text-gray-900 prose-a:text-primary-600 hover:prose-a:text-primary-700 prose-blockquote:border-primary-500 prose-img:rounded-xl prose-img:mx-auto prose-img:shadow-md"
                  dangerouslySetInnerHTML={{ __html: processContent(blog?.content) }}
                />
              </div>
            </article>

            {/* Comments */}
            <section className="mt-8 rounded-3xl bg-white shadow-xl shadow-black/5 border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Comments</h2>
                <span className="text-sm text-gray-500">{comments.length} total</span>
              </div>

              <form onSubmit={submitComment} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="name"
                  value={commentForm.name}
                  onChange={onCommentChange}
                  placeholder="Your name"
                  className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                  disabled={commentStatus === 'loading'}
                  required
                />
                <input
                  name="email"
                  type="email"
                  value={commentForm.email}
                  onChange={onCommentChange}
                  placeholder="you@example.com"
                  className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                  disabled={commentStatus === 'loading'}
                  required
                />
                <textarea
                  name="comment"
                  value={commentForm.comment}
                  onChange={onCommentChange}
                  placeholder="Write a comment..."
                  rows={4}
                  className="sm:col-span-2 px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary-500 outline-none transition resize-none"
                  disabled={commentStatus === 'loading'}
                  required
                />
                <div className="sm:col-span-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={commentStatus === 'loading'}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-200/50 transition disabled:opacity-70"
                  >
                    {commentStatus === 'loading' ? 'Posting…' : 'Post Comment'}
                  </button>
                  {commentMessage && (
                    <span
                      className={`text-sm font-medium ${
                        commentStatus === 'error' ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {commentMessage}
                    </span>
                  )}
                </div>
              </form>

              <div className="mt-8 space-y-4">
                {commentsLoading && (
                  <div className="text-sm text-gray-500">Loading comments…</div>
                )}
                {!commentsLoading && comments.length === 0 && (
                  <div className="text-sm text-gray-500">No comments yet. Be the first to comment.</div>
                )}
                {comments.map((c) => (
                  <div key={c._id} className="rounded-2xl border border-gray-100 bg-gray-50/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-gray-900">{c.name || 'Anonymous'}</div>
                      {c.createdAt && (
                        <div className="text-xs text-gray-500">
                          {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-700 leading-6 whitespace-pre-line">{c.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
