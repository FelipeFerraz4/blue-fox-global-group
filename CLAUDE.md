# Blue Fox Global Group — Contexto para IA

Site institucional da holding (`https://bluefoxglobalgroup.com`). Conteúdo estático, sem backend nem autenticação.

- **Stack**: Angular 21 + `@angular/ssr` (Express), standalone components, Signals, CSS puro, testes com Vitest (`ng test`).
- **Docker**: container `blue-fox-global-group`, SSR na porta 4000, rede `infra-net`.

## Estrutura

```
src/app/
├── app.routes.ts            # rotas sob /pt e /en (mesmas featureRoutes) + redirects legados → /pt
├── app.routes.server.ts     # todas as rotas em RenderMode.Prerender (site 100% pré-renderizado)
├── core/
│   ├── content/{pt,en}/*.ts # TODO o texto do site, um arquivo por página (home, portfolio, governance, founder, news, contact, privacy, terms)
│   └── services/
│       ├── translation.service.ts  # idioma atual (signal) derivado da URL + dicionário de conteúdo
│       └── seo.service.ts          # title, meta, canonical, hreflang
├── features/<pagina>/<pagina>.{ts,html,css}   # home, portfolio, governance (/about), founder, news, contact, privacy, terms
└── shared/components/{header,footer}/
public/                      # logos, favicons, founder.jpg, sitemap.xml, robots.txt
```

## Regras

1. **i18n sem biblioteca**: textos ficam em `core/content/pt/*.ts` e `core/content/en/*.ts` com a mesma forma. Página nova = arquivo em **ambos** os idiomas + registro no `TranslationService` + rota em `featureRoutes`.
2. Página nova também precisa entrar no `public/sitemap.xml` (versões `/pt` e `/en`) e configurar o SEO via `SeoService`.
3. SSR: use `isPlatformBrowser` antes de tocar em `window`, `document` ou `localStorage`.
4. Visual: tom corporativo premium da marca-mãe (skill `bluefox-design-system`): gradiente oficial, seções navy, CTAs em pílula.
5. Componentes seguem o padrão `nome.ts / nome.html / nome.css` (sem sufixo `.component`, padrão do Angular 21).

## Comandos

```bash
npm start                    # ng serve, porta 4200
npm run build
npm test                     # Vitest
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build    # SSR em localhost:4000
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```
