FROM node:24-slim AS build

WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@11.18.0 --activate

ENV CI=true

# Copy workspace manifests first for layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json                    ./apps/web/

# --ignore-scripts prevents native postinstall scripts from running during build;
# the @libsql optionalDependencies supply the prebuilt platform binary at runtime.
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

RUN pnpm --filter @repo/web build

# produce an isolated, production-only node_modules for just this app
RUN pnpm --filter @repo/web deploy --legacy --prod /tmp/deploy

# ---------- runtime stage ----------
FROM node:24-slim AS runtime
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=build /repo/apps/web/package.json  ./apps/web/package.json
COPY --from=build /repo/apps/web/.output ./apps/web/.output
COPY --from=build /repo/apps/web/.nuxt   ./apps/web/.nuxt
COPY --from=build /tmp/deploy/node_modules       ./node_modules

# Required to run `cd apps/<app> && npx nuxt <command>` in the container..
COPY --from=build /repo/apps/web/nuxt.config.ts ./apps/web/nuxt.config.ts
COPY --from=build /repo/apps/web/server/db      ./apps/web/server/db
COPY --from=build /repo/apps/web/tsconfig.json  ./apps/web/tsconfig.json

EXPOSE 3000
ENV IS_MONOREPO=true
COPY apps/web/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
