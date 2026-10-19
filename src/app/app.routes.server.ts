import { RenderMode, ServerRoute } from '@angular/ssr';

const LANGUAGES = ['pt', 'en'];
const PAGES = ['portfolio', 'about', 'founder', 'news', 'contact', 'privacy', 'terms'];
/** Redirecionamentos legados definidos em app.routes.ts (ex.: /about -> /pt/about). */
const LEGACY_REDIRECTS = ['portfolio', 'about', 'founder', 'news', 'contact'];

const prerenderedPaths = [
  '',
  ...LANGUAGES.flatMap((lang) => [lang, ...PAGES.map((page) => `${lang}/${page}`)]),
  ...LEGACY_REDIRECTS,
];

export const serverRoutes: ServerRoute[] = [
  ...prerenderedPaths.map((path): ServerRoute => ({ path, renderMode: RenderMode.Prerender })),
  // Qualquer outro endereço é renderizado sob demanda pela página 404, com status HTTP 404.
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
