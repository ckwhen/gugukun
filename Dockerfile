# Building Stage
FROM node:23-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Stage
FROM node:23-alpine

RUN apk update && apk add bash

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install

COPY --from=builder /app/dist ./app
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts