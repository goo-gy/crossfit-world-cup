# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS dependencies
WORKDIR /app/site
ENV CI=true WRANGLER_SEND_METRICS=false SHARP_IGNORE_GLOBAL_LIBVIPS=1
COPY site/package.json site/package-lock.json site/.npmrc ./
RUN npm ci --include=dev --include=optional --no-audit --no-fund

FROM dependencies AS build
COPY site/ ./
COPY docs/ /app/docs/
# Generate the initial schema through Drizzle; later committed migrations are reused.
RUN npm run db:generate -- --name=initial \
    && node --test tests/*.test.mjs \
    && npx --no-install tsc --noEmit \
    && npm run build \
    && node docker/prepare-runtime.mjs

FROM node:24-bookworm-slim AS runtime
WORKDIR /app/site
ENV CI=true WRANGLER_SEND_METRICS=false
COPY --from=build --chown=node:node /app/ /app/
RUN mkdir -p .wrangler/state .sites-runtime \
    && chown -R node:node .wrangler .sites-runtime \
    && chmod +x docker/entrypoint.sh
USER node
EXPOSE 8787
ENTRYPOINT ["/app/site/docker/entrypoint.sh"]
