import type { APIRoute } from 'astro';
import { manifest } from '@/lib/route-manifest';

export const GET: APIRoute = () => {
  const urls = ['https://spgutils.ru/', ...manifest.filter((entry) => entry.path !== '').map((entry) => `https://spgutils.ru/${entry.path}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${url}</loc></url>`)
    .join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
