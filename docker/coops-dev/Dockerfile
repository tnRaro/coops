FROM node:15.14.0-alpine3.13 AS base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-optional

FROM base AS web
WORKDIR /app
COPY services/web/package.json ./services/web/package.json
RUN yarn web install --frozen-lockfile
COPY services/web/next.config.js services/web/tsconfig.json services/web/.env.local ./services/web/