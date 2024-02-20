# STAGE 1: install
FROM docker.io/node:lts-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /app
WORKDIR /app

# Install dependencies
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# STAGE 2: build
FROM base AS build
RUN apk add git
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm deploy:build

# STAGE 3: app
FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build

CMD [ "pnpm", "start" ]