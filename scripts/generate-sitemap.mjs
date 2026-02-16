import fs from 'node:fs/promises';
import path from 'node:path';

function stripTrailingSlash(url) {
  return String(url || '').replace(/\/+$/, '');
}

function xmlEscape(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

async function fetchAllBlogs(apiBaseUrl) {
  const limit = 100;
  let page = 1;
  let totalPages = 1;
  const all = [];

  while (page <= totalPages) {
    const url = `${apiBaseUrl}/api/blogs?limit=${limit}&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch blogs: ${res.status} ${res.statusText}`);
    const json = await res.json();

    if (!json?.success || !Array.isArray(json?.data)) {
      throw new Error(`Unexpected API response at page ${page}`);
    }

    all.push(...json.data);
    totalPages = Number(json.totalPages || 1);
    page += 1;

    if (json.data.length === 0) break;
  }

  return all;
}

function toLastMod(blog) {
  const raw = blog?.updatedAt || blog?.createdAt;
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

async function main() {
  const apiBaseUrl = stripTrailingSlash(
    process.env.SITEMAP_API_URL || process.env.VITE_API_URL || 'https://thinknest-4lep.onrender.com',
  );
  const siteUrl = stripTrailingSlash(process.env.SITE_URL || 'http://localhost:5173');

  const blogs = await fetchAllBlogs(apiBaseUrl);
  const slugs = blogs
    .map((b) => b?.slug)
    .filter((s) => typeof s === 'string' && s.trim().length > 0);

  const now = new Date().toISOString();

  const urls = [
    { loc: `${siteUrl}/`, lastmod: now, priority: '1.0' },
    ...slugs.map((slug) => ({
      loc: `${siteUrl}/blog/${encodeURIComponent(slug)}`,
      lastmod: toLastMod(blogs.find((b) => b?.slug === slug)) || now,
      priority: '0.8',
    })),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n` +
          `    <loc>${xmlEscape(u.loc)}</loc>\n` +
          (u.lastmod ? `    <lastmod>${xmlEscape(u.lastmod)}</lastmod>\n` : '') +
          (u.priority ? `    <priority>${xmlEscape(u.priority)}</priority>\n` : '') +
          `  </url>\n`,
      )
      .join('') +
    `</urlset>\n`;

  const outPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
  await fs.writeFile(outPath, xml, 'utf8');
  console.log(`Generated sitemap: ${outPath} (${slugs.length} blog URLs)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

