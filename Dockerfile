# ===== BUILD =====
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ===== RUN SSR =====
FROM node:22-alpine

WORKDIR /app

ENV PORT=4000

COPY --from=build /app/dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

# O servidor só lê arquivos: roda sem privilégios de root.
USER node

EXPOSE 4000

# "localhost" faz parte dos allowedHosts do Angular (127.0.0.1 seria recusado com 400).
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- "http://localhost:${PORT}/pt" > /dev/null || exit 1

CMD ["node", "dist/blue-fox-global-group/server/server.mjs"]
