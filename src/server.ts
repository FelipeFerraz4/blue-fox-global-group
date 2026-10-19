import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
/**
 * O nginx de produção envia `X-Forwarded-For` e `X-Forwarded-Proto` (e o modelo de vhost do Finance também
 * envia `-Host` e `-Port`). Cabeçalhos `X-Forwarded-*` fora desta lista fazem o Angular recusar o SSR e
 * devolver o HTML vazio (renderização só no navegador), com status 200 e só um aviso no log.
 * Ao passar uma lista, SÓ estes cabeçalhos são aceitos. O host continua validado contra `allowedHosts`
 * e a porta 4000 não é publicada em produção: só o proxy chega aqui.
 */
const angularApp = new AngularNodeAppEngine({
  trustProxyHeaders: ['x-forwarded-for', 'x-forwarded-proto', 'x-forwarded-host', 'x-forwarded-port'],
});

app.disable('x-powered-by');

/**
 * Cabeçalhos de segurança. HSTS e redirecionamento http→https ficam no proxy/TLS (nginx).
 *
 * CSP: o build não gera scripts inline (sem event replay e sem CSS crítico com `onload`),
 * então `script-src 'self'` basta. `style-src 'unsafe-inline'` é necessário porque o Angular
 * injeta os estilos dos componentes em <style> em tempo de execução.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ');

app.use((_req, res, next) => {
  res.setHeader('Content-Security-Policy', CONTENT_SECURITY_POLICY);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=()',
  );
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

/** Arquivos com hash no nome (ex.: main-LMOIR2E7.js) nunca mudam; o resto (sitemap, robots, imagens) precisa poder ser atualizado. */
const HASHED_ASSET = /-[A-Za-z0-9]{8}\.(?:js|mjs|css|woff2?)$/;

function cacheControlFor(filePath: string): string {
  if (HASHED_ASSET.test(filePath)) {
    return 'public, max-age=31536000, immutable';
  }
  // Fontes em public/fonts não têm hash: 30 dias (troque o nome do arquivo ao atualizar a fonte).
  if (filePath.endsWith('.woff2')) {
    return 'public, max-age=2592000';
  }
  return 'public, max-age=3600';
}

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    index: false,
    redirect: false,
    cacheControl: false,
    setHeaders: (res, filePath) => {
      res.setHeader('Cache-Control', cacheControlFor(filePath));
    },
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
