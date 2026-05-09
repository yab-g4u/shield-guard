import { cpSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const src = resolve(rootDir, 'apps/dashboard/dist');
const dst = resolve(rootDir, 'dist');

rmSync(dst, { recursive: true, force: true });
cpSync(src, dst, { recursive: true });
