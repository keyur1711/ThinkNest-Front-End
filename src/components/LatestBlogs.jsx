import BlogCard from './BlogCard';

export default function LatestBlogs({ blogs, loading }) {
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-7 rounded-full bg-primary-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Articles</h2>
        </div>
        <p className="text-gray-500 text-sm md:text-base mb-8 ml-[19px]">Fresh stories and ideas, just for you</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-72" />
          ))}
        </div>
      </section>
    );
  }

  if (!blogs?.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-7 rounded-full bg-primary-500" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Articles</h2>
      </div>
      <p className="text-gray-500 text-sm md:text-base mb-8 ml-[19px]">Fresh stories and ideas, just for you</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </section>
  );
}
