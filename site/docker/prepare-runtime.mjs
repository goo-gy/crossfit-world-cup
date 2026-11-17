import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

export function configureDockerRuntime(config) {
  const database = config.d1_databases?.find(db => db.binding === 'DB');
  if (!database) throw new Error('Built Worker must contain the DB D1 binding.');
  // This path is relative to dist/server/wrangler.docker.json.
  database.migrations_dir = '../../drizzle';
  return config;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  if (!readdirSync('drizzle').some(file => file.endsWith('.sql'))) {
    throw new Error('No generated SQL migrations found; run npm run db:generate first.');
  }
  const config = JSON.parse(readFileSync('dist/server/wrangler.json', 'utf8'));
  writeFileSync('dist/server/wrangler.docker.json', JSON.stringify(configureDockerRuntime(config), null, 2) + '\n');
}
