# API Configuration

All frontend API calls should use the deployed backend URL.

## Usage

```js
import API_BASE_URL from './config/api';
// or
import { API_BASE_URL } from './config/api';

// Examples:
// GET blogs
fetch(`${API_BASE_URL}/api/blogs`);

// GET single blog
fetch(`${API_BASE_URL}/api/blogs/${slug}`);

// POST comment
fetch(`${API_BASE_URL}/api/comments`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, comment, blogId }),
});

// POST subscribe
fetch(`${API_BASE_URL}/api/subscribe`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email }),
});

// POST contact
fetch(`${API_BASE_URL}/api/contact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message }),
});

// Admin: POST login
fetch(`${API_BASE_URL}/api/admin/login`, { ... });
```

Current base URL: **https://thinknest-4lep.onrender.com**

Override for local dev: set `VITE_API_URL=http://localhost:5000` in `.env`.
