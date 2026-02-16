/**
 * ThinkNest API service – all calls use deployed backend.
 * Base URL: https://thinknest-4lep.onrender.com
 */
import API_BASE_URL from '../config/api';

const base = (path) => `${API_BASE_URL}${path}`;

// ——— Blogs ———
export const getBlogs = (params = {}) => {
  const searchParams = new URLSearchParams(params).toString();
  const url = searchParams ? `${base('/api/blogs')}?${searchParams}` : base('/api/blogs');
  return fetch(url).then((r) => r.json());
};

export const getBlogBySlug = (slug) =>
  fetch(base(`/api/blogs/${slug}`)).then((r) => r.json());

// ——— Comments ———
export const getCommentsByBlog = (blogId) =>
  fetch(base(`/api/comments/${blogId}`)).then((r) => r.json());

export const addComment = (data) =>
  fetch(base('/api/comments'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((r) => r.json());

// ——— Subscribe ———
export const subscribe = (email) =>
  fetch(base('/api/subscribe'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }).then((r) => r.json());

// ——— Contact ———
export const sendContact = (data) =>
  fetch(base('/api/contact'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((r) => r.json());
