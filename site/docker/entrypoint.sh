#!/bin/sh
set -eu
cd /app/site

# Both commands use the same built config and volume, so migration history and
# game results remain attached to the same local D1 database across restarts.
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js \
  d1 migrations apply DB --local \
  --config dist/server/wrangler.docker.json \
  --persist-to .wrangler/state

exec node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js \
  dev --local --config dist/server/wrangler.docker.json \
  --persist-to .wrangler/state \
  --ip 0.0.0.0 --port 8787 --inspector-port 0
