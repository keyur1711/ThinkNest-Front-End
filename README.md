# ThinkNest Frontend

React frontend for ThinkNest blog. All API calls use the deployed backend:

**https://thinknest-4lep.onrender.com**

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Production build (output: `dist/`)
- `npm run preview` – Preview production build locally

## Deploy on Vercel

1. Push the repo and import the project in [Vercel](https://vercel.com).
2. Set **Root Directory** to `client` (if the repo root is ThinkNest).
3. Build and output are auto-detected (Vite).
4. Deploy. No env vars required; the app uses the deployed API URL by default.

Optional: add `VITE_API_URL` in Vercel if you need a different API URL.

## API usage

- **Blogs:** `src/services/api.js` – `getBlogs()`, `getBlogBySlug()`
- **Comments:** `getCommentsByBlog(blogId)`, `addComment(data)`
- **Subscribe:** `subscribe(email)`
- **Contact:** `sendContact({ name, email, message })`

Base URL is set in `src/config/api.js`.
