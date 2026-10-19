# Blue Fox Global Group

Site institucional da holding **Blue Fox Global Group** ([bluefoxglobalgroup.com](https://bluefoxglobalgroup.com)), em português e inglês. Apresenta a holding, o portfólio de projetos (Aquarismo, Finance, Games), o fundador, notícias e contato.

- **Stack**: Angular 21 + `@angular/ssr` (Express), standalone components, Signals, CSS puro.
- **Sem backend e sem banco**: todo o conteúdo está no código (`src/app/core/content`).
- **Idiomas**: rotas `/pt/...` e `/en/...`; `/` redireciona para `/pt`.

## Requisitos

Node `^20.19`, `^22.12` ou `>=24` (a imagem Docker usa Node 22) e npm.

## Desenvolvimento

```bash
npm ci
npm start             # ng serve em http://localhost:4200
npm run test:ci       # testes (Vitest), uma execução
npm run build         # gera dist/ com SSR e pré-renderização
npm run audit:prod    # npm audit das dependências de produção
```

## Docker

```bash
docker network create infra-net   # uma vez; o proxy de produção acessa o container por ela

# desenvolvimento: http://localhost:4000
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

# produção (sem portas publicadas, só na infra-net)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

O container roda como usuário `node` e tem `HEALTHCHECK`.

## Onde editar

| O que | Onde |
| :--- | :--- |
| Textos de cada página | `src/app/core/content/{pt,en}/<pagina>.ts` (sempre nos dois idiomas) |
| Projetos do portfólio | `src/app/core/content/{pt,en}/portfolio.ts` |
| Roadmap e notícias | `governance.ts` e `news.ts` (mais recente primeiro) |
| Rotas | `src/app/app.routes.ts` e, para SSR, `src/app/app.routes.server.ts` |
| Meta tags, canonical, hreflang | `src/app/core/services/seo.service.ts` |
| Imagem de compartilhamento | `public/og-default.jpg` (1200x630) |
| Sitemap | `public/sitemap.xml` (adicione cada página nova em `/pt` e `/en`) |

Contato é por e-mail (`mailto:`): o site não tem formulários nem coleta dados.

## Segurança e deploy

O servidor ([src/server.ts](src/server.ts)) define:

- **CSP** com `script-src 'self'`. O build não pode gerar scripts inline: por isso não há `withEventReplay()` nem CSS crítico inline (`inlineCritical: false` no `angular.json`). Se mudar isso, valide no navegador o evento `securitypolicyviolation`.
- `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e `Cross-Origin-Opener-Policy`, e remove o `X-Powered-By`. **HSTS e o redirecionamento http→https ficam no proxy (nginx).**
- **Cache**: 1 ano só para arquivos com hash no nome (JS/CSS); fontes por 30 dias; o resto (sitemap, robots, imagens) por 1 hora.
- **Fontes locais** em `public/fonts` (Inter e Outfit, licença OFL): nenhuma requisição a terceiros.

### Hosts permitidos (SSR)

O Angular só renderiza no servidor para hosts autorizados em `angular.json` (`security.allowedHosts`: `bluefoxglobalgroup.com`, `www.bluefoxglobalgroup.com`, `blue-fox-global-group` e `localhost`). Qualquer outro `Host` recebe **400**. Para acessar por outro nome (outro domínio ou IP), adicione-o ali ou defina `NG_ALLOWED_HOSTS` no ambiente do container. O proxy deve repassar o `Host` original (`proxy_set_header Host $host;`).

### Rotas inexistentes

Qualquer endereço fora das rotas pré-renderizadas é renderizado sob demanda pela página 404, com **status HTTP 404** e `noindex`.

## CI

[.github/workflows/ci.yml](.github/workflows/ci.yml): `npm ci`, audit de produção, testes e build a cada push ou PR na `main`.

## Commits

Conventional Commits, em inglês e no imperativo (`feat(portfolio): add finance project`).
