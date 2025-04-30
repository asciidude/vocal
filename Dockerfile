FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json .npmrc* ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm ci --only=production

FROM node:20-alpine AS production

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 svelte

COPY --from=build --chown=svelte:nodejs /app/build ./build
COPY --from=build --chown=svelte:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=svelte:nodejs /app/package.json ./

ENV NODE_ENV=production
ENV PORT=3000

USER svelte

EXPOSE 3000

CMD ["node", "build"]
