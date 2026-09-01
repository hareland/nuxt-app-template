FROM node:24-slim AS build

WORKDIR /repo
ENV CI=true

RUN corepack enable && corepack prepare pnpm@11.18.0 --activate

# Copy workspace manifests first for layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source
COPY . ./

RUN pnpm build

# produce an isolated, production-only node_modules for this app
RUN pnpm --filter ./ deploy --legacy --prod /tmp/deploy

# ---------- runtime stage ----------
FROM node:24-slim AS runtime
WORKDIR /repo
ENV NODE_ENV=production

# Might want to add other packages here too...
COPY --from=build /repo/package.json  ./package.json
COPY --from=build /repo/.output ./.output
COPY --from=build /repo/.nuxt   ./.nuxt
COPY --from=build /tmp/deploy/node_modules       ./node_modules

# Required to run `npx nuxt <command>` in the container..
COPY --from=build /repo/nuxt.config.ts ./nuxt.config.ts
COPY --from=build /repo/server/db      ./server/db
COPY --from=build /repo/tsconfig.json  ./tsconfig.json

EXPOSE 3000
COPY ./entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
