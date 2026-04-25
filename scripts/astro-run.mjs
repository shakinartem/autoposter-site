import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const [command = 'dev', ...args] = process.argv.slice(2);
const astroEntry = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'node_modules', 'astro', 'astro.js');

const result = spawnSync(process.execPath, [astroEntry, command, ...args], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: '1'
  }
});

process.exit(result.status ?? 1);
