FROM node:15.14.0-alpine3.13 AS base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-optional

FROM base AS web
WORKDIR /app
COPY services/web/package.json ./services/web/package.json
RUN yarn web install --frozen-lockfile --ignore-optional
COPY services/web/next.config.js services/web/tsconfig.json services/web/.env.local ./services/web/

FROM base AS sse
WORKDIR /app
COPY services/sse/package.json ./services/sse/package.json
RUN yarn sse install --frozen-lockfile --ignore-optional
COPY services/sse/src/ ./services/sse/src/
RUN yarn sse build