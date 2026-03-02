import BlogCard from './BlogCard';

export default function LatestBlogs({ blogs, loading }) {
  if (loading) {
    return (
      <section className="tn-container tn-section">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-7 rounded-full bg-primary-500" />
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">Latest Articles</h2>
        </div>
        <p className="text-slate-500 text-sm md:text-base mb-8 ml-[19px]">Fresh stories and ideas, just for you</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-3xl bg-white/70 border border-slate-200/70 shadow-sm animate-pulse h-72" />
          ))}
        </div>
      </section>
    );
  }

  if (!blogs?.length) return null;

  return (
    <section className="tn-container tn-section">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-7 rounded-full bg-primary-500" />
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">Latest Articles</h2>
      </div>
      <p className="text-slate-500 text-sm md:text-base mb-8 ml-[19px]">Fresh stories and ideas, just for you</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </section>
  );
}
