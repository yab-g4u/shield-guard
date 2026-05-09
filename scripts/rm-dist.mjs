import { rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = resolve(fileURLToPath(new URL('.', import.meta.url)), '../apps/dashboard/dist');
rmSync(dir, { recursive: true, force: true });
