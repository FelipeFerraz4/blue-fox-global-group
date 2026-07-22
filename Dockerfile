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

COPY --from=build /app/dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev

EXPOSE 4000

CMD ["node", "dist/blue-fox-global-group/server/server.mjs"]
