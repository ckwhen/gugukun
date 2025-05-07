# Building Stage
FROM node:23-alpine as builder

WORKDIR /app

# 安裝 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN npm run build

# Production Stage
FROM node:23-alpine

RUN apk update && apk add bash

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/dist ./app
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

CMD ["npm", "start"]