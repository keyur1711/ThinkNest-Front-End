import { useState, useEffect } from 'react';
import { getBlogs } from './services/api';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBlogs()
      .then((res) => {
        if (res.success && res.data) setBlogs(res.data);
        else setError(res.message || 'Failed to load');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>ThinkNest</h1>
      <p style={{ color: '#666' }}>API: https://thinknest-4lep.onrender.com</p>
      {loading && <p>Loading blogs…</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {!loading && !error && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {blogs.length === 0 ? (
            <li>No blogs yet.</li>
          ) : (
            blogs.map((b) => (
              <li key={b._id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #eee' }}>
                <strong>{b.title}</strong>
                <p style={{ margin: '4px 0 0', color: '#555', fontSize: 14 }}>{b.description}</p>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default App;
