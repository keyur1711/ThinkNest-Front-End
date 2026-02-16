/**
 * ThinkNest API base URL.
 * Production: https://thinknest-4lep.onrender.com
 * Override with VITE_API_URL in .env for local development.
 */
const DEPLOYED_URL = 'https://thinknest-4lep.onrender.com';
export const API_BASE_URL = import.meta.env.VITE_API_URL || DEPLOYED_URL;

export default API_BASE_URL;
