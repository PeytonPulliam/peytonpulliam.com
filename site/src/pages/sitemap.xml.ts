import type { APIRoute } from 'astro';
import { notes, notePath, projects, projectPath } from '../data/portfolio';

export const GET: APIRoute = ({ site, url }) => {
  const paths = ['/', ...projects.map(projectPath), ...notes.map(notePath), '/resume/'];
  const locations = paths.map((path) => `  <url><loc>${new URL(path, site ?? url).href}</loc></url>`);
  return new Response(
    ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...locations, '</urlset>', ''].join('\n'),
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
