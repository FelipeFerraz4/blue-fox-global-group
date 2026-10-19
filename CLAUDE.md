# Blue Fox Global Group — Contexto para IA

Site institucional da holding (`https://bluefoxglobalgroup.com`), em PT e EN. Conteúdo no código, sem backend, sem banco e sem autenticação.

- **Stack**: Angular 21 + `@angular/ssr` (Express), standalone components, Signals, CSS puro, testes com Vitest (`ng test`).
- **Docker**: container `blue-fox-global-group` (usuário `node`, com `HEALTHCHECK`), SSR na porta 4000, rede `infra-net`. Em produção fica atrás de um nginx que faz HTTPS/HSTS.
- Detalhes de segurança e deploy no [README.md](README.md).

## Estrutura

```
src/
├── server.ts                # Express: cabeçalhos de segurança (CSP...), cache por tipo de arquivo, handler do Angular
└── app/
    ├── app.routes.ts            # rotas sob /pt e /en (mesmas featureRoutes) + redirects legados + "**" → página 404
    ├── app.routes.server.ts     # lista explícita de rotas pré-renderizadas; "**" = render sob demanda com status 404
    ├── core/
    │   ├── content/{pt,en}/*.ts # TODO o texto do site, um arquivo por página (home, portfolio, governance, founder, contact, news, privacy, terms, not-found)
    │   └── services/
    │       ├── translation.service.ts  # idioma atual (signal) derivado da URL + dicionário de conteúdo
    │       └── seo.service.ts          # title, meta, Open Graph, canonical, hreflang (via DOCUMENT, funciona no SSR)
    ├── features/<pagina>/<pagina>.{ts,html,css}   # home, portfolio, governance (/about), founder, news, contact, privacy, terms, not-found
    └── shared/components/{header,footer}/
public/                      # logos, favicons, og-default.jpg, fonts/ (Inter e Outfit locais), founder.jpg, sitemap.xml, robots.txt
```

## Regras

1. **i18n sem biblioteca**: textos ficam em `core/content/pt/*.ts` e `core/content/en/*.ts` com a mesma forma. Página nova = arquivo em **ambos** os idiomas + registro no `TranslationService` + rota em `featureRoutes` + entrada em `app.routes.server.ts` (`PAGES`) + `public/sitemap.xml` (`/pt` e `/en`).
2. **SEO**: toda página chama `SeoService.updateMetadata()` em um `effect`. Imagens de compartilhamento precisam de URL absoluta (o serviço já converte). Páginas que não devem ser indexadas usam `robots: 'noindex, follow'` e `canonical: false`.
3. **SSR**: use `isPlatformBrowser` antes de tocar em `window` ou `localStorage`; para o DOM use o token `DOCUMENT`, não o `document` global.
4. **CSP estrita (`script-src 'self'`)**: não adicione `<script>` inline, handlers `onclick=`/`onload=`, nem reative `withEventReplay()` ou `inlineCritical`. Não carregue fontes, scripts ou estilos de CDNs: a CSP bloqueia e a política de privacidade afirma que o site não faz requisições a terceiros. Imagens e fontes ficam em `public/`.
5. **Proxy**: o SSR só funciona se todo `X-Forwarded-*` enviado pelo nginx estiver em `trustProxyHeaders` (`src/server.ts`); do contrário a resposta é 200 com HTML vazio e só um aviso no log. Teste sempre atrás de um nginx (ver README), nunca só direto no container. Após deploy, `docker exec infra-nginx nginx -s reload`.
5b. **Hosts do SSR**: `angular.json` → `security.allowedHosts`. Host fora da lista recebe 400. Novo domínio = adicionar ali (ou `NG_ALLOWED_HOSTS`).
6. **Dados do visitante**: o site não tem formulários nem cookies; contato é `mailto:`. Qualquer coleta nova exige atualizar `core/content/{pt,en}/privacy.ts`.
7. **Dependências**: os pacotes `@angular/*` têm versão exata uns dos outros (peers) e precisam subir **juntos**. Rode `npm run audit:prod` antes de publicar.
8. Visual: tom corporativo premium da marca-mãe (skill `bluefox-design-system`): gradiente oficial, seções navy, CTAs em pílula.
9. Componentes seguem o padrão `nome.ts / nome.html / nome.css` (sem sufixo `.component`, padrão do Angular 21).
10. Ao mudar projetos, roadmap ou notícias, mantenha a ordem do mais novo para o mais antigo e atualize os números de `home.hero.stats` (os contadores leem do conteúdo).

## Comandos

```bash
npm start                    # ng serve, porta 4200
npm run build
npm run test:ci              # Vitest, uma execução
npm run audit:prod
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build    # SSR em localhost:4000
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```
