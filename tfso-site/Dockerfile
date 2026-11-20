# syntax=docker/dockerfile:1
# ---------- Стадия 1: зависимости ----------
FROM node:20-alpine AS deps
# pnpm нужен для установки (в package.json указан packageManager: pnpm@12.3.4)
RUN corepack enable && corepack prepare pnpm@12.3.4 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Устанавливаем все зависимости (включая dev — они нужны для сборки Next.js)
RUN pnpm install --frozen-lockfile

# ---------- Стадия 2: сборка ----------
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@12.3.4 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---------- Стадия 3: минимальный runtime-образ ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
