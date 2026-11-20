# syntax=docker/dockerfile:1

# ---------- Стадия 1: зависимости ----------
# Устанавливаем ВСЕ зависимости (включая dev), они нужны для сборки TypeScript.
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- Стадия 2: сборка ----------
# Компилируем TypeScript в JavaScript (папка dist/).
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- Стадия 3: минимальный runtime-образ ----------
# В production-образ попадают только собранный код, прод-зависимости и миграции.
# Итоговый образ не содержит TypeScript, исходников и dev-инструментов.
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Непривилегированный пользователь — приложение в контейнере не работает от root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
# SQL-миграции применяются при старте приложения
COPY --from=build /app/drizzle ./drizzle

USER appuser
EXPOSE 3000
CMD ["node", "dist/index.js"]
