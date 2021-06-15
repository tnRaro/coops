FROM node:15.14.0-alpine3.13 AS build
WORKDIR /app
ARG ENV
COPY package.json yarn.lock ./
COPY services/core/package.json ./services/core/package.json
COPY services/error/package.json ./services/error/package.json
COPY services/redis/package.json ./services/redis/package.json
COPY services/logic/package.json ./services/logic/package.json
COPY services/sse/package.json ./services/sse/package.json
COPY services/web/package.json ./services/web/package.json
RUN yarn install --frozen-lockfile --ignore-optional
COPY build.sh tsconfig.json ./
COPY tools/build.js ./tools/
COPY services/ ./services
RUN ./build.sh

FROM node:15.14.0-alpine3.13 AS web
WORKDIR /app
COPY package.json yarn.lock ./
COPY --from=build /app/services/web/package.json ./services/web/package.json
COPY --from=build /app/services/core/package.json ./services/core/package.json
COPY --from=build /app/services/core/dist/ ./services/core/dist
COPY --from=build /app/services/error/package.json ./services/error/package.json
COPY --from=build /app/services/error/dist/ ./services/error/dist
COPY --from=build /app/services/redis/package.json ./services/redis/package.json
COPY --from=build /app/services/redis/dist/ ./services/redis/dist
COPY --from=build /app/services/logic/package.json ./services/logic/package.json
COPY --from=build /app/services/logic/dist/ ./services/logic/dist
RUN yarn install --frozen-lockfile --ignore-optional
COPY --from=build /app/services/web/.next/ ./services/web/.next/

FROM node:15.14.0-alpine3.13 AS sse
WORKDIR /app
COPY package.json yarn.lock ./
COPY --from=build /app/services/sse/package.json ./services/sse/package.json
COPY --from=build /app/services/core/package.json ./services/core/package.json
COPY --from=build /app/services/core/dist/ ./services/core/dist
COPY --from=build /app/services/error/package.json ./services/error/package.json
COPY --from=build /app/services/error/dist/ ./services/error/dist
COPY --from=build /app/services/redis/package.json ./services/redis/package.json
COPY --from=build /app/services/redis/dist/ ./services/redis/dist
COPY --from=build /app/services/logic/package.json ./services/logic/package.json
COPY --from=build /app/services/logic/dist/ ./services/logic/dist
RUN yarn install --frozen-lockfile --production
COPY --from=build /app/services/sse/dist/ ./services/sse/dist/