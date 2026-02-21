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

export const deleteComment = (id) => {
  let token = null;
  try {
    token = localStorage.getItem('thinknest_admin_token');
  } catch {
    token = null;
  }

  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(base(`/api/comments/${id}`), {
    method: 'DELETE',
    headers,
  }).then(async (r) => {
    if (!r.ok) {
      return { success: false, message: `Server responded with ${r.status}` };
    }
    const text = await r.text();
    try {
      return JSON.parse(text);
    } catch {
      // Server returned non-JSON (e.g. HTML 404) — treat as failure
      return { success: false, message: 'Delete endpoint not available on server' };
    }
  });
};

// ——— Subscribe ———
export const subscribe = (email) =>
  fetch(base('/api/subscribe'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }).then((r) => r.json());

export const getAllSubscribers = () => {
  let token = null;
  try {
    token = localStorage.getItem('thinknest_admin_token');
  } catch {
    token = null;
  }

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(base('/api/subscribe'), { headers }).then((r) => r.json());
};

export const deleteSubscriber = (id) => {
  let token = null;
  try {
    token = localStorage.getItem('thinknest_admin_token');
  } catch {
    token = null;
  }

  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(base(`/api/subscribe/${id}`), {
    method: 'DELETE',
    headers,
  }).then(async (r) => {
    if (!r.ok) {
      return { success: false, message: `Server responded with ${r.status}` };
    }
    const text = await r.text();
    try {
      return JSON.parse(text);
    } catch {
      return { success: false, message: 'Delete endpoint not available on server' };
    }
  });
};

// ——— Contact ———
export const sendContact = (data) =>
  fetch(base('/api/contact'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const getAllMessages = () => {
  let token = null;
  try {
    token = localStorage.getItem('thinknest_admin_token');
  } catch {
    token = null;
  }

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(base('/api/contact'), { headers }).then((r) => r.json());
};

export const deleteMessage = (id) => {
  let token = null;
  try {
    token = localStorage.getItem('thinknest_admin_token');
  } catch {
    token = null;
  }

  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(base(`/api/contact/${id}`), {
    method: 'DELETE',
    headers,
  }).then(async (r) => {
    if (!r.ok) {
      return { success: false, message: `Server responded with ${r.status}` };
    }
    const text = await r.text();
    try {
      return JSON.parse(text);
    } catch {
      return { success: false, message: 'Delete endpoint not available on server' };
    }
  });
};

// ——— Admin ———
export const adminLogin = (credentials) =>
  fetch(base('/api/admin/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  }).then((r) => r.json());

export const createBlog = (formData) => {
  let token = null;
  try {
    token = localStorage.getItem('thinknest_admin_token');
  } catch {
    token = null;
  }

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(base('/api/blogs'), {
    method: 'POST',
    headers,
    body: formData,
  }).then((r) => r.json());
};

export const deleteBlog = (id) => {
  let token = null;
  try {
    token = localStorage.getItem('thinknest_admin_token');
  } catch {
    token = null;
  }

  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(base(`/api/blogs/${id}`), {
    method: 'DELETE',
    headers,
  }).then((r) => r.json());
};
