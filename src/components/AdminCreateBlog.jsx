import { useState, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { createBlog, uploadContentImage } from '../services/api';
import AdminLayout from './AdminLayout';

const CATEGORIES = [
  'Technology',
  'Health',
  'Lifestyle',
  'Food',
  'Productivity',
  'Education',
  'Travel',
  'Finance',
];

const inputClass =
  'w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-800 bg-white ' +
  'placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-primary-500 ' +
  'focus:border-primary-500 hover:border-primary-300 disabled:opacity-60 disabled:cursor-not-allowed';

export default function AdminCreateBlog() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');
  const fileRef = useRef(null);
  const quillRef = useRef(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      try {
        const res = await uploadContentImage(file);
        if (res?.success && res.url) {
          const editor = quillRef.current?.getEditor();
          if (editor) {
            const range = editor.getSelection(true);
            editor.insertEmbed(range.index, 'image', res.url);
            editor.setSelection(range.index + 1);
          }
        } else {
          alert(res?.message || 'Failed to upload image.');
        }
      } catch {
        alert('Image upload failed. Please try again.');
      }
    };
  }, []);

  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ align: [] }],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), [imageHandler]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().replace(/,$/, '');
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const strippedContent = form.content.replace(/<(.|\n)*?>/g, '').trim();
    if (!form.title.trim() || !strippedContent || !form.category) {
      setStatus('error');
      setMessage('Title, content, and category are required.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('description', form.description.trim());
      formData.append('content', form.content);
      formData.append('category', form.category);
      tags.forEach((tag) => formData.append('tags', tag));
      if (image) formData.append('featuredImage', image);

      const res = await createBlog(formData);

      if (res?.success) {
        setStatus('success');
        setMessage('Blog published successfully! Redirecting…');
        setTimeout(() => {
          window.location.href = '/admin/blogs';
        }, 1200);
      } else {
        setStatus('error');
        setMessage(res?.message || 'Failed to publish blog.');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err?.message || 'An unexpected error occurred.');
    }
  };

  const isLoading = status === 'loading';

  return (
    <AdminLayout>
    <div className="flex-1 w-full bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <button
            onClick={() => (window.location.href = '/admin/blogs')}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create New Blog</h1>
          <p className="mt-1 text-sm text-gray-500">Fill in the details below and publish your post.</p>
        </motion.div>

        {/* Form Card */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6"
        >
          {/* Status messages */}
          {status === 'error' && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </div>
          )}
          {status === 'success' && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Enter blog title"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Short description or excerpt"
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Content <span className="text-red-500">*</span>
            </label>
            <div className={`quill-wrapper rounded-xl border-2 border-gray-200 overflow-hidden transition hover:border-primary-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={form.content}
                onChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
                modules={quillModules}
                placeholder="Write your full blog content here…"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={isLoading}
              className={`${inputClass} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_14px_center] bg-[length:16px_16px] pr-10`}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Tags</label>
            <div
              className={`flex flex-wrap items-center gap-2 rounded-xl border-2 border-gray-200 px-3 py-2.5 transition hover:border-primary-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 bg-white ${
                isLoading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    disabled={isLoading}
                    className="ml-0.5 hover:text-primary-900 disabled:cursor-not-allowed"
                    aria-label={`Remove tag ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
                disabled={isLoading}
                placeholder={tags.length === 0 ? 'Type a tag and press Enter' : 'Add another…'}
                className="flex-1 min-w-[120px] border-none outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent disabled:cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400">Press Enter or comma to add a tag.</p>
          </div>

          {/* Featured Image */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Featured Image</label>
            <div
              className={`relative rounded-xl border-2 border-dashed transition ${
                imagePreview
                  ? 'border-primary-300 bg-primary-50/40'
                  : 'border-gray-200 bg-gray-50 hover:border-primary-300 hover:bg-primary-50/20'
              } ${isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => !isLoading && fileRef.current?.click()}
            >
              {imagePreview ? (
                <div className="p-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-52 w-full object-cover rounded-lg"
                  />
                  <p className="mt-2 text-center text-xs text-gray-500 truncate">{image?.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-10">
                  <svg
                    className="w-10 h-10 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 18h18M3 9.75A6.75 6.75 0 019.75 3h4.5A6.75 6.75 0 0121 9.75v4.5A6.75 6.75 0 0114.25 21H9.75A6.75 6.75 0 013 14.25v-4.5z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-primary-600">Click to upload</span> or drag &amp; drop
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5 MB</p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
                className="hidden"
              />
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                  if (fileRef.current) fileRef.current.value = '';
                }}
                disabled={isLoading}
                className="text-xs text-red-500 hover:text-red-700 transition disabled:cursor-not-allowed"
              >
                Remove image
              </button>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <motion.button
              type="submit"
              disabled={isLoading || status === 'success'}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold shadow hover:bg-primary-700 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Publishing…
                </>
              ) : (
                'Publish Blog'
              )}
            </motion.button>
            <button
              type="button"
              onClick={() => (window.location.href = '/admin/blogs')}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 hover:text-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      </div>
    </div>
    </AdminLayout>
  );
}
